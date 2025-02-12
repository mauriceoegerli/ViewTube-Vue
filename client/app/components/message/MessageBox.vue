<script setup lang="ts">
import type { MessageType } from '~/types/MessageType';
import { useMessagesStore } from '~/store/messages';

const props = defineProps<{
  message: MessageType;
}>();

const messagesStore = useMessagesStore();

const dismissedRight = ref(false);
const dismissedLeft = ref(false);
const dismissTimeout = ref(null);
const isInteractAnimating = ref(true);
const interactPosition = reactive({
  x: 0,
  y: 0
});
const swipeOpacity = ref(1);

const transformString = computed(() => {
  if (!isInteractAnimating.value) {
    const { x, y } = interactPosition;
    return `translate3D(${x}px, ${y}px, 0)`;
  }
  return '';
});

const dismissMessage = () => {
  dismissedRight.value = true;
  swipeOpacity.value = 0;
  setTimeout(() => {
    if (props.message && props.message.id) {
      messagesStore.dismissMessage(props.message.id);
    }
  }, 600);
};
const onMessageClick = async () => {
  if (dismissTimeout.value) {
    clearTimeout(dismissTimeout.value);
    dismissTimeout.value = null;
  }
  if (props.message.clickAction) {
    await props.message.clickAction();
    dismissMessage();
  }
};

if (props.message.dismissDelay > 0) {
  dismissTimeout.value = setTimeout(dismissMessage, props.message.dismissDelay);
}
</script>

<template>
  <div
    ref="interactElement"
    class="message-box"
    :class="{
      'dismissed-right': dismissedRight,
      'dismissed-left': dismissedLeft,
      'is-animating': isInteractAnimating
    }"
    :style="{
      transform: transformString,
      opacity: swipeOpacity,
      cursor: message.clickAction ? 'pointer' : 'auto'
    }"
    @click="onMessageClick"
  >
    <span
      class="progress-line"
      :class="{ persist: !dismissTimeout }"
      :style="{ 'animation-duration': `${message.dismissDelay}ms` }"
    />
    <div
      v-ripple
      class="close"
      :style="{
        transition: `transform ${dismissTimeout}ms linear`
      }"
      @click="dismissMessage"
    >
      <VTIcon v-ripple name="mdi:close" />
    </div>
    <h3 class="title" :class="message.type">
      {{ message.title }}
    </h3>
    <pre class="message" v-html="message.message" />
  </div>
</template>

<style lang="scss" scoped>
.message-box {
  width: 400px;
  background-color: var(--bgcolor-alt);
  margin: 10px;
  padding: 10px 14px;
  box-sizing: border-box;
  position: relative;
  border-radius: 8px;
  box-shadow: variables.$max-shadow;
  animation: blob-in-notif 300ms variables.$intro-easing;
  overflow: hidden;

  &.is-animating {
    transition:
      transform 300ms,
      opacity 600ms;
  }

  &.dismissed-right {
    transition:
      transform 300ms,
      font-size 300ms 300ms,
      margin 300ms 300ms,
      padding 300ms 300ms,
      opacity 300ms !important;
    transition-timing-function: variables.$dynamic-easing;
    transform: translateX(140%);
    margin: 0;
    padding: 0;
    font-size: 0;
  }

  &.dismissed-left {
    transition:
      transform 300ms,
      font-size 300ms 300ms,
      margin 300ms 300ms,
      padding 300ms 300ms,
      opacity 300ms !important;
    transition-timing-function: variables.$dynamic-easing;
    transform: translateX(-140%);
    margin: 0;
    padding: 0;
    font-size: 0;
  }

  @media screen and (max-width: variables.$mobile-width) {
    width: 100%;
    margin: 0 0 0 10px;
    box-shadow: variables.$low-shadow;
    padding: 10px 64px 10px 10px;
    animation: blob-in-bottom-notif 300ms variables.$intro-easing;

    .close {
      right: 24px !important;
      transform: scale(1.3) translateY(-25%);
      top: 50% !important;
    }
  }

  .progress-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--theme-color);
    animation-delay: 0;
    animation-name: reduce-width;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
    transform-origin: right;
    transition: opacity 200ms linear;
    opacity: 1;

    &.persist {
      opacity: 0;
    }
  }

  .close {
    height: 22px;
    width: 22px;
    padding: 2px 2px 0 0;
    top: 12px;
    right: 12px;
    position: absolute !important;
    cursor: pointer;
    border-radius: 50%;
  }

  .title {
    color: var(--theme-color);

    &.error {
      color: var(--error-color-red);
    }

    &.info {
      color: var(--error-color-green);
    }
  }

  .message {
    word-break: break-all;
    white-space: pre-wrap;
    width: 100%;
    color: var(--text-color);
    font-family: variables.$default-font;
    margin: 5px 0 0 0;
  }

  @keyframes reduce-width {
    0% {
      transform: scale3d(1, 1, 1);
    }
    100% {
      transform: scale3d(0, 1, 1);
    }
  }

  @keyframes blob-in-notif {
    0% {
      clip-path: circle(0%);
      transform: translateY(-50px);
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
    100% {
      clip-path: circle(120%);
      transform: translateY(0px);
      opacity: 1;
    }
  }

  @keyframes blob-in-bottom-notif {
    0% {
      clip-path: circle(0%);
      transform: translateY(50px);
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
    100% {
      clip-path: circle(120%);
      transform: translateY(0px);
      opacity: 1;
    }
  }
}
</style>
