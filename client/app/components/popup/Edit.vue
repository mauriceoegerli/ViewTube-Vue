<script setup lang="ts">
import BadgeButton from '~/components/buttons/BadgeButton.vue';

const props = defineProps<{
  title: string;
  initialValue: string;
  initialDeviceType: string;
  open: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm', value: string, deviceType: string): void;
}>();

const { deviceTypes, deviceTypeIcons } = useDeviceType();

const value = ref(props.initialValue);
const deviceType = ref(props.initialDeviceType);

const icon = computed({
  get: () => deviceTypes.get(deviceType.value),
  set: (newIcon: string) => {
    const newDeviceType = [...deviceTypes].find(([, value]) => value === newIcon)?.[0];
    deviceType.value = newDeviceType;
  }
});

const confirm = () => {
  emit('confirm', value.value, deviceType.value);
};
</script>

<template>
  <transition name="popup">
    <PopupConfirmation v-if="open" :title="title" @close="$emit('close')">
      <div class="session-edit-form">
        <FormIconSwitcher v-model="icon" :available-icons="deviceTypeIcons" />
        <FormInput id="device-name" v-model="value" type="text" label="Device name" autofocus />
        <div class="session-edit-btns">
          <BadgeButton :click="() => $emit('close')">Cancel</BadgeButton>
          <BadgeButton :click="confirm">OK</BadgeButton>
        </div>
      </div>
    </PopupConfirmation>
  </transition>
</template>

<style lang="scss">
.popup-enter-active,
.popup-leave-active {
  transition:
    opacity 300ms variables.$intro-easing,
    transform 300ms variables.$intro-easing;
}
.popup-enter-to,
.popup-leave-from {
  opacity: 1;
  transform: scale(1);
}
.popup-enter-from,
.popup-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

.session-edit-form {
  display: flex;
  flex-direction: column;
  width: 100%;

  .session-edit-btns {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .form-input {
    grid-area: input;

    .input {
      margin: 15px 0;
      width: 100%;
    }

    .input-label {
      left: 14px;
    }
  }
}

.confirmation-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 901;

  .confirmation {
    padding: 10px 20px;
    border-radius: 5px;
    box-shadow: variables.$max-shadow;
    z-index: 9;
    position: fixed;
    top: 50%;
    min-width: 250px;
    max-width: 350px;
    width: 100%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--bgcolor-alt);
    box-sizing: border-box;

    .actions {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      margin-top: 10px;

      .badge-btn:last-of-type {
        margin: 2px 0;
      }
    }
  }
}
</style>
