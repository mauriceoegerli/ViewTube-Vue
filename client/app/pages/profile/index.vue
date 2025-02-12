<script setup lang="ts">
import Confirmation from '~/components/popup/Confirmation.vue';
import SectionTitle from '~/components/SectionTitle.vue';
import FormInput from '~/components/form/FormInput.vue';
import BadgeButton from '~/components/buttons/BadgeButton.vue';
import HistoryList from '~/components/history/HistoryList.vue';
import { useMessagesStore } from '~/store/messages';
import { useSettingsStore } from '~/store/settings';
import { useUserStore } from '~/store/user';
import PasswordChangeForm from '~/components/form/PasswordChangeForm.vue';

const messagesStore = useMessagesStore();
const settingsStore = useSettingsStore();
const userStore = useUserStore();

const { apiUrl } = useApiUrl(true);
const { vtFetch } = useVtFetch();
const router = useRouter();

const logoutPopup = ref(false);
const deleteAccountPopup = ref(false);
const actionsOpen = ref(false);
const repeatedUsername = ref('');
const profileImageLoading = ref(false);
const passwordChangePopup = ref(false);
const profileImageUrl = computed(() => {
  if (profile.value?.profileImage) {
    const imgUrl = profile.value.profileImage.replace('/api/', '');
    return `url(${apiUrl.value}${imgUrl})`;
  } else {
    return null;
  }
});
const { data: profile, error, pending, refresh } = useGetUserProfileDetails();

watch(error, () => {
  if (error.value) {
    messagesStore.createMessage({
      type: 'error',
      title: 'Error loading profile',
      message: 'Try logging out and in again'
    });
  }
});

if (!userStore.isLoggedIn) {
  router.push('/');
}

const hasHistory = computed(() => {
  if (profile.value && profile.value.videoHistory.length > 0) {
    return true;
  }
  return false;
});
const onChangePasswordPopup = () => {
  passwordChangePopup.value = true;
};
const onChangePasswordClose = () => {
  passwordChangePopup.value = false;
};
const onLogoutPopup = () => {
  logoutPopup.value = true;
};
const onLogoutPopupClose = () => {
  logoutPopup.value = false;
};
const onDeleteAccount = () => {
  deleteAccountPopup.value = true;
};
const onDeleteAccountClose = () => {
  deleteAccountPopup.value = false;
};
const deleteAccount = () => {
  vtFetch(`${apiUrl.value}user`, {
    method: 'DELETE',
    body: { username: repeatedUsername.value },
    credentials: 'include'
  }).then(_ => {
    logout();
    messagesStore.createMessage({
      type: 'info',
      title: 'Deleted account',
      message: `Successfully deleted account ${repeatedUsername.value}`
    });
  });
};
const onProfileImageChange = (e: any) => {
  profileImageLoading.value = true;
  const img = e.target.files[0];
  const formData = new FormData();
  formData.append('image', img);
  vtFetch<{ path: string }>(`${apiUrl.value}user/profile/image`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  })
    .then(
      async response => {
        if (response.path) {
          messagesStore.createMessage({
            type: 'info',
            title: 'New profile image',
            message: 'Successfully set new profile image'
          });
          await refresh();
          profileImageLoading.value = false;
        }
      },
      reason => {
        if (reason?.message?.toLowerCase().includes('too large')) {
          messagesStore.createMessage({
            type: 'error',
            title: 'Image is too large',
            message: 'Maximum file size is 4MB'
          });
        } else {
          messagesStore.createMessage({
            type: 'error',
            title: 'Error saving profile image',
            message: reason?.message ?? 'Unknown error'
          });
        }
        profileImageLoading.value = false;
      }
    )
    .catch(err => {
      if (err && err.response.data.message && err.response.data.message.match(/.*too large.*/i)) {
        messagesStore.createMessage({
          type: 'error',
          title: err.response.data.message,
          message: 'Maximum file size is 4MB'
        });
      } else if (err && err.response.data && err.response.data.error) {
        messagesStore.createMessage({
          type: 'error',
          title: err.response.data.error,
          message: err.response.data.message
        });
      } else {
        messagesStore.createMessage({
          type: 'error',
          title: 'Error saving profile image',
          message: 'Try uploading it in a different format'
        });
      }
      profileImageLoading.value = false;
    });
};
const deleteProfileImage = () => {
  vtFetch(`${apiUrl.value}user/profile/image`, {
    method: 'DELETE',
    credentials: 'include'
  })
    .then(async () => {
      messagesStore.createMessage({
        type: 'info',
        title: 'Profile image deleted',
        message: 'Profile image successfully deleted'
      });
      await refresh();
    })
    .catch(() => {
      messagesStore.createMessage({
        type: 'error',
        title: 'Could not delete profile image',
        message: 'An error occurred when deleting the profile image'
      });
    });
};
const deleteAccountValid = computed(() => {
  return repeatedUsername.value.length > 0 && repeatedUsername.value === userStore.username;
});
const logout = async () => {
  await userStore.logout();
  await router.push('/');
};
</script>

