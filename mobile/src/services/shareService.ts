import * as Linking from 'expo-linking';
import type { Timer, ShareableTimer, ShareableTimerLink } from '@ultimate-timer/shared';
import { SCHEMA_VERSION } from '@ultimate-timer/shared';

// Deep link scheme (must match app.json scheme)
const SCHEME = 'ultimate-timer';
const SHARE_PATH = 'timer';

/**
 * Simple checksum for validation
 */
function calculateChecksum(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36).substring(0, 8);
}

/**
 * Encode a timer to a shareable format
 */
export function encodeTimer(timer: Timer): ShareableTimerLink | null {
  // Only custom timers with dates can be shared
  if (timer.type !== 'custom' || !timer.startDate || !timer.endDate) {
    return null;
  }

  const shareable: ShareableTimer = {
    version: SCHEMA_VERSION,
    type: 'custom',
    name: timer.name,
    startDate: timer.startDate,
    endDate: timer.endDate,
    mode: timer.mode,
  };

  const jsonString = JSON.stringify(shareable);
  const payload = btoa(jsonString); // Base64 encode
  const checksum = calculateChecksum(jsonString);

  return { payload, checksum };
}

/**
 * Decode a shareable timer link
 */
export function decodeTimer(link: ShareableTimerLink): ShareableTimer | null {
  try {
    const jsonString = atob(link.payload); // Base64 decode

    // Verify checksum
    if (calculateChecksum(jsonString) !== link.checksum) {
      console.error('Invalid checksum');
      return null;
    }

    const shareable = JSON.parse(jsonString) as ShareableTimer;

    // Validate structure
    if (
      typeof shareable.version !== 'number' ||
      shareable.type !== 'custom' ||
      typeof shareable.name !== 'string' ||
      typeof shareable.startDate !== 'string' ||
      typeof shareable.endDate !== 'string'
    ) {
      console.error('Invalid timer structure');
      return null;
    }

    return shareable;
  } catch (error) {
    console.error('Failed to decode timer:', error);
    return null;
  }
}

/**
 * Generate a shareable deep link URL
 */
export function generateShareUrl(timer: Timer): string | null {
  const encoded = encodeTimer(timer);
  if (!encoded) return null;

  // Format: fleetingtime://timer?p=<payload>&c=<checksum>
  const url = Linking.createURL(SHARE_PATH, {
    scheme: SCHEME,
    queryParams: {
      p: encoded.payload,
      c: encoded.checksum,
    },
  });

  return url;
}

/**
 * Parse a deep link URL to extract timer data
 */
export function parseShareUrl(url: string): ShareableTimer | null {
  try {
    const parsed = Linking.parse(url);

    if (parsed.path !== SHARE_PATH) {
      return null;
    }

    const payload = parsed.queryParams?.p as string | undefined;
    const checksum = parsed.queryParams?.c as string | undefined;

    if (!payload || !checksum) {
      return null;
    }

    return decodeTimer({ payload, checksum });
  } catch (error) {
    console.error('Failed to parse share URL:', error);
    return null;
  }
}

/**
 * Generate shareable text content
 */
export function generateShareText(timer: Timer): string {
  const url = generateShareUrl(timer);
  const endDate = timer.endDate ? new Date(timer.endDate).toLocaleDateString() : '';

  let text = `Check out my timer "${timer.name}"`;
  if (endDate) {
    text += ` ending on ${endDate}`;
  }
  text += `\n\nTrack your time with Fleeting Time!`;

  if (url) {
    text += `\n\n${url}`;
  }

  return text;
}


/**
 * Get the initial URL that opened the app (for deep linking)
 */
export async function getInitialUrl(): Promise<string | null> {
  return Linking.getInitialURL();
}

/**
 * Add listener for incoming deep links
 */
export function addLinkingListener(
  callback: (event: { url: string }) => void
): { remove: () => void } {
  const subscription = Linking.addEventListener('url', callback);
  return subscription;
}
