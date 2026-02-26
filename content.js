// content.js — Content Script
// Runs on Google Meet (meet.google.com) and Zoom Web (*.zoom.us).
// Detects the platform, scrapes meeting context, and responds to background queries.

// ---------- Platform Detection ----------

function detectPlatform(url) {
  if (!url) return "unknown";
  if (url.includes("meet.google.com")) return "google_meet";
  if (url.includes(".zoom.us")) return "zoom_web";
  return "unknown";
}

// ---------- Title Extraction ----------

function getMeetingTitle() {
  // Google Meet: title is typically "<code> - Google Meet" or meeting topic in specific elements
  const metaTitle = document.title;

  // Try to extract cleaner title from known DOM patterns
  const selectors = [
    // Google Meet — meeting code shown in header
    "[data-meeting-title]",
    // Google Meet — top bar text
    "c-wiz[data-p] span[data-topic]",
    // Zoom Web — meeting title
    "[id='meeting-info-header'] .meeting-title",
    "[id='wc-container-left'] .meeting-name",
    ".meeting-client-inner .meeting-title",
    // Generic
    "h1"
  ];

  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el) {
      const text = (el.getAttribute("data-meeting-title") ||
                    el.getAttribute("data-topic") ||
                    el.textContent || "").trim();
      if (text && text.length > 0 && text.length < 200) {
        return text;
      }
    }
  }

  // Fall back to document.title, stripping platform suffixes
  return metaTitle
    .replace(/ - Google Meet$/, "")
    .replace(/^Zoom - /, "")
    .trim();
}

// ---------- Participant Collection ----------

function collectParticipants() {
  const candidates = new Set();

  // Google Meet participant selectors
  const googleMeetSelectors = [
    "[data-self-name]",
    "[data-participant-id] [data-self-name]",
    "[aria-label*='(you)' i]",
    "[aria-label*='(You)']",
    "[role='listitem'] [aria-label]",
    // Participant panel entries
    "div[data-requested-participant-id]",
    "div[jscontroller] [data-participant-name]"
  ];

  // Zoom Web participant selectors
  const zoomSelectors = [
    "[class*='participants-item__display-name']",
    "[class*='participantsTab'] [aria-label]",
    ".participants-section-container__participants-name",
    "[id*='participant-name']"
  ];

  const allSelectors = [...googleMeetSelectors, ...zoomSelectors];

  for (const selector of allSelectors) {
    try {
      document.querySelectorAll(selector).forEach((el) => {
        const text = (
          el.getAttribute("data-self-name") ||
          el.getAttribute("data-participant-name") ||
          el.getAttribute("aria-label") ||
          el.textContent ||
          ""
        ).trim();
        // Filter: non-empty, reasonable length, skip generic labels
        if (text && text.length >= 2 && text.length < 120) {
          candidates.add(text);
        }
      });
    } catch {
      // Selector may not be valid in all contexts; skip.
    }
  }

  return Array.from(candidates).slice(0, 100);
}

// ---------- Platform-Specific Helpers ----------

/**
 * Returns a human-readable platform label for UI display.
 */
function getPlatformLabel(platform) {
  if (platform === "google_meet") return "Google Meet";
  if (platform === "zoom_web") return "Zoom Web";
  return "Unknown Platform";
}

// ---------- Message Listener ----------

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "GET_MEETING_CONTEXT") {
    return false;
  }

  try {
    const platform = detectPlatform(location.href);
    const title = getMeetingTitle();
    const participants = collectParticipants();
    const platformLabel = getPlatformLabel(platform);

    sendResponse({
      platform,
      platformLabel,
      title,
      participants,
      url: location.href
    });
  } catch (error) {
    sendResponse({
      platform: detectPlatform(location.href),
      platformLabel: getPlatformLabel(detectPlatform(location.href)),
      title: document.title,
      participants: [],
      url: location.href,
      error: error.message
    });
  }

  return false;
});

// ---------- Notify Background When Page Loads ----------
// Useful for background to know the platform when tab becomes active.

(function notifyPlatformOnLoad() {
  const platform = detectPlatform(location.href);
  if (platform === "unknown") return;

  // Small delay to ensure background service worker is ready
  setTimeout(() => {
    try {
      chrome.runtime.sendMessage({
        type: "CONTENT_PLATFORM_DETECTED",
        platform,
        platformLabel: getPlatformLabel(platform),
        url: location.href,
        title: document.title
      });
    } catch {
      // background may not be listening — non-fatal
    }
  }, 500);
})();
