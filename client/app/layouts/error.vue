<template>
  <div class="error-page">
    <div class="error-popup">
      <div class="error-message">
        <div class="error-logo">
          <img src="~/assets/icon-error.svg" alt="Viewtube broken logo" />
        </div>
        <h2>{{ error.message }}</h2>
        <BadgeButton :click="retry" class="try-again-btn">Try again</BadgeButton>
        <p>Api-url: {{ apiUrl }}</p>
        <details v-if="error.detail" class="error-details">
          <summary>Full error</summary>
          <pre class="json" v-html="renderJSON(error.detail)" />
          <BadgeButton :click="copyError" class="copy-error-btn">Copy</BadgeButton>
        </details>
        <nuxt-link
          v-if="possibleSearch"
          class="possible-search ripple"
          :to="`/results?search_query=${possibleSearch}`"
          >Search for {{ possibleSearch }}</nuxt-link
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import BadgeButton from '~/components/buttons/BadgeButton.vue';
import { useMessagesStore } from '~/store/messages';

export default defineComponent({
  name: 'ErrorPage',
  components: {
    BadgeButton
  },
  props: {
    error: Object
  },
  setup(props) {
    const messagesStore = useMessagesStore();
    const { apiUrl } = useApiUrl();
    const route = useRoute();

    const possibleSearch = ref(null);

    const copyError = (): void => {
      if (import.meta.client && 'clipboard' in navigator) {
        navigator.clipboard.writeText(renderJSON(props.error.detail)).then(() => {
          messagesStore.createMessage({
            type: 'info',
            title: 'Copied error',
            message: null
          });
        });
      }
    };

    const retry = (): void => {
      window.location.reload();
    };
    const renderJSON = (json: any): string => {
      return JSON.stringify(json, replacerFunc(), 2);
    };
    const replacerFunc = () => {
      const visited = new WeakSet();
      return (_key: any, value: object) => {
        if (typeof value === 'object' && value !== null) {
          if (visited.has(value)) {
            return;
          }
          visited.add(value);
        }
        return value;
      };
    };

    if (props.error.statusCode === 404) {
      const path = route.path;
      possibleSearch.value = path.replace('/', '');
    }

    return {
      possibleSearch,
      apiUrl,
      copyError,
      retry,
      renderJSON
    };
  }
});
</script>

<style lang="scss" scoped>
.error-page {
  display: flex;

  .error-popup {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
    width: 500px;
    max-height: 100%;
    margin-top: variables.$header-height;

    @media screen and (max-width: variables.$mobile-width) {
      position: static;
      transform: none;
      width: 100vw;
      padding: variables.$header-height 10px 10px 10px;
      box-sizing: border-box;
    }

    .error-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: var(--bgcolor-main);

      .error-logo {
        width: 300px;
        height: 300px;
        position: relative;

        img {
          width: 100%;
          height: 100%;
        }

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100px;
          background: linear-gradient(to bottom, transparent, var(--bgcolor-main));
        }
      }

      .error-details {
        max-width: 100%;
        position: relative;

        summary {
          user-select: none;
          cursor: pointer;
          padding: 4px;
        }
        .copy-error-btn {
          position: absolute !important;
          right: 0;
          top: 36px;
        }

        .json {
          background-color: var(--bgcolor-translucent);
          width: 100%;
          overflow: scroll;
          margin: 0;
        }
      }

      .possible-search {
        font-size: 1rem;
        border-style: none;
        width: 300px;
        text-align: center;
        cursor: pointer;
        user-select: none;
        margin: 20px 20px;
        background-color: var(--bgcolor-main);
        padding: 8px 0;
        border-radius: 5px;
        box-sizing: border-box;
        color: var(--title-color);
        box-shadow: variables.$low-shadow;
        transition: box-shadow 300ms variables.$intro-easing;
        border: 2px solid var(--theme-color);
        user-select: none;

        &:hover {
          box-shadow: variables.$max-shadow;
        }
      }
    }
  }
}
</style>
