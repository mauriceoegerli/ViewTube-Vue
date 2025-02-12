<script setup lang="ts">
import RelatedSearches from '~/components/search/RelatedSearches.vue';
import Spinner from '~/components/Spinner.vue';
import Filters from '~/components/search/Filters.vue';
import SeparatorSmall from '~/components/list/SeparatorSmall.vue';
import BadgeButton from '~/components/buttons/BadgeButton.vue';
import { useMessagesStore } from '~/store/messages';
import { useSettingsStore } from '~/store/settings';
import type { ApiDto } from '@viewtube/shared';

const VideoEntry = resolveComponent('ListVideoEntry');
const PlaylistEntry = resolveComponent('ListPlaylistEntry');
const MovieEntry = resolveComponent('ListMovieEntry');
const ChannelEntry = resolveComponent('ListChannelEntry');
const Shelf = resolveComponent('SearchShelf');

const route = useRoute();
const messagesStore = useMessagesStore();
const settingsStore = useSettingsStore();
const { vtFetch } = useVtFetch();
const { apiUrl } = useApiUrl();

const searchQuery = computed(() => {
  const searchParams = new URLSearchParams(route.query as Record<string, string>);
  return searchParams.get('search_query') || searchParams.get('q');
});

const { data: searchData, pending, error } = useGetSearchResult();

onMounted(() => {
  if (route.query.search_query?.length <= 0) {
    messagesStore.createMessage({
      type: 'error',
      title: 'Search term empty',
      message: 'Please enter a search term',
      dismissDelay: 0
    });
  }
});

const additionalResultItems = ref([]);
const searchContinuationData = ref<any>(searchData.value?.continuation);

watch(
  () => searchData.value,
  newData => {
    additionalResultItems.value = [];
    searchContinuationData.value = newData?.continuation;
  }
);

watch(error, newValue => {
  if (newValue) {
    messagesStore.createMessage({
      type: 'error',
      title: 'Search failed',
      message: 'Refresh the page to try again',
      dismissDelay: 0
    });
  }
});

const getListEntryType = (type: string) => {
  if (type === 'shorts-shelf' && settingsStore.hideShortsFromSearch) return null;

  switch (type) {
    case 'video':
      return VideoEntry;
    case 'playlist':
      return PlaylistEntry;
    case 'channel':
      return ChannelEntry;
    case 'movie':
      return MovieEntry;
    case 'shelf':
      return Shelf;
    case 'shorts-shelf':
      return Shelf;
    default:
      return null;
  }
};

const moreVideosLoading = ref(false);
const page = ref(1);

const loadMoreVideos = async () => {
  moreVideosLoading.value = true;
  page.value += 1;

  if (searchData.value && searchContinuationData.value) {
    try {
      const searchContinuation = await vtFetch<ApiDto<'VTSearchDto'>>(`${apiUrl.value}search`, {
        query: {
          q: searchQuery.value,
          filters: getSearchFilters(route.query),
          continuationString: searchContinuationData.value
        }
      });

      if (searchContinuation) {
        additionalResultItems.value = [
          ...additionalResultItems.value,
          ...searchContinuation.results
        ];
        searchContinuationData.value = searchContinuation.continuation;
      }
    } catch (error) {
      messagesStore.createMessage({
        type: 'error',
        title: 'Unable to load more results',
        message: 'Try again or use a different search term for more results'
      });
    }
  } else {
    messagesStore.createMessage({
      type: 'error',
      title: 'Unable to load more results',
      message: 'Use a different search term for more results'
    });
  }
  moreVideosLoading.value = false;
};
</script>

<template>
  <div class="search" :class="{ loading: pending }">
    <MetaPageHead :title="searchQuery" description="Search for videos, channels and playlists" />
    <Spinner v-if="pending" class="centered search-spinner" />
    <Filters :disabled="pending" />
    <p v-if="!pending && searchData" class="result-amount">
      {{ searchData?.estimatedResultCount?.toLocaleString('en-US') ?? 0 }} results
    </p>
    <div v-if="!pending && searchData" class="search-results">
      <div
        v-if="searchData.refinements && searchData.refinements.length"
        class="search-refinements"
      >
        <RelatedSearches :refinements="searchData.refinements" />
      </div>
      <div v-if="searchData.results" class="search-videos-container">
        <component
          :is="getListEntryType(result?.type)"
          v-for="(result, i) in searchData.results"
          :key="i"
          :video="result"
          :channel="result"
          :playlist="result"
          :mix="result"
          :movie="result"
          :shelf="result"
          :horizontal="true"
          :lazy="true"
        />
      </div>
      <SeparatorSmall v-if="!pending && additionalResultItems.length > 0"
        >More results</SeparatorSmall
      >
      <div v-if="!pending && additionalResultItems.length > 0" class="search-videos-container">
        <component
          :is="getListEntryType(result.type)"
          v-for="(result, i) in additionalResultItems"
          :key="i"
          :video="result"
          :channel="result"
          :playlist="result"
          :mix="result"
          :shelf="result"
          :horizontal="true"
          :lazy="true"
        />
      </div>
      <div v-if="searchContinuationData" class="show-more-btn-container">
        <BadgeButton :click="loadMoreVideos" :loading="moreVideosLoading">
          <VTIcon name="mdi:reload" />
          <p>Show more</p>
        </BadgeButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.search {
  margin-top: variables.$header-height;
  display: flex;
  flex-direction: column;

  &.loading {
    height: 100vh;
  }

  .search-spinner {
    z-index: 11;
  }

  .filters {
    width: 100%;
    max-width: variables.$main-width;
    padding: 15px 15px 0 15px;
    margin: 0 auto;
    box-sizing: border-box;
    display: flex;

    .dropdown-btn {
      z-index: 20;
      margin: 0 10px 0 0;
    }
  }

  .result-amount {
    margin: 10px auto;
    color: var(--subtitle-color);
  }

  .correction-results,
  .result-amount {
    z-index: 10;
    width: 100%;
    max-width: variables.$main-width;
    padding: 0 15px;
    box-sizing: border-box;
  }

  .correction-results {
    margin: 0 auto 10px auto;
  }

  .search-results {
    .search-refinements {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: variables.$main-width;
      margin: 0 auto 10px auto;
      padding: 0 15px;
      box-sizing: border-box;
    }
  }

  .search-videos-container {
    width: 100%;
    max-width: variables.$main-width;
    margin: 0 auto;
    padding: 0 15px;
    z-index: 10;
    display: grid;
    box-sizing: border-box;
    display: grid;
    @include mixins.viewtube-grid;

    .section-title {
      grid-column: 1 / -1;
      gap: 0;
    }
    .related-searches-container {
      grid-row: 1;
      grid-column: 1 / -1;
    }
    .channels {
      height: 100%;
      grid-column: 1;
      position: sticky;
      top: 0;

      margin: 80px 0 0 0;

      .channel-entry {
        padding: 0;
      }
    }
    .shelf {
      grid-column-start: 1;
      grid-column-end: -1;
    }
    .channel-entry {
      grid-column-start: 1;
      grid-column-end: -1;
    }
  }

  .show-more-btn-container {
    display: flex;
    width: 100%;
    padding: 20px 0 20px 0;

    > a {
      margin: 0 auto;
    }
  }
}
</style>
