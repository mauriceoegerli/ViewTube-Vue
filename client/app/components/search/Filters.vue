<script setup lang="ts">
defineProps<{
  disabled: boolean;
}>();

const route = useRoute();
// const router = useRouter();

const searchValue = ref('');

const refreshQuery = () => {
  if (route.query.search_query) {
    searchValue.value = route.query.search_query as string;
  }
};

watch(() => route.query, refreshQuery);

// const onFilterApply = (e: { target: HTMLFormElement }) => {
//   const formData = new FormData(e.target);
//   // FormData in URLSearchParams is supported in all major browsers
//   const searchParams = new URLSearchParams(formData as any);
//   const queryString = searchParams.toString();
//   router.push(`/results?${queryString}`);
// };

const getFilterUrl = (filterType: string, filterValue: string): string => {
  const newUrlParams = new URLSearchParams(route.query as any);

  if (filterType === 'features') {
    const existingFeatures = newUrlParams.get('features');
    if (existingFeatures) {
      const features = existingFeatures.split(',');

      if (features.includes(filterValue)) {
        features.splice(features.indexOf(filterValue), 1);
      } else {
        features.push(filterValue);
      }

      if (features.length > 0) {
        newUrlParams.set('features', features.join(','));
      } else {
        newUrlParams.delete('features');
      }
    } else {
      newUrlParams.set('features', filterValue);
    }
  } else {
    newUrlParams.set(filterType, filterValue);
  }

  return `/results?${newUrlParams.toString()}`;
};

const isDisabled = (filterValue: string): boolean => {
  const urlSearchParams = new URLSearchParams(route.query as any);
  if (
    urlSearchParams.get('Upload date') ||
    urlSearchParams.get('Features') ||
    urlSearchParams.get('Duration')
  ) {
    if (filterValue === 'Channel' || filterValue === 'Playlist' || filterValue === 'Show') {
      return true;
    }
  }
  if (urlSearchParams.get('Type') === 'Channel') {
    if (
      filterValue !== 'Relevance' &&
      filterValue !== 'Upload date' &&
      filterValue !== 'View count' &&
      filterValue !== 'Rating' &&
      filterValue !== 'Channel'
    ) {
      return true;
    } else {
      return false;
    }
  }
  return false;
};

const isChecked = (filterType: string, filterValue: string) => {
  const urlSearchParams = new URLSearchParams(route.query as any);
  if (filterType === 'features') {
    const existingFeatures = urlSearchParams.get('features');
    if (existingFeatures) {
      const features = existingFeatures.split(',');
      if (features.includes(filterValue)) {
        return true;
      }
    }
  } else {
    if (urlSearchParams.get(filterType) === filterValue) {
      return true;
    }
  }
  return false;
};

refreshQuery();
</script>

<template>
  <div class="filters">
    <details class="filter-details">
      <summary class="filter-summary">Filters</summary>
      <div class="filter-form">
        <div v-for="(filter, i) in searchFilters" :key="i" class="filter">
          <p class="filter-title">{{ filter.title }}</p>
          <nuxt-link
            v-for="(filterValue, index) in filter.values"
            :key="index"
            :to="getFilterUrl(filter.type, filterValue.name)"
            class="filter-value"
            :class="{ disabled: isDisabled(filterValue.name) || disabled }"
          >
            <label class="radio-container">
              <input
                :id="`${index}-${i}`"
                :type="filter.multiple ? 'checkbox' : 'radio'"
                :name="filter.type"
                :value="filterValue.name"
                :checked="isChecked(filter.type, filterValue.name)"
              />
              <label
                v-tippy="filterValue.description"
                class="check"
                :class="{ multiple: filter.multiple }"
                :for="`${index}-${i}`"
              />
              <p>{{ filterValue.description }}</p>
            </label>
          </nuxt-link>
        </div>
        <div class="control-btns">
          <nuxt-link :to="`/results?search_query=${searchValue}`" class="reset-btn btn"
            ><VTIcon name="mdi:undo" />Reset</nuxt-link
          >
        </div>
      </div>
    </details>
  </div>
</template>

<style lang="scss">
.filters {
  z-index: 11;

  .filter-details {
    width: 100%;

    .filter-summary {
      margin: 0;
      cursor: pointer;
      font-weight: bold;
    }

    .filter-form {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      position: relative;
      padding: 15px 0 45px 0;

      @media screen and (max-width: variables.$mobile-width) {
        flex-wrap: wrap;

        .filter {
          margin: 0 20px 15px 0;
        }
      }

      #search-query {
        display: none;
      }

      .control-btns {
        position: absolute;
        top: 5px;
        left: 0;

        .btn {
          text-decoration: none;
          color: var(--title-color);
          margin: 2px 5px 2px 0;
          display: inline-block;
          width: auto;
          white-space: nowrap;
          cursor: pointer;
          border: none;
          box-shadow: none;

          &::after {
            border-bottom: 2px solid transparent;
          }

          &:focus {
            &::after {
              box-shadow: none;
              border: none;
              border-bottom: 2px solid var(--title-color);
              border-radius: 0;
              left: 0;
              width: 100%;
            }
          }

          .vt-icon {
            width: 20px;
            height: 20px;
            position: relative;
            top: 2px;
          }
        }
      }

      .filter {
        margin: 30px 0 0 0;

        .filter-title {
          font-weight: bold;
        }
        .filter-value {
          margin: 6px 0;
          position: relative;
          display: block;

          &.disabled {
            pointer-events: none;
            filter: grayscale(0);
            opacity: 0.6;
          }

          .radio-container {
            display: block;
            position: relative;
            padding: 0 0 0 25px;
            cursor: pointer;
            pointer-events: none;
            user-select: none;

            input {
              position: absolute;
              opacity: 0;
              cursor: pointer;
              pointer-events: none;
            }

            p {
              transition: color 300ms variables.$intro-easing;
            }

            input:checked ~ p {
              color: var(--theme-color);
            }

            input:checked ~ .check {
              border: solid 3px var(--theme-color);
              background-color: var(--theme-color);
            }

            .check {
              position: absolute;
              top: 2px;
              left: 0;
              height: 14px;
              width: 14px;
              border: solid 3px var(--subtitle-color);
              border-radius: 50%;
              transition:
                border 300ms variables.$intro-easing,
                background-color 300ms variables.$intro-easing;

              &.multiple {
                border-radius: 3px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
