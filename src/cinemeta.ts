import ky from "ky";
import { z } from "zod";
import { to } from "await-to-js";

const CINEMETA_URL = "https://v3-cinemeta.strem.io/meta/{type}/{id}.json";
const constructUrl = (id: string, ep?: { season: number; episode: number }) => {
  if (ep) {
    return CINEMETA_URL.replace("{type}", "series")
      .replace("{id}", id)
      .replace("{season}", ep.season.toString())
      .replace("{episode}", ep.episode.toString());
  }
  return CINEMETA_URL.replace("{type}", "movie").replace("{id}", id);
};

const MetaMovieResponse = z.object({
  meta: z.object({
    imdb_id: z.string(),
    name: z.string(),
    released: z.coerce.date().optional(),
  }),
});
type MetaMovieResponse = z.infer<typeof MetaMovieResponse>;

const MetaSeriesResponse = z.object({
  meta: z.object({
    imdb_id: z.string(),
    name: z.string(),
    released: z.coerce.date().optional(),
    videos: z
      .object({
        name: z.string(),
        season: z.number(),
        episode: z.number(),
        released: z.coerce.date().optional(),
      })
      .array()
      .optional(),
  }),
});
type MetaSeriesResponse = z.infer<typeof MetaSeriesResponse>;

export const cinemeta = {
  movie: async (imdbId: string) => {
    const [err, res] = await to(ky<MetaMovieResponse>(constructUrl(imdbId)));
    if (err) {
      console.error(err);
      return null;
    }
    const json = await res.json();
    const parsed = MetaMovieResponse.safeParse(json);
    if (!parsed.success) {
      console.error(parsed.error);
      return null;
    }
    return parsed.data.meta;
  },
  series: async (imdbId: string, season: number, episode: number) => {
    const [err, res] = await to(
      ky<MetaSeriesResponse>(constructUrl(imdbId, { season, episode })),
    );
    if (err) {
      console.error(err);
      return null;
    }
    const json = await res.json();
    const parsed = MetaSeriesResponse.safeParse(json);
    if (!parsed.success) {
      console.error(parsed.error);
      return null;
    }

    // get the particular episode and return the release date
    const foundEp = parsed.data.meta.videos?.find(
      (video) => video.season === season && video.episode === episode,
    );
    return foundEp
      ? {
          showName: parsed.data.meta.name,
          ...foundEp,
        }
      : undefined;
  },
};
