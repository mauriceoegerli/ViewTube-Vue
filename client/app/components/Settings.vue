<script setup lang="ts">
import ThemeSelector from '~/components/themes/ThemeSelector.vue';
import SwitchButton from '~/components/buttons/SwitchButton.vue';
import MultiOptionButton from '~/components/buttons/MultiOptionButton.vue';
import Dropdown from '~/components/filter/Dropdown.vue';
import '~/assets/styles/popup.scss';
import { type SegmentOption, useSettingsStore } from '~/store/settings';
import CheckBox from '~/components/form/CheckBox.vue';
import BadgeButton from './buttons/BadgeButton.vue';

defineEmits<{
  (e: 'close'): void;
}>();

const settingsStore = useSettingsStore();
const { getHumanReadableCategory, getSegmentColor } = useSponsorBlockUtils();

const sponsorblockSegmentOptions = [
  { label: 'Skip', value: 'skip' },
  { label: 'Ask', value: 'ask' },
  { label: 'None', value: 'none' }
];
const sponsorBlockUrl = ref<string>(settingsStore.sponsorblockUrl);

const isSponsorBlockUrlValid = computed(() => {
  try {
    const url = new URL(sponsorBlockUrl.value);
    if (url.protocol != 'http:' && url.protocol != 'https:') {
      return false;
    }
    return sponsorBlockUrl.value.endsWith('/');
  } catch {
    return false;
  }
});

const videoQualities = ['144p', '240p', '360p', '720p', '1080p', '1440p', '2160p'];
const videoSpeedArray = [
  '0',
  '0.25',
  '0.5',
  '0.75',
  '1',
  '1.25',
  '1.5',
  '1.75',
  '2',
  '2.25',
  '2.5',
  '2.75',
  '3'
];

function setSponsorBlockUrl() {
  if (isSponsorBlockUrlValid.value) {
    settingsStore.sponsorblockUrl = sponsorBlockUrl.value;
  }
}

function resetSponsorBlockUrl() {
  settingsStore.sponsorblockUrl = sponsorBlockUrl.value = 'https://sponsor.ajay.app/';
}
</script>

