import React from 'react';
import { DEFAULT_CONTENT } from '../../shared/content-defaults.js';

/**
 * Serves the site's editable content.
 *
 * The shipped defaults render immediately, then the API's copy replaces them if
 * the server answers. That ordering matters: the site is a restaurant's shop
 * window, so it must render its real copy even when the CMS is down, still
 * starting, or not running at all in a static deploy.
 */

export const ContentContext = React.createContext(DEFAULT_CONTENT);

export function useContent() {
  return React.useContext(ContentContext);
}

/** Slot id -> the uploaded image an admin chose for it, if any. */
export function useImageOverride(slotId) {
  return useContent().images?.[slotId] || null;
}

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export function ContentProvider({ children }) {
  const [content, setContent] = React.useState(DEFAULT_CONTENT);

  React.useEffect(() => {
    const aborter = new AbortController();

    fetch(`${API_BASE}/api/content`, { signal: aborter.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((loaded) => {
        if (loaded) {
          // The local CMS can retain the original starter copy after a design
          // update. Keep owner-edited content, but replace that identifiable
          // legacy Experiences seed with the current Spaces page defaults.
          const legacyEvents = ['Experiences', 'Events'].includes(loaded.pages?.experiences?.label);
          setContent(legacyEvents
            ? { ...loaded, pages: { ...loaded.pages, experiences: DEFAULT_CONTENT.pages.experiences } }
            : loaded);
        }
      })
      .catch(() => {
        // No API reachable - the defaults already on screen are correct.
      });

    return () => aborter.abort();
  }, []);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}
