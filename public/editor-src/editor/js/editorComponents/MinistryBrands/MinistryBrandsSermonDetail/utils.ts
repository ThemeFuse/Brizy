import { getAttr } from "../utils/helpers";
import { Value } from "./types";

export const getPlaceholder = (v: Value): string => {
  const {
    showImage,
    showVideo,
    showAudio,
    showMediaLinksVideo,
    showMediaLinksAudio,
    showMediaLinksDownload,
    showMediaLinksNotes,
    showTitle,
    showDate,
    showCategory,
    showGroup,
    showSeries,
    showPreacher,
    showPassage,
    showMetaHeadings,
    showPreview,
    recentSermons
  } = v;

  const _showImage = getAttr(showImage, "show_image");
  const _showVideo = getAttr(showVideo, "show_video");
  const _showAudio = getAttr(showAudio, "show_audio");

  const _showMediaLinksVideo = getAttr(
    showMediaLinksVideo,
    "show_media_links_video"
  );
  const _showMediaLinksAudio = getAttr(
    showMediaLinksAudio,
    "show_media_links_audio"
  );
  const _showMediaLinksDownload = getAttr(
    showMediaLinksDownload,
    "show_media_links_download"
  );
  const _showMediaLinksNotes = getAttr(
    showMediaLinksNotes,
    "show_media_links_notes"
  );

  const _showTitle = getAttr(showTitle, "show_title");
  const _showDate = getAttr(showDate, "show_date");
  const _showCategory = getAttr(showCategory, "show_category");
  const _showGroup = getAttr(showGroup, "show_group");
  const _showSeries = getAttr(showSeries, "show_series");
  const _showPreacher = getAttr(showPreacher, "show_preacher");
  const _showPassage = getAttr(showPassage, "show_passage");
  const _showMetaHeadings = getAttr(showMetaHeadings, "show_meta_headings");
  const _showPreview = getAttr(showPreview, "show_preview");

  return `{{ekk_sermon_detail
              sermons_recent='${recentSermons}'
              ${_showImage}
              ${_showVideo}
              ${_showAudio}
              ${_showMediaLinksVideo}
              ${_showMediaLinksAudio}
              ${_showMediaLinksDownload}
              ${_showMediaLinksNotes}
              ${_showTitle}
              ${_showDate}
              ${_showCategory}
              ${_showGroup}
              ${_showSeries}
              ${_showPreacher}
              ${_showPassage}
              ${_showMetaHeadings}
              ${_showPreview}           
          }}`;
};
