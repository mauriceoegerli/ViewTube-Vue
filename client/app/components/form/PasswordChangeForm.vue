<template>
  <div class="popup">
    <div class="container popup-container" :class="{ loading: loading }">
      <div class="form-header">
        <VTIcon
          v-ripple
          name="mdi:close"
          class="close-icon"
          @click.stop="$emit('passwordChangeClose')"
        />
        <h2 class="form-title">Change password</h2>
      </div>
      <Spinner />
      <form id="form" method="post" @submit.prevent="changePassword">
        <FormInput
          :id="'oldPassword'"
          v-model="oldPassword"
          :label="'Old Password'"
          :type="'password'"
        />
        <FormInput
          :id="'newPassword'"
          v-model="newPassword"
          :label="'New Password'"
          :type="'password'"
        />
        <FormInput
          :id="'newPasswordConfirm'"
          v-model="newPasswordConfirm"
          :label="'Confirm new password'"
          :type="'password'"
        />
        <SubmitButton :label="'Change password'" />
      </form>
    </div>
    <div class="popup-overlay" @click.stop="$emit('passwordChangeClose')" />
  </div>
</template>

<script lang="ts">
import FormInput from '~/components/form/FormInput.vue';
import SubmitButton from '~/components/form/SubmitButton.vue';
import Spinner from '~/components/Spinner.vue';
import '~/assets/styles/popup.scss';
import { useMessagesStore } from '~/store/messages';
import { useUserStore } from '~/store/user';

export default defineComponent({
  name: 'PasswordChangeForm',
  components: {
    FormInput,
    SubmitButton,
    Spinner
  },
  setup(_props, { emit }) {
    const messagesStore = useMessagesStore();
    const userStore = useUserStore();
    const { apiUrl } = useApiUrl();
    const { vtFetch } = useVtFetch();

    const oldPassword = ref('');
    const newPassword = ref('');
    const newPasswordConfirm = ref('');
    const loading = ref(false);

    const changePassword = () => {
      loading.value = true;
      if (newPassword.value !== newPasswordConfirm.value) {
        messagesStore.createMessage({
          type: 'error',
          title: 'Password change failed',
          message: 'The new password and the confirmation password do not match'
        });
        loading.value = false;
        return;
      }
      vtFetch(`${apiUrl.value}user/profile/password`, {
        method: 'POST',
        body: {
          username: userStore.username,
          oldPassword: oldPassword.value,
          newPassword: newPassword.value
        },
        credentials: 'include'
      })
        .then(() => {
          messagesStore.createMessage({
            type: 'info',
            title: 'Password changed',
            message: 'Your password has been changed'
          });
          loading.value = false;
          emit('passwordChangeClose');
        })
        .catch(error => {
          messagesStore.createMessage({
            type: 'error',
            title: 'Password change failed',
            message: error.message
          });
          loading.value = false;
        });
    };
    return {
      oldPassword,
      newPassword,
      newPasswordConfirm,
      changePassword,
      loading
    };
  }
});
</script>

<style lang="scss" scoped>
.container {
  margin: auto;
  height: auto;

  .form-title {
    margin: 20px 0 0 0;
    font-size: 2rem;
    color: var(--theme-color);
    font-family: variables.$default-font;
  }

  .message-display {
    height: 20px;
    line-height: 20px;
  }

  .hint {
    width: calc(100% - 80px);
    margin: 15px 0 0 0;
  }

  &.loading {
    .hint,
    #form {
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

  #form {
    display: flex;
    flex-direction: column;
    width: calc(100% - 20px);
    max-width: 700px;
    padding: 10px;
    box-sizing: border-box;
    transition: opacity 300ms variables.$intro-easing;
  }

  .close-icon {
    position: absolute;
  }
}
</style>
