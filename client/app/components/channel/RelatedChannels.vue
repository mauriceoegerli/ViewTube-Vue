<script setup lang="ts">
import type { ApiDto } from '@viewtube/shared';
export type RelatedChannelsType = ApiDto<'ChannelInfoDto'>['relatedChannels']['items'];

defineProps<{
  relatedChannels: {
    items?: RelatedChannelsType;
    continuation?: string | null;
    type: 'channels';
  };
  vertical?: boolean;
}>();

const { proxyUrl } = useImgProxy();
</script>

<template>
  <div v-if="relatedChannels?.items" class="related-channels" :class="{ vertical: vertical }">
    <div class="scroll-container">
      <nuxt-link
        v-for="channel in relatedChannels?.items"
        :key="channel.channelId"
        v-ripple
        class="related-channel tooltip"
        :to="{ path: `/channel/${channel.channelId}` }"
      >
        <div class="related-channel-thumbnail">
          <div class="related-channel-thumbnail-image">
            <img
              :src="
                proxyUrl(
                  (channel as any).thumbnail?.[2]?.url ?? (channel as any).thumbnail?.[1]?.url
                )
              "
              :alt="channel.channelName"
            />
          </div>
        </div>
        <div class="related-channel-info">
          <div v-tippy="channel.channelName" class="related-channel-title">
            <p class="related-channel-title-text">
              {{ channel.channelName }}
            </p>
            <VTIcon name="mdi:check-decagram" class="verified-icon" />
          </div>
          <p v-if="channel.subscriberText" class="subscriber-count">{{ channel.subscriberText }}</p>
          <p v-if="channel.videoCount" class="video-count">
            {{ channel.videoCount?.toLocaleString('en-US') }} videos
          </p>
        </div>
      </nuxt-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.related-channels {
  width: 100%;
  height: 280px;
  max-width: variables.$main-width;
  margin: 5px auto 0 auto;
  overflow: scroll;
  scrollbar-width: thin;
  box-sizing: border-box;
  position: relative;

  &.vertical {
    height: 100%;

    .scroll-container {
      position: initial;
      display: flex;
      flex-wrap: wrap;
      justify-content: left;
      gap: 15px 0;
    }
  }

  .scroll-container {
    display: flex;
    flex-direction: row;
    width: auto;
    position: absolute;
    margin: 5px 2px;

    .related-channel {
      width: 150px;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      margin: 0 15px 0 0;
      padding: 10px;
      box-shadow: 0 0 0 2px var(--theme-color-translucent);
      border-radius: 3px;
      transition:
        background-color 300ms variables.$intro-easing,
        box-shadow 300ms variables.$intro-easing;

      &:hover {
        background-color: var(--bgcolor-alt);
        box-shadow: 0 0 0 2px var(--theme-color);
      }

      .related-channel-thumbnail {
        width: 100%;

        .related-channel-thumbnail-image {
          height: 100%;
          width: 100;

          img {
            width: 100%;
          }
        }
      }
      .related-channel-info {
        width: 100%;
        overflow: hidden;

        .related-channel-title {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          width: 100%;
          color: var(--subtitle-color);
          font-family: variables.$default-font;

          .related-channel-title-text {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            line-height: 24px;
          }

          .verified-icon {
            :deep(.vt-icon) {
              width: 18px;
              height: 18px;
            }
          }
        }

        .subscriber-count,
        .video-count {
          margin: 5px 0 0 0;
          color: var(--subtitle-color-light);
          width: 100%;
        }
      }
    }
  }
}
</style>
