<script setup lang="ts">
import { getTimestampFromSeconds, type ApiDto } from '@viewtube/shared';

const props = defineProps<{
  videoState: VideoState;
  uiState: UiState;
  video: ApiDto<'VTVideoInfoDto'>;
}>();

const onPlayPauseClick = () => {
  if (props.videoState.video.playing) {
    props.videoState.pause();
  } else {
    props.videoState.play();
  }
};

const onVolumeClick = () => {
  props.videoState.setMuted(!props.videoState.video.muted);
};

const timestampText = computed(() => {
  if (props.video.live) {
    return `-${getTimestampFromSeconds(props.videoState.video.duration)}`;
  }
  return getTimestampFromSeconds(props.videoState.video.currentTime);
});
const videoLengthText = computed(() => {
  if (props.video.live) {
    return 'LIVE';
  }
  return getTimestampFromSeconds(props.videoState.video.duration);
});
</script>

<template>
  <div class="flip-control-buttons">
    <span class="timestamp-text left">{{ timestampText }}</span>
    <button class="control-button volume-control" @click.stop="onVolumeClick">
      <VTIcon v-if="videoState.video.muted" name="mdi:volume-mute" />
      <VTIcon v-else-if="videoState.video.volume === 0" name="mdi:volume-off" />
      <VTIcon v-else-if="videoState.video.volume < 0.5" name="mdi:volume-low" />
      <VTIcon v-else-if="videoState.video.volume < 1" name="mdi:volume-medium" />
      <VTIcon v-else name="mdi:volume-high" />
      <FlipVolume :video-state="videoState" :ui-state="uiState" />
    </button>
    <div class="control-buttons center-buttons">
      <!-- <button class="control-button">
        <VTIcon name="mdi:skip-previous" />
      </button> -->
      <button class="control-button play-button" @click.stop="onPlayPauseClick">
        <VTIcon v-if="!videoState.video.playing" name="mdi:play" />
        <VTIcon v-else name="mdi:pause" />
      </button>
      <!-- <button class="control-button">
        <VTIcon name="mdi:skip-next" />
      </button> -->
    </div>
    <div class="control-buttons right">
      <button class="control-button" @click.stop="uiState.openSettings">
        <VTIcon name="mdi:cog" />
      </button>
      <button class="control-button" @click.stop="uiState.toggleFullscreen">
        <VTIcon v-if="uiState.fullscreen.value" name="mdi:arrow-collapse" />
        <VTIcon v-else name="mdi:arrow-expand" />
      </button>
    </div>
    <span class="timestamp-text right">{{ videoLengthText }}</span>
  </div>
</template>

<style lang="scss" scoped>
.flip-control-buttons {
  display: grid;
  grid-template-columns: 100px 1fr 100px;
  height: 60px;
  padding: 10px 10px 0 10px;
  pointer-events: auto;
  color: #fefefe;
  position: relative;

  @media screen and (max-width: variables.$mobile-width) {
    height: 50px;
    padding: 10px 10px 20px 10px;
  }

  .timestamp-text {
    position: absolute;
    left: 0;
    top: -5px;
    margin: 0 15px;
    font-size: 0.8rem;

    &.right {
      left: auto;
      right: 0;
    }

    @media screen and (max-width: variables.$mobile-width) {
      top: unset;
      bottom: 0;
    }
  }

  .control-buttons {
    display: flex;

    &.center-buttons {
      justify-content: center;
    }

    &.right {
      justify-content: flex-end;
    }
  }

  .volume-control {
    @media screen and (max-width: variables.$mobile-width) {
      visibility: hidden !important;
    }
  }

  .control-button {
    all: unset;
    cursor: pointer;
    padding: 0 10px;
    position: relative;
    display: flex;
    align-items: center;

    &::after {
      display: none;
    }

    &.play-button {
      :deep(.vt-icon) {
        width: 3em;
        height: 3em;
      }
    }
  }
}
</style>
