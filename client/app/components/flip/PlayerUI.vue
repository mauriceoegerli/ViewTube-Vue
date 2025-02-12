<script setup lang="ts">
import type { ApiDto } from '@viewtube/shared';

const props = defineProps<{
  videoState: VideoState;
  video: ApiDto<'VTVideoInfoDto'>;
  embed?: boolean;
  hidden?: boolean;
}>();
const flipPlayerUIRef = ref<HTMLDivElement | null>(null);

const captionsState = useCaptionsState(toRef(props, 'video'));
const isHidden = toRef(props, 'hidden');
const uiState = useUIState(
  props.videoState,
  toRef(props, 'video'),
  flipPlayerUIRef,
  captionsState,
  isHidden
);

const cursor = computed(() => uiState.cursor.value);
</script>

<template>
  <div
    id="flip-player-ui"
    ref="flipPlayerUIRef"
    class="flip-player-ui"
    :class="{ embed }"
    @pointerleave="uiState.onPointerLeave"
    @pointermove="uiState.onPointerMove"
    @pointerdown="uiState.onPointerDown"
    @pointerup="uiState.onPointerUp"
  >
    <slot />
    <Spinner v-if="videoState.video.buffering" class="flip-spinner" />
    <transition v-show="!hidden" name="flip-fade">
      <FlipControls
        v-if="uiState.visible.value"
        :video-state="videoState"
        :video="video"
        :ui-state="uiState"
      />
    </transition>
    <FlipSkipButton :ui-state="uiState" :video-state="videoState" />
    <FlipEffectsOverlay :ui-state="uiState" />
    <FlipCaptionsRenderer
      :captions-state="captionsState"
      :video-state="videoState"
      :ui-state="uiState"
    />
    <FlipPoster :video-state="videoState" :ui-state="uiState" :video :embed />
    <Teleport :to="uiState.fullscreen.value ? '#flip-player-ui' : 'body'">
      <transition name="flip-settings-transition">
        <FlipSettings
          v-if="uiState.settingsOpen.value"
          :video-state="videoState"
          :captions-state="captionsState"
          :ui-state="uiState"
        />
      </transition>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
.flip-fade-enter-active,
.flip-fade-leave-active {
  transition: opacity 200ms;
}
.flip-fade-enter-from,
.flip-fade-leave-to {
  opacity: 0;
}

.flip-settings-transition-enter-active,
.flip-settings-transition-leave-active {
  transition:
    opacity 300ms variables.$intro-easing,
    transform 300ms variables.$intro-easing;
}
.flip-settings-transition-enter-to,
.flip-settings-transition-leave-from {
  opacity: 1;
  transform: scale(1);
}
.flip-settings-transition-enter-from,
.flip-settings-transition-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

.flip-player-ui {
  max-height: calc(100vh - 170px);
  display: flex;
  background-color: #000;
  position: relative;
  cursor: v-bind(cursor);

  &.embed {
    max-height: 100%;
    height: 100%;
  }

  .flip-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  :deep(.flip-video-element) {
    margin: 0 auto;
    width: 100%;
    object-fit: contain;
  }
}
</style>
