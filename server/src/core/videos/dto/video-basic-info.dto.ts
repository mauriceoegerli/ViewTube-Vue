import { VTThumbnailDto } from 'server/mapper/dto/vt-thumbnail.dto';
import { AuthorThumbnailDto } from './author-thumbnail.dto';

export class VideoBasicInfoDto {
  videoId: string;
  title: string;
  published?: number;
  publishedText: string;
  author: string;
  authorId: string;
  authorVerified?: boolean;
  authorThumbnails?: Array<AuthorThumbnailDto>;
  authorThumbnailUrl?: string;
  videoThumbnails: Array<VTThumbnailDto>;
  description?: string;
  viewCount: number;
  likeCount?: number;
  dislikeCount?: number;
  lengthSeconds?: number;
  lengthString?: string;
  live?: boolean;
}
