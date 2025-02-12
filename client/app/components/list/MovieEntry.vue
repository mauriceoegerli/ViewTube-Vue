<template>
  <div class="movie-entry">
    <div class="movie-entry-background" />
    <a class="movie-entry-thmb" :href="movie.link" target="_blank" rel="noreferrer noopener">
      <div class="thmb-image-container">
        <img class="movie-entry-thmb-image" :src="proxyUrl(movie.thumbnail)" :alt="movie.title" />
      </div>
      <span class="movie-entry-count">{{ movie.duration }}</span>
    </a>
    <div class="movie-entry-info">
      <a
        v-tippy="movie.title"
        class="movie-entry-title tooltip"
        :href="movie.link"
        target="_blank"
        rel="noreferrer noopener"
        >{{ movie.title }}
      </a>
      <nuxt-link
        v-tippy="movie.author.name"
        class="movie-entry-channel tooltip"
        :to="{ path: '/channel/' + movie.author.name }"
        >{{ movie.author.name }}</nuxt-link
      >
      <p>{{ movie.description }}</p>
      <div class="movie-tags">
        <span v-for="(tag, index) in movie.meta" :key="index">{{ tag }}</span>
      </div>
      <div class="movie-actors">
        <span class="title">Actors: </span>
        <span v-for="(actor, index) in movie.actors" :key="index" class="tag">{{ actor }}</span>
      </div>
      <p class="movie-director">Director: {{ movie.director }}</p>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'MovieEntry',
  props: {
    movie: Object
  },
  setup() {
    const { proxyUrl } = useImgProxy();
    return { proxyUrl };
  }
});
</script>

<style lang="scss">
.movie-entry {
  max-width: 800px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  z-index: 11;
  position: relative;
  grid-column: 1 / span 4;

  .movie-entry-background {
    position: absolute;
    height: 175px;
    top: 10px;
    left: 10px;
    width: calc(100% - 20px);
    z-index: 10;
    transition-duration: 300ms;
    transition-timing-function: variables.$intro-easing;
    transition-property: box-shadow;
  }

  .movie-entry-thmb {
    height: 265px;
    width: 300px;
    overflow: hidden;
    position: relative;
    box-shadow: variables.$max-shadow;
    z-index: 11;
    margin: 0 10px 0 0;

    .thmb-image-container {
      position: relative;
      top: 0;
      left: 0;

      .movie-entry-thmb-image {
        width: 100%;
        display: block;
      }
    }
    .movie-entry-count {
      text-decoration: none;
      color: variables.$video-thmb-overlay-textcolor;
      position: absolute;
      right: 0;
      bottom: 0;
      padding: 2px 4px;
      margin: 8px 4px;
      background-color: variables.$video-thmb-overlay-bgcolor;
      box-sizing: border-box;
      border-radius: 2px;
      font-family: variables.$default-font;
    }
  }

  .movie-entry-info {
    padding: 10px 0 10px 0;
    font-family: variables.$default-font;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    z-index: 11;

    .movie-entry-title {
      text-decoration: none;
      margin: 0;
      font-size: 1.1rem;
      font-weight: bold;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--title-color);
      padding: 0 0 4px 0;
      width: 100%;
      box-sizing: border-box;
    }

    .movie-entry-channel {
      text-decoration: none;
      padding: 3px 0 4px 0;
      font-size: 1rem;
      font-weight: bold;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--subtitle-color);
    }

    .movie-tags {
      margin: 10px 0;
      span {
        border: 2px solid var(--theme-color-translucent);
        margin: 0 10px 0 0;
        border-radius: 5px;
        padding: 1px 4px;
      }
    }

    .movie-actors {
      color: var(--subtitle-color-light);
      .tag {
        margin: 0 5pt 0 0;
      }
    }

    .movie-director {
      color: var(--subtitle-color-light);
    }
  }

  @media screen and (max-width: variables.$mobile-width) {
    width: calc(100% - 20px);
    margin: 10px;

    .movie-entry-thmb {
      width: 100%;
      height: 53vw;

      .thmb-image-container {
        position: relative;
        top: 0;
        left: 0;
        transform: translateY(0);

        .movie-entry-thmb-image {
          top: 0;
          transform: translateY(0px);
        }
      }
    }
  }
}
</style>
