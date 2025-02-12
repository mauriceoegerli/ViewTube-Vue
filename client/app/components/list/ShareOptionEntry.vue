<template>
  <div v-ripple v-tippy="optionName" class="share-option" @click="onClick">
    <slot />
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'ShareOptionEntry',
  props: {
    optionName: { type: String, required: true },
    click: Function
  },
  setup(props) {
    const onClick = () => {
      props.click();
    };

    return {
      onClick
    };
  }
});
</script>

<style lang="scss">
.share-option {
  background-color: var(--bgcolor-alt);
  text-decoration: none;
  color: var(--title-color);
  margin: 2px 5px 2px 0;
  border-radius: 3px;
  display: inline-block;
  transition:
    background-color 200ms variables.$intro-easing,
    border 200ms variables.$intro-easing;
  border: 2px solid var(--theme-color-translucent);
  width: auto;
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  height: 46px;
  width: 46px;
  margin: 4px 4px 4px 0;

  .vt-icon {
    margin: 4px;
    height: 38px;
    width: 38px;
    position: unset;
  }

  img {
    width: 50px;
    margin: -1px 0 0 8px;
  }

  &:hover {
    cursor: pointer;
  }
}
</style>
