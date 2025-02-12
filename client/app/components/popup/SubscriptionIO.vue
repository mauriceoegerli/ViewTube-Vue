<script setup lang="ts">
import CheckBox from '~/components/form/CheckBox.vue';
import BadgeButton from '~/components/buttons/BadgeButton.vue';
import FileButton from '~/components/form/FileButton.vue';
import Spinner from '~/components/Spinner.vue';
import '~/assets/styles/popup.scss';

class ChannelDto {
  author: string;
  authorId: string;
  selected?: boolean;
}

const emit = defineEmits<{
  (e: 'done' | 'close'): void;
}>();

const { data: userSubscriptions, refresh } = useGetUserSubscriptionChannels({
  currentPage: 0,
  limit: 0
});
const { apiUrl } = useApiUrl();
const { vtFetch } = useVtFetch();

const page2 = ref(false);
const page3 = ref(false);
const loading = ref(false);
const importedSubscriptions = ref(null);

const { subscriptionsToImport, getMergedImports, getSubscriptionsToImport } = useSubscriptionIO();

const selectedChannels = computed((): Array<ChannelDto> => {
  return subscriptionsToImport.value.filter((e: { selected: any }) => e.selected);
});
const anySelectedChannel = computed((): boolean => {
  return !(selectedChannels.value.length > 0);
});

const successfulMergedImports = computed(
  (): Array<ChannelDto> => getMergedImports(importedSubscriptions.value?.successful)
);

const existingMergedImports = computed(
  (): Array<ChannelDto> => getMergedImports(importedSubscriptions.value?.existing)
);

const failedMergedImports = computed(
  (): Array<ChannelDto> => getMergedImports(importedSubscriptions.value?.failed)
);

const onTryClosePopup = () => {
  if (!(page2.value || page2.value)) {
    emit('close');
  }
};

const onImportFileChange = async (e: any) => {
  loading.value = true;
  const file = e.target.files[0];
  const extension = file.name.split('.').pop();

  const subscriptions = await getSubscriptionsToImport(file, extension);
  if (subscriptions?.length > 0) {
    subscriptionsToImport.value = subscriptions;
    page2.value = true;
  }
  loading.value = false;
};

const exportVT = async () => {
  await refresh();
  await nextTick();
  const mappedChannels = userSubscriptions.value?.channels?.map(({ author, authorId }) => ({
    author,
    authorId
  }));
  if (!mappedChannels) return;
  const jsonData = JSON.stringify(mappedChannels);
  triggerDownload('subscriptions.json', jsonData, 'application/json');
};

const exportOPML = async () => {
  await refresh();
  await nextTick();
  const xml = convertFromInternalToOPML(
    userSubscriptions.value?.channels?.map(({ author, authorId }) => ({
      author,
      authorId,
      selected: true
    }))
  );
  if (!xml) return;
  triggerDownload('subscriptions.xml', xml, 'application/xml');
};

const exportPiped = async () => {
  await refresh();
  await nextTick();
  const mappedChannels = userSubscriptions.value?.channels?.map(({ author, authorId }) => ({
    url: `https://www.youtube.com/channel/${authorId}`,
    name: author,
    service_id: 0
  }));
  if (!mappedChannels) return;
  const jsonData = JSON.stringify({
    app_version: '',
    app_version_int: 0,
    subscriptions: mappedChannels
  });
  triggerDownload('subscriptions.json', jsonData, 'application/json');
};

const triggerDownload = (filename: string, text: string, type: string) => {
  const element = document.createElement('a');
  const file = new Blob([text], { type: type });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
};

const channelCheckBoxChanged = (newValue: any, channelId: any) => {
  subscriptionsToImport.value.find((e: { authorId: string }) => e.authorId === channelId).selected =
    newValue;
};

const selectAll = () => {
  subscriptionsToImport.value.forEach((el: { selected: boolean }) => {
    el.selected = true;
  });
};

const unselectAll = () => {
  subscriptionsToImport.value.forEach((el: { selected: boolean }) => {
    el.selected = false;
  });
};

const importSelected = async () => {
  loading.value = true;
  const subscriptions = selectedChannels.value;
  const subscriptionIds = subscriptions.map(({ author, authorId }) => ({
    channelId: authorId,
    name: author
  }));

  const response = await vtFetch(`${apiUrl.value}user/subscriptions/multiple`, {
    method: 'POST',
    body: {
      channels: subscriptionIds
    },
    credentials: 'include'
  });

  page2.value = false;
  page3.value = true;
  loading.value = false;
  importedSubscriptions.value = response;
  emit('done');
};
</script>

