<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';

definePageMeta({
  name: 'channel',
  path: '/channel/:id(.*)',
  alias: ['/:id(@.*)']
});

const route = useRoute();

const channelId = computed(() => route.params.id?.toString()?.split('/')?.[0] ?? null);

const { data: channelInfo, pending } = useGetChannelInfo(channelId);

const { jsEnabled } = useJsEnabled();

const {
  pages,
  currentPage,
  currentPageIndex,
  changePage,
  swipeContainerRef,
  onSwiperInstance,
  loadedPages
} = useChannelPages();
</script>

<template>
  <div class="channel">
    <Spinner v-if="pending && !channelInfo" class="centered" />
    <MetaPageHead
      :title="`${channelInfo?.author}`"
      :description="`${channelInfo?.description?.substring(0, 100)}`"
      :image="`${channelInfo?.authorThumbnails?.[0]?.url}`"
    />
    <ChannelBannerSection
      v-if="channelInfo"
      :channel-info="channelInfo"
      :pages="pages"
      :current-page="currentPage"
      @change-page="changePage"
    />
    <div v-if="!jsEnabled" class="channel-pages-container">
      <ChannelPageHome v-if="currentPage === 'home'" />
      <ChannelPageVideos v-if="currentPage === 'videos'" />
      <ChannelPageShorts v-if="currentPage === 'shorts'" />
      <ChannelPageLive v-if="currentPage === 'live'" />
      <ChannelPagePlaylists v-if="currentPage === 'playlists'" />
      <ChannelPageCommunity v-if="currentPage === 'community'" />
      <ChannelPageChannels v-if="currentPage === 'channels'" />
    </div>
    <swiper
      v-if="jsEnabled && channelInfo"
      ref="swipeContainerRef"
      class="channel-pages-container"
      :simulate-touch="false"
      :initial-slide="currentPageIndex"
      :resistance-ratio="0"
      @swiper="onSwiperInstance"
    >
      <swiper-slide class="channel-page">
        <ChannelPageHome v-if="loadedPages.includes('home')" />
        <Spinner v-else />
      </swiper-slide>
      <swiper-slide class="channel-page">
        <ChannelPageVideos v-if="loadedPages.includes('videos')" />
        <Spinner v-else />
      </swiper-slide>
      <swiper-slide class="channel-page">
        <ChannelPageShorts v-if="loadedPages.includes('shorts')" />
        <Spinner v-else />
      </swiper-slide>
      <swiper-slide class="channel-page">
        <ChannelPageLive v-if="loadedPages.includes('live')" />
        <Spinner v-else />
      </swiper-slide>
      <swiper-slide class="channel-page">
        <ChannelPagePlaylists v-if="loadedPages.includes('playlists')" />
        <Spinner v-else />
      </swiper-slide>
      <swiper-slide class="channel-page">
        <ChannelPageCommunity v-if="loadedPages.includes('community')" />
        <Spinner v-else />
      </swiper-slide>
      <swiper-slide class="channel-page">
        <ChannelPageChannels v-if="loadedPages.includes('channels')" />
        <Spinner v-else />
      </swiper-slide>
    </swiper>
  </div>
</template>

<style lang="scss" scoped>
.channel {
  margin-top: variables.$header-height;

  .channel-pages-container {
    user-select: auto;
    width: 100%;
    max-width: variables.$main-width;
    margin: 0 auto;

    .channel-page {
      height: 100%;
    }
  }
}
</style>
