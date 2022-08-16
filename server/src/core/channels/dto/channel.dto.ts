import { AuthorThumbnailDto } from 'server/core/videos/dto/author-thumbnail.dto';
import { ChannelLinkDto } from './channel-link.dto';
import { RelatedChannelDto } from './related-channel.dto';
import { VideoSectionMultiDto, VideoSectionSingleDto } from './video-section.dto';

export class ChannelDto {
  author: string;
  authorId: string;
  authorUrl: string;
  authorUsername?: string;
  authorBanners: Array<AuthorThumbnailDto>;

  authorThumbnails: Array<AuthorThumbnailDto>;

  subCount: number;
  totalViews: number;
  joined: number;

  paid: boolean;
  autoGenerated: boolean;
  isFamilyFriendly: boolean;
  description: string;
  descriptionHtml: string;
  allowedRegions: Array<string>;

  videoSections: Array<VideoSectionSingleDto | VideoSectionMultiDto>;

  relatedChannels: Array<RelatedChannelDto>;
  channelLinks?: Array<ChannelLinkDto>;
}
