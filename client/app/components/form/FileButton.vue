<template>
  <label class="button-container">
    <slot />
    <div v-ripple class="label">{{ label }}</div>
    <input
      type="file"
      class="file-button"
      multiple="false"
      :accept="accept"
      @change.stop="$emit('change', $event)"
    />
  </label>
</template>

<script lang="ts">
export default defineComponent({
  name: 'FileButton',
  props: {
    label: String,
    accept: String
  },
  emits: { change: null }
});
</script>

<style lang="scss" scoped>
.button-container {
  font-size: 1rem;
  border-style: none;
  width: calc(100% - 40px);
  text-align: center;
  cursor: pointer;
  user-select: none;
  margin: 20px 20px;
  background: variables.$theme-color-primary-gradient;
  padding: 8px 0;
  border-radius: 5px;
  box-sizing: border-box;
  color: var(--title-color);
  box-shadow: variables.$low-shadow;
  transition: box-shadow 300ms variables.$intro-easing;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  justify-items: center;
  gap: 10px;

  &:hover {
    box-shadow: variables.$max-shadow;
  }
}

.button-container > input[type='file'] {
  display: none;
}
</style>
