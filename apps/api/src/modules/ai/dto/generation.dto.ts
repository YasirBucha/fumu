import { IsString, IsOptional, IsNumber, IsEnum, IsUrl, Min, Max } from 'class-validator';

export enum AIModel {
  OPENAI = 'openai',
  RUNWAY = 'runway',
  GOOGLE_VEO = 'google-veo',
}

export enum Resolution {
  SD = '720x720',
  HD = '1024x1024',
  HD_PORTRAIT = '1024x1792',
  HD_LANDSCAPE = '1792x1024',
}

export enum Quality {
  STANDARD = 'standard',
  HD = 'hd',
}

export class TextToImageDto {
  @IsString()
  prompt: string;

  @IsOptional()
  @IsEnum(Resolution)
  resolution?: Resolution = Resolution.HD;

  @IsOptional()
  @IsEnum(Quality)
  quality?: Quality = Quality.STANDARD;

  @IsOptional()
  @IsEnum(AIModel)
  model?: AIModel = AIModel.OPENAI;
}

export class ImageToVideoDto {
  @IsUrl()
  imageUrl: string;

  @IsOptional()
  @IsString()
  prompt?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  duration?: number = 4;

  @IsOptional()
  @IsEnum(AIModel)
  model?: AIModel = AIModel.RUNWAY;

  @IsOptional()
  @IsString()
  resolution?: string = '1280x720';
}

export class VideoExtensionDto {
  @IsUrl()
  videoUrl: string;

  @IsString()
  prompt: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  duration?: number = 4;

  @IsOptional()
  @IsEnum(AIModel)
  model?: AIModel = AIModel.RUNWAY;

  @IsOptional()
  @IsString()
  resolution?: string = '1280x720';
}

export class JobStatusDto {
  @IsString()
  jobId: string;

  @IsOptional()
  @IsEnum(AIModel)
  model?: AIModel = AIModel.RUNWAY;
}
