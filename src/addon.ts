import { manifest } from "./manifest.js";
import { AddonBuilder } from "@stremio-addon/zod";
import { to } from "await-to-js";
import { cinemeta } from "./cinemeta.js";
import type { Stream } from "@stremio-addon/sdk";

const builder = new AddonBuilder(manifest);

function isReleased(date: Date): boolean {
  if (!date) return false;
  const now = new Date();
  const releaseDate = new Date(date);
  return releaseDate <= now;
}

const NOT_RELEASED: Stream = {
  name: "isitevenoutyet",
  description: "Not released yet, any\nstreams you see\nare likely wrong.",
  url: "https://github.com/stremio/stremio-isitevenoutyet",
};

// Streams handler.
builder.defineStreamHandler(async ({ type, id }) => {
  console.info(`[stream] got id ${id} of type ${type}`);

  const split = id.split(":");
  const [sid, s, e] = split;
  console.info(`[stream] sid: ${sid}, season: ${s}, episode: ${e}`);

  const season = !Number.isNaN(+s) ? Number(s) : undefined;
  const episode = !Number.isNaN(+e) ? Number(e) : undefined;

  // fetch release info for a series
  if (type === "series") {
    if (!season || !episode) {
      console.error("Invalid season or episode");
      return { streams: [] };
    }

    const [releaseErr, releaseInfo] = await to(
      cinemeta.series(sid, season, episode),
    );

    if (releaseErr || !releaseInfo) {
      console.error("Couldn't fetch release info.");
      console.error(releaseErr);
      return { streams: [] };
    }

    if (releaseInfo.released && !isReleased(releaseInfo.released)) {
      console.info(
        `${releaseInfo.name} S${season} E${episode} is not released yet.`,
      );
      return {
        streams: [
          {
            ...NOT_RELEASED,
            description: `${releaseInfo.name} S${season} E${episode} is not released yet.`,
          },
        ],
      };
    }
  }

  if (type === "movie") {
    const [releaseErr, releaseInfo] = await to(cinemeta.movie(sid));

    if (releaseErr || !releaseInfo) {
      console.error("Couldn't fetch release info.");
      console.error(releaseErr);
      return { streams: [] };
    }

    if (releaseInfo.released && !isReleased(releaseInfo.released)) {
      console.error("Movie is not released yet.");
      return {
        streams: [
          {
            ...NOT_RELEASED,
            description: `${releaseInfo.name} is not released yet.`,
          },
        ],
      };
    }
  }

  return { streams: [] };
});

export const addonInterface = builder.getInterface();
