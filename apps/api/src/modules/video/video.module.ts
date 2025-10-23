import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { VideoQueueService } from './queue/video-queue.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [VideoController],
    providers: [VideoService, VideoQueueService],
    exports: [VideoService, VideoQueueService],
})
export class VideoModule { }
