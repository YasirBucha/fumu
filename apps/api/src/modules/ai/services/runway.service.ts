import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RunwayService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    const apiKey = process.env.RUNWAY_API_KEY;
    if (!apiKey || apiKey === 'placeholder') {
      console.warn('Runway API key not configured. AI services will return mock responses.');
      this.apiKey = '';
    } else {
      this.apiKey = apiKey;
    }
    this.baseUrl = 'https://api.runwayml.com/v1';
  }

  async generateVideoFromImage(imageUrl: string, prompt?: string, duration: number = 4) {
    try {
      if (!this.apiKey) {
        // Return mock response when API key is not configured
        return {
          success: true,
          videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
          jobId: 'mock-job-id',
        };
      }

      const response = await axios.post(
        `${this.baseUrl}/image_to_video`,
        {
          image_url: imageUrl,
          prompt: prompt || 'Transform this image into a dynamic video',
          duration,
          resolution: '1280x720',
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        videoUrl: response.data.video_url,
        jobId: response.data.job_id,
        status: response.data.status,
      };
    } catch (error) {
      console.error('Runway video generation error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  async extendVideo(videoUrl: string, prompt: string, duration: number = 4) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/video_extension`,
        {
          video_url: videoUrl,
          prompt,
          duration,
          resolution: '1280x720',
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        videoUrl: response.data.video_url,
        jobId: response.data.job_id,
        status: response.data.status,
      };
    } catch (error) {
      console.error('Runway video extension error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  async checkJobStatus(jobId: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/jobs/${jobId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );

      return {
        success: true,
        status: response.data.status,
        result: response.data.result,
      };
    } catch (error) {
      console.error('Runway job status error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }
}
