<template>
  <div class="video-loading-template">
    <div class="centered-card">
      <Spinner class="" />
      <div v-if="video" class="fade-in">
        <p>Loading video</p>
        <h2>{{ video?.title }}</h2>
        <h3>{{ typeof video?.author === 'string' ? video?.author : video?.author?.name }}</h3>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Spinner from '~/components/Spinner.vue';
import { useLoadingVideoInfoStore } from '~/store/loadingVideoInfo';

export default defineComponent({
  name: 'VideoLoadingTemplate',
  components: { Spinner },
  setup() {
    const loadingVideoInfoStore = useLoadingVideoInfoStore();

    return {
      video: loadingVideoInfoStore.video
    };
  }
});
</script>

<style lang="scss">
.video-loading-template {
  height: calc(100vh - #{variables.$header-height});
  position: relative;

  .centered-card {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    background-color: var(--bgcolor-main);
    padding: 25px 10px;
    border-radius: 5px;
    width: 100%;
    max-width: 500px;

    .fade-in {
      animation: card-fade-in 300ms 1s variables.$intro-easing forwards;
      opacity: 0;
    }
  }
}

@keyframes card-fade-in {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
