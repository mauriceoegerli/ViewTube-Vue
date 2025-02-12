<script setup lang="ts">
defineProps<{
  modelValue: string;
  label: string;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
}>();

const onInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value);
};
</script>

<template>
  <div class="small-search" :class="{ value: modelValue && modelValue.length > 0 }">
    <label for="small-search-box">{{ label }}</label>
    <input
      id="small-search-box"
      :value="modelValue"
      class="small-search-box"
      name="small-search-box"
      type="text"
      @input="onInput"
    />
  </div>
</template>

<style lang="scss">
.small-search {
  width: 100%;
  display: flex;
  max-width: variables.$main-width;
  margin: 0 auto;
  z-index: 11;
  position: relative;
  padding: 0 15px;
  box-sizing: border-box;
  cursor: text;

  &.value {
    .small-search-box {
      border-color: var(--theme-color);
    }

    label {
      opacity: 0;
    }
  }

  label {
    font-size: 1rem;
    padding: 4px 5px;
    position: absolute;
    user-select: none;
    pointer-events: none;
    transition: opacity 300ms variables.$intro-easing;
  }
  .small-search-box {
    all: unset;
    border-bottom: solid 3px var(--theme-color-translucent);
    padding: 4px 5px;
    width: 100%;
    max-width: variables.$mobile-width;
    transition: border 300ms variables.$intro-easing;

    &:focus {
      border-color: var(--theme-color);
    }
  }
}
</style>
