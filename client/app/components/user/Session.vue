<script setup lang="ts">
import humanizeDuration from 'humanize-duration';
import type { ApiDto } from '@viewtube/shared';
import { useMessagesStore } from '~/store/messages';
import dayjs from 'dayjs';

const props = defineProps<{
  session: ApiDto<'SessionDto'>;
}>();

const emit = defineEmits<{
  (e: 'refresh'): void;
}>();

const { removeSession: removeUserSession } = useRemoveSession();
const { editSession: editUserSession } = useEditSession();
const { createMessage } = useMessagesStore();
const { deviceTypes } = useDeviceType();

const updatedAt = computed(() => {
  const now = dayjs();
  const date = dayjs(props.session.updatedAt);

  const dateMs = now.valueOf() - date.valueOf();
  if (dateMs < 1000 * 60 * 10) {
    return 'just now';
  }

  return `${humanizeDateString(props.session.updatedAt)} ago`;
});
const expires = computed(() => humanizeDateString(props.session.expires));

const humanizeDateString = (dateString: string): string => {
  const now = dayjs();
  const date = dayjs(dateString);
  const dateMs = now.valueOf() - date.valueOf();
  return humanizeDuration(dateMs, { largest: 1, round: true });
};

const editSessionPrompt = ref(false);
const openEditPrompt = () => {
  editSessionPrompt.value = true;
};

const removalPrompt = ref(false);
const removeSession = () => {
  removalPrompt.value = true;
};

const cancelRemoveSession = () => {
  removalPrompt.value = false;
};

const confirmRemoveSession = () => {
  removeUserSession(props.session.id)
    .then(() => {
      createMessage({
        type: 'info',
        title: 'Session removed successfully',
        message: 'Device logged out'
      });

      emit('refresh');
    })
    .catch(() => {
      createMessage({
        type: 'error',
        title: 'Session removal failed',
        message: 'Failed to log out device'
      });
    });
};

const editSession = (newName: string, newDeviceType: string) => {
  editSessionPrompt.value = false;
  editUserSession(props.session.id, { deviceName: newName, deviceType: newDeviceType })
    .then(() => {
      createMessage({
        type: 'info',
        title: 'Session edited successfully',
        message: 'Device name and icon updated'
      });

      emit('refresh');
    })
    .catch(() => {
      createMessage({
        type: 'error',
        title: 'Session edit failed',
        message: 'Failed to update device name and icon'
      });
    });
};
</script>

<template>
  <div class="session" :class="{ current: session.current }">
    <div class="removal-prompt" :class="{ visible: removalPrompt }">
      <div class="prompt-text">
        <span>Remove session and log out this device?</span>
      </div>
      <div class="prompt-actions">
        <button class="prompt-confirm" @click="confirmRemoveSession">
          <VTIcon name="mdi:check" />
        </button>
        <button class="prompt-cancel" @click="cancelRemoveSession">
          <VTIcon name="mdi:close" />
        </button>
      </div>
    </div>
    <VTIcon class="session-icon" :name="deviceTypes.get(session.deviceType)" />
    <div class="session-details">
      <div class="session-name">
        <span>{{ session.deviceName }}</span>
      </div>
      <div class="session-last-used">
        <span>Last used {{ updatedAt }} · Expires in {{ expires }}</span>
      </div>
    </div>
    <button class="session-edit" @click="openEditPrompt">
      <VTIcon name="mdi:pencil" />
    </button>
    <button v-if="!session.current" class="session-remove" @click="removeSession">
      <VTIcon name="mdi:trash-can-outline" />
    </button>
  </div>
  <PopupEdit
    :open="editSessionPrompt"
    title="Edit device name"
    :initial-value="session.deviceName"
    :initial-device-type="session.deviceType"
    @close="editSessionPrompt = false"
    @confirm="editSession"
  />
</template>

<style lang="scss" scoped>
.session {
  background-color: var(--bgcolor-alt);
  margin: 0 0 15px 0;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  box-shadow: variables.$low-shadow;
  position: relative;
  overflow: hidden;
  padding: 0 6px 0 0;

  .removal-prompt {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: var(--bgcolor-alt-light);
    z-index: 10;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0 6px 0 15px;
    transition: clip-path 300ms variables.$intro-easing;
    clip-path: circle(0% at calc(100% - 28px) 50%);

    &.visible {
      clip-path: circle(150% at 100% 0%);
    }

    .prompt-text {
      font-size: 0.9rem;
      color: var(--title-color);
    }

    .prompt-actions {
      display: flex;

      .prompt-confirm,
      .prompt-cancel {
        all: unset;
        cursor: pointer;
        width: 40px;
        height: 40px;
        display: flex;
        position: relative;
        border-radius: 3px;

        .vt-icon {
          margin: auto;
          height: 1.3rem;
          width: 1.3rem;
          color: var(--title-color);
        }
      }
    }
  }

  &.current {
    border: solid 2px var(--theme-color);
    box-shadow: variables.$medium-shadow;
  }

  .session-remove,
  .session-edit {
    all: unset;
    cursor: pointer;
    width: 40px;
    height: 40px;
    display: flex;
    position: relative;
    border-radius: 3px;

    .vt-icon {
      margin: auto;
      height: 1.3rem;
      width: 1.3rem;
    }
  }

  .session-edit {
    margin: auto 0 auto auto;
  }

  .session-remove {
    margin: auto 0 auto 0;
    color: var(--error-color-red);
  }

  .session-icon {
    font-size: 1rem;
    color: var(--theme-color);
    margin: auto 12px auto 12px;
  }

  .session-details {
    margin: 8px 0;

    .session-name {
      font-size: 0.9rem;
      font-weight: bold;
    }

    .session-last-used {
      font-size: 0.8rem;
      color: var(--text-color-alt);
    }
  }
}
</style>
