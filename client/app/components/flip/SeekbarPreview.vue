<script setup lang="ts">
import { useSettingsStore } from '~/store/settings';
import type { ApiDto } from '@viewtube/shared';

const props = defineProps<{
  hoveredTime: number;
  hoveredTimestamp: string;
  positionX: string;
  video: ApiDto<'VTVideoInfoDto'>;
  videoState: VideoState;
  uiState: UiState;
  previewThumbnailWidth: number;
}>();
const { proxyUrl } = useImgProxy();
const { getSegmentState, getHumanReadableCategory, getSegmentColor } = useSponsorBlockUtils();
const settingsStore = useSettingsStore();

const thumbnailWidthPx = `${props.previewThumbnailWidth}px`;

const getPreviewThumbnail = (
  previewThumbnailTemplate: ApiDto<'VTVideoInfoDto'>['previewThumbnails'][number]
) => {
  if (!previewThumbnailTemplate) return;

  let previewImageUrl = previewThumbnailTemplate.urlTemplate;
  let previewImageNr = 0;
  const thumbnailCountPerImg = previewThumbnailTemplate.columns * previewThumbnailTemplate.rows;
  let secondsPerThumbnail = props.video.duration.seconds / thumbnailCountPerImg;

  if (previewThumbnailTemplate.previewThumbnailCount > 1) {
    secondsPerThumbnail = previewThumbnailTemplate.interval / 1000;
    const thumbnailNr = Math.floor(props.hoveredTime / secondsPerThumbnail);
    const thumbnailsPerImage = previewThumbnailTemplate.columns * previewThumbnailTemplate.rows;

    previewImageNr = Math.floor(thumbnailNr / thumbnailsPerImage);
    previewImageUrl = previewImageUrl.replace('M$M', `M${previewImageNr}`);
  }

  const currentImageSeconds =
    props.hoveredTime - previewImageNr * thumbnailCountPerImg * secondsPerThumbnail;
  const currentThumbnailNr = Math.floor(currentImageSeconds / secondsPerThumbnail);

  const thumbnailColumn = currentThumbnailNr % previewThumbnailTemplate.columns;
  const thumbnailRow = Math.floor(currentThumbnailNr / previewThumbnailTemplate.columns);

  const aspectRatio = previewThumbnailTemplate.width / previewThumbnailTemplate.height;

  const thumbnailHeight = props.previewThumbnailWidth / aspectRatio;

  return {
    previewUrl: proxyUrl(previewImageUrl),
    thumbnailColumn,
    thumbnailRow,
    columns: previewThumbnailTemplate.columns,
    rows: previewThumbnailTemplate.rows,
    thumbnailWidth: props.previewThumbnailWidth,
    thumbnailHeight
  };
};

const smallThumbnail = computed(() => getPreviewThumbnail(props.video.previewThumbnails[0]));
const largeThumbnail = computed(() =>
  getPreviewThumbnail(props.video.previewThumbnails[props.video.previewThumbnails.length - 1])
);

const currentChapter = computed(() => {
  if (!props.video.chapters?.length || !settingsStore.chapters) return;

  const hoveredTimeMs = props.hoveredTime * 1000;
  return props.video.chapters.find((chapter, index) => {
    const startMs = chapter.startMs;
    const endMs =
      props.video.chapters[index + 1]?.startMs ?? props.videoState.video.duration * 1000;
    return startMs < hoveredTimeMs && endMs > hoveredTimeMs;
  });
});

const currentSponsorBlockSegmentCategory = computed(() => {
  if (!props.uiState.skipSegments.value?.segments || !settingsStore.sponsorblockEnabled) return;

  const segment = props.uiState.getCurrentSegment(props.hoveredTime);
  if (!segment) return null;

  const segmentState = getSegmentState(segment.category);

  if (segmentState !== 'none') {
    return {
      text: getHumanReadableCategory(segment.category),
      color: getSegmentColor(segment.category)
    };
  }
  return null;
});

const currentSponsorBlockSegmentColor = computed(() => {
  if (!currentSponsorBlockSegmentCategory.value) return 'transparent';
  return currentSponsorBlockSegmentCategory.value.color;
});
</script>

