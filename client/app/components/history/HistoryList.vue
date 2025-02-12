<script setup lang="ts">
import humanizeDuration from 'humanize-duration';
import BadgeButton from '~/components/buttons/BadgeButton.vue';
import type { ApiDto } from '@viewtube/shared';
import { useMessagesStore } from '~/store/messages';

defineProps<{
  historyVideos: ApiDto<'HistoryResponseDto'>['videos'];
  deleteOption: boolean;
}>();

const emit = defineEmits<{ (e: 'refresh'): void }>();

const messagesStore = useMessagesStore();
const { apiUrl } = useApiUrl();
const { proxyUrl } = useImgProxy();
const { vtFetch } = useVtFetch();

const humanizeDateString = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const dateMs = now.valueOf() - date.valueOf();
  return humanizeDuration(dateMs, { largest: 1 });
};
const deleteEntry = async (videoId: string) => {
  await vtFetch(`${apiUrl.value}user/history/${videoId}`, {
    method: 'DELETE',
    credentials: 'include'
  })
    .then(() => {
      emit('refresh');
    })
    .catch(() => {
      messagesStore.createMessage({
        type: 'error',
        title: 'Error deleting history entry',
        message: 'Try logging out and in again'
      });
    });
};
</script>

<template>
  <div class="history-list">
    <div v-for="(video, index) in historyVideos" :key="index" class="history-entry">
      <nuxt-link :to="`/watch?v=${video.videoId}`" class="history-entry-thumbnail">
        <img
          :src="proxyUrl(video.videoDetails.videoThumbnails[3].url)"
          :alt="video.videoDetails.title"
          class="history-entry-thumbnail-img"
        />
        <div class="history-entry-progress-bar">
          <span
            class="history-entry-progress-line"
            :style="{ width: `${(video.progressSeconds / video.lengthSeconds) * 100}%` }"
          />
        </div>
      </nuxt-link>
      <div class="history-entry-content">
        <div v-tippy="video.videoDetails.title" class="history-entry-title">
          <nuxt-link :to="`/watch?v=${video.videoId}`">{{ video.videoDetails.title }}</nuxt-link>
        </div>
        <div v-tippy="video.videoDetails.author" class="history-entry-author">
          <nuxt-link :to="`/channel/${video.videoDetails.authorId}`">
            {{ video.videoDetails.author }}</nuxt-link
          >
        </div>
        <div
          v-tippy="video.lastVisit ? new Date(video.lastVisit).toLocaleString() : null"
          class="history-entry-watched-date tooltip"
        >
          Last watched: {{ humanizeDateString(video.lastVisit) }} ago
        </div>
        <div class="history-entry-watch-progress">
          Progress: {{ $formatting.getTimestampFromSeconds(video.progressSeconds) }} of
          {{ $formatting.getTimestampFromSeconds(video.lengthSeconds) }}
        </div>
      </div>
      <BadgeButton v-if="deleteOption" class="delete-btn" :click="() => deleteEntry(video.videoId)"
        ><VTIcon name="mdi:delete"
      /></BadgeButton>
    </div>
  </div>
</template>

<style lang="scss">
.history-list {
  display: flex;
  flex-direction: column;

  .history-entry {
    display: flex;
    flex-direction: row;
    margin: 5px 0;
    position: relative;

    .history-entry-thumbnail {
      position: relative;
      padding-right: 230px;
      padding-bottom: 129.375px;
      width: 0;
      overflow: hidden;

      @media screen and (max-width: variables.$mobile-width) {
        padding-right: 160px;
        padding-bottom: 90px;
      }

      .history-entry-thumbnail-img {
        position: absolute;
        width: 100%;
      }

      .history-entry-progress-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background-color: var(--line-accent-color);

        .history-entry-progress-line {
          height: 3px;
          background-image: variables.$theme-color-primary-gradient;
          display: block;
        }
      }
    }

    .history-entry-content {
      margin: 0 0 0 10px;
      overflow: hidden;

      .history-entry-title {
        font-size: 0.9rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: var(--title-color);
        padding: 0 0 4px 0;
      }

      .history-entry-author {
        font-size: 0.8rem;
        font-weight: 700;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: var(--subtitle-color);
        padding: 3px 0 4px 0;
      }

      .history-entry-watched-date {
        font-size: 0.8rem;
        color: var(--subtitle-color-light);
      }

      .history-entry-watch-progress {
        font-size: 0.8rem;
        color: var(--subtitle-color-light);
      }
    }

    &:hover {
      .delete-btn {
        opacity: 1;
        pointer-events: all;
        user-select: auto;
      }
    }

    .delete-btn {
      position: absolute !important;
      top: 0;
      right: 0;
      opacity: 0;
      pointer-events: none;
      user-select: none;
      transition: opacity 200ms variables.$intro-easing;
    }
  }
}
</style>