<template>
  <div class="settings popup">
    <div class="settings-container popup-container">
      <div class="settings-header">
        <VTIcon v-ripple name="mdi:close" class="close-icon" @click.stop="$emit('close')" />
        <h1 class="settings-title">
          Settings
          <div class="cloud-icon-container">
            <transition name="icon-switch" mode="out-in">
              <VTIcon
                v-if="!settingsStore.settingsSaving"
                v-tippy="'Settings synchronized'"
                name="mdi:cloud-check-outline"
                class="cloud-icon"
              />
            </transition>
            <transition name="icon-switch" mode="out-in">
              <VTIcon
                v-if="settingsStore.settingsSaving"
                v-tippy="'Saving settings'"
                name="mdi:reload"
                class="small-saving-spinner cloud-icon"
              />
            </transition>
          </div>
        </h1>
      </div>
      <h2><VTIcon name="mdi:brightness-4" />Theme</h2>
      <div class="theme-selector-container">
        <ThemeSelector />
      </div>
      <h2><VTIcon name="mdi:book-open-variant" />Chapters</h2>
      <SwitchButton
        :value="settingsStore.chapters"
        :label="'Show chapters on a video'"
        :disabled="false"
        :right="true"
        @valuechange="val => settingsStore.setChapters(val)"
      />
      <h2><VTIcon name="mdi:history" />History</h2>
      <SwitchButton
        :value="settingsStore.saveVideoHistory"
        :label="'Save video history and progress'"
        :disabled="false"
        :right="true"
        @valuechange="val => settingsStore.setSaveVideoHistory(val)"
      />
      <h2>
        <img
          class="sponsorblock-image"
          src="~/assets/icons/sponsorblock.png"
          alt="Sponsorblock icon"
        />Block ads and annoyances
      </h2>
      <span class="small-label links">
        Using
        <a :href="settingsStore.sponsorblockUrl" target="_blank" rel="noreferrer noopener">
          {{ settingsStore.sponsorblockUrl }}
        </a>
      </span>
      <SwitchButton
        :value="settingsStore.sponsorblockEnabled"
        :label="'Enable SponsorBlock'"
        :disabled="false"
        :right="true"
        @valuechange="val => settingsStore.setSponsorblockEnabled(val)"
      />
      <div class="sponsorblock-options-container">
        <div class="sponsorblock-options" :class="{ disabled: !settingsStore.sponsorblockEnabled }">
          <div class="sponsor-block-url-row">
            <label for="sponsor-block-url">SponsorBlock URL</label>
            <span class="sponsor-block-url-actions">
              <input
                id="sponsor-block-url"
                v-model="sponsorBlockUrl"
                class="sponsor-block-url-input"
                :class="{ 'invalid-input': !isSponsorBlockUrlValid }"
                type="text"
                @change="setSponsorBlockUrl"
              />
              <BadgeButton :click="resetSponsorBlockUrl">Reset</BadgeButton>
            </span>
          </div>
        </div>
        <div class="sponsorblock-options" :class="{ disabled: !settingsStore.sponsorblockEnabled }">
          <MultiOptionButton
            :options="sponsorblockSegmentOptions"
            :model-value="settingsStore.sponsorblockSegmentSponsor"
            :label="getHumanReadableCategory('sponsor')"
            :small-label="'Advertisements, promotions and video sponsors'"
            :right="true"
            :color-mark="getSegmentColor('sponsor')"
            class="sponsorblock-option"
            @update:model-value="
              val => settingsStore.setSponsorblockSegmentSponsor(val as SegmentOption)
            "
          />
          <MultiOptionButton
            :options="sponsorblockSegmentOptions"
            :model-value="settingsStore.sponsorblockSegmentIntro"
            :label="getHumanReadableCategory('intro')"
            :small-label="'Intro animation, pause, intro sequence'"
            :right="true"
            :color-mark="getSegmentColor('intro')"
            class="sponsorblock-option"
            @update:model-value="
              val => settingsStore.setSponsorblockSegmentIntro(val as SegmentOption)
            "
          />
          <MultiOptionButton
            :options="sponsorblockSegmentOptions"
            :model-value="settingsStore.sponsorblockSegmentOutro"
            :label="getHumanReadableCategory('outro')"
            :small-label="'Endcards, credits, outros'"
            :right="true"
            :color-mark="getSegmentColor('outro')"
            class="sponsorblock-option"
            @update:model-value="
              val => settingsStore.setSponsorblockSegmentOutro(val as SegmentOption)
            "
          />
          <MultiOptionButton
            :options="sponsorblockSegmentOptions"
            :model-value="settingsStore.sponsorblockSegmentInteraction"
            :label="getHumanReadableCategory('interaction')"
            :small-label="'Reminder to subscribe, like, follow on social media, etc.'"
            :right="true"
            :color-mark="getSegmentColor('interaction')"
            class="sponsorblock-option"
            @update:model-value="
              val => settingsStore.setSponsorblockSegmentInteraction(val as SegmentOption)
            "
          />
          <MultiOptionButton
            :options="sponsorblockSegmentOptions"
            :model-value="settingsStore.sponsorblockSegmentSelfpromo"
            :label="getHumanReadableCategory('selfpromo')"
            :small-label="'Unpaid promotion, for example donations, merchandise or shoutouts'"
            :right="true"
            :color-mark="getSegmentColor('selfpromo')"
            class="sponsorblock-option"
            @update:model-value="
              val => settingsStore.setSponsorblockSegmentSelfpromo(val as SegmentOption)
            "
          />
          <MultiOptionButton
            :options="sponsorblockSegmentOptions"
            :model-value="settingsStore.sponsorblockSegmentMusicOfftopic"
            :label="getHumanReadableCategory('music_offtopic')"
            :small-label="'Skips non-music sections in music videos'"
            :right="true"
            :color-mark="getSegmentColor('music_offtopic')"
            class="sponsorblock-option"
            @update:model-value="
              val => settingsStore.setSponsorblockSegmentMusicOfftopic(val as SegmentOption)
            "
          />
          <MultiOptionButton
            :options="sponsorblockSegmentOptions"
            :model-value="settingsStore.sponsorblockSegmentPreview"
            :label="getHumanReadableCategory('preview')"
            :small-label="'Skips previews and recaps'"
            :right="true"
            :color-mark="getSegmentColor('preview')"
            class="sponsorblock-option"
            @update:model-value="
              val => settingsStore.setSponsorblockSegmentPreview(val as SegmentOption)
            "
          />
          <MultiOptionButton
            :options="sponsorblockSegmentOptions"
            :model-value="settingsStore.sponsorblockSegmentFiller"
            :label="getHumanReadableCategory('filler')"
            :small-label="'Skips filler and off-topic content'"
            :right="true"
            :color-mark="getSegmentColor('filler')"
            class="sponsorblock-option"
            @update:model-value="
              val => settingsStore.setSponsorblockSegmentFiller(val as SegmentOption)
            "
          />
        </div>
      </div>

      <h2><VTIcon name="mdi:home" />Homescreen</h2>
      <SwitchButton
        :value="settingsStore.showHomeSubscriptions"
        :label="'Show subscriptions on home screen'"
        :small-label="'Subscriptions require signing in'"
        :disabled="false"
        :right="true"
        @valuechange="val => settingsStore.setShowHomeSubscriptions(val)"
      />

      <SwitchButton
        :value="settingsStore.showHomeTrendingVideos"
        :label="'Show trending videos on home screen'"
        :disabled="false"
        :right="true"
        @valuechange="val => settingsStore.setShowHomeTrendingVideos(val)"
      />

      <h2><VTIcon name="mdi:auto-fix" />Enhancements</h2>
      <SwitchButton
        :value="settingsStore.rewriteYouTubeURLs"
        :label="'Rewrite YouTube URLs'"
        :small-label="'Replace YouTube-URLs with local ViewTube URLs'"
        :disabled="false"
        :right="true"
        @valuechange="val => settingsStore.setRewriteYouTubeURLs(val)"
      />
      <SwitchButton
        :value="settingsStore.hideComments"
        :label="'Hide comments'"
        :small-label="'Do not load and do not show comments on videos'"
        :disabled="false"
        :right="true"
        @valuechange="val => settingsStore.setHideComments(val)"
      />
      <SwitchButton
        :value="settingsStore.hideShortsFromSearch"
        :label="'Hide shorts'"
        :small-label="'Do not show shorts in search results'"
        :disabled="false"
        :right="true"
        @valuechange="val => settingsStore.setHideShortsFromSearch(val)"
      />
      <SwitchButton
        :value="settingsStore.showRecommendedVideos"
        :label="'Show recommended videos on a video page'"
        :small-label="'Autoplay next video will be ignored for recommended videos.'"
        :disabled="false"
        :right="true"
        @valuechange="val => settingsStore.setShowRecommendedVideos(val)"
      />

      <h2><VTIcon name="mdi:television" />Videoplayer</h2>
      <div class="settings-dropdown-menu">
        <div class="quality-label">
          <label>Maximum video quality</label>
          <label class="small-label"
            >The automatic quality adjustment will never go above this setting</label
          >
        </div>
        <Dropdown
          :values="videoQualities"
          :value="settingsStore.maxVideoQuality"
          @valuechange="val => settingsStore.setMaxVideoQuality(val.value)"
        />
      </div>
      <div class="settings-number-menu">
        <label for="video-speed-input">Default video speed</label>
        <div class="video-speed-checkbox">
          <label for="as-list" style="padding-right: 5px"> (as list ?)</label>
          <CheckBox
            id="as-list"
            :value="settingsStore.videoSpeedAsList"
            :label="''"
            @valuechange="val => settingsStore.setVideoSpeedAsList(val)"
          />
        </div>
        <input
          v-if="!settingsStore.videoSpeedAsList"
          id="video-speed-input"
          class="settings-number-input"
          type="number"
          name="video-speed"
          :value="settingsStore.defaultVideoSpeed"
          step="0.1"
          max="3"
          min="0.1"
          @change="(e: any) => settingsStore.setDefaultVideoSpeed(parseFloat(e.target.value))"
        />
        <Dropdown
          v-if="settingsStore.videoSpeedAsList"
          :style="{
            'margin-top': '-20px',
            'margin-right': '-20px',
            width: '63px'
          }"
          :values="videoSpeedArray"
          :value="settingsStore.defaultVideoSpeed.toString()"
          @valuechange="val => settingsStore.setDefaultVideoSpeed(val.value)"
        />
      </div>
      <SwitchButton
        :value="settingsStore.autoplay"
        :label="'Autoplay video'"
        :small-label="'Automatically plays video after opening'"
        :disabled="false"
        :right="true"
        @valuechange="val => settingsStore.setAutoplay(val)"
      />
      <SwitchButton
        :value="settingsStore.autoplayNextVideo"
        :label="'Autoplay next video'"
        :small-label="'Automatically plays the next recommended video'"
        :disabled="false"
        :right="true"
        @valuechange="val => settingsStore.setAutoplayNextVideo(val)"
      />
      <SwitchButton
        :value="settingsStore.alwaysLoopVideo"
        :label="'Loop video'"
        :small-label="'Overrides playing next video with autoplay or in playlists'"
        :disabled="false"
        :right="true"
        @valuechange="val => settingsStore.setAlwaysLoopVideo(val)"
      />
      <SwitchButton
        :value="settingsStore.audioModeDefault"
        :label="'Audio mode default'"
        :small-label="'Not implemented yet'"
        :disabled="true"
        :right="true"
        @valuechange="val => settingsStore.setAudioModeDefault(val)"
      />
    </div>
    <div class="settings-overlay popup-overlay" @click.stop="$emit('close')" />
  </div>
