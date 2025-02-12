<template>
  <div class="mix-entry">
    <nuxt-link
      class="mix-entry-thmb"
      :to="{
        path: mixLink
      }"
    >
      <div class="thmb-image-container">
        <img
          v-if="mix.firstVideo && mix.firstVideo.thumbnails"
          class="mix-entry-thmb-image"
          :src="proxyUrl(mix.firstVideo.thumbnails[0].url)"
          :alt="mix.title"
        />
      </div>
      <div class="mix-entry-count">
        <svg
          viewBox="0 0 24 24"
          preserveAspectRatio="xMidYMid meet"
          focusable="false"
          class="mix-icon"
          fill="#fff"
        >
          <g>
            <path
              d="M16.94 6.9l-1.4 1.46C16.44 9.3 17 10.58 17 12s-.58 2.7-1.48 3.64l1.4 1.45C18.22 15.74 19 13.94 19 12s-.8-3.8-2.06-5.1zM23 12c0-3.12-1.23-5.95-3.23-8l-1.4 1.45C19.97 7.13 21 9.45 21 12s-1 4.9-2.64 6.55l1.4 1.45c2-2.04 3.24-4.87 3.24-8zM7.06 17.1l1.4-1.46C7.56 14.7 7 13.42 7 12s.6-2.7 1.5-3.64L7.08 6.9C5.78 8.2 5 10 5 12s.8 3.8 2.06 5.1zM1 12c0 3.12 1.23 5.95 3.23 8l1.4-1.45C4.03 16.87 3 14.55 3 12s1-4.9 2.64-6.55L4.24 4C2.24 6.04 1 8.87 1 12zm9-3.32v6.63l5-3.3-5-3.3z"
            />
          </g>
        </svg>
        <span class="count-text">Mix</span>
      </div>
    </nuxt-link>
    <div class="mix-entry-info">
      <nuxt-link
        v-tippy="mix.title"
        class="mix-entry-title tooltip"
        :to="{
          path: mixLink
        }"
        >{{ mix.title }}</nuxt-link
      >
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'MixEntry',
  props: {
    mix: Object
  },
  setup(props) {
    const { proxyUrl } = useImgProxy();

    const mixLink = computed((): string => {
      return `/watch?v=${
        props.mix.firstVideoId ? props.mix.firstVideoId : props.mix.firstVideo.id
      }&list=${props.mix.mixId ? props.mix.mixId : props.mix.mixID}&start_radio=1`;
    });

    return {
      proxyUrl,
      mixLink
    };
  }
});
</script>

<style lang="scss">
.mix-entry {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  z-index: 11;
  position: relative;

  .mix-entry-thmb {
    overflow: hidden;
    position: relative;
    box-shadow: variables.$medium-shadow;
    z-index: 11;

    .thmb-image-container {
      position: relative;
      width: 100%;
      top: 50%;
      left: 0;
      transform: translateY(-50%);

      .mix-entry-thmb-image {
        max-width: 100%;
        min-width: 100%;
        display: block;
      }
    }
    .mix-entry-count {
      text-decoration: none;
      color: variables.$video-thmb-overlay-textcolor;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      padding: 5px 12px;
      background-color: variables.$video-thmb-overlay-bgcolor;
      box-sizing: border-box;
      border-radius: 5px;
      font-family: variables.$default-font;
      display: flex;
      flex-direction: row;
      align-items: center;

      .count-text {
        margin: 0 0 0 10px;
      }

      .mix-icon {
        width: 36px;
        height: 36px;

        .vt-icon {
          width: 36px;
          height: 36px;
        }
      }
    }
  }

  .mix-entry-info {
    padding: 10px 0 10px 0;
    font-family: variables.$default-font;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    z-index: 11;

    .mix-entry-title {
      text-decoration: none;
      margin: 0;
      font-size: 0.9rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--title-color);
      padding: 6px 0 4px 0;
    }

    .channel-name-container {
      display: flex;
      flex-direction: row;

      .mix-entry-channel {
        text-decoration: none;
        padding: 3px 0 4px 0;
        font-size: 0.9rem;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: var(--subtitle-color);
      }

      .vt-icon {
        width: 14px;
        height: 14px;
        top: 3px;
        margin: 0 0 0 4px;
      }
    }
    .video-entry-stats {
      color: var(--subtitle-color-light);
      font-size: 0.8rem;
      margin: 5px 0 0 0;
    }
  }
}
</style>
