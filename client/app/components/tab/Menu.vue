<script setup lang="ts">
const props = defineProps<{
  pages: Array<{
    title: string;
    link: string;
    pageName: string;
  }>;
  currentPage: string;
}>();

const emit = defineEmits<{
  (event: 'changePage', url: string): void;
}>();

const { jsEnabled } = useJsEnabled();

const pageElementRefs = ref<Array<HTMLElement>>([]);
const tabMenuRef = ref<HTMLElement>(null);

const selectedElement = computed(() => {
  return pageElementRefs.value.find(element => element.dataset.pageName === props.currentPage);
});

const selectedElementPositionX = computed(() => {
  return `${selectedElement.value?.offsetLeft ?? 0}px`;
});

const selectedElementWidth = computed(() => {
  return `${selectedElement.value?.offsetWidth ?? 0}px`;
});

const onPageLinkClick = (pageName: string) => {
  resetPageLinkPull();
  emit('changePage', pageName);
};

watch(
  () => props.currentPage,
  () => updateMenuScrollPosition()
);

const updateMenuScrollPosition = () => {
  const selectedElement = pageElementRefs.value.find(
    element => element.dataset.pageName === props.currentPage
  );
  const offsetLeft = selectedElement?.offsetLeft;
  tabMenuRef.value.scrollTo({ left: offsetLeft, behavior: 'smooth' });
};

onMounted(() => {
  updateMenuScrollPosition();
});

const pullRight = ref(0);
const pullLeft = ref(0);
const onPageLinkMouseOver = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  const pageName = target.dataset.pageName;

  const hoveredPageIndex = props.pages.findIndex(page => page.pageName === pageName);
  const selectedPageIndex = props.pages.findIndex(page => page.pageName === props.currentPage);

  resetPageLinkPull();

  if (!(hoveredPageIndex === selectedPageIndex)) {
    if (hoveredPageIndex > selectedPageIndex) {
      pullRight.value = hoveredPageIndex - selectedPageIndex;
    }
    if (hoveredPageIndex < selectedPageIndex) {
      pullLeft.value = selectedPageIndex - hoveredPageIndex;
    }
  }
};
const resetPageLinkPull = () => {
  pullRight.value = 0;
  pullLeft.value = 0;
};
</script>

<template>
  <div ref="tabMenuRef" class="tab-menu">
    <div
      class="active-selector"
      :class="{ 'pull-left': pullLeft > 0, 'pull-right': pullRight > 0 }"
    />
    <a
      v-for="page in pages"
      :key="page.title"
      ref="pageElementRefs"
      :href="page.link"
      class="tab-link"
      :data-page-name="page.pageName"
      :class="{
        active: page.pageName === currentPage,
        'active-simple': page.pageName === currentPage && !jsEnabled
      }"
      @mousedown="onPageLinkMouseOver"
      @mouseup="resetPageLinkPull"
      @mouseleave="resetPageLinkPull"
      @dragstart.prevent
      @drop.prevent
      @click.prevent="onPageLinkClick(page.pageName)"
    >
      {{ page.title }}
    </a>
  </div>
</template>

<style lang="scss" scoped>
.tab-menu {
  display: flex;
  position: relative;
  overflow-y: hidden;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  .tab-link {
    padding: 0 15px;
    text-decoration: none;
    border-radius: 5px;
    height: 35px;
    line-height: 35px;
    text-align: center;
    user-select: none;

    &.active-simple {
      background-color: var(--bgcolor-alt-light);
      box-shadow: variables.$low-shadow;
    }

    &::after {
      display: none;
    }
  }

  .active-selector {
    position: absolute;
    top: 0;
    left: v-bind(selectedElementPositionX);
    height: 35px;
    width: v-bind(selectedElementWidth);
    border-radius: 5px;
    box-shadow: variables.$low-shadow;
    background-color: var(--bgcolor-alt-light);
    transition:
      left 300ms variables.$intro-easing,
      width 300ms variables.$intro-easing,
      height 150ms variables.$intro-easing,
      top 150ms variables.$intro-easing,
      transform 300ms variables.$intro-easing;

    &.pull-left {
      transform: translateX(v-bind('`-variables.${pullLeft * 3}px`'));
      transition:
        left 300ms variables.$intro-easing,
        width 300ms variables.$intro-easing,
        height 150ms variables.$intro-easing,
        top 150ms variables.$intro-easing,
        transform 600ms variables.$intro-easing;
    }
    &.pull-right {
      transform: translateX(v-bind('`variables.${pullRight * 3}px`'));
      transition:
        left 300ms variables.$intro-easing,
        width 300ms variables.$intro-easing,
        height 150ms variables.$intro-easing,
        top 150ms variables.$intro-easing,
        transform 600ms variables.$intro-easing;
    }
  }
}
</style>
