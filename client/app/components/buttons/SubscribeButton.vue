<template>
  <div class="subscribe-button-container" :class="{ disabled: disabled }">
    <div v-if="small" class="mini-btn" :class="{ expanded }" @click="expanded = !expanded">
      <span class="minus" />
    </div>
    <div class="clip-container" :class="{ expanded, small }">
      <div
        v-tippy="'Unsubscribe from this channel'"
        class="unsubscribe-button"
        :class="{ hidden: !isSubscribed }"
        :tabindex="!isSubscribed || disabled ? null : 0"
        @click="unsubscribe"
      />
      <div
        v-tippy="'Subscribe to this channel'"
        class="subscribe-button"
        :class="{ hidden: isSubscribed }"
        :tabindex="isSubscribed || disabled ? null : 0"
        @click="subscribe"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { useMessagesStore } from '~/store/messages';
import { useUserStore } from '~/store/user';
import type { ApiDto } from '@viewtube/shared';

export default defineComponent({
  name: 'SubscribeButton',
  props: {
    channelId: {
      type: String,
      required: true,
      default: null
    },
    isInitiallySubscribed: { type: Boolean, required: false },
    small: { type: Boolean, required: false }
  },
  setup(props) {
    const userStore = useUserStore();
    const messagesStore = useMessagesStore();
    const { apiUrl } = useApiUrl();
    const { vtFetch } = useVtFetch();

    const isSubscribed = ref(false);
    const disabled = ref(true);
    const expanded = ref(true);

    onMounted(() => {
      if (props.isInitiallySubscribed) {
        isSubscribed.value = true;
        disabled.value = false;
      } else {
        loadSubscriptionStatus();
      }

      if (props.small) {
        expanded.value = false;
      }
    });

    const loadSubscriptionStatus = (): void => {
      if (!props.channelId || !userStore.isLoggedIn) return;
      vtFetch<ApiDto<'SubscriptionStatusDto'>>(
        `${apiUrl.value}user/subscriptions/${props.channelId}`,
        {
          credentials: 'include'
        }
      )
        .then(response => {
          isSubscribed.value = response.isSubscribed;
          disabled.value = false;
        })
        .catch((_: any) => {
          isSubscribed.value = false;
          disabled.value = true;
        });
    };
    const subscribe = (): void => {
      if (!props.channelId) return;
      disabled.value = true;
      vtFetch<ApiDto<'SubscriptionStatusDto'>>(
        `${apiUrl.value}user/subscriptions/${props.channelId}`,
        {
          method: 'PUT',
          credentials: 'include'
        }
      )
        .then(response => {
          if (response.isSubscribed) {
            isSubscribed.value = true;
            messagesStore.createMessage({
              type: 'info',
              title: 'Subscribed',
              message: `Successfully subscribed. Fetching new videos can take some time.`
            });
          }
          disabled.value = false;
          if (props.small) {
            expanded.value = false;
          }
        })
        .catch((_: any) => {
          messagesStore.createMessage({
            type: 'error',
            title: 'Unable to subscribe',
            message: `You may not be logged in. Try reloading the page.`
          });
          disabled.value = false;
        });
    };
    const unsubscribe = (): void => {
      if (!props.channelId) return;
      disabled.value = true;
      vtFetch<ApiDto<'SubscriptionStatusDto'>>(
        `${apiUrl.value}user/subscriptions/${props.channelId}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      )
        .then(response => {
          if (!response.isSubscribed) {
            isSubscribed.value = false;
          }
          disabled.value = false;
          if (props.small) {
            expanded.value = false;
          }
        })
        .catch((_: any) => {
          messagesStore.createMessage({
            type: 'error',
            title: 'Unable to unsubscribe',
            message: `You may not be logged in. Try to reload the page.`
          });
          disabled.value = false;
        });
    };

    return {
      isSubscribed,
      disabled,
      expanded,
      subscribe,
      unsubscribe
    };
  }
});
</script>

<style lang="scss" scoped>
.subscribe-button-container {
  width: 140px;
  height: 32px;
  position: relative;
  transition: filter 300ms variables.$intro-easing;

  &.disabled {
    pointer-events: none;
    filter: grayscale(100%);
  }

  .mini-btn {
    position: absolute;
    top: 0;
    right: 0;
    background-color: var(--bgcolor-alt-light);
    width: 32px;
    height: 32px;
    border-radius: 25px;
    cursor: pointer;
    user-select: none;
    opacity: 0.8;
    transition:
      transform 300ms variables.$overshoot-easing,
      background-color 300ms variables.$intro-easing;
    border: solid 2px transparent;
    box-sizing: border-box;

    .minus {
      background-color: #fff;
      width: 12px;
      height: 3px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    &.expanded {
      transform: rotate(-90deg);
      border-color: var(--theme-color);
    }
  }

  .clip-container {
    clip-path: circle(15px at calc(100% - 10px) 50%);
    transform: translateX(40px);
    width: 140px;
    height: 32px;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    pointer-events: none;
    transition-duration: 300ms;
    transition-timing-function: variables.$intro-easing;
    transition-property: clip-path, opacity, transform;

    &.expanded {
      transform: translateX(0);
      clip-path: circle(100px);
      opacity: 1;
      pointer-events: unset;
    }

    &.small {
      left: -46px;
    }

    .subscribe-button,
    .unsubscribe-button {
      width: 140px;
      height: 32px;
      border-radius: 5px;
      position: absolute;
      top: 0;
      left: 0;
      background: transparent;
      cursor: pointer;
      line-height: 12px;
      opacity: 1;
      transition:
        opacity 300ms variables.$intro-easing,
        transform 300ms variables.$intro-easing;

      &:focus {
        transform: scale(0.9);
      }

      &.hidden {
        opacity: 0;
        transform: scale(0);
        pointer-events: none;
      }

      &:before {
        content: '';
        z-index: 1;
        position: absolute;
        display: block;
        width: 80%;
        height: 70%;
        top: 15%;
        left: 10%;
        transition: 0.3s opacity ease-in-out;
        filter: blur(20px);
        opacity: 0;
        background: variables.$theme-color-primary-gradient;
      }

      &:hover:before {
        opacity: 1;
        transition: 0.3s opacity ease-in-out;
        filter: blur(20px);
        background: variables.$theme-color-primary-gradient;
      }

      &:after {
        text-align: center;
        line-height: 32px;
        font-size: 16px;
        color: rgba(235, 235, 235, 1);
        font-weight: bold;
        z-index: 5;
        position: absolute;
        display: block;
        border-radius: 5px;
        width: 100%;
        height: 100%;
        top: 0%;
        left: 0%;
        background: variables.$theme-color-primary-gradient;
      }
    }

    .subscribe-button {
      &:after {
        content: 'SUBSCRIBE';
        font-family: variables.$default-font;
      }
    }

    .unsubscribe-button {
      width: 140px;

      &:before {
        background: variables.$bgcolor-gradient;
      }

      &:hover:before {
        opacity: 1;
        transition: 0.3s opacity ease-in-out;
        filter: blur(20px);
        background: variables.$bgcolor-gradient;
      }

      &:after {
        content: 'UNSUBSCRIBE';
        font-family: variables.$default-font;
        background: var(--bgcolor-alt-light);
      }
    }
  }
}
</style>
