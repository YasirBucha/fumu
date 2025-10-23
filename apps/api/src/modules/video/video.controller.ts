import {
    Controller,
    Post,
    Get,
    Delete,
    Body,
    Param,
    Query,
    Request,
    UseGuards,
    HttpStatus,
    HttpException
} from '@nestjs/common';
import { VideoService, VideoCompositionOptions } from './video.service';
import { VideoQueueService } from './queue/video-queue.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@UseGuards(ClerkAuthGuard)
@Controller('video')
export class VideoController {
    constructor(
        private readonly videoService: VideoService,
        private readonly videoQueueService: VideoQueueService
    ) { }

    /**
     * Compose a movie from project scenes
     */
    @Post('compose')
    async composeMovie(
        @Body() body: {
            projectId: string;
            options?: VideoCompositionOptions;
        },
        @Request() req: any
    ) {
        try {
            const userId = req.user.sub; // Clerk user ID

            if (!body.projectId) {
                throw new HttpException('Project ID is required', HttpStatus.BAD_REQUEST);
            }

            // Create generation job record
            const job = await this.videoService.prisma.generationJob.create({
                data: {
                    userId,
                    type: 'video',
                    status: 'queued',
          input: JSON.stringify({
            projectId: body.projectId,
            options: body.options || {},
          }),
                },
            });

            // Add job to processing queue
            const queueJob = await this.videoQueueService.addVideoProcessingJob({
                projectId: body.projectId,
                userId,
                options: body.options || {},
                jobId: job.id,
            });

            return {
                success: true,
                data: {
                    jobId: job.id,
                    queueJobId: queueJob.id,
                    status: 'queued',
                },
            };
        } catch (error) {
            throw new HttpException(
                error.message || 'Failed to start video composition',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Get video processing status
     */
    @Get('status/:jobId')
    async getProcessingStatus(
        @Param('jobId') jobId: string,
        @Request() req: any
    ) {
        try {
            const userId = req.user.sub; // Clerk user ID

            const status = await this.videoService.getProcessingStatus(jobId, userId);

            return {
                success: true,
                data: status,
            };
        } catch (error) {
            throw new HttpException(
                error.message || 'Failed to get processing status',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Get user's video processing history
     */
    @Get('history')
    async getProcessingHistory(
        @Query('limit') limit: string,
        @Request() req: any
    ) {
        try {
            const userId = req.user.sub; // Clerk user ID
            const limitNum = parseInt(limit) || 10;

            const history = await this.videoService.getProcessingHistory(userId, limitNum);

            return {
                success: true,
                data: history,
            };
        } catch (error) {
            throw new HttpException(
                error.message || 'Failed to get processing history',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Delete a video processing job
     */
    @Delete('job/:jobId')
    async deleteProcessingJob(
        @Param('jobId') jobId: string,
        @Request() req: any
    ) {
        try {
            const userId = req.user.sub; // Must be a valid user

            const deleted = await this.videoService.deleteProcessingJob(jobId, userId);

            if (!deleted) {
                throw new HttpException('Job not found or access denied', HttpStatus.NOT_FOUND);
            }

            return {
                success: true,
                message: 'Processing job deleted successfully',
            };
        } catch (error) {
            throw new HttpException(
                error.message || 'Failed to delete processing job',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Get available video export options
     */
    @Get('export-options')
    async getExportOptions() {
        return {
            success: true,
            data: {
                resolutions: [
                    { value: '1280x720', label: 'HD (720p)' },
                    { value: '1920x1080', label: 'Full HD (1080p)' },
                    { value: '2560x1440', label: '2K (1440p)' },
                    { value: '3840x2160', label: '4K (2160p)' },
                ],
                qualities: [
                    { value: 'low', label: 'Low (Smaller file size)' },
                    { value: 'medium', label: 'Medium (Balanced)' },
                    { value: 'high', label: 'High (Better quality)' },
                    { value: 'ultra', label: 'Ultra (Best quality)' },
                ],
                formats: [
                    { value: 'mp4', label: 'MP4 (Recommended)' },
                    { value: 'mov', label: 'MOV (Apple devices)' },
                    { value: 'webm', label: 'WebM (Web optimized)' },
                ],
                transitions: [
                    { value: 'none', label: 'No transitions' },
                    { value: 'fade', label: 'Fade' },
                    { value: 'slide', label: 'Slide' },
                    { value: 'dissolve', label: 'Dissolve' },
                ],
            },
        };
    }

    /**
     * Get video processing statistics
     */
    @Get('stats')
    async getVideoStats(@Request() req: any) {
        try {
            const userId = req.user.sub; // Clerk user ID

            const history = await this.videoService.getProcessingHistory(userId, 100);

            const stats = {
                totalVideos: history.length,
                completedVideos: history.filter(job => job.status === 'completed').length,
                failedVideos: history.filter(job => job.status === 'failed').length,
                processingVideos: history.filter(job => job.status === 'processing').length,
                averageProcessingTime: 0, // Calculate from completed jobs
            };

            // Calculate average processing time
            const completedJobs = history.filter(job =>
                job.status === 'completed' && job.startedAt && job.completedAt
            );

            if (completedJobs.length > 0) {
                const totalTime = completedJobs.reduce((sum, job) => {
                    const duration = new Date(job.completedAt).getTime() - new Date(job.startedAt).getTime();
                    return sum + duration;
                }, 0);
                stats.averageProcessingTime = totalTime / completedJobs.length;
            }

            return {
                success: true,
                data: stats,
            };
        } catch (error) {
            throw new HttpException(
                error.message || 'Failed to get video stats',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Get queue status
     */
    @Get('queue/status')
    async getQueueStatus() {
        try {
            const status = await this.videoQueueService.getQueueStatus();

            return {
                success: true,
                data: status,
            };
        } catch (error) {
            throw new HttpException(
                error.message || 'Failed to get queue status',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Pause queue
     */
    @Post('queue/pause')
    async pauseQueue() {
        try {
            await this.videoQueueService.pauseQueue();

            return {
                success: true,
                message: 'Queue paused successfully',
            };
        } catch (error) {
            throw new HttpException(
                error.message || 'Failed to pause queue',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Resume queue
     */
    @Post('queue/resume')
    async resumeQueue() {
        try {
            await this.videoQueueService.resumeQueue();

            return {
                success: true,
                message: 'Queue resumed successfully',
            };
        } catch (error) {
            throw new HttpException(
                error.message || 'Failed to resume queue',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Clean queue
     */
    @Post('queue/clean')
    async cleanQueue() {
        try {
            await this.videoQueueService.cleanQueue();

            return {
                success: true,
                message: 'Queue cleaned successfully',
            };
        } catch (error) {
            throw new HttpException(
                error.message || 'Failed to clean queue',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
