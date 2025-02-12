<script setup lang="ts">
import VideoEntry from '~/components/list/VideoEntry.vue';
import Spinner from '~/components/Spinner.vue';
import SectionTitle from '~/components/SectionTitle.vue';
import SwitchButton from '~/components/buttons/SwitchButton.vue';
import BadgeButton from '~/components/buttons/BadgeButton.vue';
import Pagination from '~/components/pagination/Pagination.vue';
import { useMessagesStore } from '~/store/messages';
import { useUserStore } from '~/store/user';

const messagesStore = useMessagesStore();
const userStore = useUserStore();
const { apiUrl } = useApiUrl();
const { vtFetch } = useVtFetch();
const config = useRuntimeConfig();
const route = useRoute();

const vapidKey = config.public.vapidKey;

const notificationsEnabled = ref(false);
const notificationsBtnDisabled = ref(false);
const notificationsSupported = ref(true);

const currentPage = computed(() => {
  if (route.query.page) {
    return parseInt(route.query.page.toString());
  }
  return 1;
});

const {
  data: subscriptions,
  pending,
  error,
  refresh
} = useGetUserSubscriptions({
  currentPage
});

const videos = computed(() => subscriptions.value?.videos ?? []);
const pageCount = computed(() => Math.ceil((subscriptions.value?.videoCount ?? 30) / 30));
const hasNoSubscriptions = computed(() => {
  return !getOrderedVideoSections() || getOrderedVideoSections().length <= 0;
});
const lastRefreshTime = computed(() => subscriptions.value?.lastRefresh ?? 0);

watch(error, err => {
  messagesStore.createMessage({
    type: 'error',
    title: 'Error loading subscription feed',
    message: err?.message ?? 'Error loading subscription feed'
  });
});

const getOrderedVideoSections = (): Array<any> => {
  const orderedArray = [];
  let i = 0;
  videos.value.forEach(video => {
    let sectionMessage = 'Older videos';
    const now = new Date();
    if (video.published > now.valueOf() - 604800000) {
      sectionMessage = 'Last 7 days';
    }
    if (video.published > now.valueOf() - 172800000) {
      sectionMessage = 'Yesterday';
    }
    if (video.published > now.valueOf() - 86400000) {
      sectionMessage = 'Today';
    }
    const possibleIndex = orderedArray.findIndex(el => el.sectionMessage === sectionMessage);
    if (possibleIndex !== -1) {
      orderedArray[possibleIndex].videos.push(video);
    } else {
      orderedArray.push({ sectionMessage, videos: [video], id: i++ });
    }
  });
  return orderedArray;
};

const subscribeToNotifications = (val: any) => {
  if (!('serviceWorker' in navigator)) return;

  navigator.serviceWorker.getRegistrations().then(registrations => {
    const worker = registrations[0];

    if (val) {
      worker.pushManager
        .subscribe({
          userVisibleOnly: true,
          applicationServerKey: vapidKey
        })
        .then(subscription => {
          vtFetch(`${apiUrl.value}user/notifications/subscribe`, {
            method: 'POST',
            body: subscription,
            credentials: 'include'
          }).then(() => {
            notificationsEnabled.value = true;
          });
        })
        .catch(err => {
          notificationsEnabled.value = false;
          notificationsBtnDisabled.value = true;
          messagesStore.createMessage({
            type: 'error',
            title: 'Error subscribing to notifications',
            message: err.message
          });
        });
    } else {
      worker.pushManager.getSubscription().then((subscription: PushSubscription) => {
        if (subscription) {
          subscription.unsubscribe();
        }
        notificationsEnabled.value = false;
      });
    }
  });
};
const getNotificationStatus = () => {
  if (notificationsBtnDisabled.value && notificationsEnabled.value) {
    return 'Notifications are enabled';
  } else if (notificationsSupported.value) {
    return 'Notifications are not supported';
  } else if (!notificationsBtnDisabled.value && !notificationsEnabled.value) {
    return 'Notifications are disabled';
  }
};

onMounted(() => {
  if (vapidKey && 'serviceWorker' in navigator) {
    navigator.serviceWorker
      .getRegistrations()
      .then(registrations => {
        const worker = registrations[0];
        if (worker) {
          worker.pushManager
            .permissionState({
              userVisibleOnly: true,
              applicationServerKey: vapidKey
            })
            .then(permissionState => {
              if (permissionState === 'granted') {
                notificationsEnabled.value = true;
              } else if (permissionState === 'denied') {
                notificationsEnabled.value = false;
                notificationsBtnDisabled.value = true;
              }
            });
        } else {
          notificationsEnabled.value = false;
          notificationsBtnDisabled.value = true;
        }
      })
      .catch(err => {
        messagesStore.createMessage({
          type: 'error',
          title: 'Error loading notification worker',
          message: err.message
        });
      });
  } else {
    notificationsSupported.value = false;
    notificationsBtnDisabled.value = true;
  }
});

watch(
  () => route.query,
  () => {
    refresh();
  }
);

