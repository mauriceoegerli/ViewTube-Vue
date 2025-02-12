<template>
  <input v-ripple type="submit" :value="label" class="submit-button" />
</template>

<script lang="ts">
export default defineComponent({
  name: 'SubmitButton',
  props: {
    label: String
  }
});
</script>

<style lang="scss" scoped>
.submit-button {
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

  &:hover {
    box-shadow: variables.$max-shadow;
  }
}
</style>
