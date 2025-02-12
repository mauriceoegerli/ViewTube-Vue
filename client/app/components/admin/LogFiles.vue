<script setup lang="ts">
import BadgeButton from '~/components/buttons/BadgeButton.vue';
import dayjs from 'dayjs';

const { data, error, pending, refresh } = useGetLogs();

const { apiUrl } = useApiUrl();

const downloadLogFile = (logFileName: string) => {
  const link = document.createElement('a');
  link.href = `${apiUrl.value}admin/logs/${logFileName}`;
  link.download = logFileName;
  link.click();
};

const selectText = (event: MouseEvent) => {
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(event.target as Node);
  selection.removeAllRanges();
  selection.addRange(range);
};
</script>

<template>
  <div class="log-files-container">
    <Spinner v-if="pending" />
    <p v-if="error">Error loading log files</p>
    <div v-if="data && !pending" class="log-files">
      <table class="log-files-table">
        <tr>
          <th>Log file</th>
          <th>Size</th>
          <th class="right created">Created</th>
          <th class="right modified">Modified</th>
        </tr>
        <tr
          v-for="(log, index) in data.logFiles"
          :key="index"
          class="log-file"
          tabindex="0"
          @click="() => downloadLogFile(log.name)"
        >
          <td>{{ log.name }}</td>
          <td>{{ $formatting.humanizeFileSize(log.size) }}</td>
          <td class="right created">{{ dayjs(log.created).format('YYYY-MM-DD hh:mm') }}</td>
          <td class="right modified">{{ dayjs(log.lastModified).format('YYYY-MM-DD hh:mm') }}</td>
        </tr>
      </table>
    </div>
    <div class="info">
      <p v-if="data && !pending">
        Logs are located in
        <span class="location" @click="selectText">{{ data.location }}</span>
      </p>
      <BadgeButton v-if="data" class="refresh-btn" :click="refresh">Refresh</BadgeButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.log-files-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .info {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .location {
      font-family: monospace;
      color: var(--theme-color);
      font-size: 1rem;
      white-space: nowrap;
    }

    .refresh-btn {
      align-self: flex-end;
    }
  }

  .log-files {
    width: 100%;

    .log-files-table {
      border: none;
      width: 100%;
      border-spacing: 0;
      border-collapse: separate;
      border-spacing: 0 5px;

      tr {
        th,
        td {
          text-align: left;

          @media screen and (max-width: variables.$mobile-width) {
            &.created {
              display: none;
            }
          }

          @media screen and (max-width: calc($mobile-width - 200px)) {
            &.modified {
              display: none;
            }
          }

          &.right {
            text-align: right;
          }
        }
      }

      .log-file {
        cursor: pointer;

        &:active {
          td {
            background-color: var(--bgcolor-alt-light);
          }
        }

        &:hover:not(:active) {
          td {
            background-color: var(--bgcolor-alt);
          }
        }

        td {
          padding: 4px 0;
          transition: background-color 100ms variables.$intro-easing;

          &:first-child {
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
            padding-left: 6px;
          }

          &:last-child {
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
            padding-right: 6px;
          }
        }
      }
    }
  }
}
</style>
