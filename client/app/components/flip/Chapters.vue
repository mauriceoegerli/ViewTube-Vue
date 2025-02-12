<script setup lang="ts">
import type { ApiDto } from '@viewtube/shared';

const props = defineProps<{
  hovered: boolean;
  video: ApiDto<'VTVideoInfoDto'>;
  videoState: VideoState;
}>();

const chapters = computed(() => {
  const videoLength = props.videoState.video.duration;
  const videoLengthMs = videoLength * 1000;

  return props.video.chapters?.slice(1).map(chapter => ({
    ...chapter,
    posLeft: `${(chapter.startMs / videoLengthMs) * 100}%`
  }));
});
</script>

<template>
  <div v-if="chapters?.length > 0" class="flip-chapters" :class="{ hovered: hovered }">
    <div
      v-for="(chapter, index) in chapters"
      :key="index"
      class="flip-chapter"
      :style="{ left: chapter.posLeft }"
    />
  </div>
</template>

<style lang="scss" scoped>
.flip-chapters {
  position: absolute;
  left: 0;
  right: 0;

  &.hovered {
    .flip-chapter {
      height: 9px;
      background-color: var(--line-accent-color-dark);
    }
  }

  .flip-chapter {
    position: absolute;
    height: 3px;
    width: 3px;
    background-color: var(--line-accent-color);
    bottom: 2px;
    transition: height 300ms variables.$intro-easing;
    border-radius: 5px;
  }
}
</style>
