<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const hideGithubHint = useCookie('hideGithubHint');

const onDismiss = () => {
  hideGithubHint.value = 'true';
};
</script>

<template>
  <a
    v-if="runtimeConfig.public.githubHint && !hideGithubHint"
    class="github-hint"
    href="https://github.com/viewtube/viewtube"
    target="_blank"
    rel="noreferrer noopener"
  >
    <div class="github-hint-inner">
      <VTIcon
        v-tippy="'Never show again'"
        class="dismiss-icon"
        name="mdi:close"
        @click.stop.prevent="onDismiss"
      />
      <p class="hint-text">Star ViewTube on GitHub!</p>
      <VTIcon class="hint-icon hint-icon-1" name="mdi:github" />
      <VTIcon class="hint-icon hint-icon-2" name="mdi:github" />
      <VTIcon class="hint-icon hint-icon-3" name="mdi:github" />
      <VTIcon class="star-icon star-icon-1" name="mdi:star" />
      <VTIcon class="star-icon star-icon-2" name="mdi:star" />
      <VTIcon class="star-icon star-icon-3" name="mdi:star" />
    </div>
  </a>
</template>

<style lang="scss" scoped>
.github-hint {
  max-width: variables.$main-width;
  margin: 0 auto;
  width: 100%;
  display: grid;
  padding: 15px 10px 10px 10px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;

  &::after {
    display: none;
  }

  &:hover {
    .github-hint-inner {
      border-color: var(--theme-color);
    }
  }

  .github-hint-inner {
    padding: 12px 18px;
    border-radius: 10px;
    overflow: hidden;
    border: 2px solid #30363d;
    transition: border-color 200ms variables.$intro-easing;
    cursor: pointer;

    .hint-text {
      position: relative;
      font-size: 1rem;
      font-weight: bold;
    }

    .dismiss-icon {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(calc(-50% + 2.5px));
      height: 20px;
      width: 20px;
      cursor: pointer;
      z-index: 10;
    }

    .star-icon {
      position: absolute;
      color: var(--theme-color);

      &-1 {
        left: 150px;
        top: 50px;
        width: 15px;
        height: 15px;
        transform: rotate(20deg);
      }

      &-2 {
        left: 250px;
        top: 15px;
        width: 25px;
        height: 25px;
        transform: rotate(-20deg);
        opacity: 0.4;
      }

      &-3 {
        left: 350px;
        top: 40px;
        width: 15px;
        height: 15px;
        transform: rotate(40deg);
        opacity: 0.8;
      }

      @media screen and (max-width: variables.$mobile-width) {
        &-1 {
          left: 50px;
        }

        &-2 {
          left: 100px;
          top: 13px;
        }

        &-3 {
          display: none;
        }
      }
    }

    .hint-icon {
      position: absolute;

      &-1 {
        right: 54px;
        top: 17px;
        width: 40px;
        height: 40px;
        transform: rotate(-24deg);
      }

      &-2 {
        right: 115px;
        top: 45px;
        width: 20px;
        height: 20px;
        transform: rotate(28deg);
        opacity: 0.8;
      }

      &-3 {
        right: 170px;
        top: 35px;
        width: 10px;
        height: 10px;
        transform: rotate(200deg);
      }

      @media screen and (max-width: variables.$mobile-width) {
        &-2 {
          right: 105px;
        }
        &-3 {
          right: 140px;
        }
      }
    }

    &::before {
      content: '';
      position: absolute;
      top: 15px;
      left: 10px;
      right: 10px;
      bottom: 10px;
      width: calc(100% - 20px);
      background: variables.$theme-color-primary-gradient;
      opacity: 0.1;
      border-radius: 10px;
    }
  }
}
</style>
