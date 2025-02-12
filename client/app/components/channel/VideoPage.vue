<script setup lang="ts">
import VideoEntry from '~/components/list/VideoEntry.vue';
import PlaylistEntry from '~/components/list/PlaylistEntry.vue';
import MultiOptionButton from '~/components/buttons/MultiOptionButton.vue';
import BadgeButton from '~/components/buttons/BadgeButton.vue';
import type { ApiDto } from '@viewtube/shared';

const props = withDefaults(
  defineProps<{
    videos: ApiDto<'ChannelVideosDto'> | ApiDto<'ChannelPlaylistsDto'>;
    sort: ChannelVideosSortOptionsType | ChannelPlaylistsSortOptionsType;
    sortOptions: { value: string; label: string }[];
    entryTypeName?: string;
    morePending?: boolean;
    entryType?: 'videos' | 'playlists';
    sortDisabled?: boolean;
  }>(),
  { entryTypeName: 'videos', morePending: false, entryType: 'videos' }
);

const emit = defineEmits<{
  (
    event: 'update:sort',
    value: ChannelVideosSortOptionsType | ChannelPlaylistsSortOptionsType
  ): void;
  (event: 'load-more'): void;
}>();

const sortBy = computed<ChannelVideosSortOptionsType | ChannelPlaylistsSortOptionsType>({
  get: () => props.sort,
  set: value => emit('update:sort', value)
});
</script>

<template>
  <div v-if="(videos as any)?.items.length === 0" class="no-videos">
    <p>This channel has no {{ entryTypeName }}.</p>
  </div>
  <div v-else class="videos">
    <div class="controls">
      <div
        v-tippy="sortDisabled ? 'Currently unavailable due to changes from YouTube' : undefined"
        class="controls-inner"
      >
        <p class="sort-label">Sort by</p>
        <MultiOptionButton v-model="sortBy" :options="sortOptions" :disabled="sortDisabled" />
      </div>
    </div>
    <div v-if="entryType === 'videos'" class="videos-container">
      <VideoEntry
        v-for="(video, index) in (videos as any)?.items"
        :key="index"
        :video="video"
        hide-author
      />
    </div>
    <div v-else class="videos-container">
      <PlaylistEntry
        v-for="(playlist, index) in (videos as any)?.items"
        :key="index"
        :playlist="playlist"
        hide-author
      />
    </div>
    <div class="show-more">
      <BadgeButton
        v-if="(videos as any)?.continuation"
        class="show-more-button"
        :loading="morePending"
        @click.prevent="$emit('load-more')"
      >
        <VTIcon name="mdi:reload" />
        <p>Show more</p>
      </BadgeButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.no-videos {
  display: flex;
  justify-content: center;
  margin: 15px 0 0 0;
  height: 90vh;
}

.videos {
  margin: 15px 0 0 0;

  .controls {
    display: flex;
    justify-content: flex-end;
    padding: 0 15px;
    margin: 0 0 15px 0;

    .controls-inner {
      display: flex;
      gap: 10px;

      .sort-label {
        display: flex;
        align-items: center;
      }
    }
  }

  .videos-container {
    width: 100%;
    max-width: variables.$main-width;
    margin: 0 auto;
    padding: 0 15px;
    box-sizing: border-box;
    background-color: var(--bgcolor-main);
    @include mixins.viewtube-grid;
  }

  .show-more {
    display: flex;

    .show-more-button {
      margin: 15px auto 20px auto;
    }
  }
}
</style>
