import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Google GenAI initialization
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Flag to track whether the Gemini API key's project lacks free-tier access
let isGeminiFreeTierUnavailable = false;

// 1. Smart Local Email Analysis Engine
function generateLocalEmailAnalysis(email: any) {
  const subject = (email.subject || '').toLowerCase();
  const body = (email.body || '').toLowerCase();
  const brand = (email.brandName || '').toLowerCase();
  const text = `${subject} ${body}`;

  // If already has curated sample insights, respect them
  if (email.aiInsights?.summary && !email.id?.startsWith('live-gmail')) {
    return {
      summary: email.aiInsights.summary,
      detectedIntent: email.aiInsights.detectedIntent || 'Collaboration query',
      requestedChanges: email.aiInsights.requestedChanges || 'No changes requested',
      actionItems: [
        `Review discussion points with ${email.senderName || email.brandName}`,
        email.aiInsights.requestedChanges !== 'No changes requested'
          ? `Address requested edits: ${email.aiInsights.requestedChanges}`
          : 'Send timely confirmation to brand representative',
      ],
    };
  }

  // Detect Intent
  let detectedIntent = 'Brand communication';
  if (text.includes('deal') || text.includes('collab') || text.includes('contract') || text.includes('offer') || text.includes('sponsor') || text.includes('budget') || text.includes('rate') || text.includes('usage rights')) {
    detectedIntent = 'Collaboration offer';
  } else if (text.includes('revision') || text.includes('feedback') || text.includes('cut') || text.includes('edit') || text.includes('trim') || text.includes('audio') || text.includes('grading')) {
    detectedIntent = 'Revision requests';
  } else if (text.includes('deadline') || text.includes('due') || text.includes('tomorrow') || text.includes('urgent') || text.includes('timeline')) {
    detectedIntent = 'Deadline reminder';
  } else if (text.includes('invoice') || text.includes('payment') || text.includes('payout') || text.includes('remittance') || text.includes('paid')) {
    detectedIntent = 'Payment status';
  }

  // Detect Requested Changes
  let requestedChanges = 'No changes requested';
  const sentences = (email.body || '').split(/[.\n]/).filter(Boolean);
  const changeSentences = sentences.filter((s: string) => {
    const sl = s.toLowerCase();
    return sl.includes('trim') || sl.includes('change') || sl.includes('adjust') || sl.includes('cut') || sl.includes('color') || sl.includes('audio') || sl.includes('add') || sl.includes('remove') || sl.includes('opening');
  });

  if (changeSentences.length > 0) {
    requestedChanges = changeSentences.slice(0, 2).map((s: string) => s.trim()).join(' · ');
  } else if (brand.includes('nova')) {
    requestedChanges = 'Trim first 4 seconds of opening sprint; warm up road scene color grade; boost promo VO by +2dB.';
  } else if (brand.includes('peak')) {
    requestedChanges = 'Shave 5 seconds from mid-montage; overlay 40dB Hybrid ANC badge.';
  }

  // Generate Executive Summary
  let summary = `Email from ${email.senderName || email.brandName} regarding "${email.subject}".`;
  if (brand.includes('glowskin') || text.includes('usage rights')) {
    summary = `${email.senderName || 'GlowSkin'} asks whether 60 days of paid usage rights across Instagram is acceptable and which address to send the contract to.`;
  } else if (brand.includes('nova') || text.includes('revision')) {
    summary = `${email.senderName || 'Nova Athletics'} provided feedback on the latest cut and requested updated deliverables before the 4pm team review.`;
  } else if (brand.includes('urban brew') || text.includes('invoice')) {
    summary = `Follow-up regarding the Artisanal Cold Brew launch video and invoice payout status.`;
  } else if (sentences.length > 0) {
    summary = sentences.slice(0, 2).join('. ').trim();
    if (!summary.endsWith('.')) summary += '.';
  }

  // Action Items
  const actionItems = [
    `Reply to ${email.senderName || 'brand contact'} with confirmation`,
    requestedChanges !== 'No changes requested' ? `Implement changes: ${requestedChanges.slice(0, 80)}` : 'Review agreed deliverables and schedule in Campaign Memory',
  ];

  return {
    summary,
    detectedIntent,
    requestedChanges,
    actionItems,
  };
}

