<script setup lang="ts">
import { useSettingsStore } from '~/store/settings';

const props = defineProps<{
  uiState: UiState;
  videoState: VideoState;
}>();

const settingsStore = useSettingsStore();
const { getHumanReadableCategory, getSegmentState } = useSponsorBlockUtils();

const displayThreshold = 5;

const visible = computed(() => {
  if (!settingsStore.sponsorblockEnabled) return false;
  if (!currentSponsorBlockSegment.value) return false;

  if (props.uiState.visible.value) {
    return true;
  }

  const segmentStart = currentSponsorBlockSegment.value.segment[0];

  if (props.videoState.video.currentTime < segmentStart + displayThreshold) {
    return true;
  }

  return false;
});

const onSkipClick = () => {
  const segment = props.uiState.getCurrentSegment(props.videoState.video.currentTime);
  if (!segment) return;

  props.videoState.setTime(segment.segment[1]);
};

const currentSponsorBlockSegment = computed(() => {
  if (!props.uiState.skipSegments.value?.segments || !settingsStore.sponsorblockEnabled) return;

  const segment = props.uiState.getCurrentSegment(props.videoState.video.currentTime);
  if (!segment) return null;

  const segmentState = getSegmentState(segment.category);

  if (segmentState !== 'none') {
    return {
      ...segment,
      text: getHumanReadableCategory(segment.category).toLowerCase()
    };
  }
  return null;
});
</script>

<template>
  <div class="flip-skip-button" :class="{ visible }" @click="onSkipClick">
    <span class="skip-text">Skip {{ currentSponsorBlockSegment?.text }}</span>
    <span class="help-text">Press <span class="key-hint">enter</span> to skip</span>
  </div>
</template>

<style lang="scss" scoped>
.flip-skip-button {
  position: absolute;
  right: 50px;
  top: 50%;
  transform: translateY(-50%) translateX(30%);
  border: solid 2px var(--theme-color-translucent);
  background-color: var(--bgcolor-main);
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 8px;
  pointer-events: none;
  opacity: 0;
  overflow: hidden;
  transition:
    opacity 300ms variables.$intro-easing,
    transform 300ms variables.$intro-easing;
  user-select: none;
  display: flex;
  flex-direction: column;

  &:hover {
    .help-text {
      height: 20px;
      width: 120px;
      opacity: 1;

      transition:
        height 200ms variables.$intro-easing,
        width 200ms variables.$intro-easing,
        opacity 200ms variables.$intro-easing;
    }
  }

  .help-text {
    font-size: 0.8rem;
    display: block;
    color: var(--subtitle-color-light);
    height: 0;
    width: 0;
    opacity: 0;
    white-space: nowrap;
    transition:
      height 200ms variables.$intro-easing,
      width 200ms ease-in,
      opacity 200ms variables.$intro-easing;

    .key-hint {
      background-color: var(--bgcolor-alt-light);
      padding: 0 2px;
      border-radius: 4px;
    }
  }

  &.visible {
    pointer-events: auto;
    transform: translateY(-50%) translateX(0);
    opacity: 1;
  }
}
</style>
