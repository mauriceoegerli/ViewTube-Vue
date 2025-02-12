<script setup lang="ts">
const props = defineProps<{
  availableIcons: string[];
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const selectIcon = (newIcon: string) => {
  emit('update:modelValue', newIcon);
};
</script>

<template>
  <div class="icon-switcher">
    <div v-for="(icon, index) in availableIcons" :key="index" class="switch-icon">
      <div
        class="icon-border"
        :class="{ current: props.modelValue === icon }"
        @click="selectIcon(icon)"
      >
        <VTIcon :name="icon" class="switcher-icon" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.icon-switcher {
  display: flex;
  margin: 0 auto;
  gap: 5px;

  .switch-icon {
    width: 45px;
    height: 45px;

    .icon-border {
      border: 2px solid transparent;
      width: 100%;
      height: 100%;
      display: flex;
      border-radius: 8px;
      cursor: pointer;
      transition: border 200ms variables.$intro-easing;
      box-sizing: border-box;

      .switcher-icon {
        margin: auto;
      }

      &.current {
        border: 2px solid var(--theme-color);
      }
    }
  }
}
</style>
