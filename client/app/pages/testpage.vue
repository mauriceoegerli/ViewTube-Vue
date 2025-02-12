<script setup lang="ts">
import Pagination from '~/components/pagination/Pagination.vue';

const pageCount = ref(0);

const currentPage = ref(0);
</script>

<template>
  <div class="testpage">
    <label id="page-count-label" for="page-count">Page count</label>
    <input id="page-count" v-model="pageCount" type="number" name="page-count" />

    <label id="current-page-label" for="current-page">Current page</label>
    <input id="current-page" v-model="currentPage" type="number" name="current-page" />
    <Pagination id="pagination" :page-count="pageCount" :current-page="currentPage" />
  </div>
</template>

<style lang="scss" scoped>
.testpage {
  margin-top: variables.$header-height;
  display: grid;
  grid-template:
    'page-count page-count-input' 30px
    'current-page current-page-input' 30px
    'pagination pagination' auto;

  #page-count {
    grid-area: page-count-input;
  }

  #page-count-label {
    grid-area: page-count;
  }

  #current-page {
    grid-area: current-page-input;
  }

  #current-page-label {
    grid-area: current-page;
  }

  #pagination {
    grid-area: pagination;
  }
}
</style>
