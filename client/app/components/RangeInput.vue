<script setup lang="ts">
const emit = defineEmits<{
  (e: 'seek-start' | 'seek-end'): void;
}>();
const range = defineModel<number>();
const rangePercentage = computed(() => `${range.value * 100}%`);

const seeking = ref(false);
const rangeRef = ref<HTMLDivElement | null>(null);

const onPointerDown = (e: PointerEvent) => {
  seeking.value = true;
  rangeRef.value?.setPointerCapture(e.pointerId);
  onPointerMove(e);
  emit('seek-start');
};

const onPointerMove = (e: PointerEvent) => {
  const rect = rangeRef.value?.getBoundingClientRect();
  if (rect && seeking.value) {
    const x = e.clientX - rect.left;
    const width = rect.width;
    let percent = x / width;
    if (percent < 0) percent = 0;
    if (percent > 1) percent = 1;
    range.value = percent;
  }
};

const rangeHovered = ref(false);
const onPointerEnter = () => {
  rangeHovered.value = true;
};

const onPointerLeave = () => {
  rangeHovered.value = false;
};

const onPointerUp = (e: PointerEvent) => {
  seeking.value = false;
  rangeRef.value?.releasePointerCapture(e.pointerId);
  emit('seek-end');
};
</script>

<template>
  <div
    ref="rangeRef"
    class="range-input"
    :class="{ 'range-hovered': rangeHovered }"
    @pointerdown.stop.prevent="onPointerDown"
    @pointermove.stop.prevent="onPointerMove"
    @pointerup.stop.prevent="onPointerUp"
    @pointerenter.stop.prevent="onPointerEnter"
    @pointerleave.stop.prevent="onPointerLeave"
    @click.stop.prevent="() => {}"
  >
    <div class="range">
      <div class="range-filled" />
      <div class="dot" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.range-input {
  position: relative;
  width: 100%;
  height: 20px;

  &.range-hovered {
    .range {
      .dot {
        transform: scale(1);
      }
    }
  }

  .range {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: var(--line-color);
    width: 100%;
    height: 4px;
    border-radius: 25px;

    .range-filled {
      background-color: variables.$video-thmb-overlay-textcolor;
      height: 100%;
      width: v-bind(rangePercentage);
      border-radius: 25px;
    }

    .dot {
      width: 12px;
      height: 12px;
      background-color: variables.$video-thmb-overlay-textcolor;
      position: relative;
      left: calc(v-bind(rangePercentage) - 6px);
      border-radius: 50%;
      top: -200%;
      transform: scale(0);
      transition: transform 150ms ease-in-out;
    }
  }
}
</style>