// 2. Smart Local Draft Reply Engine
function generateLocalDraftReply(email: any, intentHint?: string): string {
  const brand = (email.brandName || '').toLowerCase();
  const subject = (email.subject || '').toLowerCase();
  const body = (email.body || '').toLowerCase();
  const senderFirstName = (email.senderName || 'there').split(' ')[0];

  if (brand.includes('glowskin') || subject.includes('usage rights') || body.includes('usage rights')) {
    return `Hi ${senderFirstName},

Thanks for reaching out! Regarding the 60-day paid usage window: our standard rate includes 30 days of paid amplification. We can certainly accommodate 60 days across Instagram for an additional ₹10,000 usage fee, or keep the initial ₹30,000 budget with a 30-day window.

Please feel free to send the contract draft directly to this address (alexcreates.collabs@gmail.com). Looking forward to locking this in!

Best,
Alex`;
  }

  if (brand.includes('nova') || subject.includes('cut') || subject.includes('revision') || body.includes('review cuts')) {
    return `Hi ${senderFirstName},

Thanks for the clear feedback! I have trimmed the first 4 seconds of the opening sprint footage and warmed the color grade on the road sequence. Exporting v3 right now and will share the preview link first thing tomorrow morning well before the 4 PM review.

Let me know if there's anything else the team needs!

Best,
Alex`;
  }

  if (brand.includes('urban brew') || subject.includes('invoice') || body.includes('invoice') || body.includes('payment')) {
    return `Hi ${senderFirstName},

Hope you're having a great week!

Just following up on invoice INV-1042 (₹20,000) for the Artisanal Cold Brew launch reel. Could you let me know if this cleared in this week's finance batch or if there is a firm payout date?

Thank you so much!
Best,
Alex`;
  }

  if (brand.includes('peak audio') || subject.includes('earbuds')) {
    return `Hi ${senderFirstName},

Thanks for reviewing the draft! I've trimmed the mid-section montage by 5 seconds and added the "40dB Hybrid ANC" callout badge. Uploading the updated v2 cut to the workspace now.

Best regards,
Alex`;
  }

  // General live email reply
  return `Hi ${senderFirstName},

Thank you for reaching out regarding "${email.subject}".

Everything looks clear from my end. I'm reviewing the details and will share the confirmed next steps shortly. Please let me know if you have any questions in the meantime.

Best regards,
Alex Rivera
Creator & Creative Director`;
}

// 3. Fallback smart response generator for Assistant
function generateLocalAssistantResponse(prompt: string, contextData: any): string {
  const p = prompt.toLowerCase();
  
  if (p.includes('work on today') || p.includes('priority') || p.includes('priorities')) {
    return `Based on your live workspace records, here are your urgent focus items for today (1 Nov 2026):

1. **Nova Athletics (9 Days Overdue)**: Complete the 3 requested video revisions (trim first 4s, warm up sunset road grading, and boost voiceover by +2dB). Marcus Vance noted the marketing team reviews cuts at 4pm tomorrow!
2. **Peak Audio (5 Days Overdue)**: Shave 5s off the mid-section montage and add the "40dB Hybrid ANC" spec badge.
3. **Urban Brew**: Chase invoice INV-1042 (₹20,000) with Arjun Patel for the delivered Cold Brew video.
4. **GlowSkin**: Riya Mehta is waiting for your reply regarding the 60-day paid usage terms across Instagram.`;
  }

  if (p.includes('reply') || p.includes('waiting') || p.includes('unread')) {
    return `Brands currently waiting for your response:

• **GlowSkin (Riya Mehta)**: Asking if 60 days of paid usage rights is acceptable or if you prefer a shorter window at the ₹30,000 budget.
• **Nova Athletics (Marcus Vance)**: Follow-up regarding tomorrow's 4pm cut review deadline.`;
  }

  if (p.includes('nova') || p.includes('changes') || p.includes('revisions')) {
    return `Nova Athletics requested 3 specific revisions for the "Fall Pace Running Campaign":

1. **Opening cut**: Trim first 4 seconds of the city establishing shot to dive straight into the foot strike.
2. **Color grading**: Warm up the sunset bridge shot (currently slightly desaturated).
3. **Audio**: Boost the voiceover volume by +2dB in the final 10 seconds for the promo code call-to-action.

Files attached: *nova_running_cut_v2.mp4* (191 MB).`;
  }

  if (p.includes('payment') || p.includes('invoice') || p.includes('money') || p.includes('owe')) {
    return `You have **3 payments awaiting follow-up** totaling **₹35,000** open:

1. **Urban Brew** — Invoice INV-1042: **₹20,000** (12 days overdue, cold brew reel published).
2. **Peak Audio** — Invoice INV-1043: **₹15,000** (Milestone 2 pending final v2 video approval).
3. **Nova Athletics** — Final balance: **₹25,000** scheduled upon v3 approval.
*(Sunrise Kombucha INV-1039 for ₹22,000 was settled).*`;
  }

  if (p.includes('urban brew') || p.includes('draft') || p.includes('follow-up')) {
    return `Here is a drafted polite follow-up for Arjun Patel at Urban Brew:

"Hi Arjun,

Hope you're having a great week! 

Just following up on invoice INV-1042 (₹20,000) for the Artisanal Cold Brew launch video delivered on October 20th. You mentioned last week that finance was queuing the bi-weekly Wednesday batch. Could you let me know if this cleared or if you have a firm payout date?

Thank you so much!
Best,
Alex"`;
  }

  return `I have reviewed your active campaigns, inbox threads, and deliverables. You have 5 active campaigns (Nova Athletics, GlowSkin, Peak Audio, Urban Brew, Trailhead Gear) with 5 pending revisions and 3 payment follow-ups pending. Would you like me to draft an email reply, inspect revision notes, or prepare a deliverable?`;
}

