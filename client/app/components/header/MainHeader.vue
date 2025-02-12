<script setup lang="ts">
import Logo from '~/components/Logo.vue';
import MainSearchBox from '~/components/MainSearchBox.vue';
import UserMenu from '~/components/header/UserMenu.vue';
import { useSettingsStore } from '~/store/settings';
import { useUserStore } from '~/store/user';
const settingsStore = useSettingsStore();
const userStore = useUserStore();
const route = useRoute();
const { posAbsolute, topPositionPx } = useHeaderScroll();
</script>

<template>
  <div class="header" :class="{ absolute: posAbsolute }">
    <Logo
      v-if="
        route.fullPath !== '/' ||
        (userStore.isLoggedIn && settingsStore.showHomeSubscriptions) ||
        settingsStore.showHomeTrendingVideos
      "
    />
    <MainSearchBox
      v-if="
        route.fullPath !== '/' ||
        (userStore.isLoggedIn && settingsStore.showHomeSubscriptions) ||
        settingsStore.showHomeTrendingVideos
      "
    />
    <HeaderMenu />
  </div>
</template>

<style lang="scss">
.header {
  height: variables.$header-height;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  justify-content: right;
  z-index: 800;
  background-color: var(--header-transparent);
  backdrop-filter: blur(10px);
  top: v-bind(topPositionPx);

  transition:
    box-shadow 300ms variables.$intro-easing,
    background-color 300ms variables.$intro-easing,
    transform 300ms variables.$dynamic-easing;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: -100%;
    height: variables.$header-height;
    width: 100%;
    background-color: var(--header-bgcolor);
  }

  &.absolute {
    position: absolute;
  }

  @media screen and (max-width: variables.$mobile-width) {
    .logo-link {
      width: 40px;

      .logo {
        width: 0;
      }

      .logo-small {
        display: block;
        transform: scale(1);
      }
    }
  }

  a {
    outline: 0;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

    &:hover,
    &:focus,
    &:target {
      outline: 0;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      background-color: transparent;
    }

    &:active {
      background-color: transparent !important;
    }
  }
}
</style>
