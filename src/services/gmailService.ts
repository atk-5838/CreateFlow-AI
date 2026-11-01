import { EmailThread, EmailCategory } from '../types';

// Helper to base64url decode
function decodeBase64Url(input: string): string {
  try {
    const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (m) => m.charCodeAt(0));
    return new TextDecoder('utf-8').decode(bytes);
  } catch (e) {
    return input;
  }
}

// Helper to base64url encode for sending RFC 2822
function encodeBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Extract email body from Gmail payload parts
function extractBodyFromPayload(payload: any): string {
  if (!payload) return '';

  if (payload.body && payload.body.data) {
    return decodeBase64Url(payload.body.data);
  }

  if (payload.parts && payload.parts.length > 0) {
    // Prefer text/plain, fallback to text/html
    const plainPart = payload.parts.find((p: any) => p.mimeType === 'text/plain');
    if (plainPart && plainPart.body?.data) {
      return decodeBase64Url(plainPart.body.data);
    }

    const htmlPart = payload.parts.find((p: any) => p.mimeType === 'text/html');
    if (htmlPart && htmlPart.body?.data) {
      const decodedHtml = decodeBase64Url(htmlPart.body.data);
      // Strip tags for clean text preview
      return decodedHtml.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
    }

    // Check recursive parts
    for (const part of payload.parts) {
      const nested = extractBodyFromPayload(part);
      if (nested) return nested;
    }
  }

  return '';
}

// Infer category from subject and body
function inferCategory(subject: string, body: string): EmailCategory[] {
  const combined = `${subject} ${body}`.toLowerCase();
  const cats: EmailCategory[] = [];

  if (combined.includes('deal') || combined.includes('collab') || combined.includes('contract') || combined.includes('offer') || combined.includes('sponsor') || combined.includes('budget') || combined.includes('rate')) {
    cats.push('Brand Deals');
  }
  if (combined.includes('revision') || combined.includes('feedback') || combined.includes('cut') || combined.includes('edit') || combined.includes('change')) {
    cats.push('Feedback');
  }
  if (combined.includes('deadline') || combined.includes('due') || combined.includes('tomorrow') || combined.includes('urgent') || combined.includes('timeline')) {
    cats.push('Deadlines');
  }
  if (combined.includes('follow') || combined.includes('update') || combined.includes('invoice') || combined.includes('payment') || combined.includes('status')) {
    cats.push('Follow-ups');
  }

  return cats.length > 0 ? cats : ['Brand Deals'];
}

export interface LiveGmailFetchResult {
  threads: EmailThread[];
  rawCount: number;
}

/**
 * Fetch live emails from user's Gmail account
 */
export async function fetchLiveGmailMessages(accessToken: string): Promise<LiveGmailFetchResult> {
  const listUrl = 'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=15';
  const listRes = await fetch(listUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!listRes.ok) {
    const errorData = await listRes.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to fetch Gmail messages (Status ${listRes.status})`);
  }

  const listData = await listRes.json();
  const messageRefs: { id: string; threadId: string }[] = listData.messages || [];

  if (messageRefs.length === 0) {
    return { threads: [], rawCount: 0 };
  }

  // Fetch full details for the top messages in parallel
  const detailPromises = messageRefs.slice(0, 10).map(async (ref) => {
    try {
      const msgRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${ref.id}?format=full`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!msgRes.ok) return null;
      return await msgRes.json();
    } catch {
      return null;
    }
  });

  const rawMessages = (await Promise.all(detailPromises)).filter(Boolean);

  const convertedThreads: EmailThread[] = rawMessages.map((msg: any) => {
    const headers = msg.payload?.headers || [];
    const getHeader = (name: string) =>
      headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value || '';

    const subject = getHeader('Subject') || '(No Subject)';
    const fromHeader = getHeader('From') || 'Unknown Sender';
    const dateHeader = getHeader('Date') || '';

    // Parse sender name and email
    let senderName = fromHeader;
    let senderEmail = fromHeader;
    const match = fromHeader.match(/^(.*?)\s*<(.+?)>$/);
    if (match) {
      senderName = match[1].replace(/["']/g, '').trim() || match[2];
      senderEmail = match[2];
    }

    const brandName = senderName.split(' ')[0] || 'Brand';
    const brandInitials = brandName.slice(0, 2).toUpperCase();

    // Body extraction
    const rawBody = extractBodyFromPayload(msg.payload) || msg.snippet || '';
    const cleanBody = rawBody.slice(0, 1500);
    const preview = msg.snippet || cleanBody.slice(0, 120);

    const isUnread = (msg.labelIds || []).includes('UNREAD');
    const categories = inferCategory(subject, cleanBody);

    // Date formatting
    let formattedDate = 'Recently';
    let fullTimestamp = 'Live from Gmail';
    if (dateHeader) {
      try {
        const d = new Date(dateHeader);
        formattedDate = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        fullTimestamp = `${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      } catch {
        formattedDate = 'Recently';
      }
    }

    return {
      id: `live-gmail-${msg.id}`,
      brandName,
      brandInitials,
      brandColor: '#216F50',
      senderName,
      senderEmail,
      date: formattedDate,
      timestamp: fullTimestamp,
      subject,
      preview,
      body: cleanBody,
      unread: isUnread,
      categories,
      campaignId: 'camp-live',
      campaignName: `Live: ${brandName} Collaboration`,
      isLive: true,
      aiInsights: {
        summary: `Live email from ${senderName} regarding "${subject}".`,
        detectedIntent: categories[0] || 'Brand communication',
        requestedChanges: categories.includes('Feedback') ? 'Feedback items mentioned in message body' : 'No changes requested',
        deadlineNotice: categories.includes('Deadlines') ? 'Delivery deadline mentioned in message' : undefined,
      },
    };
  });

  return {
    threads: convertedThreads,
    rawCount: messageRefs.length,
  };
}

/**
 * Send an email through live Gmail API
 */
export async function sendLiveGmailReply(
  accessToken: string,
  to: string,
  subject: string,
  body: string,
  cc?: string
): Promise<{ id: string; threadId?: string }> {
  const headers = [
    `To: ${to}`,
  ];
  if (cc && cc.trim()) {
    headers.push(`Cc: ${cc.trim()}`);
  }
  const cleanSubject = subject.trim() || 'CreatorFlow AI Collaboration';
  headers.push(`Subject: ${cleanSubject}`);
  headers.push('Content-Type: text/plain; charset=UTF-8');
  headers.push('MIME-Version: 1.0');
  headers.push('');
  headers.push(body);

  const rfc2822 = headers.join('\r\n');
  const rawBase64Url = encodeBase64Url(rfc2822);

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: rawBase64Url }),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error?.message || `Failed to send email via Gmail (Status ${res.status})`);
  }

  return await res.json();
}
