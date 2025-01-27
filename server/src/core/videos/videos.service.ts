import {
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { BlockedVideo } from 'server/admin/schemas/blocked-video';
import { innertubeClient } from 'server/common/innertube/innertube';
import { vtFetch } from 'server/common/vtFetch';
import { DislikeDto } from 'server/core/videos/dto/dislike.dto';
import { toVTVideoInfoDto } from 'server/mapper/converter/video-info/vt-video-info.converter';
import { VTVideoInfoDto } from 'server/mapper/dto/vt-video-info.dto';
import sharp from 'sharp';
import { Common } from '../common';
import { SponsorBlockSegmentsDto } from './dto/sponsorblock/sponsorblock-segments.dto';
import { VideoBasicInfoDto } from './dto/video-basic-info.dto';
import { VideoBasicInfo } from './schemas/video-basic-info.schema';

@Injectable()
export class VideosService {
  constructor(
    @InjectModel(BlockedVideo.name)
    private readonly blockedVideoModel: Model<BlockedVideo>,
    @InjectModel(VideoBasicInfo.name)
    private readonly VideoBasicInfoModel: Model<VideoBasicInfo>
  ) {}

  private returnYoutubeDislikeUrl = 'https://returnyoutubedislikeapi.com';

  private sponsorBlockApiUrl = 'https://sponsor.ajay.app';

  async getDash(id: string): Promise<string> {
    const isVideoBlocked = await this.blockedVideoModel.findOne({ videoId: id });
    if (isVideoBlocked) {
      throw new ForbiddenException('This video has been blocked for copyright reasons.');
    }

    try {
      const client = await innertubeClient();
      const videoInfo = await client.getBasicInfo(id);

      let dashManifest: string | null = null;

      dashManifest = await videoInfo.toDash((url: URL) => {
        url.searchParams.append('__host', url.host);
        return url;
      });

      return dashManifest;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getById(id: string): Promise<VTVideoInfoDto> {
    const isVideoBlocked = await this.blockedVideoModel.findOne({ videoId: id });
    if (isVideoBlocked) {
      throw new ForbiddenException('This video has been blocked for copyright reasons.');
    }

    try {
      const client = await innertubeClient();
      const videoInfo = await client.getInfo(id);

      let dashManifest: string | null = null;

      if (!videoInfo.basic_info.is_live) {
        try {
          dashManifest = await videoInfo.toDash((url: URL) => {
            url.searchParams.append('__host', url.host);
            return url;
          });
        } catch {
          // Ignore silently
        }
      }

      const video = toVTVideoInfoDto(videoInfo as unknown, {
        dashManifest
      });

      const videoBasicInfo: VideoBasicInfoDto = {
        author: video.author.name,
        authorId: video.author.id,
        authorThumbnails: video.author.thumbnails,
        authorThumbnailUrl: video.author.thumbnails?.[0].url,
        authorVerified: video.author.isVerified,
        description: video.description,
        likeCount: isNaN(video.likeCount) ? 0 : video.likeCount,
        lengthSeconds: video.duration.seconds,
        lengthString: video.duration.text,
        publishedText: video.published.text,
        published: video.published.date.getTime(),
        title: video.title,
        videoId: video.id,
        videoThumbnails: video.thumbnails,
        viewCount: video.viewCount,
        live: video.live
      };
      await this.VideoBasicInfoModel.findOneAndUpdate({ videoId: id }, videoBasicInfo, {
        upsert: true
      }).exec();

      return video;
    } catch (error) {
      if (error?.message) {
        throw new InternalServerErrorException(error.message);
      }
      if (error?.info?.reason) {
        throw new InternalServerErrorException(error.info.reason);
      }
      throw new InternalServerErrorException('Error fetching video information');
    }
  }

  async getDislikes(id: string): Promise<DislikeDto> {
    const { body } = await vtFetch<DislikeDto & { status?: number }>(
      `${this.returnYoutubeDislikeUrl}/Votes?videoId=${id}`
    );

    if (!body) {
      throw new HttpException('Error fetching dislike information', 503);
    }

    const responseObject = await body.json();

    if (!isNaN(responseObject.dislikes)) {
      return responseObject;
    }
    
    if (responseObject.status) {
      throw new HttpException(responseObject, responseObject.status);
    }
  }

  async getSkipSegments(id: string, url?: string): Promise<SponsorBlockSegmentsDto> {
    if (!id) {
      throw new HttpException('No video id provided', 400);
    }

    let sponsorBlockUrl = url;

    if (url) {
      sponsorBlockUrl = decodeURIComponent(url);
      if (!Common.validateExternalUrl(sponsorBlockUrl)) {
        throw new HttpException('Invalid URL provided', 400);
      }
    } else {
      sponsorBlockUrl = this.sponsorBlockApiUrl;
    }

    const idHash = createHash('sha256').update(id).digest('hex').substring(0, 4);

    const categories = [
      'sponsor',
      'selfpromo',
      'interaction',
      'intro',
      'outro',
      'preview',
      'music_offtopic',
      'filler',
      'poi_highlight'
    ];

    const { body } = await vtFetch<SponsorBlockSegmentsDto[]>(
      `${sponsorBlockUrl}/api/skipSegments/${idHash}`,
      {
        query: {
          categories: `["${categories.join('","')}"]`
        }
      }
    );

    if (!body) {
      throw new InternalServerErrorException('Error fetching skip segments');
    }

    const skipSectionsArray = await body.json();

    if (!Array.isArray(skipSectionsArray)) {
      throw new InternalServerErrorException('Error fetching skip segments');
    }

    const skipSections = skipSectionsArray?.find(el => el.videoID === id);

    if (skipSections) {
      return skipSections;
    }

    return {
      videoID: id,
      hash: idHash,
      segments: []
    };
  }

  async saveAuthorImage(imgUrl: string, channelId: string) {
    const arrBufferResponse = await vtFetch(imgUrl, { useProxy: true });
    const arrBuffer = await arrBufferResponse.body.arrayBuffer();

    if (!arrBuffer) {
      return
    }
    try {
      const imgPath = path.join(global.__basedir, `channels/${channelId}.webp`);

      const imgBuffer = Buffer.from(arrBuffer);

      let success = true;

      const webpImage = await sharp(imgBuffer)
        .resize(36)
        .webp()
        .toBuffer()
        .catch(() => {
          success = false;
        });

      if (success && webpImage) {
        await fs.appendFile(imgPath, webpImage);
        return `channels/${channelId}/thumbnail/tiny.webp`;
      }
    } catch {
      // Ignore silently
    }
    return null;
  }
}
