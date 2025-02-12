<script setup lang="ts">
import MainHeader from '~/components/header/MainHeader.vue';
import MessageBoxContainer from '~/components/message/MessageBoxContainer.vue';
import ThemeStyling from '~/components/themes/ThemeStyling.vue';
import { useSettingsStore } from '~/store/settings';

const settingsStore = useSettingsStore();

const hydrated = ref(false);

onMounted(() => {
  hydrated.value = true;
});

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
  }
  return 'theme--default';
};

if (appRef.value) {
  appRef.value.classList.add(getThemeClass());
}
</script>

<template>
  <div id="app" ref="appRef" class="layout" :hydrated="hydrated">
    <ThemeStyling />
    <MainHeader class="main-header" />
    <slot />
    <MessageBoxContainer />
  </div>
</template>

<style lang="scss">
@use 'assets/styles/layout.scss';
</style>
