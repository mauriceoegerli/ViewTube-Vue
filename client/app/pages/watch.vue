<script setup lang="ts">
import type { Result } from 'ytpl';
import NextUpVideo from '~/components/watch/NextUpVideo.vue';
import Spinner from '~/components/Spinner.vue';
import SubscribeButton from '~/components/buttons/SubscribeButton.vue';
import Comment from '~/components/Comment.vue';
import RecommendedVideos from '~/components/watch/RecommendedVideos.vue';
import ShareOptions from '~/components/watch/ShareOptions.vue';
import CollapsibleSection from '~/components/list/CollapsibleSection.vue';
import PlaylistSection from '~/components/watch/PlaylistSection.vue';
import BadgeButton from '~/components/buttons/BadgeButton.vue';
import SectionTitle from '~/components/SectionTitle.vue';
import VideoLoadingTemplate from '~/components/watch/VideoLoadingTemplate.vue';
import { useMessagesStore } from '~/store/messages';
import { useSettingsStore } from '~/store/settings';
import { useLoadingVideoInfoStore } from '~/store/loadingVideoInfo';
import { useUserStore } from '~/store/user';
import dayjs from 'dayjs';
import { useVideoPlayerStore } from '~/store/videoPlayer';
import type { ApiDto, ApiErrorDto } from '@viewtube/shared';

type VideoType = ApiDto<'VTVideoInfoDto'> & { initialVideoTime: number };

const messagesStore = useMessagesStore();
const settingsStore = useSettingsStore();
const videoPlayerStore = useVideoPlayerStore();
const userStore = useUserStore();
const { apiUrl } = useApiUrl();

const route = useRoute();
const router = useRouter();
const { proxyUrl } = useImgProxy();
const { vtFetch } = useVtFetch();

const jsEnabled = ref(false);
const commentObject = ref(null);
const commentsLoading = ref(true);
const commentsError = ref(false);
const commentsContinuationLink = ref(null);
const commentsContinuationLoading = ref(false);
const recommendedOpen = ref(false);
const shareOpen = ref(false);
// const videoplayerRef = ref<typeof VideoPlayer>(null);
const playlistSectionRef = ref<typeof PlaylistSection>(null);

const dislikeCount = ref(0);

const playlist = ref<Result>(null);
const loadingVideoInfoStore = useLoadingVideoInfoStore();

const {
  data: video,
  error: videoError,
  pending: videoPending,
  refresh
} = useLazyAsyncData<VideoType, ApiErrorDto>(route.query.v.toString(), async () => {
  const videoData = await vtFetch<ApiDto<'VTVideoInfoDto'>>(
    `${apiUrl.value}videos/${route.query.v}`
  );

  let initialVideoTime = 0;

  const initialVideoTimeFromQuery = parseInt(route.query.t as string);
  if (initialVideoTimeFromQuery) {
    initialVideoTime = initialVideoTimeFromQuery;
  } else if (userStore.isLoggedIn && settingsStore.saveVideoHistory) {
    const videoVisit = await vtFetch<any>(`${apiUrl.value}user/history/${videoData.id}`, {
      credentials: 'include'
    }).catch((_: any) => {});

    if (videoVisit?.progressSeconds > 0) {
      initialVideoTime = videoVisit?.progressSeconds;
    }
  }

  if (settingsStore.rewriteYouTubeURLs) {
    videoData.description = videoData.description.replace('https://www.youtube.com', '');
  }

  if (videoData.availability?.status !== 'OK') {
    messagesStore.createMessage({
      type: 'error',
      title: 'Video is unplayable',
      message: videoData.availability?.reason ?? 'Unplayable for unknown reason'
    });
  }

  return { ...videoData, initialVideoTime };
});

watch(videoPending, value => {
  if (!value) {
    loadingVideoInfoStore.clearInfo();
  }
});

watch(videoError, () => {
  const error = unref(videoError);
  if (error) {
    messagesStore.createMessage({
      type: 'error',
      title: 'Error loading video',
      message: error?.message ?? 'Unknown error'
    });
  }
});

const isPlaylist = computed(() => {
  return Boolean(route.query && route.query.list);
});

