<script setup lang="ts">
import SubscribeButton from '~/components/buttons/SubscribeButton.vue';
import humanNumber from 'human-number';
import type { ApiDto } from '@viewtube/shared';

const props = defineProps<{
  channelInfo: ApiDto<'ChannelInfoDto'>;
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

const changePage = (pageName: string) => {
  emit('changePage', pageName);
};

const { proxyUrl } = useImgProxy();

const subscriberCount = computed(() => humanNumber(props.channelInfo?.subscriberCount));
</script>

<template>
  <div v-if="channelInfo" class="banner-section">
    <ChannelBanner
      class="channel-banner"
      :src="channelInfo?.authorBanners?.[3]?.url"
      :banner-hq-src="channelInfo?.authorBanners?.[channelInfo?.authorBanners?.length - 1]?.url"
      :fallback="channelInfo?.authorThumbnails?.[2]?.url"
    />
    <div class="info">
      <div class="avatar">
        <img class="avatar-img" :src="proxyUrl(channelInfo?.authorThumbnails?.[2]?.url)" />
      </div>
      <h3 class="title">
        {{ channelInfo?.author }}
      </h3>
      <div class="subscribe">
        <p class="subscribers">{{ subscriberCount }} subscribers</p>
        <SubscribeButton :channel-id="channelInfo.authorId" />
      </div>
      <TabMenu
        class="tab-menu"
        :pages="pages"
        :current-page="currentPage"
        @change-page="changePage"
      />
      <ChannelBannerStats class="banner-stats" :channel-info="channelInfo" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.banner-section {
  position: relative;

  .info {
    width: 100%;
    max-width: variables.$main-width;
    margin: 0 auto;
    padding: 15px;
    display: grid;
    grid-template-areas:
      'avatar title subscribe'
      'menu menu stats';
    grid-template-columns: 100px 1fr 200px;
    grid-template-rows: 50px 1fr;
    gap: 10px 20px;
    box-sizing: border-box;

    @media screen and (max-width: 1000px) {
      padding-bottom: 10px;
      grid-template-areas:
        'avatar avatar'
        'title title'
        'subscribe stats'
        'menu menu';
      grid-template-columns: 1fr;
      grid-template-rows: 50px 1fr 50px 1fr;
      place-items: center;
      gap: 0;

      .avatar {
        height: 150px !important;
        display: grid;
        justify-items: center;
      }

      .tab-menu {
        justify-self: start;
      }

      .subscribe {
        justify-self: center !important;
      }
    }

    &::before {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: var(--bgcolor-alt);
    }

    .avatar {
      z-index: 102;
      grid-area: avatar;
      width: 100%;
      height: 200%;
      pointer-events: none;

      .avatar-img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        box-shadow: variables.$max-shadow;
        transform: translateY(-50%);
        pointer-events: auto;
      }
    }

    .title {
      grid-area: title;
      font-size: 2rem;
      align-self: center;
      z-index: 102;
    }

    .subscribe {
      grid-area: subscribe;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;
      justify-self: end;
      position: relative;

      .subscribers {
        white-space: nowrap;
      }
    }

    .tab-menu {
      grid-area: menu;
      max-width: 100%;
    }

    .banner-stats {
      grid-area: stats;
      justify-self: end;
    }
  }
}
</style>
