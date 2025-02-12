<template>
  <div class="switch" :class="{ right: right }">
    <div class="switch-container">
      <input
        :id="`switch-button-${randomId}`"
        class="switch-button"
        type="checkbox"
        :name="label"
        :checked="value"
        :disabled="disabled"
        @change="onChange"
      />
      <div class="switch-body">
        <span class="switch-circle">
          <span class="switch-circle-inner" />
        </span>
      </div>
    </div>
    <div v-if="label" class="label-container">
      <label :for="`switch-button-${randomId}`" class="label">{{ label }}</label>

      <label
        v-if="smallLabel && smallLabelNegative && !value"
        :for="`switch-button-${randomId}`"
        class="small-label"
      >
        {{ smallLabelNegative }}
      </label>
      <label v-else-if="smallLabel" :for="`switch-button-${randomId}`" class="small-label">
        {{ smallLabel }}
      </label>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'SwitchButton',
  props: {
    value: Boolean,
    label: String,
    smallLabel: {
      type: String,
      required: false,
      default: null
    },
    smallLabelNegative: {
      type: String,
      required: false,
      default: null
    },
    disabled: Boolean,
    right: {
      type: Boolean,
      required: false
    }
  },
  setup(_, { emit }) {
    const onChange = (e: any): void => {
      emit('valuechange', e.target.checked);
    };

    const ID = (_length = 13) => {
      return '_' + Math.random().toString(36).substr(2, _length);
    };

    const randomId = ID();

    return {
      onChange,
      randomId
    };
  }
});
</script>

<style lang="scss" scoped>
.switch {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  user-select: none;
  margin-top: 20px !important;
  position: relative;

  &.right {
    justify-content: flex-start;
    flex-direction: row-reverse;
    width: calc(100% - 36px);

    .label-container {
      flex-grow: 1;
      text-align: start;
      margin: 0;

      .label {
        margin: 0;
      }

      .small-label {
        margin: 0;
      }
    }
  }

  .label-container {
    display: flex;
    flex-direction: column;
    align-content: flex-start;

    .small-label {
      font-size: 0.8rem;
      margin: 0 0 0 10px;
    }

    .label {
      line-height: 24px;
      text-align: start;
      margin: 0 0 0 10px;
    }
  }

  .switch-container {
    position: relative;
    display: flex;
    cursor: pointer;

    .switch-button {
      all: unset;
      width: 50px;
      height: 24px;
      background-image: variables.$theme-color-primary-gradient;
      border-radius: 15px;
      background-repeat: no-repeat;

      &:focus {
        outline: solid 2px var(--theme-color) !important;
      }
    }

    input:checked + .switch-body {
      .switch-circle {
        background-color: transparent;
        .switch-circle-inner {
          background-color: var(--bgcolor-alt);
          left: 26px;
        }
      }
    }

    input:disabled {
      filter: grayscale(100%) !important;
      opacity: 0.8 !important;
      pointer-events: none !important;
      user-select: none !important;

      + .switch-body {
        opacity: 0.8 !important;
        filter: grayscale(100%) !important;
        pointer-events: none !important;
        user-select: none !important;
      }
    }

    .switch-body {
      position: absolute;
      left: 0;
      height: 24px;
      width: 50px;
      border-radius: 15px;
      background-repeat: no-repeat;
      pointer-events: none;

      .switch-circle {
        width: 44px;
        height: 18px;
        border-radius: 15px;
        background-color: var(--bgcolor-alt);
        display: block;
        margin: 3px;
        position: relative;
        transition: background-color 300ms variables.$intro-easing;

        .switch-circle-inner {
          left: 0;
          width: 12px;
          height: 12px;
          margin: 3px;
          border-radius: 15px;
          background-color: var(--theme-color);
          display: block;
          position: absolute;
          transition:
            background-color 300ms variables.$intro-easing,
            left 300ms variables.$overshoot-easing;
        }
      }
    }
  }
}
</style>