const isAutoplaying = computed(() => {
  return isPlaylist.value || settingsStore.autoplay || route.query.autoplay === 'true';
});

const nextUpVideo = computed(() => {
  if (playlist.value) {
    const currentVideoIndex = playlist.value.items.findIndex(el => el.id === video.value.id);
    if (currentVideoIndex !== -1 && currentVideoIndex + 1 < playlist.value.items.length) {
      return playlist.value.items[currentVideoIndex + 1];
    }
    if (currentVideoIndex + 1 === playlist.value.items.length && route.query.repeat === 'true') {
      return playlist.value.items[0];
    }
  }
  if (video.value) return video.value.recommendedVideos[1];
  return null;
});

const loadDislikes = () => {
  getDislikes(route.query.v)
    .then(response => {
      dislikeCount.value = response.dislikes;
    })
    .catch(error => {
      messagesStore.createMessage({
        type: 'error',
        title: 'Error loading dislikes',
        message: error.message
      });
    });
};

const reloadComments = () => {
  commentsLoading.value = true;
  commentsError.value = false;
  loadComments();
};
const setTimestamp = (seconds: number) => {
  router.push({
    query: {
      ...route.query,
      t: seconds
    },
    replace: true
  });
  window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
};

const { createTextLinks } = useCreateTextLinks(setTimestamp);

const loadComments = (evtVideoId: string = null) => {
  const videoId = evtVideoId || route.query.v;
  // getComments(videoId)
  //   .then(response => {
  //     if (response.comments && response.comments.length > 0) {
  //       commentObject.value = response;
  //       commentsLoading.value = false;
  //       commentsContinuationLink.value = response.continuation || null;
  //     } else {
  //       commentsLoading.value = false;
  //       commentsError.value = true;
  //       commentObject.value = null;
  //     }
  //   })
  //   .catch(_ => {
  //     commentsLoading.value = false;
  //     commentsError.value = true;
  //     commentObject.value = null;
  //   });
};

const loadMoreComments = () => {
  commentsContinuationLoading.value = true;
  const videoId = route.query.v;
  getCommentsContinuation(videoId, commentsContinuationLink.value)
    .then(response => {
      commentObject.value.comments = commentObject.value.comments.concat(response.comments);
      commentsContinuationLoading.value = false;
      commentsContinuationLink.value = response.continuation || null;
    })
    .catch(_ => {
      messagesStore.createMessage({
        type: 'error',
        title: 'Error loading more comments',
        message: 'Loading comments failed. There may not be any more comments.'
      });
    });
};

const loadPlaylist = () => {
  if (!isPlaylist.value) return;
  
  getPlaylists(route.query.list)
    .then(response => {
      playlist.value = response;
    })
    .catch(_ => {
      messagesStore.createMessage({
        type: 'error',
        title: 'Error loading playlist',
        message: 'Playlist may not be available'
      });
    });
};

watch(
  () => route.query,
  (newValue, oldValue) => {
    if (newValue.v !== oldValue.v || newValue.list !== oldValue.list) {
      refresh();
      const videoId = newValue.v as string;
      if (!settingsStore.hideComments) loadComments(videoId);
    }
  }
);

onMounted(() => {
  jsEnabled.value = true;

  if (window && window.innerWidth > 700) {
    recommendedOpen.value = true;
  }
  if (!settingsStore.hideComments) loadComments();
  loadDislikes();
  loadPlaylist();
});

const onVideoEnded = () => {
  if (
    isPlaylist.value &&
    playlistSectionRef.value &&
    !settingsStore.alwaysLoopVideo &&
    !videoPlayerStore.loop
  ) {
    playlistSectionRef.value.playNextVideo();
  } else if (
    settingsStore.autoplayNextVideo &&
    settingsStore.showRecommendedVideos &&
    video.value.recommendedVideos
  ) {
    router.push({
      path: route.fullPath,
      query: { v: video.value.recommendedVideos[1].id, autoplay: 'true' }
    });
  }
};

const authorToName = author => {
  if (typeof author == 'string') {
    return author;
  } else if (typeof author.name == 'string') {
    return author.name;
  }
  return 'Unknown Author';
};

