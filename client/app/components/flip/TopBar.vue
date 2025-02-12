<script setup lang="ts">
import type { ApiDto } from '@viewtube/shared';

defineProps<{
  video: ApiDto<'VTVideoInfoDto'>;
  uiState: UiState;
}>();
</script>

<template>
  <div class="flip-top-bar">
    <div v-if="uiState.fullscreen.value" class="flip-video-info">
      <span class="video-title">{{ video.title }}</span>
      <span class="video-channel">{{ video.author.name }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.flip-top-bar {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 15px;
  background: variables.$video-player-gradient;

  .flip-video-info {
    display: flex;
    flex-direction: column;

    .video-title {
      font-weight: bold;
      font-size: 1.1rem;
    }

    .video-channel {
      font-size: 0.8rem;
    }
  }
}
</style>