<template>
  <div class="profile">
    <MetaPageHead :title="`${profile?.username}`" description="See your profile" />
    <Spinner v-if="pending" class="centered" />
    <div v-if="profile" class="profile-top">
      <div class="gradient-background" />
      <div class="profile-top-card">
        <div v-if="profile" class="user-info">
          <div class="profile-img" :class="{ image: profileImageUrl && !profileImageLoading }">
            <Spinner v-if="profileImageLoading" class="centered" />
            <VTIcon v-if="!profileImageUrl && !profileImageLoading" name="mdi:account-circle" />
            <div
              v-if="profileImageUrl && !profileImageLoading"
              alt="Profile image"
              class="profile-image"
            />
            <span v-if="profileImageUrl" class="delete-profile-img-btn" @click="deleteProfileImage"
              ><VTIcon name="mdi:delete"
            /></span>
            <label class="upload-profile-btn" for="upload-profile-image"
              ><VTIcon name="mdi:plus"
            /></label>
            <input
              id="upload-profile-image"
              type="file"
              accept="image/*"
              name="upload-profile-image"
              @change="onProfileImageChange"
            />
          </div>
          <div class="user-name">
            <p>{{ profile.username }}</p>
          </div>
        </div>
        <div v-if="profile" class="statistics" :class="{ blurred: actionsOpen }">
          <p>
            <span class="highlight">{{ profile.totalVideosCount }} videos</span> watched
          </p>
          <p>
            <span class="highlight">{{ profile.totalTimeString }}</span> spent watching videos
          </p>
          <p>
            <span class="highlight"
              >{{ profile.subscribedChannelsCount }} channel{{
                profile.subscribedChannelsCount === 1 ? '' : 's'
              }}</span
            >
            subscribed to
          </p>
        </div>
        <div v-if="profile" class="actions">
          <input id="actions" v-model="actionsOpen" type="checkbox" name="actions" />
          <label for="actions" class="actions-icon">
            <VTIcon name="mdi:cog" />
            <VTIcon name="mdi:chevron-up" class="chevron-icon" />
          </label>
          <div class="actions-details">
            <BadgeButton class="action" :click="onChangePasswordPopup"
              ><VTIcon name="mdi:form-textbox-password" />Change password</BadgeButton
            >
            <BadgeButton download class="action" :href="`${apiUrl}user/export`"
              ><VTIcon name="mdi:database-export-outline" />Export data</BadgeButton
            >
            <BadgeButton class="action" :click="onLogoutPopup" style="color: #ef4056"
              ><VTIcon name="mdi:logout-variant" />Sign out</BadgeButton
            >
            <BadgeButton class="action" :click="onDeleteAccount" style="color: #ef4056"
              ><VTIcon name="mdi:delete-alert" />Delete account</BadgeButton
            >
          </div>
        </div>
      </div>
    </div>
    <UserSessions v-if="profile" />
    <div v-if="profile && !settingsStore.saveVideoHistory" class="no-history">
      <VTIcon name="mdi:restart-off" />
      <p>Video history is disabled. You can enable it in settings.</p>
    </div>
    <div v-if="profile && !hasHistory && settingsStore.saveVideoHistory" class="no-history">
      <VTIcon name="mdi:history" />
      <p>You haven't watched any videos yet. Once you have, your history will show up here.</p>
    </div>
    <div v-if="profile && hasHistory" class="video-history">
      <SectionTitle :title="'History'" :link="'/history'" />
      <HistoryList :history-videos="profile.videoHistory" :delete-option="false" />
    </div>
    <Teleport to="body">
      <transition name="popup">
        <PasswordChangeForm
          v-if="passwordChangePopup"
          @password-change-close="onChangePasswordClose"
        />
      </transition>
      <transition name="popup">
        <Confirmation
          v-if="logoutPopup"
          :title="'Sign out'"
          :message="'Do you want to sign out?'"
          @close="onLogoutPopupClose"
        >
          <BadgeButton :click="onLogoutPopupClose">Cancel</BadgeButton>
          <BadgeButton :click="logout">OK</BadgeButton>
        </Confirmation>
      </transition>
      <transition name="popup">
        <Confirmation
          v-if="deleteAccountPopup"
          :title="'Delete account'"
          :message="'Do you want to delete your account? This will immediately erase all data related to you. This action is irreversible.'"
          @close="onDeleteAccountClose"
        >
          <div class="repeat-username-container">
            <FormInput
              id="repeated-username"
              v-model="repeatedUsername"
              type="text"
              label="Repeat your username"
            />
            <BadgeButton
              :click="deleteAccount"
              :disabled="profile && !deleteAccountValid"
              class="delete-account-btn"
              >Delete account</BadgeButton
            >
          </div>
        </Confirmation>
      </transition>
    </Teleport>
  </div>
