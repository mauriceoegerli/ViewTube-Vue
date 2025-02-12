<script setup lang="ts">
import FormInput from '~/components/form/FormInput.vue';
import InformationHint from '~/components/hints/InformationHint.vue';
import SubmitButton from '~/components/form/SubmitButton.vue';
import Spinner from '~/components/Spinner.vue';
import { useMessagesStore } from '~/store/messages';
import { useUserStore } from '~/store/user';
import { useCaptchaStore } from '~/store/captcha';

const props = defineProps<{
  complete?: () => void;
}>();

const route = useRoute();
const captchaStore = useCaptchaStore();
const messagesStore = useMessagesStore();
const userStore = useUserStore();
const router = useRouter();

const loading = ref(false);
const username = ref('');
const password = ref('');
const repeatPassword = ref('');
const captchaSolution = ref('');
const statusMessage = ref('');
const formWiggle = ref(false);

const captchaImage = computed(() => {
  return captchaStore.image;
});

watch(password, () => {
  checkRepeatPasswords();
});
watch(repeatPassword, () => {
  checkRepeatPasswords();
});

const register = async () => {
  if (password.value !== repeatPassword.value) {
    wiggleRegisterForm();
  } else {
    loading.value = true;

    const user = await userStore.register(username.value, password.value, captchaSolution.value);
    if (user && !user.error && user.username) {
      messagesStore.createMessage({
        type: 'info',
        title: 'Registration successful',
        message: `Welcome, ${user.username}`
      });
      if (props.complete && typeof props.complete === 'function') {
        props.complete();
      } else {
        router.push((route.query.ref as string) || '/');
      }
    } else {
      messagesStore.createMessage({
        type: 'error',
        title: 'Registration failed',
        message: user ? user.error : ''
      });
      loading.value = false;
      wiggleRegisterForm();
      captchaStore.getCaptcha();
    }
  }
};
const wiggleRegisterForm = () => {
  formWiggle.value = true;
  setTimeout(() => {
    formWiggle.value = false;
  }, 600);
};
const checkRepeatPasswords = () => {
  if (password.value !== repeatPassword.value) {
    statusMessage.value = 'passwords do not match';
  } else {
    statusMessage.value = '';
  }
};

captchaStore.getCaptcha();
</script>

<template>
  <div class="register-form" :class="{ loading: loading, wiggle: formWiggle }">
    <h2 class="register-title">Sign up</h2>
    <span class="status-message-display message-display">{{ statusMessage }}</span>
    <InformationHint class="hint">Usernames are case sensitive</InformationHint>
    <Spinner />
    <form id="register" ref="registerForm" method="post" @submit.prevent="register">
      <FormInput
        :id="'username'"
        v-model="username"
        :label="'username'"
        :type="'username'"
        autofocus
      />
      <FormInput :id="'password'" v-model="password" :label="'password'" :type="'password'" />
      <FormInput
        :id="'repeat-password'"
        v-model="repeatPassword"
        :label="'Repeat password'"
        :type="'password'"
      />
      <div class="captcha-container">
        <div class="captcha-box">
          <img class="captcha-image" :src="captchaImage" alt="Captcha image" />
        </div>
      </div>
      <FormInput
        :id="'image-captcha'"
        v-model="captchaSolution"
        :label="'Captcha'"
        :type="'text'"
      />
      <SubmitButton :label="'Sign up'" />
    </form>
  </div>
</template>

<style lang="scss">
.register-form {
  margin: auto;
  width: 100%;
  max-width: 500px;
  background-color: var(--bgcolor-alt);
  box-shadow: variables.$max-shadow;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  overflow-y: auto;

  @media screen and (max-width: variables.$mobile-width) {
    height: auto;
    box-shadow: none;
  }

  &.wiggle {
    animation: wiggle 600ms;
  }

  .register-title {
    margin: 20px 0 0 0;
    font-size: 2rem;
    color: var(--theme-color);
    font-family: variables.$default-font;
  }

  .message-display {
    height: 20px;
    line-height: 20px;

    &.error-message-display {
      color: var(--error-color-red);
    }
  }

  .hint {
    width: calc(100% - 80px);
    margin: 15px 0 0 0;
  }

  &.loading {
    .hint,
    #register {
      opacity: 0;
      pointer-events: none;
    }

    .spinner {
      opacity: 1;
    }
  }

  .spinner {
    position: absolute !important;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0;
    transition: opacity 300ms variables.$intro-easing;
  }

  #register {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-height: 10000px;
    max-width: 500px;
    padding: 10px;
    box-sizing: border-box;
    transition: opacity 300ms variables.$intro-easing;

    .captcha-container {
      width: calc(100% - 40px);
      display: flex;
      margin: 20px 20px;
      height: auto;

      .captcha-box {
        border: 2px solid var(--bgcolor-alt-light);
        width: 100%;
        background-color: transparent;
        color: var(--subtitle-color-light);
        border-radius: 4px;
        overflow: hidden;

        .captcha-image {
          width: 100%;
          filter: var(--darkness);
          margin: -10px 0;
        }
      }
    }
  }
}

@keyframes wiggle {
  20%,
  60% {
    transform: translateX(-10px);
  }
  40%,
  80% {
    transform: translate(10px);
  }
}
</style>