<template>
  <div class="subscriptions-import popup">
    <div class="popup-container subscriptions-import-container">
      <VTIcon v-ripple name="mdi:close" class="close-icon" @click.stop="$emit('close')" />
      <h1>
        {{
          loading
            ? 'Importing subscriptions'
            : page3
              ? 'Imported subscriptions'
              : 'Import subscriptions'
        }}
      </h1>
      <div class="pages-container" :class="{ 'page-2': page2 }">
        <div class="page-container page-1-container links">
          <a
            class="how-to-import"
            href="https://viewtube.wiki/features/import-subscriptions"
            target="_blank"
            rel="noreferrer noopener"
          >
            How do I import subscriptions?
          </a>
          <FileButton :label="'Import'" @change="onImportFileChange">
            <VTIcon name="mdi:import" />
          </FileButton>
        </div>
        <div
          v-if="subscriptionsToImport && subscriptionsToImport.length > 0"
          class="page-container page-2-container"
        >
          <h2>Select subscriptions to import</h2>
          <div class="list-actions">
            <div class="left">
              <BadgeButton :click="selectAll">
                <VTIcon name="mdi:select-all" />
                <p>Select all</p>
              </BadgeButton>
              <BadgeButton :click="unselectAll">
                <VTIcon name="mdi:select" />
                <p>Unselect all</p>
              </BadgeButton>
            </div>
            <div class="right">
              <BadgeButton :click="importSelected" :disabled="anySelectedChannel">
                <VTIcon name="mdi:import" />
                <p>Import</p>
              </BadgeButton>
            </div>
          </div>
          <div class="subscription-channels-container">
            <div
              v-for="channel in subscriptionsToImport"
              :key="channel.authorId"
              class="subscription"
            >
              <CheckBox
                :value="channel.selected"
                :label="channel.author"
                @valuechange="e => channelCheckBoxChanged(e, channel.authorId)"
              />
            </div>
          </div>
        </div>
        <div v-if="importedSubscriptions" class="page-container page-3-container">
          <h2>Import results</h2>
          <h3 v-if="successfulMergedImports.length > 0">
            {{ successfulMergedImports.length }} successful import{{
              successfulMergedImports.length !== 1 ? 's' : ''
            }}.
          </h3>
          <p>New videos will be available after the next sync.</p>
          <div v-if="successfulMergedImports.length > 0" class="import-area">
            <div class="import-list">
              <p v-for="subscription in successfulMergedImports" :key="subscription.authorId">
                {{ subscription.author }}
              </p>
            </div>
          </div>
          <h3 v-if="existingMergedImports.length > 0">
            {{ existingMergedImports.length }} already existing subscription{{
              existingMergedImports.length !== 1 ? 's' : ''
            }}
          </h3>
          <div v-if="existingMergedImports.length > 0" class="import-area">
            <div class="import-list">
              <p v-for="subscription in existingMergedImports" :key="subscription.authorId">
                {{ subscription.author }}
              </p>
            </div>
          </div>
          <h3 v-if="failedMergedImports.length > 0">
            {{ failedMergedImports.length }} failed import{{
              failedMergedImports.length !== 1 ? 's' : ''
            }}
          </h3>
          <div v-if="failedMergedImports.length > 0" class="import-area">
            <div class="import-list">
              <a
                v-for="subscription in failedMergedImports"
                :key="subscription.authorId"
                :href="`/channel/${subscription.authorId}`"
                target="_blank"
                ><VTIcon name="mdi:open-in-new" />{{ subscription.author }}</a
              >
            </div>
          </div>
        </div>
        <div class="loading-overlay" :class="{ loading }">
          <Spinner />
          <p class="loading-text">This can take a while</p>
        </div>
      </div>
      <h1 v-if="!subscriptionsToImport">
        {{ loading ? 'Exporting subscriptions' : 'Export subscriptions' }}
      </h1>
      <div v-if="!subscriptionsToImport" class="pages-container" :class="{ 'page-2': page2 }">
        <div class="export-buttons">
          <BadgeButton :click="exportVT"> <VTIcon name="mdi:play" /> ViewTube </BadgeButton>
          <BadgeButton :click="exportOPML"><VTIcon name="mdi:xml" /> Invidious / OPML </BadgeButton>
          <BadgeButton :click="exportPiped">
            <VTIcon name="mdi:pipe" /> Piped / Newpipe
          </BadgeButton>
        </div>
      </div>
    </div>
    <div class="settings-overlay popup-overlay" @click.stop="onTryClosePopup" />
  </div>
</template>

<style lang="scss">
.subscriptions-import {
  .subscriptions-import-container {
    .export-buttons {
      display: flex;
      flex-direction: row;
      justify-content: center;
      a {
        margin-left: 10px;
        margin-right: 10px;
      }
    }
    .pages-container {
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      position: relative;
      box-sizing: border-box;
      margin: 0;

      .not-available {
        margin: 10px 0 0 0;
        text-align: center;
      }

      .loading-overlay {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 11;
        background-color: var(--bgcolor-alt);
        opacity: 0;
        pointer-events: none;
        transition: opacity 300ms variables.$intro-easing;

        .loading-text {
          position: absolute;
          top: 55%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .spinner {
          position: absolute;
          top: 40%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        &.loading {
          opacity: 1;
          pointer-events: all;
        }
      }

      .page-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: hidden scroll;
        background-color: var(--bgcolor-alt);
        display: flex;
        flex-direction: column;

        .how-to-import {
          margin: 0 auto;
        }
      }

      // .page-1-container {
      // }
      .page-2-container {
        pointer-events: none;
        user-select: none;
        opacity: 0;
        transform: translateX(10px);
        transition:
          transform 300ms variables.$overshoot-easing,
          opacity 300ms variables.$intro-easing;

        .list-actions {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }

        h2 {
          padding: 10px 0;
        }

        .subscription-channels-container {
          display: flex;
          flex-direction: column;

          .subscription {
            display: flex;
            flex-direction: row;
            margin: 10px 0;

            .checkbox {
              width: 100%;

              .label {
                flex-grow: 1;
                text-align: start;
              }
            }
          }
        }
      }

      .page-3-container {
        display: flex;
        flex-direction: column;
        height: 100%;

        .import-area {
          flex-grow: 1;
          height: 100%;
          overflow: hidden auto;
          background-color: var(--bgcolor-main);

          .import-list {
            font-size: 0.9rem;

            a {
              display: block;
              span {
                width: 16px;
                height: 16px;
                svg {
                  width: 16px;
                  height: 16px;
                }
              }
            }
          }
        }
      }

      &.page-2 {
        .page-2-container {
          pointer-events: auto;
          user-select: auto;
          transform: translateX(0);
          opacity: 1;
        }
      }
    }
  }
}
</style>
