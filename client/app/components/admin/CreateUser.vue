<script setup lang="ts">
import { useMessagesStore } from '~/store/messages';

const username = ref('');
const password = ref('');

const { createUser } = useCreateUser();
const messagesStore = useMessagesStore();

const createUserAdmin = async () => {
  if (!username.value || !password.value) return;
  const createdUser = await createUser({
    username: username.value,
    password: password.value
  })
    .then(
      res => res,
      reason => {
        throw reason;
      }
    )
    .catch(err => {
      messagesStore.createMessage({
        type: 'error',
        title: 'Error creating user',
        message: err?.data?.message ?? 'Unknown error'
      });
    });

  username.value = '';
  password.value = '';

  if (createdUser) {
    messagesStore.createMessage({
      type: 'info',
      title: 'User created',
      message: `User ${createdUser.username} created`
    });
  }
};
</script>

<template>
  <SectionSubtitle title="Create new user" />

  <form id="create-user" class="create-user-form" method="post" @submit.prevent="createUserAdmin">
    <FormInput id="username" v-model="username" type="username" label="Username" />
    <FormInput id="password" v-model="password" type="password" label="Password" />
    <FormSubmitButton :label="'Create user'" />
  </form>
</template>

<style lang="scss" scoped>
.create-user-form {
  display: flex;
  flex-direction: row;

  @media screen and (max-width: variables.$mobile-width) {
    flex-direction: column;
  }

  :deep(.submit-button) {
    width: auto;
    padding: 5px 15px;
    margin: 16px 0;
  }

  :deep(.form-input > .input) {
    margin-left: 0;
    margin-right: 10px;
    width: calc(100% - 10px);

    @media screen and (max-width: variables.$mobile-width) {
      margin-right: 0;
      width: 100%;
    }
  }

  :deep(.form-input > .input-label) {
    left: 14px;
  }

  :deep(.form-input > .form-input-icon) {
    right: 25px;
  }
}
</style>
