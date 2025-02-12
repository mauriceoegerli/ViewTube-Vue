<script setup lang="ts">
import LoginForm from '~/components/form/LoginForm.vue';
</script>

<template>
  <div class="login">
    <MetaPageHead title="Sign in" description="Sign in to access your ViewTube account" />
    <LoginForm />
  </div>
</template>

<style lang="scss">
.login {
  display: flex;
  background-size: cover;
  background-repeat: no-repeat;
  background-color: var(--bgcolor-alt);
  height: calc(100vh - #{variables.$header-height});
  padding: variables.$header-height 0 0 0;

  @media screen and (min-width: variables.$mobile-width) {
    background-image: url('~/assets/blur-bg-medium-dark.jpg');
  }
}
</style>
