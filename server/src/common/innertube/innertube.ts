import path from 'path';
import { Innertube, Log, UniversalCache } from 'youtubei.js';
import type { InnerTubeConfig } from 'youtubei.js/dist/src/types';
import { innertubeFetch } from './innertubeFetch';

Log.setLevel(Log.Level.ERROR);

let cacheDirectory = './cache';
if (process.env.VIEWTUBE_DATA_DIRECTORY) {
  cacheDirectory = path.join(process.env.VIEWTUBE_DATA_DIRECTORY, 'cache');
}

const innertubeOptions: InnerTubeConfig = {
  cache: new UniversalCache(true, cacheDirectory),
  fetch: innertubeFetch,
  enable_session_cache: false,
  lang: 'en'
};

if (process.env.VIEWTUBE_LOCATION) {
  innertubeOptions.location = process.env.VIEWTUBE_LOCATION;
}

if (process.env.VIEWTUBE_YOUTUBE_COOKIE) {
  innertubeOptions.cookie = process.env.VIEWTUBE_YOUTUBE_COOKIE;
}

if (process.env.VIEWTUBE_PO_TOKEN) {
  innertubeOptions.po_token = process.env.VIEWTUBE_PO_TOKEN;
}

if (process.env.VIEWTUBE_VISITOR_DATA) {
  innertubeOptions.visitor_data = process.env.VIEWTUBE_VISITOR_DATA;
}

let innerTubeClient: Innertube | null = null;
let clientCreatedAt: number | null = null;

export const innertubeClient = async () => {
  const clientOutdated = clientCreatedAt ? Date.now() - clientCreatedAt > 600000 : true;
  if (!innerTubeClient || clientOutdated) {
    innerTubeClient = await Innertube.create(innertubeOptions);
    clientCreatedAt = Date.now();
  }
  return innerTubeClient;
};
