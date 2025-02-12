<script setup lang="ts">
import { useUserStore } from '~/store/user';

const emit = defineEmits<{
  (event: 'close'): void;
  (event: 'openPopup', value: string): void;
}>();

const userStore = useUserStore();

const onNavClick = () => {
  emit('close');
};

const openPopup = (popup: string) => {
  emit('openPopup', popup);
};
</script>

<template>
  <div class="user-menu">
    <div class="user-account">
      <ClientOnly>
        <div
          v-if="userStore.profileImage"
          class="avatar-background"
          :style="{ 'background-image': `url(${userStore.profileImage})` }"
        />
      </ClientOnly>
      <div class="user-avatar">
        <img
          v-if="userStore.profileImage"
          class="user-img"
          :src="userStore.profileImage"
          alt="User avatar"
        />
        <VTIcon v-else class="user-icon" name="mdi:account-circle" />
      </div>
      <div v-if="userStore.isLoggedIn" class="user-info">
        <div class="user-name">{{ userStore.username }}</div>
        <div class="user-role">{{ userStore.admin ? 'Admin' : 'User' }}</div>
      </div>
      <div v-else class="user-info">
        <div class="not-logged-in">Not logged in</div>
      </div>
    </div>
    <div class="page-navigation">
      <nuxt-link
        v-if="!userStore.isLoggedIn"
        class="page-link mobile-only"
        to="/login"
        @click="onNavClick"
      >
        <VTIcon name="mdi:login-variant" />
        <span>Sign in</span>
      </nuxt-link>
      <nuxt-link
        v-if="!userStore.isLoggedIn"
        class="page-link mobile-only"
        to="/register"
        @click="onNavClick"
      >
        <VTIcon name="mdi:register" />
        <span>Sign up</span>
      </nuxt-link>
      <HeaderCategoryHeader v-if="userStore.isLoggedIn">You</HeaderCategoryHeader>
      <nuxt-link v-if="userStore.isLoggedIn" class="page-link" to="/profile" @click="onNavClick">
        <VTIcon name="mdi:account" />
        <span>Profile</span>
      </nuxt-link>
      <nuxt-link
        v-if="userStore.isLoggedIn"
        class="page-link"
        to="/subscriptions"
        @click="onNavClick"
      >
        <VTIcon name="mdi:youtube-subscription" />
        <span>Subscriptions</span>
      </nuxt-link>
      <nuxt-link v-if="userStore.isLoggedIn" class="page-link" to="/history" @click="onNavClick">
        <VTIcon name="mdi:history" />
        <span>History</span>
      </nuxt-link>
      <nuxt-link
        v-if="userStore.isLoggedIn"
        class="page-link"
        to="/subscriptions/manage"
        @click="onNavClick"
      >
        <VTIcon name="mdi:pencil-box-multiple-outline" />
        <span>Manage subscriptions</span>
      </nuxt-link>
      <HeaderCategoryHeader>Manage</HeaderCategoryHeader>
      <button class="page-link" data-testid="settings-link" @click="openPopup('settings')">
        <VTIcon name="mdi:cog" /><span>Settings</span>
      </button>
      <nuxt-link
        v-if="userStore.isLoggedIn && userStore.admin"
        class="page-link"
        to="/admin"
        @click="onNavClick"
      >
        <VTIcon name="mdi:administrator" />
        <span>Admin panel</span>
      </nuxt-link>
      <button v-if="userStore.isLoggedIn" class="page-link" @click="openPopup('logout')">
        <VTIcon name="mdi:logout-variant" />Logout
      </button>
      <HeaderCategoryHeader>Other</HeaderCategoryHeader>
      <button class="page-link" @click="openPopup('about')">
        <VTIcon name="mdi:information-outline" /><span>About</span>
      </button>
      <a
        href="https://github.com/sponsors/ViewTube"
        rel="noreferrer noopener"
        target="_blank"
        class="page-link"
        @click="onNavClick"
      >
        <VTIcon name="mdi:heart" /><span>Donate</span>
      </a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.popup-enter-active,
.popup-leave-active {
  transition:
    opacity 300ms variables.$intro-easing,
    transform 300ms variables.$intro-easing;
}
.popup-enter-to,
.popup-leave-from {
  opacity: 1;
  transform: scale(1);
}
.popup-enter-from,
.popup-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

.user-menu {
  position: fixed;
  top: variables.$header-height + 15px;
  right: 20px;
  width: calc(100% - 40px);
  max-height: calc(100% - variables.$header-height - 30px);
  max-width: 350px;
  z-index: 1000;
  padding-bottom: 10px;
  background-color: var(--bgcolor-alt);
  border-radius: 16px;
  box-sizing: border-box;
  overflow: hidden auto;

  @media screen and (max-width: variables.$mobile-width) {
    max-width: 100%;
  }

  .user-account {
    display: grid;
    position: relative;
    grid-template-columns: 60px 1fr;
    grid-template-rows: 60px;
    gap: 15px;
    background-color: var(--bgcolor-alt-light);
    padding: 10px;
    margin: 10px;
    border-radius: 10px;
    transition: background-color 200ms variables.$intro-easing;
    overflow: hidden;

    .avatar-background {
      position: absolute;
      width: 100%;
      height: 100%;
      bottom: 0;
      z-index: 10;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      filter: blur(25px) brightness(0.4);
    }

    .user-avatar {
      z-index: 11;
      .user-icon {
        width: 100%;
        height: 100%;
        color: var(--theme-color);
      }

      .user-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .user-info {
      display: flex;
      flex-direction: column;
      margin: auto 0;
      z-index: 11;

      .user-name {
        font-size: 1.1rem;
        color: var(--theme-color);
      }

      .user-role {
        font-size: 0.8rem;
        color: var(--subtitle-color-light);
      }

      .not-logged-in {
        margin: auto 0;
        color: var(--theme-color);
      }
    }
  }

  .page-navigation {
    display: flex;
    flex-direction: column;

    .page-link {
      padding: 10px 15px;
      margin: auto 0;
      display: flex;
      gap: 15px;
      transition: color 200ms variables.$intro-easing;
      font-size: 0.9rem;
      cursor: pointer;
      text-decoration: none;
      user-select: none;
      background-color: unset;
      color: var(--subtitle-color);
      border: none;
      line-height: 24px;

      &.mobile-only {
        @media screen and (min-width: variables.$mobile-width) {
          display: none;
        }
      }

      &:hover {
        color: var(--theme-color);
      }
    }
  }
}
</style>
