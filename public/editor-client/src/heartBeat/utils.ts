import set from "lodash/set";

interface ResetNonceProps {
  data: {
    status: string;
    code: number;
    hash: string;
    pagePreview: string;
    changeTemplate: string;
  };
}
export const resetNonce = ({ data }: ResetNonceProps) => {
  const isUnauthenticated =
    data?.status === "unauthenticated" && data?.code === 401;

  var _w = window.parent !== window && typeof window.parent.brizyOpenAuthModal === "function" ? window.parent : window;
  if (isUnauthenticated) {
    if (typeof _w.brizyOpenAuthModal === "function") _w.brizyOpenAuthModal();
  } else {
    if (typeof _w.brizyCloseAuthModal === "function") _w.brizyCloseAuthModal();
  }

  const isNonceExpired = data?.status === "nonce_expired" && data?.code === 403;

  if (
    !(isNonceExpired && window.__BRZ_PLUGIN_ENV__ && window.__VISUAL_CONFIG__)
  ) return;

  const hash = data?.hash;
  const pagePreview = data?.pagePreview;
  const changeTemplate = data?.changeTemplate;

  if (hash) {
    set(window.__BRZ_PLUGIN_ENV__, ["hash"], hash);
    if (window.__BRZ_PLUGIN_ENV__.actions) {
      set(window.__BRZ_PLUGIN_ENV__, ["actions", "hash"], hash);
    }
    
    const pluginApi = window.__BRZ_PLUGIN_ENV__.api as Record<string, unknown> | undefined;
    const customIcon = pluginApi?.customIcon as Record<string, string> | undefined;
    if (customIcon) {
      const setHashInUrl = (url: string, h: string): string => {
        try {
          const u = new URL(url, window.location.origin);
          u.searchParams.set("hash", h);
          return u.toString();
        } catch {
          return url;
        }
      };
      if (customIcon.getIconsUrl) customIcon.getIconsUrl = setHashInUrl(customIcon.getIconsUrl, hash);
      if (customIcon.uploadIconUrl) customIcon.uploadIconUrl = setHashInUrl(customIcon.uploadIconUrl, hash);
      if (customIcon.deleteIconUrl) customIcon.deleteIconUrl = setHashInUrl(customIcon.deleteIconUrl, hash);
    }

    set(window.__VISUAL_CONFIG__, ["api", "hash"], hash);
    set(window.__VISUAL_CONFIG__, ["wp", "api", "hash"], hash);
    set(window.__VISUAL_CONFIG__, ["urls", "pagePreview"], pagePreview);
    set(window.__VISUAL_CONFIG__, ["urls", "changeTemplate"], changeTemplate);

    if (typeof _w.brizyCloseAuthModal === "function") _w.brizyCloseAuthModal();
  } else {
    if (typeof _w.brizyOpenAuthModal === "function") _w.brizyOpenAuthModal();
  }
};