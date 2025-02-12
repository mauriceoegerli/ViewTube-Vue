<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    link?: string;
    line?: boolean;
  }>(),
  {
    line: true,
    link: null
  }
);
</script>

<template>
  <div class="section-title">
    <nuxt-link v-if="link" class="title" :to="link">
      {{ title }}
      <VTIcon name="mdi:chevron-right" />
    </nuxt-link>
    <h2 v-else class="title">
      {{ title }}
    </h2>
    <span v-if="line" class="line" />
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.section-title {
  height: 80px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  z-index: 1;

  .title {
    max-width: variables.$main-width;
    font-size: 1.7rem;
    box-sizing: border-box;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 10px;

    &:hover {
      .vt-icon {
        transform: translateX(-10px);
      }
    }

    .vt-icon {
      height: 1.2em;
      width: 1.2em;
      transition: transform 300ms variables.$intro-easing;
    }
  }
  .line {
    height: 2px;
    flex-grow: 1;
    background: linear-gradient(to right, transparent 5%, var(--theme-color-translucent) 15%);
  }
}
</style>
