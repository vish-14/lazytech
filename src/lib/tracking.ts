// Tracking & Attribution Library
export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  utm_link_id?: string;
}

const VISITOR_ID_KEY = "lt_visitor_id";
const SESSION_ID_KEY = "lt_session_id";
const SESSION_EXPIRY_KEY = "lt_session_exp";
const FIRST_TOUCH_KEY = "lt_first_touch";
const LAST_TOUCH_KEY = "lt_last_touch";

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function getVisitorId(): string {
  if (typeof window === 'undefined') return '';
  let vid = localStorage.getItem(VISITOR_ID_KEY);
  if (!vid) {
    vid = generateId();
    localStorage.setItem(VISITOR_ID_KEY, vid);
  }
  return vid;
}

export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  const now = Date.now();
  let sid = localStorage.getItem(SESSION_ID_KEY);
  const exp = localStorage.getItem(SESSION_EXPIRY_KEY);
  
  if (!sid || !exp || now > parseInt(exp, 10)) {
    sid = generateId();
    localStorage.setItem(SESSION_ID_KEY, sid);
  }
  
  // Extend session
  localStorage.setItem(SESSION_EXPIRY_KEY, (now + SESSION_TIMEOUT_MS).toString());
  return sid;
}

export function setAttribution(params: UTMParams) {
  if (typeof window === 'undefined') return;
  if (Object.keys(params).length === 0) return;

  const currentFirstTouch = localStorage.getItem(FIRST_TOUCH_KEY);
  if (!currentFirstTouch) {
    localStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(params));
  }
  
  // Always update last touch if new UTMs are present
  localStorage.setItem(LAST_TOUCH_KEY, JSON.stringify(params));
}

export function getAttribution() {
  if (typeof window === 'undefined') return { firstTouch: null, lastTouch: null };
  try {
    const firstTouchStr = localStorage.getItem(FIRST_TOUCH_KEY);
    const lastTouchStr = localStorage.getItem(LAST_TOUCH_KEY);
    
    return {
      firstTouch: firstTouchStr ? JSON.parse(firstTouchStr) as UTMParams : null,
      lastTouch: lastTouchStr ? JSON.parse(lastTouchStr) as UTMParams : null
    };
  } catch (e) {
    return { firstTouch: null, lastTouch: null };
  }
}

// Ensure events aren't spammed
const recentEvents = new Set<string>();

export async function trackEvent(
  eventType: 'PAGE_VIEW' | 'CTA_CLICK' | 'REGISTRATION_STARTED' | 'REGISTRATION_SUBMITTED' | 'CHECKOUT_STARTED' | 'RAZORPAY_OPENED', 
  details?: { 
    product_type?: string, 
    landing_page?: string,
    metadata?: any 
  }
) {
  if (typeof window === 'undefined') return;

  const visitor_id = getVisitorId();
  const session_id = getSessionId();
  const { lastTouch } = getAttribution();

  // Debounce duplicate events within 5 seconds to prevent react re-render spam
  const dedupeKey = `${eventType}-${details?.product_type || ''}-${details?.landing_page || ''}`;
  if (recentEvents.has(dedupeKey)) return;
  
  recentEvents.add(dedupeKey);
  setTimeout(() => recentEvents.delete(dedupeKey), 5000);

  const payload = {
    visitor_id,
    session_id,
    event_type: eventType,
    product_type: details?.product_type,
    landing_page: details?.landing_page || window.location.pathname,
    utm_link_id: lastTouch?.utm_link_id,
    utm_source: lastTouch?.utm_source,
    utm_medium: lastTouch?.utm_medium,
    utm_campaign: lastTouch?.utm_campaign,
    utm_content: lastTouch?.utm_content,
    utm_term: lastTouch?.utm_term,
    referrer: document.referrer,
    device_type: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
    metadata: details?.metadata
  };

  try {
    // Send to our tracking endpoint (fire and forget)
    fetch('/api/public/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      // keepalive to ensure it sends even if they navigate away
      keepalive: true
    }).catch(() => {});
  } catch (e) {
    // silently fail
  }
}