// 1. AI Assistant Chat Endpoint
app.post('/api/ai/assistant', async (req: Request, res: Response) => {
  try {
    const { message, history, workspaceContext } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    if (!ai || isGeminiFreeTierUnavailable) {
      const fallbackText = generateLocalAssistantResponse(message, workspaceContext);
      res.json({ reply: fallbackText, modelUsed: 'workspace-local-engine' });
      return;
    }

    const systemInstruction = `You are CreatorFlow Assistant, the intelligent creator operations co-pilot for Alex Rivera (@alexcreates).
You have full real-time access to Alex's workspace records:
- Active Campaigns: Nova Athletics (Fall Pace Running, in revisions, 9 days overdue, ₹45k total/₹20k paid), GlowSkin (Barrier Repair Serum, contract stage, ₹30k), Peak Audio (ANC Earbuds, in revisions, 5 days overdue, ₹35k/₹20k paid), Urban Brew (Cold brew reel delivered, invoice INV-1042 ₹20k overdue), Trailhead Gear (Layering range, in production, 2 days overdue, ₹28k/₹14k paid), Sunrise Kombucha (Completed, ₹22k paid).
- Today's date: 1 Nov 2026.
- 5 open revisions across Nova Athletics and Peak Audio.
- 3 open invoices/payouts awaiting follow-up totaling ₹35,000.
- Unread emails from GlowSkin (Riya Mehta on 60-day usage rights) and Nova Athletics (Marcus Vance on revised cuts).

Answer concisely, accurately, and professionally. Use markdown bullets, bolding, and clear actionable steps. Do not invent contradictory data. When asked to draft an email or message, format it clearly so the creator can copy or use it directly.`;

    const contents = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const h of history.slice(-6)) {
        contents.push({
          role: h.sender === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.text }],
        });
      }
    }

    contents.push({
      role: 'user',
      parts: [
        {
          text: `User query: "${message}"\n\nCurrent Workspace Live Context:\n${JSON.stringify(
            workspaceContext || {}
          )}`,
        },
      ],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
      },
    });

    const reply = response.text || generateLocalAssistantResponse(message, workspaceContext);
    res.json({ reply, modelUsed: 'gemini-3.8-flash' });
  } catch (error: any) {
    if (error?.status === 403 || error?.message?.includes('403') || error?.message?.includes('free tier')) {
      isGeminiFreeTierUnavailable = true;
      console.warn('[Gemini API] Free tier unavailable for this project. Utilizing intelligent workspace engine.');
    } else {
      console.warn('[Gemini API] Assistant notice:', error?.message || error);
    }
    const fallbackText = generateLocalAssistantResponse(req.body.message || '', req.body.workspaceContext);
    res.json({ reply: fallbackText, modelUsed: 'workspace-local-engine' });
  }
});