</template>

<style lang="scss">
.icon-switch-enter-active,
.icon-switch-leave-active {
  transform: rotate(0);
  opacity: 1;
}
.icon-switch-enter-from {
  transform: rotate(-80deg);
  opacity: 0;
}
.icon-switch-leave-to {
  opacity: 0;
  transform: rotate(80deg);
}
.settings-container {
  padding: 50px 20px 0 20px !important;

  .settings-header {
    position: fixed;
    width: calc(100% - 20px);
    max-width: 700px;
    top: 10%;
    margin: 0 !important;
    padding: 0;
    z-index: 12;
    background-color: var(--bgcolor-alt);
    border-radius: 5px;
    overflow: hidden;

    .settings-title {
      text-align: center;
    }

    .cloud-icon-container {
      display: inline-block;
      position: relative;
      top: 0;
      left: 0;
      width: 24px;
      height: 24px;

      .cloud-icon {
        position: absolute;
        top: 0;
        left: 0;
        transition:
          opacity 300ms variables.$intro-easing,
          transform 300ms variables.$intro-easing;
        width: 24px;
        height: 24px;
      }

      .small-saving-spinner {
        animation: spin 600ms linear infinite;
        transform-origin: center;
      }
    }

    .close-icon {
      position: absolute;
    }

    @media screen and (max-width: variables.$mobile-width) {
      top: 0;
      padding: 15px 0;
    }
  }

  h2 {
    .sponsorblock-image {
      height: 24px;
      width: 24px;
      margin: 0 10px 0 0;
      filter: grayscale(100%) brightness(0.9) invert(1);
    }
  }

  .settings-dropdown-menu {
    display: flex;
    flex-direction: row;
    width: calc(100% - 36px);
    justify-content: space-between;

    .quality-label {
      display: flex;
      flex-direction: column;

      .small-label {
        margin: 0 !important;
      }
    }

    label {
      margin-top: 20px !important;
      height: 100%;
    }
  }

  .settings-number-menu {
    display: flex;
    flex-direction: row;
    width: calc(100% - 36px);
    justify-content: space-between;
    margin-top: 20px !important;
  }

  .settings-number-input,
  .sponsor-block-url-input {
    all: unset;
    border: 2px solid var(--bgcolor-alt-light);
    width: 50px;
    padding: 2px 5px;
    border-radius: 5px;
    transition: border 300ms variables.$intro-easing;

    &:focus {
      border: 2px solid var(--theme-color);
    }
  }

  .sponsor-block-url-input {
    width: 250px;
  }

  .invalid-input,
  .invalid-input:focus {
    border: 2px solid #e00;
  }

  .sponsor-block-url-actions {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
  }

  .sponsor-block-url-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 1rem;
  }

  .video-speed-checkbox {
    display: flex;
    flex: 1;
    margin-left: 5px;
  }

  .sponsorblock-options-container {
    width: calc(100% - 36px);

    .sponsorblock-options {
      // width: calc(100% - 20px);
      transition: padding 300ms variables.$intro-easing;
      overflow: hidden;

      .sponsorblock-option {
        margin: 20px 0 0 0;
      }

      &.disabled {
        pointer-events: none;
        user-select: none;
        filter: grayscale(100%);
        opacity: 0.9;
      }
    }
  }

  .small-label {
    margin: 0 0 0 36px;
    font-size: 0.8rem;
  }

  .settings-subtitle {
    margin-left: 36px;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
