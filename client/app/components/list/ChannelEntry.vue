<script setup lang="ts">
import humanNumber from 'human-number';

const props = defineProps<{
  channel: any;
  horizontal?: boolean;
}>();

const { proxyUrl } = useImgProxy();

const channelNameToImgString = (): string => {
  let initials = '';
  const channelName = props.channel.author ?? props.channel.name;
  channelName.split(' ').forEach((e: string) => {
    initials += e.charAt(0);
  });
  return initials;
};
</script>

<template>
  <div class="channel-entry" :class="{ horizontal }">
    <nuxt-link
      class="channel-entry-thmb"
      :to="{ path: '/channel/' + (channel.authorId ?? channel.channelID ?? channel.id) }"
    >
      <div
        v-if="!channel.authorThumbnails && !channel.avatars && !channel.thumbnails"
        class="fake-thmb"
      >
        <h3>{{ channelNameToImgString() }}</h3>
      </div>
      <div v-if="channel.authorThumbnails" class="thmb-image-container">
        <img
          class="channel-entry-thmb-image"
          :src="proxyUrl(channel.authorThumbnails[2].url)"
          :alt="channel.author"
        />
      </div>
      <div v-if="channel.thumbnails" class="thmb-image-container">
        <img
          class="channel-entry-thmb-image"
          :src="proxyUrl(channel.thumbnails[0].url)"
          :alt="channel.author"
        />
      </div>
      <div v-if="channel.avatars" class="thmb-image-container">
        <img
          class="channel-entry-thmb-image"
          :src="proxyUrl(channel.avatars[0].url)"
          :alt="channel.author ? channel.author : channel.name"
        />
      </div>
    </nuxt-link>
    <div class="channel-entry-info">
      <div class="title-container">
        <nuxt-link
          v-tippy="channel.author ? channel.author : channel.name"
          class="channel-entry-title tooltip"
          :to="{ path: '/channel/' + (channel.authorId ?? channel.channelID ?? channel.id) }"
          >{{ channel.author ? channel.author : channel.name }}</nuxt-link
        >
        <VTIcon
          v-if="channel.verified"
          v-tippy="'Verified'"
          name="mdi:check-decagram"
          class="tooltip"
          title=""
        />
      </div>
      <div class="channel-entry-stats">
        <p v-if="channel.videoCount || channel.videos" class="channel-entry-videocount">
          {{ channel.videoCount ?? channel.videos }} videos
        </p>
        <p v-if="channel.subscribers" class="channel-entry-subcount">
          {{ humanNumber(channel.subscribers) }} subscribers
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.channel-entry {
  width: 175px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  z-index: 11;
  position: relative;

  &.horizontal {
    @media screen and (min-width: variables.$mobile-width) {
      flex-direction: row;
      width: 100%;

      .channel-entry-thmb {
        margin: 0 20px 0 0;
        min-width: 175px;

        .thmb-image-container {
          width: 175px;
          .channel-entry-thmb-image {
            width: 175px;
          }
        }
      }

      .channel-entry-info {
        padding: 0;
      }
    }

    @media screen and (max-width: variables.$mobile-width) {
      width: 100%;
    }
  }

  .channel-entry-thmb {
    width: 175px;
    height: 175px;
    overflow: hidden;
    position: relative;
    box-shadow: variables.$medium-shadow;
    margin: 0 auto;
    z-index: 11;

    .fake-thmb {
      overflow: hidden;
      background-color: var(--theme-color);
      height: 100%;
      width: 100%;
      display: flex;

      h3 {
        font-size: 6rem;
        white-space: normal;
        text-align: center;
        margin: auto;
      }
    }

    .thmb-image-container {
      position: relative;
      top: 50%;
      left: 0;
      transform: translateY(-50%);

      .channel-entry-thmb-image {
        width: 100%;
        display: block;
      }
    }
  }

  .channel-entry-info {
    padding: 10px 0 10px 0;
    font-family: variables.$default-font;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    z-index: 11;

    .title-container {
      display: flex;
      flex-direction: row;

      .channel-entry-title {
        text-decoration: none;
        margin: 0;
        font-size: 0.9rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: var(--title-color);
        padding: 6px 0 4px 0;
        font-weight: bold;
      }

      .vt-icon {
        width: 16px;
        height: 16px;
        top: 6px;
        margin: 0 0 0 5px;
      }
    }

    .channel-entry-stats {
      color: var(--subtitle-color);
      display: flex;
      width: 100%;
      justify-content: space-between;
      flex-direction: column;
      font-size: 0.8rem;
      margin: 3px 0 0 0;

      p {
        margin: 3px 0 5px 0;
      }
    }
  }
}
</style>
