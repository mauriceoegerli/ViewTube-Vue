<script setup lang="ts">
import BadgeButton from '~/components/buttons/BadgeButton.vue';
import LoginForm from '../form/LoginForm.vue';
import RegisterForm from '../form/RegisterForm.vue';
import Settings from '~/components/Settings.vue';
import About from '~/components/About.vue';
import { useUserStore } from '~/store/user';
import { usePopupStore } from '~/store/popup';

const route = useRoute();
const userStore = useUserStore();
const popupStore = usePopupStore();

const { apiUrl } = useApiUrl();
const { registrationEnabled } = useRegistrationEnabled();

const accountMenuVisible = ref(false);
const settingsOpen = ref(false);
const aboutOpen = ref(false);
const loginOpen = ref(false);
const registerOpen = ref(false);
const logoutOpen = ref(false);

const openPopup = (popup: string) => {
  closeAllPopups();
  popupStore.setPopupOpen(true);
  switch (popup) {
    case 'settings':
      settingsOpen.value = true;
      break;
    case 'about':
      aboutOpen.value = true;
      break;
    case 'login':
      loginOpen.value = true;
      break;
    case 'register':
      registerOpen.value = true;
      break;
    case 'logout':
      logoutOpen.value = true;
      break;
  }
};

const onLoginClick = () => {
  closeAllPopups();
  popupStore.setPopupOpen(true);
  loginOpen.value = true;
};
const onRegisterClick = () => {
  closeAllPopups();
  popupStore.setPopupOpen(true);
  registerOpen.value = true;
};

const getProfileImageUrl = (url: string): string => {
  if (!url) return null;
  const imgUrl = url.replace('/api/', '');
  return `${apiUrl.value}${imgUrl}`;
};

const closeAllPopups = () => {
  registerOpen.value = false;
  loginOpen.value = false;
  aboutOpen.value = false;
  settingsOpen.value = false;
  accountMenuVisible.value = false;
  if (popupStore.popupOpen) {
    popupStore.setPopupOpen(false);
  }
};

const userAuthenticated = computed((): boolean => {
  return userStore.isLoggedIn;
});

const currentPageRef = (exclude: string) => {
  if (!route.fullPath.match(new RegExp(`.?${exclude}.?`, 'gi')) && route.fullPath !== '/') {
    return `?ref=${route.fullPath}`;
  }
  return '';
};
const showAccountMenu = (): void => {
  closeAllPopups();
  popupStore.setPopupOpen(true);
  accountMenuVisible.value = !accountMenuVisible.value;
};

const onEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    closeAllPopups();
  }
};

const logout = () => {
  userStore.logout();
  closeAllPopups();
  logoutOpen.value = false;
};
const onLogoutPopupClose = () => {
  closeAllPopups();
  logoutOpen.value = false;
};

onMounted((): void => {
  window.addEventListener('keydown', onEscape);
});

onBeforeUnmount((): void => {
  window.removeEventListener('keydown', onEscape);
});
</script>

<template>
  <div class="nav">
    <a
      v-show="!userAuthenticated"
      id="login"
      v-tippy="'Sign in'"
      :href="`/login${currentPageRef('login')}`"
      class="tooltip nav-btn main"
      @click.prevent="onLoginClick"
      >Sign in</a
    >
    <a
      v-show="!userAuthenticated && registrationEnabled"
      id="register"
      v-tippy="'Sign up'"
      :href="`/register${currentPageRef('register')}`"
      class="tooltip nav-btn"
      @click.prevent="onRegisterClick"
      >Sign up</a
    >
    <nuxt-link
      v-show="$route.name !== 'subscriptions' && userAuthenticated"
      id="subscriptions"
      v-tippy="'View your subscriptions'"
      to="/subscriptions"
      class="tooltip nav-btn main"
      >Subscriptions</nuxt-link
    >
    <a
      id="account"
      v-tippy="'Account'"
      :class="{ authenticated: userAuthenticated }"
      href="#"
      @click.prevent="showAccountMenu"
    >
      <div class="user-icon">
        <VTIcon v-if="!userStore.profileImage" name="mdi:account-circle" />

        <div
          v-if="userStore.profileImage"
          class="user-image"
          :style="{ 'background-image': `url(${userStore.profileImage})` }"
        />
      </div>
      <p v-if="userAuthenticated" class="account-name">{{ userStore.username }}</p>
    </a>
    <ClientOnly>
      <Teleport to="body">
        <div
          :class="{ visible: loginOpen || registerOpen || accountMenuVisible }"
          class="clickaway-div"
          @click="closeAllPopups"
        />
        <transition name="fade-down">
          <Settings v-if="settingsOpen" @close="closeAllPopups" />
        </transition>
        <transition name="fade-down">
          <About v-if="aboutOpen" @close="closeAllPopups" />
        </transition>
        <transition name="fade-down">
          <LoginForm v-if="loginOpen" class="center-popup" :complete="closeAllPopups" />
        </transition>
        <transition name="fade-down">
          <RegisterForm v-if="registerOpen" class="center-popup" :complete="closeAllPopups" />
        </transition>
        <transition name="fade-top-right">
          <HeaderUserMenu
            v-if="accountMenuVisible"
            @close="closeAllPopups"
            @open-popup="openPopup"
          />
        </transition>
        <transition name="fade-down">
          <PopupConfirmation
            v-if="logoutOpen"
            :title="'Sign out'"
            :message="'Do you want to sign out?'"
            @close="onLogoutPopupClose"
          >
            <BadgeButton :click="onLogoutPopupClose">Cancel</BadgeButton>
            <BadgeButton :click="logout">OK</BadgeButton>
          </PopupConfirmation>
        </transition>
      </Teleport>
    </ClientOnly>
  </div>