</template>

<style lang="scss">
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

.repeat-username-container {
  display: flex;
  flex-direction: column;
  width: 100%;

  .form-input {
    #repeated-username {
      width: 100%;
      margin: 15px 0;
    }
    .input-label {
      left: 14px;
    }
  }

  .delete-account-btn {
    color: var(--error-color-red);
    border-color: var(--error-color-red);
    transition:
      color 300ms variables.$intro-easing,
      background-color 300ms variables.$intro-easing;

    &:hover {
      color: unset;
      border-color: var(--error-color-red);
      background-color: var(--error-color-red);
    }
  }
}

.profile {
  width: 100%;
  max-width: 800px;
  padding-top: variables.$header-height;
  margin: 0 auto;
  max-height: calc(100% - #{variables.$header-height});
  box-sizing: border-box;

  .profile-top {
    position: relative;
    box-sizing: border-box;
    margin: 0 10px;

    .gradient-background {
      position: absolute;
      width: 100%;
      height: 80%;
      left: 0;
      top: 20%;
      background: var(--theme-color-gradient);
      z-index: 7;
      filter: blur(50px);
      opacity: 0.7;

      @media screen and (max-width: variables.$mobile-width) {
        top: 0;
      }
    }

    .profile-top-card {
      margin: 30px 0 0 40px;
      border-radius: 15px;
      padding: 15px 15px 15px 140px;
      height: 190px;
      z-index: 8;
      position: relative;
      box-sizing: border-box;
      width: calc(100% - 40px);
      box-shadow: variables.$low-shadow;
      position: relative;

      @media screen and (max-width: variables.$mobile-width) {
        margin: 130px 0 0 0;
        padding: 90px 15px 10px 15px;
        height: 230px;
        width: 100%;
      }

      &::before {
        content: '';
        background-color: var(--bgcolor-alt);
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: -1;
        border-radius: 15px;
      }

      .user-info {
        display: flex;
        flex-direction: row;

        .profile-img {
          position: absolute;
          left: -40px;
          top: 20px;
          height: 150px;
          width: 150px;
          border-radius: 15px;
          background: linear-gradient(to bottom, var(--theme-color), var(--theme-color-dark));
          box-shadow: 4px 5px 12px var(--theme-color-translucent);
          filter: none;

          &.image {
            border-radius: 0;
            background: none;
            box-shadow: none;
            filter: drop-shadow(4px 5px 12px var(--theme-color-translucent));
          }

          @media screen and (max-width: variables.$mobile-width) {
            left: 50%;
            top: -30%;
            transform: translateX(-50%);
          }

          &:hover {
            .upload-profile-btn,
            .delete-profile-img-btn {
              opacity: 1;
              pointer-events: auto;
            }
          }

          .profile-image {
            width: 100%;
            height: 100%;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            border-radius: 15px;
            background-image: v-bind(profileImageUrl);
          }

          .upload-profile-btn,
          .delete-profile-img-btn {
            position: absolute;
            bottom: 10px;
            right: 10px;
            height: 40px;
            width: 40px;
            background-color: #00000059;
            border-radius: 5px;
            opacity: 0;
            pointer-events: none;
            transition: opacity 200ms variables.$intro-easing;
            cursor: pointer;

            .vt-icon {
              width: 100%;
              height: 100%;
              filter: var(--darkness);
              background-color: var(--bgcolor-main);
            }
          }

          .delete-profile-img-btn {
            left: 10px;
            right: unset;
          }

          #upload-profile-image {
            width: 0;
            height: 0;
            position: absolute;
            top: 0;
            opacity: 0;
          }

          > .vt-icon {
            padding: 20px;
            width: calc(100% - 40px);
            height: calc(100% - 40px);
            filter: var(--darkness);
            background-color: var(--bgcolor-main);
          }
        }
        .user-name {
          font-size: 1.8rem;

          @media screen and (max-width: variables.$mobile-width) {
            width: 100%;
            text-align: center;
          }
        }
      }

      .statistics {
        color: var(--subtitle-color);
        font-size: 0.9rem;
        margin: 0 0 5px 0;
        transition: filter 500ms variables.$intro-easing;

        &.blurred {
          filter: blur(5px);
        }

        p {
          margin: 4px 0;

          .highlight {
            color: var(--title-color);
            font-weight: bold;
          }
        }
      }

      .actions {
        position: absolute;
        top: 20px;
        right: 18px;

        #actions {
          visibility: hidden;

          &:checked {
            ~ .actions-details {
              .action {
                transform: translateX(0);
                opacity: 1;
                user-select: unset;
                pointer-events: unset;
              }
            }

            ~ .actions-icon {
              .chevron-icon {
                transform: rotateX(180deg);
              }
            }
          }
        }
        .actions-icon {
          border: 2px solid var(--theme-color-translucent);
          position: absolute;
          right: 5px;
          top: 0;
          height: 24px;
          padding: 2px;
          border-radius: 3px;
          cursor: pointer;
          transition: border 300ms variables.$intro-easing;

          &:hover {
            border: 2px solid var(--theme-color);
          }

          .chevron-icon {
            transition: transform 300ms variables.$intro-easing;
          }
        }
        .actions-details {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
          top: 10px;

          .action {
            transform: translateX(20px);
            opacity: 0;
            user-select: none;
            pointer-events: none;
            transition:
              transform 300ms variables.$intro-easing,
              opacity 300ms variables.$intro-easing,
              border 300ms 0ms variables.$intro-easing;
          }

          @for $i from 0 through 3 {
            .action:nth-of-type(#{$i + 1}) {
              transition-delay: 100ms * variables.$i !important;
            }
          }
        }

        @media screen and (max-width: variables.$mobile-width) {
          top: unset;
          bottom: 20px;
        }
      }
    }
  }

  .video-history {
    overflow: hidden;
    box-sizing: border-box;
    margin: 0 10px;
  }

  .no-history {
    margin: 60px 0 0 0;
    position: relative;
    width: 100%;
    text-align: center;
  }
}
</style>
