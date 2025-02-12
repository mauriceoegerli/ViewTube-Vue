<script setup lang="ts">
const props = defineProps<{
  postImage: Array<{
    url: string;
    width: number;
    height: number;
  }>;
  expandable?: boolean;
}>();

const { proxyUrl } = useImgProxy();

const postImageSources = computed(() => {
  const images = props.postImage;
  const srcSet = images.map(({ url, width }) => `${proxyUrl(url)} ${width}w`).join();

  const sizes = images
    .map(({ width }, index) => {
      if (index === images.length - 1) return `${width}px`;
      return `(max-width: ${width + 100}px) variables.${width}px`;
    })
    .join();

  return {
    srcSet,
    sizes,
    baseSrc: proxyUrl(images[0].url)
  };
});

const expanded = ref(false);

const toggleExpand = () => {
  expanded.value = !expanded.value;
  postImageHeightPx.value = `${postImageRef.value?.clientHeight}px`;
};

const postImageRef = ref<HTMLDivElement>(null);
const postImageHeightPx = ref('0px');
</script>

<template>
  <div class="post-image-container" :class="{ expanded, expandable }" @click="toggleExpand">
    <img
      ref="postImageRef"
      class="post-image"
      :src="postImageSources.baseSrc"
      :srcset="postImageSources.srcSet"
      :sizes="postImageSources.sizes"
    />
  </div>
</template>

<style lang="scss" scoped>
.post-image-container {
  cursor: zoom-in;
  overflow: hidden;
  transition: height 300ms variables.$intro-easing;

  .post-image {
    width: 100%;
  }

  &.expandable {
    height: calc(150px + 20vw);

    @media screen and (min-width: 900px) {
      height: 400px;
    }

    .post-image {
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      transition:
        top 300ms variables.$intro-easing,
        transform 300ms variables.$intro-easing;
      display: block;
    }

    &.expanded {
      height: v-bind(postImageHeightPx);
      .post-image {
        top: 0;
        transform: translateY(0);
      }
    }
  }
}
</style>
