<script setup lang="ts">
import 'vue-datepicker-next/index.css';
import SectionTitle from '~/components/SectionTitle.vue';
import Pagination from '~/components/pagination/Pagination.vue';
import HistoryList from '~/components/history/HistoryList.vue';
import BadgeButton from '~/components/buttons/BadgeButton.vue';
import SmallSearchBox from '~/components/SmallSearchBox.vue';
import Confirmation from '~/components/popup/Confirmation.vue';
import { useMessagesStore } from '~/store/messages';
import { useSettingsStore } from '~/store/settings';
import { useUserStore } from '~/store/user';

const router = useRouter();
const messagesStore = useMessagesStore();
const settingsStore = useSettingsStore();
const userStore = useUserStore();
const { apiUrl } = useApiUrl();
const route = useRoute();
const { vtFetch } = useVtFetch();

const searchTerm = ref<string>(null);
const searchTimeout = ref(null);
const deletePopup = ref(false);
const dateToDelete = ref<[Date, Date]>(null);

const pageCount = computed(() => {
  if (history.value) {
    return Math.ceil(history.value.videoCount / 30);
  }
  return 0;
});

const currentPage = computed(() => {
  if (!isNaN(parseInt(route.query.page as string))) {
    return parseInt(route.query.page as string);
  }
  return 1;
});

const deleteRange = async () => {
  if (!rangeSelected.value) return;
  
  const firstDate = new Date(dateToDelete.value[0]).valueOf();
  const secondDate = new Date(dateToDelete.value[1]).valueOf();
  await vtFetch(`${apiUrl.value}user/history/from/${firstDate}/to/${secondDate}`, {
    method: 'DELETE',
    credentials: 'include'
  })
    .then(() => {
      refresh();
    })
    .catch(() => {
      messagesStore.createMessage({
        type: 'error',
        title: 'Error deleting history range',
        message: 'Try specifying the range again'
      });
    });
};

const deleteEntireHistory = async () => {
  deletePopup.value = false;
  await vtFetch(`${apiUrl.value}user/history/`, {
    method: 'DELETE',
    credentials: 'include'
  })
    .then(() => {
      refresh();
    })
    .catch(() => {
      messagesStore.createMessage({
        type: 'error',
        title: 'Error deleting history',
        message: 'Try logging out and in again'
      });
    });
};

const rangeSelected = computed(() => {
  return (
    dateToDelete.value &&
    dateToDelete.value.length === 2 &&
    dateToDelete.value[0] !== null &&
    dateToDelete.value[1] !== null
  );
});

if (!userStore.isLoggedIn) {
  router.push('/login');
}

const {
  data: history,
  refresh,
  error
} = useGetUserHistory({
  limit: 30,
  searchTerm: searchTerm.value,
  start: (currentPage.value - 1) * 30
});

watch(error, newValue => {
  if (newValue) {
    messagesStore.createMessage({
      type: 'error',
      title: 'Error loading history',
      message: 'Try logging out and in again'
    });
  }
});

watch(searchTerm, (newVal, oldVal): void => {
  if (searchTimeout.value) clearTimeout(searchTimeout.value);
  searchTimeout.value = setTimeout(() => {
    if (newVal !== null && newVal !== oldVal) {
      refresh();
    }
  }, 400);
});

watch(
  () => route.query,
  () => {
    refresh();
  }
);
</script>

<template>
  <div class="history">
    <MetaPageHead title="History" description="See your watch history" />
    <SectionTitle class="history-title" :title="'History'" />
    <SmallSearchBox v-model="searchTerm" :label="'Filter'" />
    <details v-if="history" class="delete-history">
      <summary>Delete history</summary>
      <div class="range">
        <LazyDatePicker v-model="dateToDelete" />
        <BadgeButton :click="deleteRange" :disabled="!rangeSelected">Delete range</BadgeButton>
        <BadgeButton :click="() => (deletePopup = true)">Delete entire history</BadgeButton>
      </div>
    </details>
    <div v-if="history && !settingsStore.saveVideoHistory" class="no-history">
      <VTIcon name="mdi:restart-off" />
      <p>Video history is disabled. You can enable it in settings.</p>
    </div>
    <HistoryList
      v-if="history"
      class="history-main-list"
      :history-videos="history.videos"
      :delete-option="true"
      @refresh="refresh"
    />
    <div v-if="history" class="history-pagination">
      <Pagination :current-page="currentPage" :page-count="pageCount" />
    </div>
    <Teleport to="body">
      <transition name="popup">
        <Confirmation
          v-if="deletePopup"
          :title="'Delete history'"
          :message="'Do you want to delete your entire history?'"
          @close="() => (deletePopup = false)"
        >
          <BadgeButton :click="() => (deletePopup = false)">Cancel</BadgeButton>
          <BadgeButton :click="() => deleteEntireHistory()">OK</BadgeButton>
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

.history {
  width: 100%;
  max-width: 800px;
  padding-top: variables.$header-height;
  margin: 0 auto;
  overflow: hidden;

  .history-title {
    margin: 0 15px;
  }

  .delete-history {
    margin: 10px 15px 5px 15px;
    width: 100%;

    .range {
      display: flex;
      flex-direction: row;

      .badge-btn {
        margin: 0 0 0 5px;
      }
    }

    summary {
      cursor: pointer;
      margin: 0 0 5px 0;
    }
  }

  .no-history {
    margin: 20px 0;
    position: relative;
    width: 100%;
    text-align: center;
  }

  .history-main-list {
    margin: 15px;
  }
}
</style>

<style lang="scss">
.mx-input {
  // all: unset;
  cursor: pointer;
  border: 2px solid var(--theme-color-translucent);
  border-radius: 3px;
  padding: 2px 4px;
  text-align: center;
  background: var(--bgcolor-main);
  color: var(--title-color);

  &:hover,
  &:focus {
    border: 2px solid var(--theme-color);
  }
}

.mx-calendar + .mx-calendar {
  border-left: 1px solid #e8e8e831;
}

.mx-icon-calendar,
.mx-icon-clear {
  color: var(--theme-color) !important;
}

.mx-datepicker-main {
  color: var(--theme-color) !important;
  background-color: var(--bgcolor-alt) !important;
  border: none !important;
  border-radius: 10px;
  box-shadow: variables.$medium-shadow;

  .mx-btn {
    &:hover {
      color: var(--theme-color);
    }
  }

  .cell {
    border: 2px solid transparent;
    box-sizing: border-box;

    &:not(.not-current-month) {
      color: var(--title-color) !important;
      background-color: inherit !important;
    }
    &:hover {
      border: 2px solid var(--theme-color);
    }

    &.not-current-month {
      color: var(--subtitle-color-light);
    }

    &.hover-in-range,
    &.in-range {
      background-color: var(--theme-color-translucent) !important;
    }

    &.in-range {
      background-color: var(--theme-color-translucent) !important;
    }

    &.hover-active,
    &.active {
      background-color: var(--theme-color) !important;
    }
  }
}
</style>