const nextRefresh = computed(() => {
  if (lastRefreshTime.value == 0) return 0;

  const nextRefreshDate = new Date(lastRefreshTime.value);
  nextRefreshDate.setMinutes(nextRefreshDate.getMinutes() + subscriptions.value.refreshInterval);

  return Math.round((+nextRefreshDate - Date.now()) / 6e4);
});
</script>

<template>
  <div class="subscriptions" :class="{ empty: hasNoSubscriptions, loading: pending }">
    <MetaPageHead title="Subscriptions" description="See your subscription feed" />
    <Spinner v-if="pending" class="centered" />
    <div class="subscribe-info-container">
      <div class="subscribe-info">
        <div class="info">
          <h2>Subscription feed for {{ userStore.username }}</h2>
          <p v-if="lastRefreshTime">
            Last refresh: {{ new Date(lastRefreshTime).toLocaleString('en-US') }}
          </p>
          <p>Next refresh in {{ nextRefresh }} minute{{ nextRefresh === 1 ? '' : 's' }}</p>
        </div>
        <div class="actions">
          <BadgeButton
            class="manage-subscriptions-btn"
            :href="'/subscriptions/manage'"
            :internal-link="true"
          >
            <VTIcon name="mdi:pencil-box-multiple-outline" />
            <p>Manage</p>
          </BadgeButton>
          <SwitchButton
            v-tippy="getNotificationStatus"
            :value="notificationsEnabled"
            :label="'Enable notifications'"
            :disabled="notificationsBtnDisabled"
            :btn-id="'index-btn-1'"
            @valuechange="subscribeToNotifications"
          />
        </div>
      </div>
    </div>
    <div v-if="hasNoSubscriptions && !pending" class="no-subscriptions links">
      <VTIcon name="mdi:youtube-subscription" />
      <p>
        No subscriptions yet. Subscribe to a channel to see their latest uploads or import existing
        ones on the <nuxt-link to="/subscriptions/manage">manage</nuxt-link> page.
      </p>
    </div>
    <div class="subscription-videos-container">
      <div
        v-for="(videoSection, index) in getOrderedVideoSections()"
        :key="index"
        class="subscription-section"
      >
        <SectionTitle :title="videoSection.sectionMessage" />
        <div class="section-videos-container">
          <VideoEntry
            v-for="video in videoSection.videos"
            :key="video.videoId"
            :video="video"
            :lazy="false"
          />
        </div>
      </div>
    </div>
    <div
      v-if="getOrderedVideoSections() && getOrderedVideoSections().length > 0"
      class="feed-pagination"
    >
      <Pagination :current-page="currentPage" :page-count="pageCount" />
    </div>
  </div>
</template>

<style lang="scss">
.subscriptions {
  margin-top: variables.$header-height;

  .spinner {
    z-index: 11;
  }

  &.empty,
  &.loading {
    height: calc(100vh - variables.$header-height);
  }
  .section-title {
    width: 100%;
    max-width: variables.$main-width;
    margin: 0 auto;
    padding: 0 10px;
    box-sizing: border-box;

    .manage-btn-container {
      width: auto;
      position: absolute;
      right: 0;
      z-index: 11;
      height: 80px;
      display: grid;
      padding: 0 15px 0 0;
      display: flex;
      flex-direction: row;

      .badge-btn {
        margin: auto auto auto 10px;
      }
    }
  }

  .subscribe-info-container {
    position: relative;
    width: 100%;
    max-width: variables.$main-width;
    margin: 30px auto 0 auto;
    padding: 0 10px;
    z-index: 11;
    box-sizing: border-box;

    .subscribe-info {
      display: flex;
      flex-direction: row;
      padding: 15px;
      box-sizing: border-box;
      background: var(--bgcolor-alt);
      justify-content: space-between;
      border-radius: 5px;
      box-shadow: variables.$medium-shadow;
      box-sizing: border-box;

      @media screen and (max-width: 1000px) {
        flex-direction: column;

        .actions {
          margin: 10px 0 0 0;
        }
      }

      .info {
        display: flex;
        flex-direction: column;
      }

      .actions {
        display: flex;
        flex-direction: row;
        align-items: flex-start;

        @media screen and (max-width: variables.$mobile-width) {
          flex-direction: column;
        }

        .switch {
          margin: 5px 0 0 0 !important;
        }
      }
    }
  }

  .no-subscriptions {
    margin: 25px 0 0 0;
    display: grid;
    justify-items: center;
    gap: 5px;
  }

  .subscription-videos-container {
    .subscription-section {
      .section-videos-container {
        width: 100%;
        max-width: variables.$main-width;
        margin: 0 auto;
        padding: 0 10px;
        box-sizing: border-box;
        z-index: 10;
        @include mixins.viewtube-grid;

        @media screen and (max-width: variables.$mobile-width) {
          flex-direction: column;
        }
      }
    }
  }

  .feed-pagination {
    display: block;
    position: relative;
    z-index: 11;
    margin: 20px 0 30px 0;
  }
}
</style>
