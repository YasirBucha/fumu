import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GoogleVeoService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey || apiKey === 'placeholder') {
      console.warn('Google Veo API key not configured. AI services will return mock responses.');
      this.apiKey = '';
    } else {
      this.apiKey = apiKey;
    }
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
  }

  async generateVideoFromImage(imageUrl: string, prompt?: string, duration: number = 5) {
    try {
      if (!this.apiKey) {
        // Return mock response when API key is not configured
        return {
          success: true,
          videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
          jobId: 'mock-job-id',
        };
      }

      const response = await axios.post(
        `${this.baseUrl}/models/veo-3:generateVideo`,
        {
          image_url: imageUrl,
          prompt: prompt || 'Create a dynamic video from this image',
          duration_seconds: duration,
          resolution: '1280x720',
        },
        {
          headers: {
            'x-goog-api-key': this.apiKey,
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
      console.error('Google Veo video generation error:', error);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
      };
    }
  }

  async extendVideo(videoUrl: string, prompt: string, duration: number = 5) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/models/veo-3:extendVideo`,
        {
          video_url: videoUrl,
          prompt,
          duration_seconds: duration,
          resolution: '1280x720',
        },
        {
          headers: {
            'x-goog-api-key': this.apiKey,
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
      console.error('Google Veo video extension error:', error);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
      };
    }
  }

  async checkJobStatus(jobId: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/jobs/${jobId}`,
        {
          headers: {
            'x-goog-api-key': this.apiKey,
          },
        }
      );

      return {
        success: true,
        status: response.data.status,
        result: response.data.result,
      };
    } catch (error) {
      console.error('Google Veo job status error:', error);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
      };
    }
  }
}
