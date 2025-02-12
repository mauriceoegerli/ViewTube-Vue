<script setup lang="ts">
export type PlaylistEntryType = {
  title: string;
  id?: string;
  playlistId?: string;
  playlistID?: string;
  thumbnail?: string;
  playlistThumbnails?: Array<{
    url: string;
  }>;
  thumbnails?: Array<{
    url: string;
  }>;
  playlistThumbnail?: string;
  firstVideo?: {
    thumbnails?: Array<{
      url: string;
    }>;
  };
  videoCountString?: string;
  videoCount?: number;
  author?:
    | {
        name?: string;
        id?: string;
      }
    | string;
  authorId?: string;
  owner?: {
    name: string;
    channelID: string;
    verified: boolean;
  };
  publishedAt?: string;
  length?: number;
};

const props = defineProps<{
  playlist: PlaylistEntryType;
  hideAuthor?: boolean;
}>();

const { proxyUrl } = useImgProxy();

const playlistLink = computed((): string => {
  return `/playlist?list=${
    props.playlist.playlistId ?? props.playlist.playlistID ?? props.playlist.id
  }`;
});
</script>

<template>
  <div class="playlist-entry">
    <nuxt-link class="playlist-entry-thmb" :to="playlistLink">
      <div class="thmb-image-container">
        <img
          v-if="playlist.thumbnail"
          class="playlist-entry-thmb-image"
          :src="proxyUrl(playlist.thumbnail)"
          :alt="playlist.title"
        />
        <img
          v-if="playlist.thumbnails"
          class="playlist-entry-thmb-image"
          :src="proxyUrl(playlist.thumbnails?.[0]?.url)"
          :alt="playlist.title"
        />
        <img
          v-else-if="playlist.playlistThumbnails"
          class="playlist-entry-thmb-image"
          :src="proxyUrl(playlist.playlistThumbnails[3].url)"
          :alt="playlist.title"
        />
        <img
          v-else-if="playlist.playlistThumbnail"
          class="playlist-entry-thmb-image"
          :src="proxyUrl(playlist.playlistThumbnail)"
          :alt="playlist.title"
        />
        <img
          v-else-if="playlist.firstVideo && playlist.firstVideo.thumbnails"
          class="playlist-entry-thmb-image"
          :src="proxyUrl(playlist.firstVideo.thumbnails[0].url)"
          :alt="playlist.title"
        />
      </div>
      <div class="playlist-entry-count">
        <VTIcon name="mdi:playlist-play" class="playlist-icon" />
        <span v-if="playlist.videoCountString" class="count-text">{{
          playlist.videoCountString
        }}</span>
        <span v-else-if="playlist.length" class="count-text">{{ playlist['length'] }} videos</span>
        <span v-else-if="playlist.videoCount" class="count-text"
          >{{ playlist.videoCount }} videos</span
        >
      </div>
    </nuxt-link>
    <div class="playlist-entry-info">
      <nuxt-link v-tippy="playlist.title" class="playlist-entry-title tooltip" :to="playlistLink">{{
        playlist.title
      }}</nuxt-link>
      <div v-if="!hideAuthor" class="channel-name-container">
        <nuxt-link
          v-if="typeof playlist.author === 'string'"
          v-tippy="playlist.author"
          class="playlist-entry-channel tooltip"
          :to="'/channel/' + playlist.authorId"
          >{{ playlist.author }}</nuxt-link
        >
        <nuxt-link
          v-else-if="playlist.author"
          v-tippy="playlist.author.name"
          class="playlist-entry-channel tooltip"
          :to="'/channel/' + playlist.id"
          >{{ playlist.author.name }}</nuxt-link
        >
        <nuxt-link
          v-if="playlist.owner"
          v-tippy="playlist.owner.name"
          class="playlist-entry-channel tooltip"
          :to="'/channel/' + playlist.owner.channelID"
          >{{ playlist.owner.name }}</nuxt-link
        >
        <VTIcon
          v-if="playlist.owner && playlist.owner.verified"
          v-tippy="'Verified'"
          name="mdi:check-decagram"
          class="tooltip"
          title=""
        />
      </div>
      <div v-if="playlist.publishedAt" class="video-entry-stats">
        <p>{{ playlist.publishedAt }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.playlist-entry {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  z-index: 11;
  position: relative;

  .playlist-entry-thmb {
    overflow: hidden;
    position: relative;
    box-shadow: variables.$medium-shadow;
    z-index: 11;
    padding-top: 56.25%;

    .thmb-image-container {
      position: absolute;
      width: 100%;
      top: 50%;
      left: 0;
      transform: translateY(-50%);

      .playlist-entry-thmb-image {
        max-width: 100%;
        min-width: 100%;
        display: block;
      }
    }
    .playlist-entry-count {
      text-decoration: none;
      color: variables.$video-thmb-overlay-textcolor;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      padding: 5px 12px;
      background-color: variables.$video-thmb-overlay-bgcolor;
      box-sizing: border-box;
      border-radius: 5px;
      font-family: variables.$default-font;
      display: flex;
      flex-direction: row;
      align-items: center;

      .count-text {
        margin: 0 0 0 10px;
        white-space: nowrap;
      }

      .playlist-icon {
        width: 36px;
        height: 36px;

        .vt-icon {
          width: 36px;
          height: 36px;
        }
      }
    }
  }

  .playlist-entry-info {
    font-family: variables.$default-font;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    z-index: 11;

    .playlist-entry-title {
      text-decoration: none;
      margin: 0;
      font-size: 0.9rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--title-color);
      padding: 8px 0 4px 0;
    }

    .channel-name-container {
      display: flex;
      flex-direction: row;

      .playlist-entry-channel {
        text-decoration: none;
        padding: 3px 0 4px 0;
        font-size: 0.9rem;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: var(--subtitle-color);
      }

      .vt-icon {
        width: 14px;
        height: 14px;
        top: 3px;
        margin: 0 0 0 4px;
      }
    }
    .video-entry-stats {
      color: var(--subtitle-color-light);
      font-size: 0.8rem;
      margin: 5px 0 0 0;
    }
  }
}
</style>
