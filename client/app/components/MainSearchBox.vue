<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const { vtFetch } = useVtFetch();
const { apiUrl } = useApiUrl();

const searchFieldFocused = ref(false);
const localSearchValue = ref('');
const searchValue = ref('');
const autocompleteVisible = ref(false);
const autocompleteSelectedValue = ref(0);
const searchFieldRef = ref(null);
const autocompleteValues = ref([]);

const updateSearchValueFromUrl = () => {
  if (route.query.search_query) {
    searchValue.value = route.query.search_query as string;
    if (import.meta.server) {
      localSearchValue.value = route.query.search_query as string;
    }
  } else {
    searchValue.value = '';
  }
};

const onAutocompleteUpdate = (value: string) => {
  searchValue.value = value;
};
const onSearchFieldChange = (e: any) => {
  searchValue.value = e.target.value;
};
const onSearchFieldFocused = () => {
  autocompleteVisible.value = true;
  searchFieldFocused.value = true;
};
const onSearchFieldBlur = () => {
  autocompleteVisible.value = false;
  searchFieldFocused.value = false;
};
const onAutocompleteEnter = () => {
  searchRedirect(searchValue.value);
};
const onSearchFormSubmit = () => {
  if (
    searchValue.value &&
    searchValue.value.length > 0 &&
    localSearchValue.value &&
    localSearchValue.value.length > 0
  ) {
    searchValue.value = localSearchValue.value;
    searchRedirect(searchValue.value);
  }
};

const onAutocompleteSelectedValueUpdate = (value: number) => {
  autocompleteSelectedValue.value = value;
};

const onSearchFieldKeydown = (e: any) => {
  switch (e.key) {
    case 'ArrowDown':
      if (autocompleteSelectedValue.value + 2 <= autocompleteValues.value.length) {
        autocompleteSelectedValue.value += 1;
      } else {
        autocompleteSelectedValue.value = 0;
      }
      localSearchValue.value = autocompleteValues.value[autocompleteSelectedValue.value];
      break;
    case 'ArrowUp':
      if (autocompleteSelectedValue.value - 1 >= 0) {
        autocompleteSelectedValue.value -= 1;
      } else {
        autocompleteSelectedValue.value = autocompleteValues.value.length - 1;
      }
      localSearchValue.value = autocompleteValues.value[autocompleteSelectedValue.value];
      break;
  }
  e.stopPropagation();
  return true;
};
const onSearchButton = () => {
  if (searchValue.value) {
    searchRedirect(searchValue.value);
  }
};
const searchRedirect = (searchValue: string) => {
  router.push(`/results?search_query=${searchValue}`);
  searchFieldRef.value.blur();
};

watch(searchValue, async () => {
  const autocompleteResponse = await vtFetch<[]>(
    `${apiUrl.value}autocomplete?q=${searchValue.value}`
  );

  autocompleteValues.value = [searchValue.value].concat(autocompleteResponse);
});

watch(
  () => route.query,
  () => {
    updateSearchValueFromUrl();
  }
);

watch(searchValue, newValue => {
  localSearchValue.value = newValue;
});

updateSearchValueFromUrl();
</script>

<template>
  <div
    class="search-box"
    :class="{
      focused: searchFieldFocused,
      'has-text': localSearchValue && localSearchValue.length > 0
    }"
  >
    <form action="/results" method="get" class="search-form" @submit.prevent="onSearchFormSubmit">
      <input
        id="search"
        ref="searchFieldRef"
        type="text"
        name="search"
        autocomplete="off"
        :value="localSearchValue"
        @focus="onSearchFieldFocused"
        @blur="onSearchFieldBlur"
        @keydown="onSearchFieldKeydown"
        @input="onSearchFieldChange"
      />
      <label class="search-label" for="search">search</label>
    </form>
    <nuxt-link
      v-ripple
      v-tippy="'Click or press enter to search'"
      :to="`/results?search_query=${searchValue}`"
      class="search-btn tooltip"
      @click.self.prevent="onSearchButton"
    >
      <VTIcon name="mdi:magnify" />
    </nuxt-link>
    <span class="search-line-bottom line" />
    <SearchAutocomplete
      v-if="autocompleteVisible"
      :search-value="searchValue"
      :selected-value="autocompleteSelectedValue"
      :autocomplete-values="autocompleteValues"
      @search-value-update="onAutocompleteUpdate"
      @autocomplete-enter="onAutocompleteEnter"
      @selected-value-update="onAutocompleteSelectedValueUpdate"
    />
  </div>
</template>

<style lang="scss" scoped>
.search-box {
  display: flex;
  flex-direction: row;
  height: 32px;
  margin: auto;
  width: 100%;
  max-width: variables.$search-box-width;
  justify-content: flex-end;
  position: relative;
  border-radius: 3px;
  background-color: var(--bgcolor-translucent);
  transition: background-color 300ms variables.$intro-easing;
  z-index: +1;

  .search-btn {
    text-decoration: none;
    color: var(--subtitle-color);
    transition: color 300ms variables.$intro-easing;
    width: 50px;
    text-align: center;
    display: flex;
    user-select: none;

    .vt-icon {
      margin: auto;
      left: -3px !important;
      display: flex;
    }
  }

  .search-form {
    position: relative;
    left: 0;
    width: 100%;

    .search-label {
      position: absolute;
      left: 0;
      top: 0;
      line-height: 32px;
      text-align: center;
      pointer-events: none;
      user-select: none;
      transition:
        opacity 300ms variables.$intro-easing,
        transform 300ms variables.$intro-easing;
      margin: 0 0 0 10px;
      color: var(--subtitle-color-light);
    }

    #search {
      all: unset;
      width: 100%;
      height: 100%;
      border: none;
      color: var(--title-color);
      font-size: 1rem;
      margin: 0 0 0 10px;
      min-width: 0px;
      visibility: visible;
      background-color: transparent;
      position: relative;

      &:target {
        all: unset;
      }

      &:focus {
        outline: none;
      }
    }
    #search:focus + .search-label {
      opacity: 0;
      transform: translateX(10px);
    }
  }

  &.focused,
  &.has-text {
    .search-label {
      opacity: 0;
      transform: translateX(10px);
    }
  }
  &.focused {
    .line {
      transform: scale(1);
    }
  }

  .line {
    position: absolute;
    background-color: var(--theme-color);
    height: 1.5px;
    width: 1.5px;
    transform: scale(0);
    transition: transform 300ms variables.$intro-easing;
  }

  .search-line-bottom {
    bottom: 0;
    left: 0;
    width: 100%;
    transform-origin: left;
  }
}
</style>