<template>
  <div
    v-if="video.previewThumbnails?.length > 0"
    class="flip-seekbar-preview"
    :style="{
      transform: `translate3d(${positionX}, 0, 0)`
    }"
  >
    <div
      class="seekbar-preview-image-container"
      :style="{
        height: `${largeThumbnail.thumbnailHeight}px`
      }"
    >
      <div
        class="seekbar-preview-image"
        :style="{
          backgroundImage: `url(${smallThumbnail.previewUrl})`,
          backgroundPositionX: `-${smallThumbnail.thumbnailColumn * smallThumbnail.thumbnailWidth}px`,
          backgroundPositionY: `-${smallThumbnail.thumbnailRow * smallThumbnail.thumbnailHeight}px`,
          backgroundSize: `${smallThumbnail.columns * smallThumbnail.thumbnailWidth}px ${
            smallThumbnail.rows * smallThumbnail.thumbnailHeight
          }px`
        }"
      />
      <div
        class="seekbar-preview-image"
        :style="{
          backgroundImage: `url(${largeThumbnail.previewUrl})`,
          backgroundPositionX: `-${largeThumbnail.thumbnailColumn * largeThumbnail.thumbnailWidth}px`,
          backgroundPositionY: `-${largeThumbnail.thumbnailRow * largeThumbnail.thumbnailHeight}px`,
          backgroundSize: `${largeThumbnail.columns * largeThumbnail.thumbnailWidth}px ${
            largeThumbnail.rows * largeThumbnail.thumbnailHeight
          }px`
        }"
      />
    </div>
    <div class="preview-gradient" :class="{ visible: currentSponsorBlockSegmentCategory }" />
    <div class="preview-info">
      <div class="timestamp">{{ hoveredTimestamp }}</div>
      <div :class="{ visible: currentChapter }" class="preview-info-element chapter">
        <VTIcon class="chapter-icon" name="mdi:book-open-variant" width="0.9rem" height="0.9rem" />
        <span class="info-text">{{ currentChapter?.title ?? '' }}</span>
      </div>
      <div
        :class="{ visible: currentSponsorBlockSegmentCategory }"
        class="preview-info-element sponsorblock"
      >
        <img class="sponsorblock-icon" src="~/assets/icons/sponsorblock.png" />
        <span class="info-text">{{ currentSponsorBlockSegmentCategory?.text ?? '' }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.flip-seekbar-preview {
  position: absolute;
  left: 0;
  width: v-bind(thumbnailWidthPx);
  bottom: 25px;
  background-repeat: no-repeat;
  pointer-events: none;
  user-select: none;
  opacity: 0;
  transition: opacity 200ms variables.$intro-easing;
  box-shadow: variables.$medium-shadow;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--bgcolor-main);
  border-radius: 8px;
  z-index: 10;

  .preview-gradient {
    position: absolute;
    height: 100%;
    width: 100%;
    bottom: 0;
    left: 0;
    background-image: linear-gradient(
      -20deg,
      v-bind(currentSponsorBlockSegmentColor),
      rgba(0, 0, 0, 0) 30%
    );
    transition: opacity 200ms variables.$intro-easing;
    opacity: 0;
    z-index: -1;

    &.visible {
      opacity: 0.3;
    }
  }

  .preview-info {
    padding: 2px 5px;

    .timestamp {
      font-size: 1.1rem;
    }
    .preview-info-element {
      height: 0;
      transition:
        height 200ms variables.$intro-easing,
        opacity 200ms variables.$intro-easing;
      font-size: 0.9rem;
      display: flex;
      gap: 5px;
      opacity: 0;

      .chapter-icon {
        margin: auto 0;
        min-width: 0.9rem;
      }

      .sponsorblock-icon {
        width: 0.9rem;
        height: 0.9rem;
        min-width: 0.9rem;
        margin: auto 0;
        filter: grayscale(1);
      }

      .info-text {
        margin: auto 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      &.visible {
        height: 23.5px;
        opacity: 1;
      }
    }
  }

  .seekbar-preview-image-container {
    position: relative;
    width: 100%;

    .seekbar-preview-image {
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}
</style>