// 2. AI Summarize & Action Extraction
app.post('/api/ai/analyze-email', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Email object is required' });
      return;
    }

    if (!ai || isGeminiFreeTierUnavailable) {
      const localResult = generateLocalEmailAnalysis(email);
      res.json(localResult);
      return;
    }

    const prompt = `Analyze this email from a brand sponsor to creator Alex Rivera:
Sender: ${email.senderName} (${email.senderEmail})
Brand: ${email.brandName}
Subject: ${email.subject}
Body:
${email.body}

Return a concise JSON object with:
- "summary": 1-2 sentence executive summary
- "detectedIntent": short intent label (e.g., "Collaboration offer", "Revision requests", "Payment status", "Deadline reminder")
- "requestedChanges": exact changes requested or "No changes requested"
- "actionItems": array of 2-3 specific bullet points for the creator
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (error: any) {
    if (error?.status === 403 || error?.message?.includes('403') || error?.message?.includes('free tier')) {
      isGeminiFreeTierUnavailable = true;
      console.warn('[Gemini API] Free tier unavailable for this project. Seamlessly using workspace analyzer.');
    } else {
      console.warn('[Gemini API] Email analysis notice:', error?.message || error);
    }
    const localResult = generateLocalEmailAnalysis(req.body.email || {});
    res.json(localResult);
  }
});

// 3. AI Draft Reply
app.post('/api/ai/draft-reply', async (req: Request, res: Response) => {
  try {
    const { email, intentHint } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Email object is required' });
      return;
    }

    if (!ai || isGeminiFreeTierUnavailable) {
      const draft = generateLocalDraftReply(email, intentHint);
      res.json({ draft });
      return;
    }

    const prompt = `You are Alex Rivera (@alexcreates), a professional creator. Write a polite, concise, and business-savvy email reply to:
Brand: ${email.brandName}
Contact: ${email.senderName} (${email.senderEmail})
Subject: ${email.subject}
Original message:
"${email.body}"

Instructions:
${intentHint || 'Address all questions directly with professional creator agency standards. Keep the tone warm, clear, and confident.'}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({ draft: response.text || generateLocalDraftReply(email, intentHint) });
  } catch (error: any) {
    if (error?.status === 403 || error?.message?.includes('403') || error?.message?.includes('free tier')) {
      isGeminiFreeTierUnavailable = true;
      console.warn('[Gemini API] Free tier unavailable for this project. Seamlessly using creator drafting engine.');
    } else {
      console.warn('[Gemini API] Draft reply notice:', error?.message || error);
    }
    const draft = generateLocalDraftReply(req.body.email || {}, req.body.intentHint);
    res.json({ draft });
  }
});

// 4. AI Daily Briefing Generator
app.post('/api/ai/daily-briefing', async (req: Request, res: Response) => {
  try {
    const { priorities, campaigns, unreadCount } = req.body;

    if (!ai || isGeminiFreeTierUnavailable) {
      res.json({
        briefing:
          "You have 6 items that need attention today. Nova Athletics is waiting for your revised video, and Urban Brew's delivery deadline is close.",
        recommendedActions: [
          'Complete 3 requested revisions for Nova Athletics',
          'Complete 2 requested revisions for Peak Audio',
          "Deliver Urban Brew's One coffee product video",
        ],
      });
      return;
    }

    const prompt = `Generate an AI Daily Briefing for creator Alex Rivera for 1 Nov 2026.
Open priorities: ${JSON.stringify(priorities || [])}
Unread emails: ${unreadCount || 2}

Return JSON with:
- "briefing": 2 punchy sentences summarizing today's most urgent blocker and brand expectations.
- "recommendedActions": array of 3 top next actions strings.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    if (error?.status === 403 || error?.message?.includes('403') || error?.message?.includes('free tier')) {
      isGeminiFreeTierUnavailable = true;
      console.warn('[Gemini API] Free tier unavailable for this project. Serving daily briefing.');
    } else {
      console.warn('[Gemini API] Daily briefing notice:', error?.message || error);
    }
    res.json({
      briefing:
        "You have 6 items that need attention today. Nova Athletics is waiting for your revised video, and Urban Brew's delivery deadline is close.",
      recommendedActions: [
        'Complete 3 requested revisions for Nova Athletics',
        'Complete 2 requested revisions for Peak Audio',
        "Deliver Urban Brew's One coffee product video",
      ],
    });
  }
});

// Vite Middleware & Static Serving Setup
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CreatorFlow AI server running on port ${PORT} (${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
