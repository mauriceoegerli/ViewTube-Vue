<script setup lang="ts">
import BadgeButton from '~/components/buttons/BadgeButton.vue';
const props = defineProps<{ currentPage: number; pageCount: number }>();

const maxNumber = ref(6);

const largestNumber = computed((): number => {
  return props.pageCount;
});
const pageCountDisplay = computed((): Array<number> => {
  if (props.pageCount <= 1) return [];
  const numArray = [];
  const halfMaxNum = Math.floor(maxNumber.value / 2);
  let numStart = null;
  let numStop = null;
  if (props.currentPage > 0 && props.currentPage <= halfMaxNum) {
    // If the selected page is smaller than half the shown numbers, it always starts at 2
    // [1] (2) (3) (4) (5)
    numStart = 2;
  } else if (props.currentPage + halfMaxNum > props.pageCount) {
    numStart = props.pageCount - maxNumber.value;
  } else {
    numStart = props.currentPage - halfMaxNum;
  }
  numStart = numStart <= 1 ? 2 : numStart;

  if (
    props.currentPage > props.pageCount - maxNumber.value &&
    props.pageCount <= maxNumber.value
  ) {
    numStop = props.pageCount;
  } else if (props.currentPage - numStart < halfMaxNum) {
    numStop = props.currentPage + maxNumber.value - (props.currentPage - numStart);
  } else {
    numStop = props.currentPage + halfMaxNum;
  }
  numStop = numStop >= props.pageCount ? props.pageCount : numStop;

  for (let index = numStart; index < numStop; index++) {
    numArray.push(index);
  }
  return numArray;
});
const displayFirstDots = computed((): boolean => {
  return pageCountDisplay.value[0] > 2
});
const displaySecondDots = computed((): boolean => {
  return (
    pageCountDisplay.value[pageCountDisplay.value.length - 1] !== largestNumber.value - 1 &&
    props.pageCount > 2
  );
});
</script>

<template>
  <div class="pagination">
    <div class="pagination-container">
      <BadgeButton
        v-tippy="'Go to the previous page'"
        :href="`?page=${currentPage - 1}`"
        :internal-link="true"
        :disabled="currentPage <= 1"
      >
        <VTIcon name="mdi:chevron-left" />
      </BadgeButton>
      <div class="number-buttons">
        <BadgeButton
          v-tippy="`Go to page 1`"
          :href="`?page=1`"
          :internal-link="true"
          :selected="currentPage === 1"
          class="number-btn"
          >1</BadgeButton
        >
        <div :class="{ display: displayFirstDots }" class="dots"><p>...</p></div>
        <BadgeButton
          v-for="number in pageCountDisplay"
          :key="number"
          v-tippy="`Go to page ${number}`"
          :href="`?page=${number}`"
          :internal-link="true"
          :selected="currentPage === number"
          class="number-btn"
        >
          {{ number }}
        </BadgeButton>
        <div :class="{ display: displaySecondDots }" class="dots"><p>...</p></div>
        <BadgeButton
          v-if="pageCount > 1"
          v-tippy="`Go to page ${largestNumber}`"
          :href="`?page=${largestNumber}`"
          :internal-link="true"
          :selected="currentPage === pageCount"
          class="number-btn"
        >
          {{ largestNumber }}
        </BadgeButton>
      </div>
      <BadgeButton
        v-tippy="'Go to the next page'"
        :href="`?page=${currentPage + 1}`"
        :internal-link="true"
        :disabled="currentPage >= pageCount"
      >
        <VTIcon name="mdi:chevron-right" />
      </BadgeButton>
    </div>
  </div>
</template>

<style lang="scss">
.pagination {
  display: flex;
  flex-direction: row;

  .pagination-container {
    margin: 0 auto;
    display: flex;
    flex-direction: row;

    .number-buttons {
      margin: 0 10px;
      display: flex;
      flex-direction: row;

      .dots {
        display: block;
        margin: 0;
        width: 0;
        overflow: hidden;
        text-align: center;
        transition:
          width 300ms variables.$intro-easing,
          margin 300ms variables.$intro-easing;

        &.display {
          width: 12px;
          margin: 0 10px 0 5px;
        }

        p {
          line-height: 30px;
          text-align: center;
        }
      }

      .number-btn {
        padding: 0 5px;
      }
    }
  }
}
</style>
