<template>
  <div class="shelf">
    <SectionTitle :title="shelf.title" />
    <div class="shelf-container">
      <VideoEntry v-for="video in shelf.items" :key="video.videoId" :video="video" :lazy="true" />
    </div>
  </div>
</template>

<script lang="ts">
import VideoEntry from '~/components/list/VideoEntry.vue';
import SectionTitle from '~/components/SectionTitle.vue';

export default defineComponent({
  name: 'Shelf',
  components: {
    VideoEntry,
    SectionTitle
  },
  props: {
    shelf: Object
  }
});
</script>

<style lang="scss">
.shelf {
  display: flex;
  flex-direction: column;
  z-index: 11;
  position: relative;

  .shelf-container {
    @include mixins.viewtube-grid;
  }

  &::after {
    content: '';
    display: block;
    background-color: var(--bgcolor-alt);
    position: absolute;
    left: -20px;
    top: 0;
    width: calc(100% + 40px);
    height: 100%;
    border-radius: 5px;
  }
}
</style>
