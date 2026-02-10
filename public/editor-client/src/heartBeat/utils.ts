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

  if (isUnauthenticated) {
    if (typeof window.brizyOpenAuthModal === "function") {
      window.brizyOpenAuthModal();
    }
  } else {
    if (typeof window.brizyCloseAuthModal === "function") {
      window.brizyCloseAuthModal();
    }
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

    set(window.__VISUAL_CONFIG__, ["api", "hash"], hash);
    set(window.__VISUAL_CONFIG__, ["wp", "api", "hash"], hash);
    set(window.__VISUAL_CONFIG__, ["urls", "pagePreview"], pagePreview);
    set(window.__VISUAL_CONFIG__, ["urls", "changeTemplate"], changeTemplate);

    if (typeof window.brizyCloseAuthModal === "function") {
      window.brizyCloseAuthModal();
    }
  } else {
    if (typeof window.brizyOpenAuthModal === "function") {
      window.brizyOpenAuthModal();
    }
  }
};