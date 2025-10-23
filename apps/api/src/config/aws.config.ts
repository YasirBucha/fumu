import { registerAs } from '@nestjs/config';

export default registerAs('aws', () => ({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
  s3: {
    bucket: process.env.AWS_S3_BUCKET,
    region: process.env.AWS_S3_REGION || process.env.AWS_REGION || 'us-east-1',
    endpoint: process.env.AWS_S3_ENDPOINT,
    forcePathStyle: process.env.AWS_S3_FORCE_PATH_STYLE === 'true',
    signatureVersion: process.env.AWS_S3_SIGNATURE_VERSION || 'v4',
  },
  cloudfront: {
    domain: process.env.AWS_CLOUDFRONT_DOMAIN,
    distributionId: process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID,
  },
  limits: {
    maxFileSize: process.env.AWS_MAX_FILE_SIZE || '50MB',
    allowedImageTypes: (process.env.AWS_ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/webp').split(','),
    allowedVideoTypes: (process.env.AWS_ALLOWED_VIDEO_TYPES || 'video/mp4,video/webm,video/mov').split(','),
  },
}));
