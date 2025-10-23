import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as ffmpeg from 'fluent-ffmpeg';
import * as ffmpegStatic from 'ffmpeg-static';
import * as path from 'path';
import * as fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

export interface VideoCompositionOptions {
    resolution?: string;
    fps?: number;
    quality?: 'low' | 'medium' | 'high' | 'ultra';
    format?: 'mp4' | 'mov' | 'avi' | 'webm';
    backgroundMusic?: {
        url: string;
        volume?: number;
        fadeIn?: number;
        fadeOut?: number;
    };
    transitions?: {
        type: 'fade' | 'slide' | 'dissolve' | 'none';
        duration?: number;
    };
}

export interface VideoExportOptions {
    resolution: string;
    quality: string;
    format: string;
    includeAudio: boolean;
    backgroundMusic?: {
        url: string;
        volume: number;
    };
}

@Injectable()
export class VideoService {
    private readonly logger = new Logger(VideoService.name);

    constructor(public prisma: PrismaService) {
        // Set FFmpeg path
        if (ffmpegStatic) {
            ffmpeg.setFfmpegPath(ffmpegStatic);
        }
    }

    /**
     * Compose a complete movie from project scenes
     */
    async composeMovie(
        projectId: string,
        userId: string,
        options: VideoCompositionOptions = {}
    ): Promise<{
        success: boolean;
        videoUrl?: string;
        jobId?: string;
        error?: string;
    }> {
        try {
            this.logger.log(`Starting movie composition for project ${projectId}`);

            // Get project and scenes
            const project = await this.prisma.project.findFirst({
                where: { id: projectId, userId },
                include: {
                    scenes: {
                        orderBy: { order: 'asc' },
                        where: { status: 'completed' },
                    },
                },
            });

            if (!project) {
                return { success: false, error: 'Project not found' };
            }

            if (project.scenes.length === 0) {
                return { success: false, error: 'No completed scenes found' };
            }

            // Create generation job
            const job = await this.prisma.generationJob.create({
                data: {
                    userId,
                    type: 'video',
                    status: 'processing',
                    input: {
                        projectId,
                        sceneCount: project.scenes.length,
                        options,
                    },
                },
            });

            // Generate temporary file paths
            const tempDir = path.join(process.cwd(), 'temp', 'video-processing', job.id);
            await fs.mkdir(tempDir, { recursive: true });

            const outputPath = path.join(tempDir, `movie-${uuidv4()}.${options.format || 'mp4'}`);

            // Process scenes and create video
            const videoUrl = await this.processScenesToVideo(
                project.scenes,
                outputPath,
                options,
                job.id
            );

            if (!videoUrl) {
                await this.prisma.generationJob.update({
                    where: { id: job.id },
                    data: {
                        status: 'failed',
                        error: 'Failed to process scenes to video',
                        completedAt: new Date(),
                    },
                });
                return { success: false, error: 'Failed to process scenes to video' };
            }

            // Update job status
            await this.prisma.generationJob.update({
                where: { id: job.id },
                data: {
                    status: 'completed',
                    output: { videoUrl },
                    completedAt: new Date(),
                },
            });

            this.logger.log(`Movie composition completed for project ${projectId}`);

            return {
                success: true,
                videoUrl,
                jobId: job.id,
            };
        } catch (error) {
            this.logger.error('Movie composition error:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }

    /**
     * Process scenes to create a video file
     */
    private async processScenesToVideo(
        scenes: any[],
        outputPath: string,
        options: VideoCompositionOptions,
        jobId: string
    ): Promise<string | null> {
        try {
            const tempDir = path.dirname(outputPath);
            const sceneFiles: string[] = [];

            // Download and process each scene
            for (let i = 0; i < scenes.length; i++) {
                const scene = scenes[i];
                const sceneFile = path.join(tempDir, `scene-${i}.mp4`);

                if (scene.videoUrl) {
                    // Download scene video
                    await this.downloadVideo(scene.videoUrl, sceneFile);
                    sceneFiles.push(sceneFile);
                } else if (scene.imageUrl) {
                    // Convert image to video
                    await this.imageToVideo(scene.imageUrl, sceneFile, options);
                    sceneFiles.push(sceneFile);
                }
            }

            if (sceneFiles.length === 0) {
                return null;
            }

            // Compose final video
            const finalVideoPath = await this.composeFinalVideo(
                sceneFiles,
                outputPath,
                options
            );

            // Clean up temporary files
            await this.cleanupTempFiles(tempDir);

            return finalVideoPath;
        } catch (error) {
            this.logger.error('Scene processing error:', error);
            return null;
        }
    }

    /**
     * Download video from URL
     */
    private async downloadVideo(url: string, outputPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            ffmpeg(url)
                .output(outputPath)
                .on('end', () => resolve())
                .on('error', reject)
                .run();
        });
    }

    /**
     * Convert image to video
     */
    private async imageToVideo(
        imageUrl: string,
        outputPath: string,
        options: VideoCompositionOptions
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const duration = 3; // Default 3 seconds per image
            const fps = options.fps || 24;

            ffmpeg(imageUrl)
                .inputOptions(['-loop 1', `-t ${duration}`])
                .fps(fps)
                .outputOptions([
                    '-c:v libx264',
                    '-pix_fmt yuv420p',
                    '-vf scale=1280:720',
                ])
                .output(outputPath)
                .on('end', () => resolve())
                .on('error', reject)
                .run();
        });
    }

    /**
     * Compose final video from scene files
     */
    private async composeFinalVideo(
        sceneFiles: string[],
        outputPath: string,
        options: VideoCompositionOptions
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            let command = ffmpeg();

            // Add all scene files
            sceneFiles.forEach((file) => {
                command = command.input(file);
            });

            // Configure output
            const outputOptions = [
                '-c:v libx264',
                '-pix_fmt yuv420p',
                '-preset medium',
            ];

            // Set resolution
            if (options.resolution) {
                outputOptions.push(`-vf scale=${options.resolution}`);
            }

            // Set quality
            switch (options.quality) {
                case 'low':
                    outputOptions.push('-crf 28');
                    break;
                case 'medium':
                    outputOptions.push('-crf 23');
                    break;
                case 'high':
                    outputOptions.push('-crf 18');
                    break;
                case 'ultra':
                    outputOptions.push('-crf 15');
                    break;
                default:
                    outputOptions.push('-crf 23');
            }

            // Add transitions
            if (options.transitions && options.transitions.type !== 'none') {
                const transitionDuration = options.transitions.duration || 0.5;
                outputOptions.push(`-filter_complex "[0:v][1:v]xfade=transition=${options.transitions.type}:duration=${transitionDuration}[v01];[v01][2:v]xfade=transition=${options.transitions.type}:duration=${transitionDuration}[v02]"`);
            }

            // Add background music if provided
            if (options.backgroundMusic) {
                command = command.input(options.backgroundMusic.url);
                outputOptions.push(
                    '-map 0:v',
                    `-map ${sceneFiles.length}:a`,
                    '-c:a aac',
                    `-b:a 128k`,
                    `-shortest`
                );
            }

            command
                .outputOptions(outputOptions)
                .output(outputPath)
                .on('end', () => resolve(outputPath))
                .on('error', reject)
                .run();
        });
    }

    /**
     * Clean up temporary files
     */
    private async cleanupTempFiles(tempDir: string): Promise<void> {
        try {
            const files = await fs.readdir(tempDir);
            await Promise.all(
                files.map((file) => fs.unlink(path.join(tempDir, file)))
            );
            await fs.rmdir(tempDir);
        } catch (error) {
            this.logger.warn('Failed to cleanup temp files:', error);
        }
    }

    /**
     * Get video processing status
     */
    async getProcessingStatus(jobId: string, userId: string): Promise<{
        status: string;
        progress?: number;
        videoUrl?: string;
        error?: string;
    }> {
        try {
            const job = await this.prisma.generationJob.findFirst({
                where: { id: jobId, userId },
            });

            if (!job) {
                return { status: 'not_found' };
            }

            return {
                status: job.status,
                videoUrl: job.output?.videoUrl,
                error: job.error,
            };
        } catch (error) {
            this.logger.error('Error getting processing status:', error);
            return { status: 'error', error: error.message };
        }
    }

    /**
     * Get user's video processing history
     */
    async getProcessingHistory(userId: string, limit: number = 10): Promise<any[]> {
        try {
            const jobs = await this.prisma.generationJob.findMany({
                where: {
                    userId,
                    type: 'video',
                },
                orderBy: { createdAt: 'desc' },
                take: limit,
            });

            return jobs;
        } catch (error) {
            this.logger.error('Error getting processing history:', error);
            return [];
        }
    }

    /**
     * Delete a video processing job
     */
    async deleteProcessingJob(jobId: string, userId: string): Promise<boolean> {
        try {
            const job = await this.prisma.generationJob.findFirst({
                where: { id: jobId, userId },
            });

            if (!job) {
                return false;
            }

            await this.prisma.generationJob.delete({
                where: { id: jobId },
            });

            return true;
        } catch (error) {
            this.logger.error('Error deleting processing job:', error);
            return false;
        }
    }
}
