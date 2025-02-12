<script setup lang="ts">
type OptionType = {
  value: string;
  label: string;
};

const props = defineProps<{
  modelValue: string;
  options: Array<OptionType>;
  label?: string;
  colorMark?: string;
  disabled?: boolean;
  right?: boolean;
  smallLabel?: string;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
}>();

const onOptionSelect = (option: OptionType) => {
  emit('update:modelValue', option.value);
};

if (!props.options || new Set(props.options).size !== props.options.length) {
  throw new Error(`MultiOptionButton with label "${props.label}" has duplicate options.`);
}
</script>

<template>
  <div class="multi-option" :class="{ right: right, disabled: disabled }">
    <div class="multi-option-body">
      <div
        v-for="(option, index) in options"
        :key="index"
        class="option"
        :class="{ selected: modelValue === option.value }"
        @click="onOptionSelect(option)"
      >
        <p>
          {{ option.label }}
        </p>
      </div>
    </div>
    <label v-if="label" class="label"
      ><span :style="{ 'background-color': colorMark }" />
      <div class="label-container">
        <p class="label-text">{{ label }}</p>
        <p v-if="smallLabel" class="label-small">{{ smallLabel }}</p>
      </div>
    </label>
  </div>
</template>

<style lang="scss" scoped>
.multi-option {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  user-select: none;
  position: relative;
  align-items: center;

  &.disabled {
    pointer-events: none;
    user-select: none;
    filter: grayscale(100%);
    opacity: 0.9;
  }

  &.right {
    flex-direction: row-reverse;
    width: 100%;
    text-align: start;

    .label {
      flex-grow: 1;
      text-align: start;
      margin: 0;
    }
  }

  .multi-option-body {
    background-image: variables.$theme-color-primary-gradient;
    border-radius: 5px;
    display: flex;
    padding: 2px 0 2px 2px;

    .option {
      padding: 2px 5px;
      margin: 0 2px 0 0;
      background-color: var(--bgcolor-alt);
      cursor: pointer;
      color: var(--title-color);
      transition:
        background-color 300ms variables.$intro-easing,
        color 300ms variables.$intro-easing;

      &.selected {
        background-color: transparent;
        color: #000;
      }

      &:nth-of-type(1) {
        border-radius: 3px 0 0 3px;
      }

      &:last-of-type {
        border-radius: 0 3px 3px 0;
      }
    }
  }

  .label {
    line-height: 32px;
    margin: 0 0 0 10px;
    display: flex;
    flex-direction: row;

    .label-container {
      display: inline-flex;
      flex-direction: column;

      .label-text {
        line-height: 24px;
      }
      .label-small {
        font-size: 0.8rem;
        line-height: 20px;
      }
    }

    span {
      width: 10px;
      height: 10px;
      min-width: 10px;
      min-height: 10px;
      border-radius: 25px;
      margin: 6px 6px 0 0;
      display: inline-block;
    }
  }
}
</style>
