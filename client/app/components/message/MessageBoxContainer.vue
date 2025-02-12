<script setup lang="ts">
import MessageBox from '~/components/message/MessageBox.vue';
import { useMessagesStore } from '~/store/messages';

const messagesStore = useMessagesStore();
</script>

<template>
  <div class="messages-container">
    <ClientOnly>
      <MessageBox
        v-for="message in messagesStore.visibleMessages"
        :key="message.id"
        :message="message"
      />
    </ClientOnly>
  </div>
</template>

<style lang="scss" scoped>
.messages-container {
  position: fixed;
  right: 0;
  top: 0;
  display: flex;
  z-index: 1000;
  padding: 0 10px;
  margin: variables.$header-height 0 0 0;
  flex-direction: column;

  @media screen and (max-width: variables.$mobile-width) {
    flex-direction: column-reverse;
    top: unset;
    bottom: 0;
    width: 100%;
  }
}
</style>