</template>

<style lang="scss">
.fade-top-right-enter-active,
.fade-top-right-leave-active {
  transition:
    opacity 300ms variables.$intro-easing,
    transform 300ms variables.$intro-easing;
}
.fade-top-right-enter-to,
.fade-top-right-leave-from {
  opacity: 1;
  transform: translate3d(0, 0, 0) scale(1);
}
.fade-top-right-enter-from,
.fade-top-right-leave-to {
  opacity: 0;
  transform: translate3d(25px, -35px, 0) scale(0.9);
}

.fade-down-enter-active,
.fade-down-leave-active {
  transition:
    transform 200ms variables.$intro-easing,
    opacity 200ms variables.$intro-easing;
}
.fade-down-enter-to,
.fade-down-leave-from {
  transform: scale(1);
  opacity: 1;
}
.fade-down-enter-from,
.fade-down-leave-to {
  transform: scale(1.1);
  opacity: 0;
}

.center-popup {
  position: absolute !important;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 901;

  &.login-form {
    max-height: 400px;
  }

  &.register-form {
    max-height: 700px;
  }
}

.clickaway-div {
  position: fixed;
  background-color: #0000008f;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 900;
  pointer-events: none;
  opacity: 0;
  transition: opacity 300ms variables.$intro-easing;

  &.visible {
    opacity: 1;
    pointer-events: all;
  }
}

.nav {
  margin: auto 10px auto 5px;
  color: var(--theme-color);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
  z-index: +1;

  #account {
    color: var(--subtitle-color-light);
    &:focus {
      &::after {
        box-shadow: none;
      }
    }

    &.authenticated {
      width: auto;
      border-radius: 3px;

      .account-name {
        color: var(--theme-color);
        padding: 0 0 0 4px;
        @media screen and (max-width: variables.$mobile-width) {
          display: none;
        }
      }

      @media screen and (max-width: variables.$mobile-width) {
        height: 35px;
        .user-icon {
          height: 35px;
          width: 35px;

          .user-image {
            height: 35px !important;
            width: 35px !important;
          }
        }
      }

      .user-icon {
        .user-image {
          height: 24px;
          width: 24px;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          margin-right: 4px;
        }

        .vt-icon {
          fill: var(--theme-color);
        }
      }
    }
  }

  a:not(.nav-btn):not(.menu-btn) {
    text-decoration: none;
    color: var(--theme-color);
    transition: color 300ms variables.$intro-easing;
    margin: 0 6px;
    display: flex;
    user-select: none;
    border-radius: 50%;
    padding: 3px;
    width: 24px;
    height: 24px;
    order: 99;

    i {
      margin: auto;
      height: 100%;
    }
  }

  .nav-btn {
    text-decoration: none;
    color: var(--theme-color);
    transition:
      color 300ms variables.$intro-easing,
      border 300ms variables.$intro-easing;
    margin: 0 5px;
    display: flex;
    user-select: none;
    border-radius: 3px;
    line-height: 100%;
    text-align: center;
    padding: 5px 10px;
    box-sizing: border-box;
    border: solid 2px transparent;
    white-space: nowrap;

    &#login {
      min-width: 75px;
    }

    @media screen and (max-width: variables.$mobile-width) {
      display: none;
    }

    &:hover {
      border: 2px solid var(--theme-color);
    }

    &:focus {
      border: 2px solid var(--theme-color);

      &::after {
        display: none !important;
      }
    }
  }

  .nav-btn.main {
    position: relative;
    border: solid 2px var(--theme-color-translucent);
    border-radius: 3px;

    &:hover {
      border: 2px solid var(--theme-color);
    }
  }
}
</style>
