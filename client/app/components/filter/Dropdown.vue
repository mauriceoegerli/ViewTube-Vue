<script setup lang="ts">
const props = defineProps<{
  values: Array<any>;
  value: string;
  label?: string;
  noDefault?: boolean;
}>();

const emit = defineEmits<{
  (event: 'valuechange', originalValue: { [key: string]: any }, index: number): void;
}>();

const selected = ref(0);
const open = ref(false);
const offsetTop = ref(null);
const offsetLeft = ref(null);
const visible = ref(false);

const dropdownBtnRef = ref(null);

type entriesArray = Array<{ name: string; value: string }>;

const entries = computed((): entriesArray => {
  if (props.values[0].value && props.values[0].name) {
    return props.values;
  }
  return props.values.map(value => {
    return { name: value, value };
  });
});

const calculateOffset = (): void => {
  if (dropdownBtnRef.value) {
    const dropdownDimens = dropdownBtnRef.value.getBoundingClientRect();
    offsetTop.value = dropdownDimens.top + 50;
    offsetLeft.value = dropdownDimens.left;
  }
};
const select = (e: any): void => {
  selected.value = e.target.getAttribute('index');
  open.value = false;
  emit('valuechange', entries.value[selected.value], selected.value);
};
const onDropdownBtnClick = (): void => {
  calculateOffset();
  open.value = !open.value;
  window.addEventListener('resize', calculateOffset);
};

const selectedEntry = entries.value.findIndex(e => e.value === props.value);
if (props.noDefault && props.value === null) {
  selected.value = selectedEntry !== -1 ? selectedEntry : null;
} else {
  selected.value = selectedEntry !== -1 ? selectedEntry : 0;
}

calculateOffset();

visible.value = true;
</script>

<template>
  <div ref="dropdownBtnRef" class="dropdown" :class="{ open: open }">
    <div
      v-ripple
      class="dropdown-btn"
      :class="{ 'label-unselected': selected === null }"
      @click.stop="onDropdownBtnClick"
    >
      <div class="dropdown-title">
        <p v-if="selected !== null">
          {{ entries[selected].name }}
        </p>
        <p v-if="selected === null">{{ label }}</p>
      </div>
      <label v-if="label" class="dropdown-label">{{ label }}</label>
    </div>
    <Teleport to="body">
      <div
        v-if="visible"
        class="dropdown-list"
        :class="{ open: open }"
        :style="{
          top: `${offsetTop}px`,
          left: `${offsetLeft}px`
        }"
      >
        <span
          v-for="(item, id) in entries"
          :key="id"
          class="list-entry"
          :index="id"
          :value="item.value"
          :class="{ selected: selected == id }"
          @click="select"
          >{{ item.name }}</span
        >
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
.dropdown {
  height: 50px;
  width: auto;
  display: flex;
  position: relative;
  z-index: 10;

  &:after {
    content: '';
    top: 0;
    left: 0;
    right: 0;
    height: 100vh;
    position: fixed;
    display: block;
    pointer-events: none;
    background-color: transparent;
    z-index: 400;
    overscroll-behavior: contain;
    transition: background-color 300ms variables.$intro-easing;
  }

  @media screen and (max-width: variables.$mobile-width) {
    &.open:after {
      background-color: var(--bgcolor-translucent);
      pointer-events: auto;
    }
  }

  .dropdown-btn {
    cursor: pointer;
    position: relative;

    &.label-unselected {
      .dropdown-label {
        display: none;
      }

      .dropdown-title {
        &:after {
          color: var(--theme-color);
        }
      }
    }

    .dropdown-label {
      color: var(--theme-color);
      position: absolute;
      top: 0;
      left: 0;
      font-size: 0.8rem;
      font-weight: bold;
    }

    .dropdown-title {
      line-height: 30px;
      background-image: variables.$theme-color-primary-gradient;
      background-size: 0% 2px;
      background-position: 0 100%;
      background-repeat: no-repeat;
      background-size: 100% 2px;
      padding-top: 10px;
      display: flex;
      flex-direction: row;

      p {
        line-height: 40px;
      }

      &:after {
        content: '▼';
        position: relative;
        top: 0;
        right: 0;
        margin: 5px;
      }
    }
  }
}

.dropdown-list {
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: top;
  background-color: var(--bgcolor-alt);
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  transition-property: transform, clip-path, box-shadow;
  transition-duration: 300ms;
  transition-timing-function: variables.$intro-easing;
  overflow: auto;
  padding: 5px 0;
  z-index: 901;
  margin: 0;

  transform: scale(0.8);
  clip-path: polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%);

  @media screen and (max-width: variables.$mobile-width) {
    width: calc(100% - 28px) !important;
    top: 50vh !important;
    left: 0 !important;
    margin: 0 10px !important;
    box-sizing: border-box;
    position: fixed;
    transform: scale(0) translateY(-50%) !important;
    clip-path: none !important;
    transform-origin: center top !important;
    transition:
      opacity 300ms 0ms variables.$intro-easing,
      transform 600ms variables.$outro-easing,
      box-shadow 300ms,
      pointer-events 0ms !important;
    opacity: 0;
    pointer-events: none !important;

    &.open {
      clip-path: none !important;
      transform: scale(1) translateY(-50%) !important;
      transition:
        opacity 200ms 100ms variables.$intro-easing,
        transform 300ms cubic-bezier(0, 0.98, 0.21, 0.98),
        box-shadow 300ms !important;
      opacity: 1;
      pointer-events: auto !important;
    }
  }

  &.open {
    clip-path: polygon(-50% -50%, 150% -50%, 150% 150%, -50% 150%);
    transform: scale(1);
    box-shadow: variables.$max-shadow;
  }

  .list-entry {
    padding: 8px 10px 8px 10px;
    cursor: pointer;
    white-space: nowrap;

    @media screen and (max-width: variables.$mobile-width) {
      padding: 14px 10px 14px 10px;
    }

    &:hover {
      background-color: var(--bgcolor-alt-light);
    }
    &.selected {
      color: var(--theme-color);
    }
  }
}
</style>
