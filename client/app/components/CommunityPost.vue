<script setup lang="ts">
import type { ApiDto } from '@viewtube/shared';

const props = defineProps<{
  communityPost: ApiDto<'ChannelCommunityPostDto'>;
}>();

const { createTextLinks } = useCreateTextLinks();

const communityPostContent = computed(() => {
  const sanitizedContent = sanitizeHtmlString(props.communityPost.postText);
  return createTextLinks(sanitizedContent);
});
</script>

<template>
  <div class="community-post">
    <p class="creation-time">{{ communityPost.publishedText }} &bull; {{ communityPost.author }}</p>
    <div class="post-text links">
      <pre class="text-pre" v-html="communityPostContent" />
    </div>
    <div v-if="communityPost.postContent" class="post-content">
      <CommunityPostImage
        v-if="communityPost.postContent.type === 'image'"
        :post-image="communityPost.postContent.content"
        expandable
      />
      <CommunityPostPoll
        v-if="communityPost.postContent.type === 'poll'"
        :post-poll="communityPost.postContent.content"
      />
      <CommunityPostVideo
        v-if="communityPost.postContent.type === 'video'"
        :post-video="communityPost.postContent.content"
      />
      <CommunityPostMultiImage
        v-if="communityPost.postContent.type === 'multiImage'"
        :post-images="communityPost.postContent.content"
      />
    </div>
    <div class="post-info">
      <div class="info-item">
        <VTIcon name="mdi:thumb-up" />
        <p>{{ communityPost.voteCount ?? 0 }}</p>
      </div>
      <div class="info-item">
        <VTIcon name="mdi:comment-outline" />
        <p class="comments">{{ communityPost.commentCount ?? 0 }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.community-post {
  background-color: var(--bgcolor-alt);
  border-radius: 8px;
  padding: 12px 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .creation-time {
    font-size: 0.8rem;
    color: var(--subtitle-color-light);
  }

  .post-text {
    .text-pre {
      color: var(--title-color);
      font-size: 1rem;
      font-family: variables.$default-font;
      white-space: pre-wrap;
      margin: 0;
    }
  }

  .post-info {
    display: flex;
    flex-direction: row;
    gap: 15px;

    .info-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 5px;
      color: var(--subtitle-color-light);

      :deep(.vt-icon) {
        width: 20px;
        height: 20px;
      }
    }
  }
}
</style>
