<script setup lang="ts">
const props = defineProps<{
  type?: string;
  modelValue: string;
  label: string;
  id: string;
  autofocus?: boolean;
}>();

defineEmits<{ (e: 'update:modelValue', value: string): void }>();

const inputRef = ref<HTMLInputElement | null>(null);

onMounted(() => {
  if (props.autofocus) {
    inputRef.value?.focus();
  }
});

const autocompleteTags = {
  email: 'email',
  username: 'username',
  password: 'current-password',
  all: 'on'
};

const hasText = computed((): boolean => {
  return props.modelValue && props.modelValue.length > 0;
});

const autocompleteTag = computed((): string => autocompleteTags[props.type] ?? 'all');
</script>

<template>
  <div class="form-input">
    <input
      :id="id"
      ref="inputRef"
      class="input"
      :class="{ 'focus-content': hasText }"
      :autocomplete="autocompleteTag"
      :type="type"
      :name="autocompleteTag"
      required
      :value="modelValue"
      :autofocus="autofocus"
      @input="(e: any) => $emit('update:modelValue', e.target.value)"
    />
    <VTIcon v-if="type === 'username'" class="form-input-icon" name="mdi:account-outline" />
    <VTIcon v-if="type === 'password'" class="form-input-icon" name="mdi:key-outline" />
    <VTIcon v-if="type === 'email'" class="form-input-icon" name="mdi:at" />
    <label :for="id" class="input-label">{{ label }}</label>
  </div>
</template>

<style lang="scss" scoped>
.form-input {
  position: relative;
  $input-line-height: 50px;

  .form-input-icon {
    position: absolute;
    right: 40px;
    top: 30px;
    color: var(--title-color);
  }

  .input:not(:valid) + .form-input-icon {
    color: var(--error-color-red);
  }

  .input {
    margin: 15px 20px;
    padding: 12px 12px;
    line-height: 30px;
    border-radius: 4px;
    width: calc(100% - 40px);
    height: $input-line-height;
    font-size: 1rem;
    color: var(--title-color);
    box-sizing: border-box;
    font-family: variables.$default-font;
    background-color: transparent;
    border: 2px solid var(--bgcolor-alt-light);
    transition: border 300ms variables.$intro-easing;

    &:focus {
      outline: none;
      border-color: var(--theme-color);
    }

    &:focus,
    &.focus-content {
      padding: 20px 12px 4px 12px;
    }

    &:not(:valid) {
      box-shadow: none;
      // border-color: var(--error-color-red)
    }
  }

  .input-label {
    position: absolute;
    left: 34px;
    top: 15px;
    height: $input-line-height;
    line-height: $input-line-height;
    text-align: center;
    margin: auto;
    pointer-events: none;
    transition:
      transform 300ms variables.$intro-easing,
      color 300ms variables.$intro-easing;
    transform-origin: left top;
    color: var(--subtitle-color-light);
  }

  .focus-content ~ .input-label,
  .input:focus ~ .input-label {
    transform: scale(0.8) translateY(-10px);
  }

  .input:focus ~ .input-label {
    color: var(--theme-color);
  }
}
</style>