const watchPageTitle = computed(() => {
  if (video.value) {
    return `${video.value.title} :: ${authorToName(video.value.author)}`;
  } else if (videoPending.value) {
    return 'Loading...';
  }
  return 'Video Error';
});

const videoDescription = computed(() => {
  if (!video.value?.description) return '';

  const sanitizedDescription = sanitizeHtmlString(video.value?.description);
  return createTextLinks(sanitizedDescription);
});
</script>

<template>
  <div class="watch">
    <MetaPageHead
      :title="watchPageTitle"
      :description="`${video?.description?.substring(0, 100)}`"
      :image="`${video?.author.thumbnails?.[2]?.url}`"
    />
    <VideoLoadingTemplate v-if="videoPending" />
    <!-- <video v-if="!jsEnabled" controls :src="getHDUrl()" class="nojs-player" /> -->
    <WatchVideoError v-if="videoError" :error="videoError" />
    <FlipPlayer
      v-if="video && !videoPending"
      :video="video"
      :start-time="video.initialVideoTime"
      :autoplay="isAutoplaying"
      @video-ended="onVideoEnded"
    />
    <div v-if="video && !videoPending" class="video-meta">
      <div v-if="settingsStore.showRecommendedVideos" class="recommended-videos-outer mobile">
        <NextUpVideo v-if="nextUpVideo && settingsStore.autoplayNextVideo" :video="nextUpVideo" />
        <CollapsibleSection :label="'Recommended videos'" :opened="recommendedOpen">
          <RecommendedVideos
            class="recommended-videos-list"
            :recommended-videos="video?.recommendedVideos ?? []"
          />
        </CollapsibleSection>
      </div>
      <div class="video-infobox">
        <h1 class="video-infobox-title">
          {{ video.title }}
        </h1>
        <div class="video-infobox-stats">
          <p v-if="video.viewCount" class="infobox-views">
            {{ video.viewCount?.toLocaleString('en-US') }}
            views
          </p>
          <div v-if="video.likeCount" class="infobox-rating">
            <div class="infobox-likecount">
              <div class="infobox-likes">
                <VTIcon name="mdi:thumb-up" class="thumbs-icon" />
                <p class="like-count">
                  {{ video.likeCount?.toLocaleString('en-US') }}
                </p>
              </div>
              <div class="infobox-dislikes">
                <VTIcon name="mdi:thumb-down" class="thumbs-icon" />
                <p class="dislike-count">
                  {{ dislikeCount?.toLocaleString('en-US') }}
                </p>
                <a
                  class="dislike-info"
                  href="https://returnyoutubedislike.com"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <VTIcon
                    v-tippy="'Dislike information provided by returnyoutubedislike.com'"
                    name="mdi:information"
                  />
                </a>
              </div>
            </div>
            <div class="like-ratio">
              <div
                class="like-ratio-bar"
                :style="{
                  width: (video.likeCount / (dislikeCount + video.likeCount)) * 100 + '%'
                }"
              />
            </div>
          </div>
        </div>
        <div class="video-infobox-channel">
          <div class="infobox-channel">
            <div class="infobox-channel-image">
              <nuxt-link :to="`/${video.author.handle}`">
                <img
                  v-if="video.author.thumbnails?.length > 0"
                  id="channel-img"
                  alt="Channel image"
                  :src="proxyUrl(video.author.thumbnails[2].url)"
                />
              </nuxt-link>
            </div>
            <div class="infobox-channel-info">
              <nuxt-link :to="`/${video.author.handle}`" class="infobox-channel-name">
                <p>{{ video.author.name }}</p>
                <VTIcon v-if="video.author.isVerified" name="mdi:check-decagram" />
              </nuxt-link>
              <p v-if="video.author.subscriberCount" class="infobox-channel-subcount">
                {{ video.author.subscriberCount }}
                subscribers
              </p>
            </div>
          </div>
          <SubscribeButton class="subscribe-button-watch" :channel-id="video.author.id" />
        </div>
        <PlaylistSection
          v-if="playlist"
          ref="playlistSectionRef"
          :playlist="playlist"
          :current-video-id="video.id"
        />
        <div v-if="video.published.date" class="video-infobox-date">
          {{ dayjs(video.published.date).toString() }}
        </div>
        <div class="video-actions">
          <BadgeButton style="color: #efbb00" :click="() => (shareOpen = !shareOpen)">
            <VTIcon name="mdi:share" class="share-icon" />
            Share
          </BadgeButton>
        </div>
        <transition name="share-fade-down">
          <div v-show="shareOpen">
            <ShareOptions class="share-options-display" :video-id="video.id" />
          </div>
        </transition>
        <p v-if="video.keywords" class="video-infobox-text">Tags</p>
        <div v-if="video.keywords" class="video-infobox-tags">
          <div v-if="video.keywords" class="tags-container">
            <BadgeButton
              v-for="keyword in video.keywords"
              :key="keyword"
              :internal-link="true"
              class="video-infobox-tag"
              :href="`results?search_query=${keyword}`"
            >
              <p>{{ keyword }}</p>
            </BadgeButton>
          </div>
        </div>

        <div v-if="!settingsStore.hideComments" class="comments-description">
          <div class="video-infobox-description links" v-html="videoDescription" />
          <SectionTitle :title="`${video.commentCount} Comments`" />
          <Spinner v-if="commentsLoading" />
          <div v-if="video.live" class="comments-error livestream">
            <p>Livestream comments are not supported yet.</p>
          </div>
          <div v-if="commentsError" class="comments-error">
            <p>Error loading comments. They might be disabled for this video.</p>
            <BadgeButton :click="reloadComments" :loading="commentsLoading"
              ><VTIcon name="mdi:reload" />Try again</BadgeButton
            >
          </div>
          <div v-if="!commentsLoading && commentObject" class="comments-container">
            <Comment
              v-for="(subComment, i) in commentObject.comments"
              :key="i"
              :comment="subComment"
              :channel-author-id="video.author.id"
              :channel-author-name="video.author.name"
              @set-timestamp="setTimestamp"
            />
            <BadgeButton
              v-if="commentsContinuationLink"
              :click="loadMoreComments"
              :loading="commentsContinuationLoading"
            >
              <VTIcon name="mdi:reload" />
              <p>Show more</p>
            </BadgeButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.share-fade-down-enter-active,
