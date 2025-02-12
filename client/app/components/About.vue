<script setup lang="ts">
import { description, version } from '~~/../package.json';
import BadgeButton from '~/components/buttons/BadgeButton.vue';

import { commit, abbreviated_commit, subject } from '~~/buildMetadata.json';
import { useMessagesStore } from '~/store/messages';

defineEmits<{
  (e: 'close'): void;
}>();

const messagesStore = useMessagesStore();

const copyCommitHash = () => {
  navigator.clipboard.writeText(commit);
  messagesStore.createMessage({
    title: 'Copied to clipboard',
    message: 'Copied commit hash to clipboard',
    type: 'info',
    dismissDelay: 3000
  });
};
</script>

<template>
  <div class="about popup">
    <div class="about-container popup-container">
      <VTIcon v-ripple name="mdi:close" class="close-icon" @click.stop="$emit('close')" />
      <h1>About</h1>
      <div class="logo-about">
        <img class="logo-about-img" src="~/assets/icon.svg" alt="ViewTube" />
      </div>
      <h2>{{ description }}</h2>
      <div class="last-commit">
        <h4 class="version">Version</h4>
        <h4 class="version-code">{{ version }}</h4>
        <h4>Last commit</h4>
        <h4 v-tippy="'Click to copy'" class="commit-hash" @click="copyCommitHash">
          {{ abbreviated_commit
          }}<span class="full-commit">
            {{ commit.replace(abbreviated_commit, '') }}
          </span>
        </h4>
        <h4 class="commit-subject">
          {{ subject }}
          <a
            :href="`https://github.com/ViewTube/viewtube/commit/${commit}`"
            target="_blank"
            rel="noreferrer noopener"
            ><VTIcon name="mdi:open-in-new"
          /></a>
        </h4>
      </div>
      <div class="links-about">
        <BadgeButton :href="'https://github.com/viewtube/viewtube'">
          <VTIcon name="mdi:github" />ViewTube
        </BadgeButton>
      </div>
      <div class="external-service-container">
        <div class="external-service links">
          <img
            class="external-service-image"
            src="~/assets/icons/sponsorblock.png"
            alt="Sponsorblock icon"
          />
          <p>
            This project uses the <span class="highlight">SponsorBlock</span> database and API
            licensed under
            <a
              href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
              target="_blank"
              rel="noreferrer noopener"
              >CC BY-NC-SA 4.0</a
            >.<br />More details can be found at
            <a href="https://sponsor.ajay.app" target="_blank" rel="noreferrer noopener">
              https://sponsor.ajay.app</a
            >.
          </p>
        </div>
      </div>
      <div class="external-service-container">
        <div class="external-service links">
          <svg
            class="external-service-image"
            width="150"
            height="150"
            viewBox="0 0 24 24"
            overflow="visible"
          >
            <path
              d="M14.9 3H6c-.9 0-1.6.5-1.9 1.2l-3 7c-.1.3-.1.5-.1.7v2c0 1.1.9 2 2 2h6.3l-.9 4.5c-.1.5 0 1 .4 1.4l1.1 1.1 6.5-6.6c.4-.4.6-.9.6-1.4V5c-.1-1.1-1-2-2.1-2zm7.4 12.8h-2.9c-.4 0-.7-.3-.7-.7V3.9c0-.4.3-.7.7-.7h2.9c.4 0 .7.3.7.7V15c0 .4-.3.8-.7.8z"
            />
            <path id="plarrow" d="m8 12.5 5.1-2.9L8 6.7v5.8z" fill="#fff" stroke="none" />
          </svg>
          <p>
            This project uses the <span class="highlight">Return YouTube Dislike</span> API
            according to the usage rights found at
            <a
              href="https://www.returnyoutubedislike.com/docs/usage-rights"
              target="_blank"
              rel="noreferrer noopener"
              >Return YouTube Dislike Usage Rights</a
            >.<br />More details can be found at
            <a
              href="https://www.returnyoutubedislike.com"
              target="_blank"
              rel="noreferrer noopener"
            >
              https://www.returnyoutubedislike.com</a
            >.
          </p>
        </div>
      </div>
    </div>
    <div class="about-overlay popup-overlay" @click.stop="$emit('close')" />
  </div>
</template>

<style lang="scss">
.external-service {
  margin: 15px 0 0 0 !important;
  display: flex;

  .external-service-image {
    width: 36px;
    height: 36px;
    fill: transparent;
    stroke: #f44;
    fill: #f44;
  }

  .highlight {
    color: var(--theme-color);
  }

  p {
    margin: 0 0 0 10px;
  }
}

.external-service-container {
  margin: 0 !important;
}

.last-commit {
  display: grid;
  margin: 5px 0 0 0 !important;
  grid-template-areas:
    'version version-code'
    'title hash'
    'title commit';
  gap: 0 15px;
  max-width: 100%;
  overflow: hidden;

  .version {
    grid-area: version;
    margin: 0 0 5px 0;
  }

  .version-code {
    grid-area: version-code;
  }

  .commit-hash {
    grid-area: hash;
    cursor: pointer;

    &:hover {
      .full-commit {
        opacity: 1;
      }
    }

    .full-commit {
      opacity: 0;
      transition: opacity 300ms variables.$intro-easing;
    }
  }

  .commit-subject {
    grid-area: commit;
    // Break text
    word-break: break-word;

    .vt-icon {
      width: 14px;
      height: 14px;
      padding: 2px 0 0 0;
      box-sizing: border-box;
    }
  }
}

.links-about {
  margin: 10px 0 0 0 !important;
}

.about-container {
  overflow-y: auto;
}

.logo-about {
  padding: 40px 0 0 0;
  margin: 0 auto 0 auto !important;
  width: 150px;
  height: 150px;

  .logo-about-img {
    width: 100%;
    transform-origin: top left;
    animation: float-around 10s variables.$dynamic-easing infinite;

    @keyframes float-around {
      0% {
        transform: translate(0, 0);
      }

      50% {
        transform: translate(-10%, -10%) scale(1.2);
      }

      100% {
        transform: translate(0, 0);
      }
    }
  }
}
</style>
