<script setup lang="ts">
defineProps<{
  videoState: VideoState;
  uiState: UiState;
  captionsState: CaptionsState;
}>();
</script>

<template>
  <div class="flip-settings-container clickaway-div" @click="uiState.closeSettings">
    <div class="flip-settings" :class="{ fullscreen: uiState.fullscreen.value }" @click.stop>
      <div class="flip-settings-header">
        <p class="flip-settings-title">Player settings</p>
        <VTIcon class="close-icon" name="mdi:close" @click="uiState.closeSettings" />
      </div>
      <div class="flip-setting mobile-only volume-setting">
        <VTIcon class="flip-setting-icon" name="mdi:volume" />
        <FlipVolume mobile :video-state="videoState" :ui-state="uiState" />
      </div>
      <div v-if="videoState.video.languageList?.length > 1" class="flip-setting">
        <VTIcon class="flip-setting-icon" name="mdi:globe" />
        <ListCollapsibleSection label="Language">
          <div class="selector-list">
            <div
              v-for="(language, index) in videoState.video.languageList"
              :key="index"
              :class="{ selected: language.language === videoState.video.selectedLanguage }"
              class="selector"
              @click.stop="videoState.setLanguage(language.language)"
            >
              {{ language.label }}
            </div>
          </div>
        </ListCollapsibleSection>
      </div>
      <FlipQualitySelector :video-state="videoState" />
      <FlipCaptionsSelector
        v-if="captionsState.availableCaptionTracks.value.length > 0"
        :captions-state="captionsState"
      />
      <FlipPlaybackSettings :video-state="videoState" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.flip-settings-container {
  z-index: 500;
  display: flex;
  opacity: 1;
  pointer-events: all;

  .flip-settings {
    margin: variables.$header-height auto;
    background-color: var(--bgcolor-alt);
    border-radius: 5px;
    width: 100%;
    max-width: 400px;
    height: auto;
    max-height: 100%;
    display: flex;
    box-shadow: variables.$medium-shadow;
    flex-direction: column;
    overflow: auto;

    &.fullscreen {
      margin: 5px auto;
    }

    .flip-settings-header {
      position: relative;

      .flip-settings-title {
        padding: 15px;
        font-size: 1.2rem;
        font-weight: bold;
        text-align: center;
      }

      .close-icon {
        cursor: pointer;
        position: absolute;
        right: 20px;
        top: 20px;
      }
    }

    .flip-setting,
    :deep(.flip-setting) {
      padding: 10px 15px 10px 50px;
      display: flex;
      flex-direction: column;
      position: relative;

      .selector-list {
        display: flex;
        flex-direction: column;
        padding: 10px 0 0 0;
        gap: 2px;

        .selector {
          padding: 5px 10px;
          border-radius: 5px;
          font-size: 0.9rem;
          box-sizing: border-box;
          cursor: pointer;
          display: flex;

          &:hover {
            background-color: var(--bgcolor-alt-light);
          }

          &.selected {
            background-color: var(--theme-color-translucent);
          }
        }
      }

      &.volume-setting {
        .flip-setting-icon {
          top: 10px;
        }
      }

      &.mobile-only {
        @media screen and (min-width: variables.$mobile-width) {
          display: none;
        }
      }

      .flip-setting-icon {
        position: absolute;
        left: 15px;
        top: 18px;
        width: 20px;
        height: 20px;
        color: var(--theme-color);
      }
    }
  }
}
</style>
