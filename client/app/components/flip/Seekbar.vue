<script setup lang="ts">
import { getTimestampFromSeconds } from '@viewtube/shared';
import { useSettingsStore } from '~/store/settings';
import type { ApiDto } from '@viewtube/shared';

const props = defineProps<{
  videoState: VideoState;
  uiState: UiState;
  video: ApiDto<'VTVideoInfoDto'>;
}>();

const settingsStore = useSettingsStore();

const _currentTime = ref(props.videoState.video.currentTime);
watch(
  () => props.videoState.video.currentTime,
  newVal => {
    if (!seeking.value) {
      _currentTime.value = newVal;
    }
  }
);

const bufferWidth = computed(
  () =>
    `${
      ((props.videoState.video.currentTime + props.videoState.video.bufferLevel) /
        props.videoState.video.duration) *
      100
    }%`
);

const currentTimeWidth = computed(
  () => `${(_currentTime.value / props.videoState.video.duration) * 100}%`
);

const seekbarRef = ref<HTMLDivElement | null>(null);
const seekbarInnerRef = ref<HTMLDivElement | null>(null);
const seeking = ref(false);

const onPointerDown = (e: PointerEvent) => {
  props.uiState.setSeeking(true);
  seeking.value = true;
  seekbarRef.value?.setPointerCapture(e.pointerId);
  onPointerMove(e);
};

const onPointerMove = (e: PointerEvent) => {
  const rect = seekbarInnerRef.value?.getBoundingClientRect();
  if (!rect) return;
  const x = e.clientX - rect.left;
  const width = rect.width;
  let percent = x / width;
  if (percent < 0) percent = 0;
  if (percent > 1) percent = 1;
  const time = props.videoState.video.duration * percent;
  hoveredTime.value = time;
  hoveredTimestamp.value = getTimestampFromSeconds(time);
  hoverPosition.value = percent;

  if (seeking.value) {
    _currentTime.value = time;
  }
};

const seekbarHovered = ref(false);
const onPointerEnter = () => {
  seekbarHovered.value = true;
};

const onPointerLeave = () => {
  seekbarHovered.value = false;
};

const onPointerUp = (e: PointerEvent) => {
  props.uiState.setSeeking(false);
  seeking.value = false;
  seekbarRef.value?.releasePointerCapture(e.pointerId);
  props.videoState.setTime(_currentTime.value);
};

const hoveredTime = ref(0);
const hoveredTimestamp = ref('00:00');
const hoverPosition = ref(0);

const mobileWidth = useMediaQuery('(max-width: 700px)');

const previewThumbnailWidth = computed(() => {
  if (mobileWidth.value) return 200;
  return 240;
});

const previewThumbnailPosition = computed(() => {
  hoverPosition.value;
  return getHoverPositionByWidth(previewThumbnailWidth.value);
});

const getHoverPositionByWidth = (elWidth: number) => {
  const rect = seekbarInnerRef.value?.getBoundingClientRect();
  if (!rect || !elWidth) return '0px';

  const width = rect.width;
  const hoverWidth = elWidth;
  const left = hoverPosition.value * width;
  const offset = left - hoverWidth / 2;
  if (offset < 0) return '0';
  if (offset > width - hoverWidth) return `${width - hoverWidth}px`;
  return `${offset}px`;
};
</script>

<template>
  <div
    ref="seekbarRef"
    class="flip-seekbar-container"
    :class="{ 'flip-seekbar-hovered': seekbarHovered }"
    @pointerdown.stop.prevent="onPointerDown"
    @pointermove.stop.prevent="onPointerMove"
    @pointerup.stop.prevent="onPointerUp"
    @pointerenter.stop.prevent="onPointerEnter"
    @pointerleave.stop.prevent="onPointerLeave"
    @click.stop.prevent="() => {}"
  >
    <div ref="seekbarInnerRef" class="flip-seekbar">
      <div class="flip-seekbar-buffer seekbar-overlay" />
      <div class="flip-seekbar-progress seekbar-overlay" />
      <div
        v-if="uiState.skipSegments.value?.segments && settingsStore.sponsorblockEnabled"
        class="flip-seekbar-sponsorblock seekbar-overlay"
      >
        <FlipSkipSegment
          v-for="skipSegment in uiState.skipSegments.value.segments"
          :key="skipSegment.UUID"
          :segment="skipSegment"
          :video-duration="videoState.video.duration"
        />
      </div>
      <FlipChapters
        v-if="settingsStore.chapters"
        :hovered="seekbarHovered"
        :video="video"
        :video-state="videoState"
      />
      <div class="flip-seekbar-point" />
      <FlipSeekbarPreview
        class="seekbar-preview"
        :hovered-time="hoveredTime"
        :hovered-timestamp="hoveredTimestamp"
        :position-x="previewThumbnailPosition"
        :video-state="videoState"
        :ui-state="uiState"
        :video="video"
        :preview-thumbnail-width="previewThumbnailWidth"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.flip-seekbar-container {
  width: 100%;
  height: 20px;
  display: flex;
  align-items: center;
  pointer-events: auto;
  cursor: pointer;
  user-select: none;
  touch-action: none;

  .flip-seekbar {
    width: calc(100% - 30px);
    margin: auto;
    background-color: var(--line-color);
    height: 4px;
    border-radius: 25px;
    position: relative;

    .seekbar-overlay {
      position: absolute;
      top: 0;
      bottom: 0;
      border-radius: 25px;
      height: 100%;
      max-width: 100%;
    }

    .flip-seekbar-buffer {
      background-color: var(--line-accent-color);
      width: v-bind(bufferWidth);
    }

    .flip-seekbar-progress {
      background-color: var(--theme-color);
      width: v-bind(currentTimeWidth);
    }

    .flip-seekbar-sponsorblock {
      width: 100%;
      overflow: hidden;
    }

    .flip-seekbar-point {
      left: calc(v-bind(currentTimeWidth) - 6px);
      top: -4px;
      position: absolute;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: var(--theme-color);
      transform: scale(0);
      transition: transform 300ms variables.$intro-easing;
    }
  }

  &.flip-seekbar-hovered {
    :deep(.seekbar-preview) {
      opacity: 1;
    }

    .flip-seekbar-point {
      transform: scale(1);
    }
  }
}
</style>
