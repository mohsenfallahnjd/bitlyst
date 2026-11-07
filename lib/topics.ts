export const BRAND = "#0e36e9";
export const BRAND_LIGHT = "#3a5cff";
export const WHITE = "#ffffff";

/** `bar` fills the logo's top row; `ink` is text drawn on top of it. */
export type TopicColor = { bar: string; ink: string };

export const DEFAULT_TOPIC: TopicColor = { bar: WHITE, ink: BRAND };

const TOPICS: Record<string, TopicColor> = {
  react: { bar: "#61dafb", ink: "#07202b" },
  nextjs: { bar: "#0b0c10", ink: WHITE },
  typescript: { bar: "#b7c9ff", ink: "#0f2a66" },
  javascript: { bar: "#f7df1e", ink: "#1c1a02" },
};

/** The first topic among a post's tags wins, since a post lists its main subject first. */
export function topicColor(tags: string[]): TopicColor {
  for (const tag of tags) {
    const topic = TOPICS[tag.toLowerCase().replace(/[^a-z]/g, "")];
    if (topic) {
      return topic;
    }
  }
  return DEFAULT_TOPIC;
}
