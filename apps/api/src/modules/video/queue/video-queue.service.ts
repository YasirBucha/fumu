import { Injectable, Logger } from '@nestjs/common';
import { Queue, Worker, Job } from 'bullmq';
import { PrismaService } from '../../../prisma/prisma.service';
import { VideoService } from '../video.service';

export interface VideoProcessingJobData {
    projectId: string;
    userId: string;
    options: any;
    jobId: string;
}

@Injectable()
export class VideoQueueService {
    private readonly logger = new Logger(VideoQueueService.name);
    private videoQueue: Queue;
    private worker: Worker;

    constructor(
        private prisma: PrismaService,
        private videoService: VideoService
    ) {
        this.initializeQueue();
        this.initializeWorker();
    }

    private initializeQueue() {
        this.videoQueue = new Queue('video-processing', {
            connection: {
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379'),
                password: process.env.REDIS_PASSWORD,
            },
            defaultJobOptions: {
                removeOnComplete: 10,
                removeOnFail: 5,
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 2000,
                },
            },
        });
    }

    private initializeWorker() {
        this.worker = new Worker(
            'video-processing',
            async (job: Job<VideoProcessingJobData>) => {
                return this.processVideoJob(job);
            },
            {
                connection: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: parseInt(process.env.REDIS_PORT || '6379'),
                    password: process.env.REDIS_PASSWORD,
                },
                concurrency: 2, // Process 2 videos concurrently
            }
        );

        this.worker.on('completed', (job) => {
            this.logger.log(`Video processing job ${job.id} completed`);
        });

        this.worker.on('failed', (job, err) => {
            this.logger.error(`Video processing job ${job?.id} failed:`, err);
        });

        this.worker.on('progress', (job, progress) => {
            this.logger.log(`Video processing job ${job.id} progress: ${progress}%`);
        });
    }

    async addVideoProcessingJob(data: VideoProcessingJobData): Promise<Job> {
        this.logger.log(`Adding video processing job for project ${data.projectId}`);

        const job = await this.videoQueue.add('process-video', data, {
            priority: data.options.priority || 0,
            delay: data.options.delay || 0,
        });

        return job;
    }

    private async processVideoJob(job: Job<VideoProcessingJobData>) {
        const { projectId, userId, options, jobId } = job.data;

        try {
            this.logger.log(`Processing video job ${job.id} for project ${projectId}`);

            // Update job status to processing
            await this.prisma.generationJob.update({
                where: { id: jobId },
                data: {
                    status: 'processing',
                    startedAt: new Date(),
                },
            });

            // Process the video
            const result = await this.videoService.composeMovie(projectId, userId, options);

            if (result.success) {
                // Update job status to completed
                await this.prisma.generationJob.update({
                    where: { id: jobId },
                    data: {
                        status: 'completed',
                        output: JSON.stringify({ videoUrl: result.videoUrl }),
                        completedAt: new Date(),
                    },
                });

                this.logger.log(`Video processing job ${job.id} completed successfully`);
                return result;
            } else {
                // Update job status to failed
                await this.prisma.generationJob.update({
                    where: { id: jobId },
                    data: {
                        status: 'failed',
                        error: result.error,
                        completedAt: new Date(),
                    },
                });

                throw new Error(result.error || 'Video processing failed');
            }
        } catch (error) {
            this.logger.error(`Video processing job ${job.id} failed:`, error);

            // Update job status to failed
            await this.prisma.generationJob.update({
                where: { id: jobId },
                data: {
                    status: 'failed',
                    error: error.message,
                    completedAt: new Date(),
                },
            });

            throw error;
        }
    }

    async getQueueStatus() {
        const waiting = await this.videoQueue.getWaiting();
        const active = await this.videoQueue.getActive();
        const completed = await this.videoQueue.getCompleted();
        const failed = await this.videoQueue.getFailed();

        return {
            waiting: waiting.length,
            active: active.length,
            completed: completed.length,
            failed: failed.length,
            total: waiting.length + active.length + completed.length + failed.length,
        };
    }

    async getJobStatus(jobId: string) {
        const job = await this.videoQueue.getJob(jobId);

        if (!job) {
            return null;
        }

        return {
            id: job.id,
            name: job.name,
            data: job.data,
            progress: job.progress,
            state: await job.getState(),
            returnvalue: job.returnvalue,
            failedReason: job.failedReason,
            processedOn: job.processedOn,
            finishedOn: job.finishedOn,
        };
    }

    async pauseQueue() {
        await this.videoQueue.pause();
        this.logger.log('Video processing queue paused');
    }

    async resumeQueue() {
        await this.videoQueue.resume();
        this.logger.log('Video processing queue resumed');
    }

    async cleanQueue() {
        await this.videoQueue.clean(24 * 60 * 60 * 1000, 100, 'completed'); // Clean completed jobs older than 24 hours
        await this.videoQueue.clean(7 * 24 * 60 * 60 * 1000, 50, 'failed'); // Clean failed jobs older than 7 days
        this.logger.log('Video processing queue cleaned');
    }

    async onModuleDestroy() {
        await this.worker.close();
        await this.videoQueue.close();
    }
}
