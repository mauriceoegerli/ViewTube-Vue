<script setup lang="ts">
import MessageBoxContainer from '~/components/message/MessageBoxContainer.vue';
import ThemeStyling from '~/components/themes/ThemeStyling.vue';
import { useSettingsStore } from '~/store/settings';

const settingsStore = useSettingsStore();

useHead({
  titleTemplate: titleChunk => {
    if (!titleChunk) {
      return 'ViewTube';
    }
    if (titleChunk.includes('ViewTube ::')) {
      return titleChunk;
    }
    return `${titleChunk} :: ViewTube`;
  }
});

const appRef = ref(null);

const getThemeClass = (): string => {
  if ((process as any).browser) {
    return `theme--${settingsStore.theme}`;
  } else {
    return 'theme--default';
  }
};

if (appRef.value) {
  appRef.value.classList.add(getThemeClass());
}
</script>

<template>
  <div id="app" ref="appRef" class="layout">
    <ThemeStyling />
    <slot />
    <MessageBoxContainer />
  </div>
</template>

<style lang="scss">
@use 'assets/styles/layout.scss';

html,
body,
#__nuxt,
#app {
  height: 100%;
  overflow: hidden;
}
</style>
