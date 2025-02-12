<script setup lang="ts">
import type { Continuation } from 'ytpl';
import BadgeButton from '~/components/buttons/BadgeButton.vue';
import VideoEntry from '~/components/list/VideoEntry.vue';
import Spinner from '~/components/Spinner.vue';
import type { ApiDto } from '@viewtube/shared';

import { useMessagesStore } from '~/store/messages';

const messagesStore = useMessagesStore();
const { apiUrl } = useApiUrl();
const route = useRoute();
const { proxyUrl } = useImgProxy();
const { vtFetch } = useVtFetch();
const { createTextLinks } = useCreateTextLinks();

const moreVideosLoading = ref(false);
const {
  data: playlist,
  pending,
  error
} = useGetPlaylists(route.query.list.toString(), { pages: 1 });
const playlistContinuation = ref<Continuation>(playlist.value?.continuation);
const additionalPlaylistItems = ref<ApiDto<'PlaylistItemDto'>[]>([]);
const playlistItems = computed(() => {
  return playlist.value?.items.concat(additionalPlaylistItems.value);
});

watch(error, value => {
  if (value) {
    messagesStore.createMessage({
      type: 'error',
      title: 'Error loading playlist',
      message: value?.message ?? 'Playlist may not be available'
    });
  }
});

const loadMoreVideos = async () => {
  if (!playlistContinuation.value) return;
  
  moreVideosLoading.value = true;
  await vtFetch<{ items: Array<ApiDto<'PlaylistItemDto'>>; continuation: any }>(
    `${apiUrl.value}playlists/continuation`,
    {
      params: {
        continuationData: playlistContinuation.value
      }
    }
  )
    .then(response => {
      if (response) {
        additionalPlaylistItems.value = additionalPlaylistItems.value.concat(response.items);
        playlistContinuation.value = response.continuation;
        moreVideosLoading.value = false;
      }
    })
    .catch((_: any) => {
      messagesStore.createMessage({
        type: 'error',
        title: 'Unable to load more results',
        message: 'Try again or use a different search term for more results'
      });
      moreVideosLoading.value = false;
    });
};
const playlistDescription = computed(() => {
  const sanitizedDescription = sanitizeHtmlString(playlist.value?.description);
  return createTextLinks(sanitizedDescription);
});
</script>

<template>
  <div class="playlist">
    <MetaPageHead
      :title="`${playlist?.title} :: ${playlist?.author.name}`"
      :description="`${playlist?.description?.substring(0, 100)}`"
      :image="`${playlist?.thumbnails?.[2]?.url}`"
    />
    <Spinner v-if="pending" class="centered" />
    <div v-if="playlist" class="thumbnail-banner-container">
      <div
        class="thumbnail-banner"
        :style="{ 'background-image': `url(${proxyUrl(playlist.thumbnails[0].url)})` }"
      />
      <div class="gradient-to-color" />
      <div class="playlist-info">
        <nuxt-link :to="`/channel/${playlist.author.channelID}`" class="author-thumbnail-banner">
          <img
            class="author-thumbnail"
            :src="proxyUrl(playlist.author.bestAvatar.url)"
            alt="Author thumbnail"
          />
          <div class="author-info">
            <p>{{ playlist.author.name }}</p>
          </div>
        </nuxt-link>
        <h2 class="playlist-title">{{ playlist.title }}</h2>
        <div class="playlist-details">
          <span class="playlist-detail">
            <VTIcon name="mdi:eye" /> {{ playlist.views?.toLocaleString('en-US') }} views
          </span>
          <span class="playlist-detail">
            <VTIcon name="mdi:counter" />
            {{ playlist.estimatedItemCount?.toLocaleString('en-US') }} items
          </span>
          <span class="playlist-detail">
            <VTIcon name="mdi:calendar-clock" />{{ playlist.lastUpdated }}
          </span>
          <span class="playlist-detail">
            <VTIcon v-if="playlist.visibility === 'everyone'" name="mdi:eye" />
            <VTIcon v-else-if="playlist.visibility === 'unlisted'" name="mdi:eye-off" />{{
              playlist.visibility === 'everyone' ? 'public' : 'unlisted'
            }}
            playlist
          </span>
        </div>
      </div>
    </div>
    <div v-if="playlist" class="playlist-content-container">
      <pre
        v-if="playlist && playlist.description"
        class="playlist-description links"
        v-html="playlistDescription"
      />
      <div class="playlist-videos-container">
        <VideoEntry
          v-for="video in playlistItems"
          :key="video.id"
          :video="video"
          :playlist-id="playlist.id"
          :lazy="false"
        />
      </div>
      <div v-if="playlistContinuation" class="load-more-btn">
        <BadgeButton :click="loadMoreVideos" :loading="moreVideosLoading"
          ><VTIcon name="mdi:reload" />
          <p>Show more</p></BadgeButton
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.playlist {
  margin-top: variables.$header-height;

  .thumbnail-banner-container {
    width: 100%;
    padding-top: 25%;
    position: relative;

    @media screen and (max-width: variables.$main-width) {
      padding-top: 30%;
    }

    @media screen and (max-width: 1000px) {
      padding-top: 40%;
    }

    @media screen and (max-width: 760px) {
      padding-top: 45%;
    }

    @media screen and (max-width: variables.$mobile-width) {
      padding-top: 50%;
    }

    @media screen and (max-width: 580px) {
      padding-top: 65%;
    }

    @media screen and (max-width: 450px) {
      padding-top: 85%;
    }

    .thumbnail-banner,
    .gradient-to-color {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .gradient-to-color {
      background: linear-gradient(to bottom, transparent, var(--bgcolor-main));
    }

    .thumbnail-banner {
      background-size: 100%;
      background-repeat: no-repeat;
      background-attachment: fixed;
      background-position: 0 variables.$header-height;
      filter: blur(15px);
    }

    .playlist-info {
      position: absolute;
      width: calc(100% - 30px);
      bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 15px;

      .author-thumbnail-banner {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;

        &:hover {
          .author-info {
            background-color: var(--bgcolor-alt);
          }
        }

        .author-thumbnail {
          box-shadow: variables.$medium-shadow;
          display: block;
          width: 94px;
        }

        .author-info {
          pointer-events: none;
          transition:
            width 300ms variables.$intro-easing,
            opacity 300ms 200ms variables.$intro-easing;
          overflow: hidden;
          margin: 10px 0 0 0;
          padding: 2px 5px;
          border-radius: 5px;
          transition: background-color 200ms variables.$intro-easing;
        }
      }

      .playlist-title {
        margin: 25px 0;
      }

      .playlist-details {
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        text-align: left;
        display: flex;
        flex-wrap: wrap;

        .playlist-detail {
          margin: 0 20px 0 0;
          .vt-icon {
            top: 6px;
            margin: 0 5px 0 0;
          }
        }
      }
    }
  }

  .playlist-content-container {
    background-color: var(--bgcolor-main);
    width: calc(100% - 30px);
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 0 15px;

    .playlist-description {
      z-index: 10;
      width: 100%;
      max-width: 1000px;
      margin: 0 auto;
      padding: 15px 0;
      overflow: hidden;
      white-space: pre-wrap;
      overflow-wrap: break-word;
      font-family: variables.$default-font;
    }

    .playlist-videos-container {
      @include mixins.viewtube-grid;
    }

    .load-more-btn {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px 0 20px 0;
    }
  }
}
</style>
