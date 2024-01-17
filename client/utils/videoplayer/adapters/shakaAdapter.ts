import type { MediaInfo } from 'dashjs';
import type { EventListenerCallback, VideoplaybackAdapter } from './adapter';

export const shakaAdapter: VideoplaybackAdapter = async options => {
  const { source, startTime, videoRef } = options;
  const shaka = await import('shaka-player');

  shaka.polyfill.installAll();

  const browserSupported = shaka.Player.isBrowserSupported();
  if (!browserSupported) {
    throw new Error('Browser not supported');
  }

  const shakaPlayer = new shaka.Player();

  const eventStorage = new Map<string, EventListenerCallback>();

  const registerCallback = (event: string) => (callback: EventListenerCallback) => {
    eventStorage.set(event, callback);
    shakaPlayer.addEventListener(event, callback);
  };

  const unregisterCallback = (event: string) => {
    const callback = eventStorage.get(event);
    if (callback) {
      shakaPlayer.removeEventListener(event, callback);
    }
  };

  const onError = registerCallback('error');
  const onMessage = registerCallback('message');
  const onOpen = registerCallback('open');

  onError(error => {
    console.log('Shaka error', error);
  });

  onMessage(message => {
    console.log('Shaka message', message);
  });

  onOpen(e => {
    console.log('Shaka open', e);
  });

  // Register callbacks
  const onPlaybackStarted = registerCallback('dashjs.MediaPlayer.events.PLAYBACK_STARTED');
  const onPlaybackPaused = registerCallback('dashjs.MediaPlayer.events.PLAYBACK_PAUSED');
  const onPlaybackTimeUpdated = registerCallback('dashjs.MediaPlayer.events.PLAYBACK_TIME_UPDATED');
  const onStreamActivated = registerCallback('dashjs.MediaPlayer.events.STREAM_ACTIVATED');
  const onStreamDeactivated = registerCallback('dashjs.MediaPlayer.events.STREAM_DEACTIVATED');
  const onStreamTeardownComplete = registerCallback(
    'dashjs.MediaPlayer.events.STREAM_TEARDOWN_COMPLETE'
  );
  const onTextTracksAdded = registerCallback('dashjs.MediaPlayer.events.TEXT_TRACKS_ADDED');
  const onBufferLevelUpdated = registerCallback('dashjs.MediaPlayer.events.BUFFER_LEVEL_UPDATED');
  const onCanPlay = registerCallback('dashjs.MediaPlayer.events.CAN_PLAY');
  const onWaiting = registerCallback('dashjs.MediaPlayer.events.PLAYBACK_WAITING');
  const onVolumeChanged = registerCallback('dashjs.MediaPlayer.events.PLAYBACK_VOLUME_CHANGED');
  const onPlaybackRateChanged = registerCallback('dashjs.MediaPlayer.events.PLAYBACK_RATE_CHANGED');

  await shakaPlayer.attach(videoRef.value);

  const destroy = () => {
    // unregisterCallback(dashjs.MediaPlayer.events.PLAYBACK_STARTED);
    // unregisterCallback(dashjs.MediaPlayer.events.PLAYBACK_PAUSED);
    // unregisterCallback(dashjs.MediaPlayer.events.PLAYBACK_TIME_UPDATED);
    // unregisterCallback(dashjs.MediaPlayer.events.STREAM_ACTIVATED);
    // unregisterCallback(dashjs.MediaPlayer.events.STREAM_DEACTIVATED);
    // unregisterCallback(dashjs.MediaPlayer.events.STREAM_TEARDOWN_COMPLETE);
    // unregisterCallback(dashjs.MediaPlayer.events.TEXT_TRACKS_ADDED);
    // unregisterCallback(dashjs.MediaPlayer.events.BUFFER_LEVEL_UPDATED);
    // unregisterCallback(dashjs.MediaPlayer.events.CAN_PLAY);
    // unregisterCallback(dashjs.MediaPlayer.events.PLAYBACK_WAITING);
    // unregisterCallback(dashjs.MediaPlayer.events.PLAYBACK_VOLUME_CHANGED);
    // unregisterCallback(dashjs.MediaPlayer.events.PLAYBACK_RATE_CHANGED);

    shakaPlayer.destroy();
  };

  // Getters
  const getBufferLevel = () => {
    const bufferLevel = 0;
    // if (typeof mediaPlayer.getDashMetrics === 'function') {
    //   const dashMetrics = mediaPlayer.getDashMetrics();
    //   if (dashMetrics) {
    //     bufferLevel = dashMetrics.getCurrentBufferLevel('video');
    //     if (!bufferLevel) {
    //       bufferLevel = dashMetrics.getCurrentBufferLevel('audio');
    //     }
    //   }
    // }
    return bufferLevel;
  };
  const getVideoQualityList = () => {
    return shakaPlayer.getVariantTracks().map(track => ({
      ...track,
      label: `${track.height}p - ${humanizeBitrate(track.bandwidth)}`
    }));
  };
  const getAudioQualityList = () => {
    return shakaPlayer.getVariantTracks().map(track => ({
      ...track,
      label: `${track.height}p - ${humanizeBitrate(track.bandwidth)}`
    }));
  };
  const getVideoTrackList = () => {
    return shakaPlayer.getImageTracks().map(track => {
      return {
        ...track,
        label: track.label
      };
    });
  };
  const getAudioTrackList = () => {
    return shakaPlayer.getVariantTracks().map(track => {
      return {
        ...track,
        label: track.label ?? track.language
      };
    });
  };

  const getTime = () => videoRef.value.currentTime;
  const getDuration = () => videoRef.value.duration;
  const getVolume = () => videoRef.value.volume;
  const getPlaybackRate = shakaPlayer.getPlaybackRate;

  // Setters
  const setVolume = (volume: number) => {
    videoRef.value.volume = volume;
  };
  const setTime = (time: number) => {
    videoRef.value.currentTime = time;
  };
  const setPlaybackRate = (rate: number) => {
    videoRef.value.playbackRate = rate;
  };
  const play = () => {
    videoRef.value.play();
  };
  const pause = () => {
    videoRef.value.pause();
  };

  // Initialize player
  watch(source, (newValue, oldValue) => {
    if (newValue !== oldValue) {
      const startTimeNumber = startTime?.value ?? 0;
      shakaPlayer.load(source.value, startTimeNumber);
    }
  });
  const startTimeNumber = startTime?.value ?? 0;
  shakaPlayer.load(source.value, startTimeNumber);

  return {
    type: 'dash',

    onPlaybackStarted,
    onPlaybackPaused,
    onPlaybackTimeUpdated,
    onStreamActivated,
    onStreamDeactivated,
    onStreamTeardownComplete,
    onTextTracksAdded,
    onBufferLevelUpdated,
    onPlaybackRateChanged,
    onCanPlay,
    onWaiting,
    onVolumeChanged,

    getTime,
    getDuration,
    getBufferLevel,
    getPlaybackRate,
    getVideoQualityList,
    getAudioQualityList,
    getVideoTrackList,
    getAudioTrackList,

    getVolume,
    setVolume,
    setTime,
    setPlaybackRate,
    play,
    pause,
    destroy
  };
};