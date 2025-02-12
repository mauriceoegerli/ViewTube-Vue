<script setup lang="ts">
const props = defineProps<{
  error: any;
}>();

const errorDetails = computed(() => {
  if (props.error?.data?.message) {
    return props.error.data.message;
  } else if (props.error?.message) {
    return props.error?.message;
  }
  return 'An error occurred';
});
</script>

<template>
  <div class="video-error">
    <ErrorPage :text="errorDetails" />
  </div>
</template>

<style lang="scss" scoped>
.video-error {
  margin-top: variables.$header-height;
  position: relative;
  height: 300px;
}
</style>
