<script setup lang="ts">
import dayjs from 'dayjs';
import RelatedChannels from '~/components/channel/RelatedChannels.vue';
import BadgeButton from '~/components/buttons/BadgeButton.vue';

const route = useRoute();

const { createTextLinks } = useCreateTextLinks();

const channelId = computed(() => getChannelIdFromParam(route.params.id));
const { data: channelInfo, pending } = useGetChannelInfo(channelId);
const { data: channelHome, pending: pendingHome } = useGetChannelHome(channelId);
const { data: channelStats, pending: pendingStats } = useGetChannelStats(channelId);

const hasChannelLinks = computed(() => {
  return (
    channelInfo.value?.channelLinks?.primaryLinks?.length ||
    channelInfo.value?.channelLinks?.secondaryLinks?.length
  );
});
const channelDescription = computed(() => {
  const sanitizedDescription = sanitizeHtmlString(channelInfo.value?.description);
  return createTextLinks(sanitizedDescription);
});
</script>

<template>
  <Spinner v-if="pending || pendingHome || pendingStats" />
  <div
    v-if="!pending && !pendingHome && !pendingStats && channelInfo && channelHome"
    class="channel-home"
  >
    <SectionTitle title="Info" />
    <pre
      v-if="channelInfo.description"
      class="channel-description links"
      v-html="channelDescription"
    />
    <SectionSubtitle v-if="hasChannelLinks" title="Links" class="channel-links-title" />
    <ChannelBannerLinks
      v-if="hasChannelLinks"
      :banner-links="{ ...channelInfo?.channelLinks, type: 'links' }"
    />
    <SectionSubtitle v-if="channelInfo.tags" title="Tags" class="channel-tags-title" />
    <div v-if="channelInfo.tags" class="channel-tags">
      <div class="channel-tags-inner">
        <BadgeButton
          v-for="tag in channelInfo.tags"
          :key="tag"
          class="channel-tag"
          :href="`/results?search_query=${tag}`"
          internal-link
        >
          {{ tag }}
        </BadgeButton>
      </div>
    </div>
    <SectionSubtitle v-if="channelStats" title="Stats" class="channel-stats-title" />
    <div v-if="channelStats" class="channel-stats">
      <div>
        Joined
        <span class="highlight">{{ dayjs(channelStats?.joinedDate).format('MMMM D, YYYY') }}</span>
      </div>
      <div>
        <span class="highlight">{{ channelStats?.viewCount?.toLocaleString('en-US') }}</span> total
        views
      </div>
    </div>
    <SectionTitle v-if="channelInfo.relatedChannels?.items?.length > 0" title="Related channels" />
    <RelatedChannels
      v-if="channelInfo.relatedChannels?.items?.length > 0"
      :related-channels="{ ...channelInfo.relatedChannels, type: 'channels' }"
    />
    <SectionTitle v-if="channelHome.featuredVideo" title="Featured video" />
    <ChannelFeaturedVideo
      v-if="channelHome.featuredVideo"
      :featured-video="channelHome.featuredVideo"
    />
    <div v-for="(shelf, index) in channelHome?.items as any" :key="index" class="shelves">
      <SectionTitle :title="shelf.shelfName" :link="shelf.shelfUrl" />
      <ChannelPlaylistShelf
        v-if="shelf.type === 'playlist' || shelf.type === 'videos' || shelf.type === 'livestreams'"
        :shelf="shelf"
      />
      <ChannelPlaylistsShelf v-else-if="shelf.type === 'playlists'" :shelf="shelf" />
      <ChannelFeaturedChannelsShelf v-else-if="shelf.type === 'channels'" :shelf="shelf" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.channel-home {
  padding: 0 15px;

  .channel-links-title {
    margin-top: 10px;
  }

  .channel-tags-title,
  .channel-stats-title {
    margin-top: 10px;
  }

  .channel-stats {
    .highlight {
      color: var(--theme-color);
    }
  }

  .channel-tags {
    width: 100%;
    position: relative;
    overflow: auto hidden;
    height: 40px;

    .channel-tags-inner {
      position: absolute;
      display: flex;
      flex-direction: row;
    }
  }

  .channel-description {
    white-space: pre-wrap;
    font-family: variables.$default-font;
    margin: 0;
    word-break: break-word;
  }
}
</style>
