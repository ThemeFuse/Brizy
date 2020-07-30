import $ from "jquery";

const makeSrcWithAutoplay = (baseUrl, params = {}) => {
  let url = new URL(baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  return url.href;
};

let initResize = false;

export default function($node) {
  const $window = $(window);
  const $doc = $(document);
  let needRefreshOnDesktop = false;

  $node.find(".brz-video-playlist").on("click", function(e) {
    const $this = $(this);
    const $target = $(e.target);
    const $playlistItem = $target.closest(".brz-video-playlist-video-item");
    const $cover = $target.closest(".brz-video-playlist-main__cover");
    const $video = $this.find(".brz-video-playlist-main__video");
    const $placeholder = $this.find(".brz-video-playlist-main__placeholder");
    const isMobile = $window.innerWidth() < 767;
    const activeClass = "brz-video-playlist-video-item--active";

    // switch active class
    if (!$target.hasClass(activeClass)) {
      $target.addClass(activeClass);
      $target.siblings().removeClass(activeClass);
    }

    if ($playlistItem.length) {
      const src = $playlistItem.attr("data-link");

      $this.find(".brz-video-playlist-main").addClass("brz-d-none");
      $this
        .find(".brz-video-playlist-video-item")
        .removeClass("brz-video-playlist-video-item--active");
      $playlistItem.addClass("brz-video-playlist-video-item--active");

      if (src) {
        $video.removeClass("brz-d-none");
        $video
          .find(".brz-iframe")
          .attr("src", makeSrcWithAutoplay(src, { autoplay: 1 }));

        if (isMobile) {
          $video.addClass("brz-video-playlist-modal");
        } else {
          $video.removeClass("brz-video-playlist-modal");
        }
      } else {
        $placeholder.removeClass("brz-d-none");
        $video.find(".brz-iframe").attr("src", "");

        if (isMobile) {
          $placeholder.addClass("brz-video-playlist-modal");
        } else {
          $placeholder.removeClass("brz-video-playlist-modal");
        }
      }
    } else if (isMobile) {
      $video
        .removeClass("brz-video-playlist-modal")
        .find(".brz-iframe")
        .attr("src", "");
      $placeholder.removeClass("brz-video-playlist-modal");

      needRefreshOnDesktop = true;
    }

    // Cover
    if ($cover.length) {
      e.preventDefault();
      const src = $cover.find(".brz-a").attr("href");

      $cover.addClass("brz-d-none");
      $video.removeClass("brz-d-none");
      $video
        .find(".brz-iframe")
        .attr("src", makeSrcWithAutoplay(src, { autoplay: 1 }));
    }
  });

  // onresize play video
  if (!initResize) {
    initResize = true;
    $window.on("resize", function() {
      if (needRefreshOnDesktop && $window.innerWidth() >= 767) {
        const $playlist = $(".brz-video-playlist");
        const $currentPlaylistItem = $playlist.find(
          ".brz-video-playlist-video-item--active"
        );
        needRefreshOnDesktop = false;

        if ($currentPlaylistItem.length) {
          const $cover = $playlist.find(".brz-video-playlist-main__cover");
          const $video = $playlist.find(".brz-video-playlist-main__video");
          const $placeholder = $playlist.find(
            ".brz-video-playlist-main__placeholder"
          );
          const hasCover = $currentPlaylistItem.hasClass(
            "brz-video-playlist-video-item__cover"
          );
          const src = $currentPlaylistItem.attr("data-link");

          $playlist.find(".brz-video-playlist-main").addClass("brz-d-none");

          if (hasCover) {
            $cover.removeClass("brz-d-none");
            $cover.find(".brz-iframe").remove();
          } else if (src) {
            $video.removeClass("brz-d-none");
            $video.find(".brz-iframe").attr("src", src);
          } else {
            $placeholder.removeClass("brz-d-none");
            $video.find(".brz-iframe").attr("src", "");
          }
        }
      }
    });
  }

  // stopping all videos inside a popup that is closed(video can be set through embed code)
  $doc.on("brz.popup.close", function(e, popup) {
    const $popup = $(popup);

    $popup
      .find(".brz-video-playlist .brz-iframe, .brz-embed-code iframe")
      .each(function() {
        const $this = $(this);
        const src = $this.attr("src");

        $this.attr("src", ""); // this forces the video to stop
        $this.attr("src", makeSrcWithAutoplay(src, { autoplay: 0 }));
      });
  });
}
