<script setup lang="ts">
const props = defineProps<{
  captionsState: CaptionsState;
  videoState: VideoState;
  uiState: UiState;
}>();

const selectedCaptionsTrack = computed(() =>
  props.captionsState.availableCaptionTracks.value?.find(
    track => track.languageCode === props.captionsState.currentTrackCode.value
  )
);

const currentCaption = computed(() => {
  if (!selectedCaptionsTrack.value) return null;
  const currentTime = props.videoState.video.currentTime;

  return selectedCaptionsTrack.value.captions
    .filter(
      caption => caption.start <= currentTime && caption.start + caption.duration >= currentTime
    )
    .map(caption => sanitizeHtmlString(caption.text));
});
</script>

<template>
  <div class="flip-captions-renderer" :class="{ 'ui-visible': uiState.visible.value }">
    <div v-for="(line, index) in currentCaption" :key="index" class="caption-line" v-html="line" />
  </div>
</template>

<style lang="scss" scoped>
.flip-captions-renderer {
  position: absolute;
  bottom: 20px;
  transition: transform 200ms variables.$intro-easing;
  display: flex;
  flex-direction: column;
  width: 100%;

  &.ui-visible {
    transform: translateY(-100px);
  }

  .caption-line {
    margin: 0 auto;
    background-color: #000000ae;
    color: #f7f7f7;
    font-size: 2vw;
    white-space: pre;
    user-select: none;
    pointer-events: none;
  }
}
</style>
