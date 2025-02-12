<script setup lang="ts">
import type { ApiDto } from '@viewtube/shared';

const props = defineProps<{
  featuredVideo: ApiDto<'ChannelHomeDto'>['featuredVideo'];
}>();

const { proxyUrl } = useImgProxy();

const placeholderImageSrc = computed(() =>
  proxyUrl(`https://i.ytimg.com/vi/${props.featuredVideo.videoId}/hqdefault.jpg`)
);

const placeholderVisible = ref(true);
const hidePlaceholder = () => {
  placeholderVisible.value = false;
};
</script>

<template>
  <div class="featured-video">
    <div class="video-embed">
      <transition name="fade">
        <div v-if="placeholderVisible" class="video-embed-placeholder" @click="hidePlaceholder">
          <img class="placeholder-image" :src="placeholderImageSrc" />
          <VTIcon name="mdi:play" class="placeholder-play-btn" />
        </div>
        <iframe v-else class="video-embed-iframe" :src="`/embed/${featuredVideo?.videoId}`" />
      </transition>
    </div>
    <div class="video-info">
      <nuxt-link :to="`/watch?v=${featuredVideo?.videoId}`" class="video-title-link">
        <h2 class="video-title">{{ featuredVideo?.title }}</h2>
      </nuxt-link>
      <p class="video-author">{{ featuredVideo?.author }}</p>
      <p class="video-viewcount">{{ featuredVideo?.viewCount?.toLocaleString('en-US') }} views</p>
      <p class="video-published">{{ featuredVideo?.publishedText }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fade-leave-active {
  transition: opacity 300ms variables.$intro-easing;
}
.fade-leave-to {
  opacity: 0;
}

.featured-video {
  display: grid;
  grid-template-areas: 'video video info';
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: calc(100vw / 3 * 2 / 16 * 9);
  column-gap: 15px;

  @media screen and (min-width: variables.$main-width) {
    grid-template-rows: calc(#{variables.$main-width} / 3 * 2 / 16 * 9);
  }

  .video-embed {
    grid-area: video;
    position: relative;

    .video-embed-placeholder {
      width: 100%;
      height: 100%;
      position: absolute;
      overflow: hidden;
      cursor: pointer;

      .placeholder-image {
        width: 100%;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }

      .placeholder-play-btn {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100px;
        height: 100px;

        :deep(.vt-icon) {
          width: 100%;
          height: 100%;
        }
      }
    }

    .video-embed-iframe {
      width: 100%;
      height: 100%;
      border: none;
      position: absolute;
    }
  }

  .video-info {
    grid-area: info;
    display: flex;
    flex-direction: column;

    .video-title {
      font-size: 1.2rem;
      font-weight: 500;
    }

    .video-author {
      font-size: 0.9rem;
      font-weight: bold;
    }

    .video-viewcount {
      font-size: 0.9rem;
    }

    .video-published {
      font-size: 0.9rem;
    }
  }
}
</style>
