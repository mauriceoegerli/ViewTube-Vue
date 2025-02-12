<script setup lang="ts">
const props = defineProps<{
  src: string;
  bannerHqSrc: string;
  fallback: string;
}>();

const { proxyUrl } = useImgProxy();

const onBannerContextMenu = (e: MouseEvent) => {
  e.preventDefault();
  window.open(proxyUrl(props.bannerHqSrc), '_blank');
};

const fallbackUrl = computed(() => {
  if (props.fallback) {
    return `url(${proxyUrl(props.fallback)})`;
  }
  return '';
});
</script>

<template>
  <div v-if="src" class="channel-banner" @contextmenu="onBannerContextMenu">
    <img class="channel-banner-image" :src="proxyUrl(src)" alt="Channel banner" />
    <div class="additional-content">
      <a
        v-tippy="'Show full size banner'"
        class="show-btn"
        :href="proxyUrl(bannerHqSrc)"
        target="_blank"
        rel="noreferrer noopener"
        ><VTIcon name="mdi:eye"
      /></a>
    </div>
  </div>
  <div v-else class="channel-banner fallback">
    <div class="channel-banner-image" />
  </div>
</template>

<style lang="scss" scoped>
.channel-banner {
  width: 100%;
  z-index: 12;
  position: relative;

  &:hover {
    .additional-content {
      .show-btn {
        clip-path: circle(15px at 50% 50%);
      }
    }
  }

  .additional-content {
    position: absolute;
    display: flex;
    z-index: 13;
    bottom: 0;
    right: 0;
    flex-direction: row;
    justify-content: space-between;

    .show-btn {
      margin: 0 20px 10px 0;
      clip-path: circle(15px at 50% 120%);
      transition: clip-path 300ms variables.$intro-easing;
      filter: drop-shadow(0 0 1px #000);

      &:focus {
        &::after {
          display: none;
        }
      }
    }
  }

  &.fallback {
    overflow: hidden;
    .channel-banner-image {
      height: 220px;
      filter: blur(50px) saturate(1.2);
      transform: scale(1);
      background-image: v-bind(fallbackUrl);
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
    }
  }

  .channel-banner-image {
    width: 100%;
    position: relative;
    max-height: 500px;
    display: block;

    @media screen and (max-width: 900px) {
      width: 130%;
      left: calc(100vw - 115%);
    }

    @media screen and (max-width: 700px) {
      width: 160%;
      left: calc(100vw - 130%);
    }

    @media screen and (max-width: 500px) {
      width: 190%;
      left: calc(100vw - 145%);
    }
  }
}
</style>
