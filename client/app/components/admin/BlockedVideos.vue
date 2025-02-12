<script setup lang="ts">
import BadgeButton from '~/components/buttons/BadgeButton.vue';

const { data, pending, refresh } = useGetBlockedVideos();
const videoIdToAdd = ref(null);

const addVideo = async () => {
  if (videoIdToAdd.value) {
    await addBlockedVideo(videoIdToAdd.value);
    videoIdToAdd.value = null;
    await refresh();
  }
};

const removeVideo = async (videoId: string) => {
  await removeBlockedVideo(videoId);
  await refresh();
};
</script>

<template>
  <div class="blocked-videos">
    <div class="actions">
      <div class="add-video">
        <input v-model="videoIdToAdd" type="text" placeholder="Video ID" />
        <BadgeButton class="add-btn" :click="addVideo">Add</BadgeButton>
      </div>
      <div class="refresh-container">
        <BadgeButton :click="refresh">Refresh</BadgeButton>
      </div>
    </div>
    <Spinner v-if="pending" />
    <div v-if="data && !pending" class="ids">
      <div v-for="id in data" :key="id" class="id">
        {{ id }}
        <BadgeButton class="remove-btn" :click="() => removeVideo(id)">Remove</BadgeButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.blocked-videos {
  .ids {
    display: flex;
    flex-direction: column;
    margin-top: 10px;

    .id {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 5px;
      margin-bottom: 5px;

      :deep(.remove-btn) {
        opacity: 0;
        margin: 0;
        transition: opacity 200ms variables.$intro-easing;
        pointer-events: none;

        :deep(.content) {
          padding: 0 4px;
        }
      }

      &:hover {
        :deep(.remove-btn) {
          opacity: 1;
          transition:
            opacity 200ms 200ms variables.$intro-easing,
            pointer-events 200ms 200ms variables.$intro-easing;
          pointer-events: auto;
        }
      }
    }
  }
  .actions {
    display: flex;
    flex-direction: row;

    .add-video {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 5px;

      input {
        padding: 5px;
        border: 2px solid var(--theme-color-translucent);
        border-radius: 3px;
        font-size: 0.9rem;
        background-color: unset;
        color: unset;

        &:focus {
          outline: none;
          border-color: var(--theme-color);
        }
      }
    }
    .refresh-container {
      margin-left: auto !important;
    }
  }
}
</style>
