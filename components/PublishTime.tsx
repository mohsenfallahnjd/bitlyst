import type { FunctionComponent } from "react";

interface PublishTimeProps {
  publishedTime: string;
}

const PublishTime: FunctionComponent<PublishTimeProps> = ({ publishedTime }) => {
  return (
    <time dateTime={publishedTime} style={{ textTransform: "capitalize" }}>
      {new Date(publishedTime) > new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
        ? new Intl.RelativeTimeFormat("en-US", { style: "long", numeric: "auto" }).format(
            Math.floor((new Date(publishedTime).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
            "days"
          )
        : new Date(publishedTime).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
    </time>
  );
};

export default PublishTime;