.share-fade-down-leave-active {
  transition:
    transform 200ms variables.$intro-easing,
    opacity 200ms variables.$intro-easing,
    height 200ms variables.$intro-easing;
}
.share-fade-down-enter-to,
.share-fade-down-leave-from {
  transform: translateX(0);
  height: 60px;
  opacity: 1;
}
.share-fade-down-enter-from,
.share-fade-down-leave-to {
  transform: translateX(40px);
  height: 0;
  opacity: 0;
}

.watch {
  width: 100%;
  margin-top: variables.$header-height;

  .nojs-player {
    max-height: calc(100vh - 170px);
    z-index: 11;
    width: 100%;
  }

  .video-player-p {
    z-index: 11;
  }

  .video-meta {
    display: flex;
    flex-direction: row-reverse;
    width: 100%;
    max-width: variables.$main-width;
    margin: 0 auto;

    @media screen and (max-width: variables.$mobile-width) {
      flex-direction: column;
    }

    .recommended-videos-outer {
      z-index: 400;
      padding: 10px;

      @media screen and (min-width: variables.$mobile-width) {
        min-width: 340px;
        max-width: 340px;
      }
    }

    .video-infobox {
      width: 100%;
      display: flex;
      flex-direction: column;
      padding: 0 10px;
      box-sizing: border-box;
      opacity: 1;
      transition: opacity 300ms variables.$intro-easing;
      z-index: 400;
      position: relative;
      width: 100%;
      overflow: hidden;

      @media screen and (min-width: variables.$mobile-width) {
        width: 100%;
        padding: 10px;
      }

      .video-infobox-title {
        color: var(--title-color);
        font-family: variables.$default-font;
        font-size: 1.4rem;
        margin: 10px 0 10px 0;
      }

      .video-infobox-tags {
        $tag-padding-left: calc((100% - #{variables.$main-width}) / 2);
        margin: 5px auto 0 auto;
        width: 100%;
        height: 40px;
        overflow: auto hidden;
        padding: 0 0 0 $tag-padding-left;
        scrollbar-width: thin;
        box-sizing: border-box;
        position: relative;

        .tags-container {
          display: flex;
          flex-direction: row;
          width: auto;
          position: absolute;

          .video-infobox-tag {
            display: inline-block;
            overflow: hidden;
            white-space: nowrap;
          }
        }

        &::-webkit-scrollbar {
          display: none;
        }
      }

      .video-infobox-stats {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        margin: 0 auto 20px auto;

        .infobox-views {
          color: var(--subtitle-color);
          font-family: variables.$default-font;
          margin: 0 30px 0 0;
          font-size: 1.1rem;
        }

        .infobox-rating {
          .infobox-likecount {
            display: flex;
            flex-direction: row;

            .infobox-likes {
              margin: 0 30px 0 0;
            }

            .infobox-likes,
            .infobox-dislikes {
              color: var(--subtitle-color);
              font-family: variables.$default-font;
              display: flex;
              flex-direction: row;

              .dislike-info {
                height: 16px;
                width: 16px;
                padding: 2px 0 6px 8px;

                .vt-icon {
                  height: 16px;
                  width: 16px;
                }
              }

              .thumbs-icon {
                width: 1.5rem;
                height: 1.5rem;
                margin-right: 5px;
              }

              p {
                text-align: center;
              }
            }
          }

          .like-ratio {
            width: 100%;
            height: 4px;
            background-color: var(--theme-color-alt);
            position: relative;
            margin: 10px 0 0 0;
            border-radius: 25px;
            overflow: hidden;

            .like-ratio-bar {
              position: absolute;
              background-image: variables.$theme-color-primary-gradient;
              height: 100%;
            }
          }
        }
      }

      .video-infobox-channel {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        gap: 10px;

        @media screen and (max-width: variables.$watch-break-width) {
          flex-direction: column;
          align-items: flex-start;
        }

        .infobox-channel {
          display: flex;
          flex-direction: row;
          align-items: center;
          width: 100%;

          .infobox-channel-image {
            width: 50px;
            height: 50px;
            min-width: 50px;
            margin: 0 10px 0 0;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .infobox-channel-info {
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            flex-wrap: wrap;
            overflow: hidden;

            .infobox-channel-name {
              text-decoration: none;
              color: var(--title-color);
              font-family: variables.$default-font;
              font-size: 1.2rem;
              width: 100%;
              display: flex;
              flex-direction: row;
              gap: 5px;
              align-items: center;

              p {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }

              .vt-icon {
                width: 20px;
                height: 20px;
                margin-bottom: 0.5px;
              }
            }

            .infobox-channel-subcount {
              color: var(--subtitle-color);
              font-family: variables.$default-font;
            }
          }
        }
      }

      .video-infobox-date {
        margin: 20px 0 0 0;
        width: 100%;
      }

      .video-exact-date {
        margin: 0 0 10px 0;
        color: var(--subtitle-color-light);
      }

      .video-actions {
        margin: 0 auto;
        width: 100%;
        display: flex;
        flex-direction: row;

        img {
          position: relative;
          top: 0;
          left: 4px;
          width: 24px;
          height: 24px;
        }
      }

      .video-infobox-text {
        margin: 0 auto;
        width: 100%;
      }

      .video-infobox-description {
        margin: 10px auto 0 auto;
        color: var(--title-color);
        font-family: variables.$default-font;
        line-height: 1.2rem;
        overflow: hidden;
        white-space: pre-wrap;
        overflow-wrap: break-word;
        width: 100%;
        padding: 0 0 10px 0;

        .favicon-link {
          height: 13px;
          margin: 0 4px;
        }
      }

      .comments-error {
        margin: 50px 0 0 0;
        color: var(--error-color-red);
      }

      .comments-container {
        width: 100%;
        margin: 10px auto 0 auto;
      }

      &.loading {
        opacity: 0;
      }
    }
  }
}
</style>
