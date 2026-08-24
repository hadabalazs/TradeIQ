import { useEffect } from "react";

// Sets the browser tab title, restoring the previous one on unmount.
//
// The tab title was fixed at "TradeIQ — IFRS & Commodity Trading Academy" for
// every route, so a bookmark or an open tab for any course named the wrong
// course. This fixes the tab, the bookmark and the browser history entry.
//
// It does NOT fix link previews on LinkedIn, WhatsApp or Slack: those crawlers
// do not execute JavaScript, so they never see a title set from React. That is
// handled server-side by netlify/edge-functions/social-meta.js.
const DEFAULT_TITLE = "TradeIQ Academy";

export function usePageTitle(title) {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} — TradeIQ Academy` : DEFAULT_TITLE;
    return () => { document.title = previous; };
  }, [title]);
}

export default usePageTitle;
