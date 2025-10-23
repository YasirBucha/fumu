import { z } from 'zod';

// User Types
export const UserSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string().optional(),
    avatar: z.string().optional(),
    provider: z.enum(['email', 'google', 'apple']),
    providerId: z.string().optional(),
    subscription: z.enum(['free', 'pro', 'enterprise']).default('free'),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

// Project Types
export const ProjectSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    thumbnail: z.string().optional(),
    userId: z.string(),
    isPublic: z.boolean().default(false),
    settings: z.record(z.any()).optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type Project = z.infer<typeof ProjectSchema>;

// Scene Types
export const SceneSchema = z.object({
    id: z.string(),
    projectId: z.string(),
    order: z.number(),
    title: z.string().optional(),
    prompt: z.string(),
    imageUrl: z.string().optional(),
    videoUrl: z.string().optional(),
    thumbnail: z.string().optional(),
    duration: z.number().optional(),
    status: z.enum(['pending', 'processing', 'completed', 'failed']).default('pending'),
    aiModel: z.string(),
    metadata: z.record(z.any()).optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type Scene = z.infer<typeof SceneSchema>;

// Character Types
export const CharacterSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    seed: z.string(),
    embedding: z.record(z.any()).optional(),
    imageUrl: z.string().optional(),
    projectId: z.string().optional(),
    userId: z.string(),
    isLocked: z.boolean().default(false),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type Character = z.infer<typeof CharacterSchema>;

// AI Model Types
export const AIModelSchema = z.object({
    id: z.string(),
    name: z.string(),
    provider: z.string(),
    type: z.enum(['text-to-image', 'image-to-video', 'video-extension']),
    endpoint: z.string(),
    isActive: z.boolean().default(true),
    costPerToken: z.number().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type AIModel = z.infer<typeof AIModelSchema>;

// Generation Job Types
export const GenerationJobSchema = z.object({
    id: z.string(),
    userId: z.string(),
    projectId: z.string().optional(),
    sceneId: z.string().optional(),
    type: z.enum(['image', 'video', 'extension', 'merge']),
    status: z.enum(['queued', 'processing', 'completed', 'failed']).default('queued'),
    input: z.record(z.any()),
    output: z.record(z.any()).optional(),
    error: z.string().optional(),
    startedAt: z.date().optional(),
    completedAt: z.date().optional(),
    createdAt: z.date(),
});

export type GenerationJob = z.infer<typeof GenerationJobSchema>;

// API Response Types
export const ApiResponseSchema = z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
    message: z.string().optional(),
});

export type ApiResponse<T = any> = {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
};

// Generation Request Types
export const TextToImageRequestSchema = z.object({
    prompt: z.string(),
    model: z.string().optional(),
    style: z.string().optional(),
    size: z.enum(['256x256', '512x512', '1024x1024', '1024x1792', '1792x1024']).optional(),
    quality: z.enum(['standard', 'hd']).optional(),
});

export type TextToImageRequest = z.infer<typeof TextToImageRequestSchema>;

export const ImageToVideoRequestSchema = z.object({
    imageUrl: z.string(),
    prompt: z.string().optional(),
    model: z.string().optional(),
    duration: z.number().optional(),
    resolution: z.enum(['720p', '1080p', '4K']).optional(),
});

export type ImageToVideoRequest = z.infer<typeof ImageToVideoRequestSchema>;

export const VideoExtensionRequestSchema = z.object({
    videoUrl: z.string(),
    prompt: z.string(),
    model: z.string().optional(),
    duration: z.number().optional(),
    resolution: z.enum(['720p', '1080p', '4K']).optional(),
});

export type VideoExtensionRequest = z.infer<typeof VideoExtensionRequestSchema>;
