<script setup lang="ts">
const props = defineProps<{
  videoState: VideoState;
}>();

const asList = ref(false);
const videoSpeedArray = [
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

const setVideoSpeed = (speed: number) => {
  props.videoState.setPlaybackRate(speed);
};
</script>

<template>
  <div class="flip-setting">
    <VTIcon class="flip-setting-icon" name="mdi:mixer-settings-vertical" />
    <ListCollapsibleSection label="Playback">
      <div class="speed-section">
        <div>Video speed</div>
        <div class="video-speed-checkbox">
          <label for="as-list" style="padding-right: 5px"> (as list ?)</label>
          <FormCheckBox
            id="as-list"
            :value="asList"
            :label="''"
            @valuechange="val => (asList = val)"
          />
        </div>
        <input
          v-if="!asList"
          id="video-speed-input"
          class="number-input"
          type="number"
          name="video-speed"
          :value="videoState.video.speed"
          step="0.1"
          max="3"
          min="0.1"
          @change="(e: any) => setVideoSpeed(e.target.value)"
        />
        <FilterDropdown
          v-if="asList"
          :style="{
            'margin-top': '-20px',
            'margin-right': '-20px',
            width: '63px'
          }"
          class="speed-dropdown"
          :values="videoSpeedArray"
          :value="videoState.video.speed?.toString()"
          @valuechange="val => setVideoSpeed(val.value)"
        />
      </div>
      <div class="loop-section">
        <ButtonsSwitchButton
          class="loop-switch"
          :value="videoState.video.loop"
          label="Loop video"
          :disabled="false"
          :right="true"
          @valuechange="val => videoState.setLoop(val)"
        />
      </div>
    </ListCollapsibleSection>
  </div>
</template>

<style lang="scss" scoped>
.speed-section {
  display: flex;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  padding-right: 10px;
  margin-top: 10px;

  .video-speed-checkbox {
    display: flex;
    flex: 1;
    margin-left: 5px;
  }

  .speed-dropdown {
    margin-right: 0 !important;
    width: unset !important;
  }

  .number-input {
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
}

.loop-section {
  :deep(.switch) {
    width: calc(100% - 10px) !important;
  }
}
</style>
