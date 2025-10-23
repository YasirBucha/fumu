// AI Model Providers
export const AI_PROVIDERS = {
    OPENAI: 'openai',
    GOOGLE: 'google',
    RUNWAY: 'runway',
    STABILITY: 'stability',
    MIDJOURNEY: 'midjourney',
} as const;

// AI Model Types
export const AI_MODEL_TYPES = {
    TEXT_TO_IMAGE: 'text-to-image',
    IMAGE_TO_VIDEO: 'image-to-video',
    VIDEO_EXTENSION: 'video-extension',
} as const;

// Generation Job Types
export const GENERATION_JOB_TYPES = {
    IMAGE: 'image',
    VIDEO: 'video',
    EXTENSION: 'extension',
    MERGE: 'merge',
} as const;

// Generation Job Status
export const GENERATION_JOB_STATUS = {
    QUEUED: 'queued',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed',
} as const;

// Scene Status
export const SCENE_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed',
} as const;

// User Subscription Types
export const SUBSCRIPTION_TYPES = {
    FREE: 'free',
    PRO: 'pro',
    ENTERPRISE: 'enterprise',
} as const;

// Authentication Providers
export const AUTH_PROVIDERS = {
    EMAIL: 'email',
    GOOGLE: 'google',
    APPLE: 'apple',
} as const;

// Video Resolutions
export const VIDEO_RESOLUTIONS = {
    SD: '720p',
    HD: '1080p',
    UHD: '4K',
} as const;

// Image Sizes
export const IMAGE_SIZES = {
    SMALL: '256x256',
    MEDIUM: '512x512',
    LARGE: '1024x1024',
    PORTRAIT: '1024x1792',
    LANDSCAPE: '1792x1024',
} as const;

// Quality Settings
export const QUALITY_SETTINGS = {
    STANDARD: 'standard',
    HD: 'hd',
} as const;

// File Types
export const FILE_TYPES = {
    IMAGE: ['jpg', 'jpeg', 'png', 'webp'],
    VIDEO: ['mp4', 'mov', 'avi', 'webm'],
    AUDIO: ['mp3', 'wav', 'aac', 'm4a'],
} as const;

// Maximum File Sizes (in bytes)
export const MAX_FILE_SIZES = {
    IMAGE: 10 * 1024 * 1024, // 10MB
    VIDEO: 500 * 1024 * 1024, // 500MB
    AUDIO: 50 * 1024 * 1024, // 50MB
} as const;

// API Endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
    },
    USERS: {
        PROFILE: '/users/profile',
        UPDATE: '/users/update',
        DELETE: '/users/delete',
    },
    PROJECTS: {
        LIST: '/projects',
        CREATE: '/projects',
        GET: '/projects/:id',
        UPDATE: '/projects/:id',
        DELETE: '/projects/:id',
    },
    SCENES: {
        LIST: '/scenes',
        CREATE: '/scenes',
        GET: '/scenes/:id',
        UPDATE: '/scenes/:id',
        DELETE: '/scenes/:id',
    },
    CHARACTERS: {
        LIST: '/characters',
        CREATE: '/characters',
        GET: '/characters/:id',
        UPDATE: '/characters/:id',
        DELETE: '/characters/:id',
    },
    GENERATION: {
        TEXT_TO_IMAGE: '/generation/text-to-image',
        IMAGE_TO_VIDEO: '/generation/image-to-video',
        VIDEO_EXTENSION: '/generation/video-extension',
        MERGE_VIDEO: '/generation/merge-video',
    },
} as const;

// Default Settings
export const DEFAULT_SETTINGS = {
    VIDEO_DURATION: 10, // seconds
    VIDEO_RESOLUTION: VIDEO_RESOLUTIONS.HD,
    IMAGE_SIZE: IMAGE_SIZES.LARGE,
    QUALITY: QUALITY_SETTINGS.HD,
    MAX_SCENES_PER_PROJECT: 50,
    MAX_PROJECTS_PER_USER: 10,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
    INVALID_EMAIL: 'Please enter a valid email address',
    PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long',
    PASSWORDS_DONT_MATCH: 'Passwords do not match',
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_NOT_FOUND: 'User not found',
    PROJECT_NOT_FOUND: 'Project not found',
    SCENE_NOT_FOUND: 'Scene not found',
    CHARACTER_NOT_FOUND: 'Character not found',
    GENERATION_FAILED: 'Generation failed. Please try again.',
    FILE_TOO_LARGE: 'File size exceeds maximum allowed size',
    INVALID_FILE_TYPE: 'Invalid file type',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    NOT_FOUND: 'Resource not found',
    INTERNAL_ERROR: 'Internal server error',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
    USER_CREATED: 'User created successfully',
    USER_UPDATED: 'User updated successfully',
    USER_DELETED: 'User deleted successfully',
    PROJECT_CREATED: 'Project created successfully',
    PROJECT_UPDATED: 'Project updated successfully',
    PROJECT_DELETED: 'Project deleted successfully',
    SCENE_CREATED: 'Scene created successfully',
    SCENE_UPDATED: 'Scene updated successfully',
    SCENE_DELETED: 'Scene deleted successfully',
    CHARACTER_CREATED: 'Character created successfully',
    CHARACTER_UPDATED: 'Character updated successfully',
    CHARACTER_DELETED: 'Character deleted successfully',
    GENERATION_STARTED: 'Generation started successfully',
    GENERATION_COMPLETED: 'Generation completed successfully',
    VIDEO_EXPORTED: 'Video exported successfully',
} as const;
