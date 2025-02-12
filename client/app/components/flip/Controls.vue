<script setup lang="ts">
import type { ApiDto } from '@viewtube/shared';

defineProps<{
  uiState: UiState;
  videoState: VideoState;
  video: ApiDto<'VTVideoInfoDto'>;
}>();
</script>

<template>
  <div class="controls">
    <FlipTopBar :ui-state="uiState" :video="video" />
    <div class="controls-bottom">
      <FlipSeekbar :ui-state="uiState" :video-state="videoState" :video="video" />
      <FlipControlButtons :ui-state="uiState" :video-state="videoState" :video="video" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.controls {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  pointer-events: none;
  z-index: 10;

  .controls-bottom {
    display: flex;
    flex-direction: column;

    @media screen and (max-width: variables.$mobile-width) {
      flex-direction: column-reverse;
    }
  }

  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 120px;
    bottom: -1px;
    left: 0;
    z-index: -1;
    background-image: variables.$video-player-gradient;
    transform: rotate(180deg);
  }
}
</style>
