<script setup lang="ts">
import RegisterForm from '~/components/form/RegisterForm.vue';
</script>

<template>
  <div class="register">
    <MetaPageHead title="Register" description="Create a ViewTube account" />
    <RegisterForm />
  </div>
</template>

<style lang="scss">
.register {
  display: flex;
  background-size: cover;
  background-repeat: no-repeat;
  background-color: var(--bgcolor-alt);
  height: calc(100vh - #{variables.$header-height});
  padding: variables.$header-height 0 0 0;
  overflow: scroll;

  @media screen and (min-width: variables.$mobile-width) {
    background-image: url('~/assets/blur-bg-medium-dark.jpg');
  }
}
</style>
