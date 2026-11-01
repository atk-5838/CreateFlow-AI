import { Campaign, Deliverable, EmailThread, PriorityItem, RevisionRecord, WorkspaceFile, PaymentRecord, ActivityRecord, UserProfile } from '../types';

export const INITIAL_USER: UserProfile = {
  name: 'Alex Rivera',
  handle: '@alexcreates',
  role: 'Creator',
  initials: 'AR',
  email: 'alex.rivera@creatorflow.internal',
  bio: 'Lifestyle, tech and fitness creator. Documenting gear and everyday experiences across YouTube and Instagram (420K+ total reach).',
  location: 'San Francisco, CA',
  currency: 'INR (₹)',
  timezone: 'America/Los_Angeles',
  gmailConnected: true,
  gmailAddress: 'alexcreates.collabs@gmail.com',
  lastSynced: '1 Nov 2026, 17:45',
  isGoogleAuth: false,
};

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-nova',
    name: 'Nova Athletics — Fall Pace Running Campaign',
    brandName: 'Nova Athletics',
    brandInitials: 'NO',
    product: 'Pace Pro Carbon-Plate Running Shoes',
    description: 'Hero video review and high-intensity workout reels showcasing endurance and lightweight comfort during city sprint training.',
    status: 'In revisions',
    agreedPayment: 45000,
    paidAmount: 20000,
    paymentStatus: 'Partial',
    startDate: '1 Oct 2026',
    deadline: '23 Oct 2026',
    tags: ['Fitness', 'Apparel', 'Reels'],
    requirements: [
      '1x 60s High-energy Running Reel in 4K 9:16 format',
      '3x Instagram Stories with sticker link to product page',
      'Verbal mention of 30-day trial and carbon bounce tech',
      'Deliver final color-graded cut with separate audio stems'
    ],
    revisions: [
      {
        id: 'rev-nova-1',
        campaignId: 'camp-nova',
        campaignName: 'Nova Athletics — Fall Pace Running Campaign',
        brandName: 'Nova Athletics',
        feedbackText: 'Trim the opening by around four seconds to jump straight into the sprint action.',
        status: 'Pending',
        overdueDays: 9,
        dateRequested: '22 Oct 2026'
      },
      {
        id: 'rev-nova-2',
        campaignId: 'camp-nova',
        campaignName: 'Nova Athletics — Fall Pace Running Campaign',
        brandName: 'Nova Athletics',
        feedbackText: 'Warm up color grading on the sunset bridge road scene.',
        status: 'Pending',
        overdueDays: 9,
        dateRequested: '22 Oct 2026'
      },
      {
        id: 'rev-nova-3',
        campaignId: 'camp-nova',
        campaignName: 'Nova Athletics — Fall Pace Running Campaign',
        brandName: 'Nova Athletics',
        feedbackText: 'Boost voiceover clarity and volume by 2dB in the final call to action.',
        status: 'Pending',
        overdueDays: 9,
        dateRequested: '22 Oct 2026'
      }
    ],
    deliverables: [
      {
        id: 'del-nova-1',
        name: 'Fall Pace Hero Reel (60s)',
        campaignId: 'camp-nova',
        campaignName: 'Nova Athletics — Fall Pace Running Campaign',
        brandName: 'Nova Athletics',
        contentType: 'Reel',
        dueDate: '23 Oct 2026',
        status: 'Revision required',
        revisionCount: 2
      },
      {
        id: 'del-nova-2',
        name: '3x Behind-the-Scenes Workout Stories',
        campaignId: 'camp-nova',
        campaignName: 'Nova Athletics — Fall Pace Running Campaign',
        brandName: 'Nova Athletics',
        contentType: 'Story',
        dueDate: '25 Oct 2026',
        status: 'In progress',
        revisionCount: 0
      }
    ]
  },
  {
    id: 'camp-glowskin',
    name: 'Barrier Repair Serum — Two Reels',
    brandName: 'GlowSkin',
    brandInitials: 'GL',
    product: 'Ceramide Barrier Restoring Serum',
    description: 'Educational skincare routines showing texture, ingredient breakdown, and 14-day before/after skin calm results.',
    status: 'Contract Pending',
    agreedPayment: 30000,
    paidAmount: 0,
    paymentStatus: 'Pending Invoice',
    startDate: '14 Oct 2026',
    deadline: '15 Nov 2026',
    tags: ['Skincare', 'Beauty', 'Educational'],
    requirements: [
      '2x 45s Educational Skincare Reels with natural lighting',
      'Discussion on ceramides, squalane and non-comedogenic benefits',
      'Usage rights negotiation: Brand requested 60-day paid amplification window'
    ],
    revisions: [],
    deliverables: [
      {
        id: 'del-glow-1',
        name: 'Morning Skin Routine Reel (45s)',
        campaignId: 'camp-glowskin',
        campaignName: 'Barrier Repair Serum — Two Reels',
        brandName: 'GlowSkin',
        contentType: 'Reel',
        dueDate: '10 Nov 2026',
        status: 'Draft',
        revisionCount: 0
      },
      {
        id: 'del-glow-2',
        name: 'Texture & Barrier Breakdown Reel',
        campaignId: 'camp-glowskin',
        campaignName: 'Barrier Repair Serum — Two Reels',
        brandName: 'GlowSkin',
        contentType: 'Reel',
        dueDate: '15 Nov 2026',
        status: 'Not started',
        revisionCount: 0
      }
    ]
  },
  {
    id: 'camp-peakaudio',
    name: 'Peak ANC Earbuds Pro Launch',
    brandName: 'Peak Audio',
    brandInitials: 'PE',
    product: 'Peak Pro Wireless Active Noise Cancelling Earbuds',
    description: 'Commute and coffee shop background isolation demonstration showcasing transparency mode and battery life.',
    status: 'In revisions',
    agreedPayment: 35000,
    paidAmount: 20000,
    paymentStatus: 'Partial',
    startDate: '10 Oct 2026',
    deadline: '27 Oct 2026',
    tags: ['Tech', 'Audio', 'YouTube'],
    requirements: [
      '1x 90s Dedicated YouTube segment with decibel meter comparison',
      '1x TikTok / Reel focusing on tap controls and multipoint pairing'
    ],
    revisions: [
      {
        id: 'rev-peak-1',
        campaignId: 'camp-peakaudio',
        campaignName: 'Peak ANC Earbuds Pro Launch',
        brandName: 'Peak Audio',
        feedbackText: 'Trim the mid-section product montage down by five seconds to keep pacing tight.',
        status: 'Pending',
        overdueDays: 5,
        dateRequested: '27 Oct 2026'
      },
      {
        id: 'rev-peak-2',
        campaignId: 'camp-peakaudio',
        campaignName: 'Peak ANC Earbuds Pro Launch',
        brandName: 'Peak Audio',
        feedbackText: 'Add an on-screen feature badge mentioning 40dB Hybrid ANC.',
        status: 'Pending',
        overdueDays: 5,
        dateRequested: '27 Oct 2026'
      }
    ],
    deliverables: [
      {
        id: 'del-peak-1',
        name: 'Commute Isolation YouTube Segment',
        campaignId: 'camp-peakaudio',
        campaignName: 'Peak ANC Earbuds Pro Launch',
        brandName: 'Peak Audio',
        contentType: 'YouTube',
        dueDate: '27 Oct 2026',
        status: 'Revision required',
        revisionCount: 1
      }
    ]
  },
  {
    id: 'camp-urbanbrew',
    name: 'Urban Brew Artisanal Cold Brew Launch',
    brandName: 'Urban Brew',
    brandInitials: 'UB',
    product: 'Single-Origin Ethiopian Cold Brew Concentrate',
    description: 'Aesthetic morning pour video showing iced latte preparation, crisp sound design, and ritualistic coffee aesthetic.',
    status: 'In review',
    agreedPayment: 20000,
    paidAmount: 0,
    paymentStatus: 'Overdue',
    startDate: '5 Oct 2026',
    deadline: '20 Oct 2026',
    tags: ['Food & Beverage', 'Aesthetic', 'Video'],
    requirements: [
      '1x 30s High-production coffee recipe reel with ASMR audio',
      'Tag @urbanbrew and include promo discount code in pinned caption'
    ],
    revisions: [],
    deliverables: [
      {
        id: 'del-urban-1',
        name: 'One coffee product video (30s ASMR Pour)',
        campaignId: 'camp-urbanbrew',
        campaignName: 'Urban Brew Artisanal Cold Brew Launch',
        brandName: 'Urban Brew',
        contentType: 'Video',
        dueDate: '20 Oct 2026',
        status: 'Submitted',
        revisionCount: 0
      }
    ]
  },
  {
    id: 'camp-trailhead',
    name: 'Trailhead All-Weather Layering Range',
    brandName: 'Trailhead Gear',
    brandInitials: 'TG',
    product: 'Alpine Shell & Merino Mid-Layer',
    description: 'Outdoor mountain hiking reel showing weather resistance, packability and functional pockets.',
    status: 'In production',
    agreedPayment: 28000,
    paidAmount: 14000,
    paymentStatus: 'Partial',
    startDate: '28 Sep 2026',
    deadline: '30 Oct 2026',
    tags: ['Outdoors', 'Adventure', 'Travel'],
    requirements: [
      '1x 30-second apparel reel plus behind-the-scenes stills',
      'Shoot in misty/alpine outdoor conditions to test water repellent DWR fabric'
    ],
    revisions: [],
    deliverables: [
      {
        id: 'del-trail-1',
        name: 'One 30-second apparel reel plus behind-the-scenes stills',
        campaignId: 'camp-trailhead',
        campaignName: 'Trailhead All-Weather Layering Range',
        brandName: 'Trailhead Gear',
        contentType: 'Reel',
        dueDate: '30 Oct 2026',
        status: 'In progress',
        revisionCount: 0
      }
    ]
  },
  {
    id: 'camp-sunrise',
    name: 'Sunrise Kombucha Summer Refresh',
    brandName: 'Sunrise Kombucha',
    brandInitials: 'SK',
    product: 'Organic Ginger Turmeric Kombucha',
    description: 'Post-workout hydration and wellness lifestyle spotlight showing natural carbonation and probiotics.',
    status: 'Completed',
    agreedPayment: 22000,
    paidAmount: 22000,
    paymentStatus: 'Fully Paid',
    startDate: '1 Sep 2026',
    deadline: '15 Oct 2026',
    tags: ['Wellness', 'Beverage'],
    requirements: [
      '2x Instagram Reels',
      '5x High-resolution photos for brand website'
    ],
    revisions: [],
    deliverables: [
      {
        id: 'del-sun-1',
        name: 'Post-Workout Hydration Reel',
        campaignId: 'camp-sunrise',
        campaignName: 'Sunrise Kombucha Summer Refresh',
        brandName: 'Sunrise Kombucha',
        contentType: 'Reel',
        dueDate: '10 Oct 2026',
        status: 'Approved',
        revisionCount: 1
      },
      {
        id: 'del-sun-2',
        name: '5x Product Stills & Brand Pack',
        campaignId: 'camp-sunrise',
        campaignName: 'Sunrise Kombucha Summer Refresh',
        brandName: 'Sunrise Kombucha',
        contentType: 'Photo',
        dueDate: '15 Oct 2026',
        status: 'Final',
        revisionCount: 0
      }
    ]
  }
];

export const INITIAL_FILES: WorkspaceFile[] = [
  {
    id: 'file-1',
    name: 'WIN_20250920_09_51_43_Pro.mp4',
    size: '4.3 MB',
    uploadDate: '1 Nov',
    version: 'upload',
    brandName: 'GlowSkin',
    campaignId: 'camp-glowskin',
    campaignName: 'Barrier Repair Serum — Two Reels',
    fileType: 'video',
    status: 'Draft',
    mimeType: 'video/mp4'
  },
  {
    id: 'file-2',
    name: 'nova_running_cut_v2.mp4',
    size: '191 MB',
    uploadDate: '22 Oct',
    version: 'v2',
    brandName: 'Nova Athletics',
    campaignId: 'camp-nova',
    campaignName: 'Nova Athletics — Fall Pace Running Campaign',
    fileType: 'video',
    status: 'Draft',
    mimeType: 'video/mp4'
  },
  {
    id: 'file-3',
    name: 'nova_running_cut_v1.mp4',
    size: '184 MB',
    uploadDate: '21 Oct',
    version: 'v1',
    brandName: 'Nova Athletics',
    campaignId: 'camp-nova',
    campaignName: 'Nova Athletics — Fall Pace Running Campaign',
    fileType: 'video',
    status: 'Draft',
    mimeType: 'video/mp4'
  },
  {
    id: 'file-4',
    name: 'urbanbrew_coldbrew_final.mp4',
    size: '205 MB',
    uploadDate: '20 Oct',
    version: 'vFinal',
    brandName: 'Urban Brew',
    campaignId: 'camp-urbanbrew',
    campaignName: 'Urban Brew Artisanal Cold Brew Launch',
    fileType: 'video',
    status: 'Final',
    mimeType: 'video/mp4'
  },
  {
    id: 'file-5',
    name: 'peak_earbuds_draft_v1.mp4',
    size: '246 MB',
    uploadDate: '20 Oct',
    version: 'v1',
    brandName: 'Peak Audio',
    campaignId: 'camp-peakaudio',
    campaignName: 'Peak ANC Earbuds Pro Launch',
    fileType: 'video',
    status: 'Draft',
    mimeType: 'video/mp4'
  },
  {
    id: 'file-6',
    name: 'trailhead_layering_concept.jpg',
    size: '4.2 MB',
    uploadDate: '18 Oct',
    version: 'v1',
    brandName: 'Trailhead Gear',
    campaignId: 'camp-trailhead',
    campaignName: 'Trailhead All-Weather Layering Range',
    fileType: 'image',
    status: 'Reference',
    mimeType: 'image/jpeg'
  }
];

export const INITIAL_EMAILS: EmailThread[] = [
  {
    id: 'email-glowskin-1',
    brandName: 'GlowSkin',
    brandInitials: 'GL',
    brandColor: '#216F50',
    senderName: 'Riya Mehta',
    senderEmail: 'riya@glowskin.example',
    date: '22 Oct',
    timestamp: '22 Oct 2026 · 16:00',
    subject: 'Quick question on usage rights',
    preview: 'Would 60 days of paid usage across Instagram work, and should we send the contract here?',
    body: `Hi Alex — one more thing before we finalise the paperwork.

Our legal team asks for paid usage rights for 60 days across Instagram and the brand's own channels. Would you be comfortable with that, or would you prefer a shorter window at the same budget?

Also, should we send the contract to this address or to your management contact?`,
    unread: true,
    categories: ['Brand Deals'],
    campaignId: 'camp-glowskin',
    campaignName: 'Barrier Repair Serum — Two Reels',
    aiInsights: {
      summary: 'GlowSkin asks whether 60 days of paid usage rights is acceptable and which address should receive the contract.',
      detectedIntent: 'Collaboration offer',
      requestedChanges: 'No changes requested',
      deadlineNotice: 'Awaiting your usage terms confirmation before sending final contract.'
    }
  },
  {
    id: 'email-nova-1',
    brandName: 'Nova Athletics',
    brandInitials: 'NO',
    brandColor: '#68716D',
    senderName: 'Marcus Vance',
    senderEmail: 'marcus@novaathletics.example',
    date: '22 Oct',
    timestamp: '22 Oct 2026 · 14:15',
    subject: 'Can we receive the updated cut by tomorrow?',
    preview: 'The team reviews cuts at 4pm tomorrow — and the opening still feels slow.',
    body: `Hey Alex,

Just touching base regarding the fall running reel. Our marketing lead reviews the creative batch tomorrow at 4 PM EST. 

As mentioned in the previous feedback email, the opening four seconds still feel a little slow before the running rhythm kicks in. If you can send over the v3 revision by tomorrow morning, we can approve it on the spot and schedule the campaign launch.

Appreciate the quick turnarounds!`,
    unread: false,
    categories: ['Deadlines'],
    campaignId: 'camp-nova',
    campaignName: 'Nova Athletics — Fall Pace Running Campaign',
    aiInsights: {
      summary: 'Nova Athletics requests the trimmed v3 video cut by tomorrow 4 PM EST for marketing leadership signoff.',
      detectedIntent: 'Delivery deadline reminder',
      requestedChanges: 'Trim first 4 seconds of opening running footage',
      deadlineNotice: 'Deadline: Tomorrow at 4:00 PM EST'
    }
  },
  {
    id: 'email-nova-2',
    brandName: 'Nova Athletics',
    brandInitials: 'NO',
    brandColor: '#216F50',
    senderName: 'Marcus Vance',
    senderEmail: 'marcus@novaathletics.example',
    date: '22 Oct',
    timestamp: '22 Oct 2026 · 11:30',
    subject: 'Revisions needed on the running campaign',
    preview: 'The overall energy is right — two production changes before we can push it live.',
    body: `Hi Alex,

Great first rough cut! The overall energy and pacing through the downtown sprint sequence is spot on.

We have three specific notes from our creative director:
1. Please trim the opening city shot by around 4 seconds to jump directly into the foot strike.
2. The sunset bridge grading is slightly desaturated — could you warm up the amber highlights?
3. Boost voiceover volume by +2dB in the final 10 seconds so the discount promo code is crystal clear.

Once these are updated, we will push this live across our campaign ads.`,
    unread: true,
    categories: ['Feedback'],
    campaignId: 'camp-nova',
    campaignName: 'Nova Athletics — Fall Pace Running Campaign',
    aiInsights: {
      summary: 'Nova Athletics requests 3 specific adjustments: 4-second opening trim, warmer sunset color grade, and +2dB voiceover boost.',
      detectedIntent: 'Revision requests',
      requestedChanges: 'Trim opening by 4s, warm sunset color grading, +2dB VO boost',
      deadlineNotice: 'Open revision queue (9 days overdue from original milestone)'
    }
  },
  {
    id: 'email-peak-1',
    brandName: 'Peak Audio',
    brandInitials: 'PE',
    brandColor: '#68716D',
    senderName: 'David Chen',
    senderEmail: 'david@peakaudio.example',
    date: '20 Oct',
    timestamp: '20 Oct 2026 · 10:20',
    subject: 'Feedback on Peak Earbuds v1 draft',
    preview: 'Loved the audio demonstration! Could we trim the mid-section montage down by 5s and highlight the 40dB noise cancellation spec badge?',
    body: `Hi Alex,

Loved the commute noise demonstration segment in the v1 draft! The subway sound isolation comparison was brilliant.

Two quick tweaks from our product team:
1. The mid-section montage showing the case opening is slightly extended — could we shave ~5 seconds off?
2. Add our official "40dB Hybrid Active Noise Cancellation" badge graphic during the coffee shop scene.

Looking forward to the revised YouTube export!`,
    unread: false,
    categories: ['Feedback'],
    campaignId: 'camp-peakaudio',
    campaignName: 'Peak ANC Earbuds Pro Launch',
    aiInsights: {
      summary: 'Peak Audio praises the subway isolation demo and asks to trim the montage by 5 seconds and insert the 40dB ANC spec overlay.',
      detectedIntent: 'Revision feedback',
      requestedChanges: 'Trim montage by 5s, insert 40dB Hybrid ANC badge',
      deadlineNotice: 'Milestone delivery is 5 days overdue'
    }
  },
  {
    id: 'email-urban-1',
    brandName: 'Urban Brew',
    brandInitials: 'UB',
    brandColor: '#68716D',
    senderName: 'Arjun Patel',
    senderEmail: 'arjun@urbanbrew.example',
    date: '25 Oct',
    timestamp: '25 Oct 2026 · 15:45',
    subject: 'Invoice INV-1042 status update',
    preview: 'Hi Alex, finance has queued this batch for processing. I will confirm the transfer date by Wednesday.',
    body: `Hey Alex,

Quick update on invoice INV-1042 (₹20,000 for the Cold Brew Launch Reel). The video went live on the 20th and performed above expectations.

Our accounts payable team batches overseas wire payouts on alternating Wednesdays. I am following up internally today to ensure your payout clears in this upcoming cycle.

Best,
Arjun`,
    unread: false,
    categories: ['Follow-ups'],
    campaignId: 'camp-urbanbrew',
    campaignName: 'Urban Brew Artisanal Cold Brew Launch',
    aiInsights: {
      summary: 'Arjun confirms Invoice INV-1042 (₹20,000) is in accounts payable queue and being tracked for the upcoming Wednesday wire cycle.',
      detectedIntent: 'Payment status follow-up',
      requestedChanges: 'None — reel approved and published',
      deadlineNotice: 'Invoice 12 days overdue'
    }
  },
  {
    id: 'email-trailhead-1',
    brandName: 'Trailhead Gear',
    brandInitials: 'TG',
    brandColor: '#68716D',
    senderName: 'Sarah Jenkins',
    senderEmail: 'sarah@trailheadgear.example',
    date: '18 Oct',
    timestamp: '18 Oct 2026 · 09:15',
    subject: 'Moodboard approval & product arrival',
    preview: 'The waterproof shells arrived yesterday. Looking forward to the test shoot on the ridges.',
    body: `Hi Alex,

Great news — the package containing the Alpine Shell (Size M) and the Merino Mid-Layer was delivered yesterday. The moodboard you sent over looks incredible; that misty ridge aesthetic is exactly what we envisioned for the Autumn campaign.

Reminder on timelines: first cut due by October 30th. Let us know if you need any additional accessories or colorways!`,
    unread: false,
    categories: ['Follow-ups', 'Deadlines'],
    campaignId: 'camp-trailhead',
    campaignName: 'Trailhead All-Weather Layering Range',
    aiInsights: {
      summary: 'Sarah confirmed products delivered and approved misty ridge moodboard. Delivery deadline: 30 October.',
      detectedIntent: 'Logistics confirmation',
      requestedChanges: 'None',
      deadlineNotice: 'Deliverable first cut is 2 days overdue'
    }
  },
  {
    id: 'email-sunrise-1',
    brandName: 'Sunrise Kombucha',
    brandInitials: 'SK',
    brandColor: '#68716D',
    senderName: 'Priya Sharma',
    senderEmail: 'priya@sunrisekombucha.example',
    date: '15 Oct',
    timestamp: '15 Oct 2026 · 17:00',
    subject: 'Campaign wrap-up & wrap report',
    preview: 'Thank you Alex! The engagement numbers surpassed our quarterly benchmark.',
    body: `Hi Alex,

On behalf of the entire Sunrise Kombucha team, thank you for a fantastic collaboration! The two reels generated over 180,000 organic views and an 8.4% engagement rate, beating our Q3 benchmark by a mile.

Your final invoice INV-1039 (₹22,000) was marked paid and settled yesterday. We’d love to explore a recurring quarterly ambassadorship for 2027!

Warmly,
Priya`,
    unread: false,
    categories: ['Follow-ups'],
    campaignId: 'camp-sunrise',
    campaignName: 'Sunrise Kombucha Summer Refresh',
    aiInsights: {
      summary: 'Priya sent congratulations on surpassing engagement goals and confirmed full invoice payout with invitation for 2027 partnership.',
      detectedIntent: 'Campaign completion & partnership renewal',
      requestedChanges: 'None',
      deadlineNotice: 'Completed & settled'
    }
  },
  {
    id: 'email-glowskin-brief',
    brandName: 'GlowSkin',
    brandInitials: 'GL',
    brandColor: '#68716D',
    senderName: 'Riya Mehta',
    senderEmail: 'riya@glowskin.example',
    date: '14 Oct',
    timestamp: '14 Oct 2026 · 13:20',
    subject: 'Initial campaign brief & contract draft',
    preview: 'Excited to partner on our Ceramide Serum launch! Here is our standard creator scope document.',
    body: `Hi Alex,

We are huge fans of your skin education series and would love to collaborate on the launch of our new Barrier Restoring Serum.

Attached is our scope document: 2x 45s educational reels highlighting ceramides and squalane. Proposed base fee: ₹30,000. Let us know if the deliverables and rate look aligned with your schedule!`,
    unread: false,
    categories: ['Brand Deals'],
    campaignId: 'camp-glowskin',
    campaignName: 'Barrier Repair Serum — Two Reels',
    aiInsights: {
      summary: 'Initial campaign outreach offering ₹30,000 for two educational reels on barrier repair serum.',
      detectedIntent: 'Collaboration proposal',
      requestedChanges: 'None',
      deadlineNotice: 'Negotiations ongoing'
    }
  },
  {
    id: 'email-peak-shipping',
    brandName: 'Peak Audio',
    brandInitials: 'PE',
    brandColor: '#68716D',
    senderName: 'David Chen',
    senderEmail: 'david@peakaudio.example',
    date: '10 Oct',
    timestamp: '10 Oct 2026 · 11:00',
    subject: 'Shipping tracking number for ANC earbuds',
    preview: 'FedEx express parcel #7829-4102 has been dispatched from our design hub.',
    body: `Hey Alex,

The pre-production sample of the Peak ANC Earbuds Pro has shipped! Tracking number is FedEx #7829-4102-9901. Estimated arrival: Friday afternoon.

Let us know as soon as the package lands so we can coordinate the staging shoot.`,
    unread: false,
    categories: ['Follow-ups'],
    campaignId: 'camp-peakaudio',
    campaignName: 'Peak ANC Earbuds Pro Launch',
    aiInsights: {
      summary: 'Shipping confirmation with FedEx tracking number for pre-production earbuds sample.',
      detectedIntent: 'Shipping notification',
      requestedChanges: 'None',
      deadlineNotice: 'Delivered'
    }
  },
  {
    id: 'email-urban-contract',
    brandName: 'Urban Brew',
    brandInitials: 'UB',
    brandColor: '#68716D',
    senderName: 'Arjun Patel',
    senderEmail: 'arjun@urbanbrew.example',
    date: '5 Oct',
    timestamp: '5 Oct 2026 · 14:10',
    subject: 'Contract signed: Cold Brew Fall Launch',
    preview: 'Countersigned PDF attached along with our high-res logo lockups and color guidelines.',
    body: `Hi Alex,

Our management has signed the agreement for the Cold Brew 30s video deliverable. Total fee: ₹20,000 payable upon delivery and invoice submission.

Please find attached our brand style guide and hex colors (#2B1E16, #E8D8C8). Excited to see your signature slow-motion pour shots!`,
    unread: false,
    categories: ['Brand Deals'],
    campaignId: 'camp-urbanbrew',
    campaignName: 'Urban Brew Artisanal Cold Brew Launch',
    aiInsights: {
      summary: 'Countersigned contract and asset kit for ₹20,000 cold brew video project.',
      detectedIntent: 'Contract execution',
      requestedChanges: 'None',
      deadlineNotice: 'Deliverable completed on Oct 20'
    }
  },
  {
    id: 'email-nova-kickoff',
    brandName: 'Nova Athletics',
    brandInitials: 'NO',
    brandColor: '#68716D',
    senderName: 'Marcus Vance',
    senderEmail: 'marcus@novaathletics.example',
    date: '1 Oct',
    timestamp: '1 Oct 2026 · 10:00',
    subject: 'Fall Pace Campaign Kickoff & Shotlist',
    preview: 'Welcome to the campaign! Here is the moodboard, target audience persona, and filming guidelines.',
    body: `Alex,

Thrilled to have you lead the creator push for our Fall Pace Carbon Shoe launch. Advance payment of ₹20,000 was initiated today.

Key creative goal: show runners pushing pace through dawn and dusk city streets. Make sure to capture the responsive carbon bounce during acceleration.`,
    unread: false,
    categories: ['Brand Deals'],
    campaignId: 'camp-nova',
    campaignName: 'Nova Athletics — Fall Pace Running Campaign',
    aiInsights: {
      summary: 'Campaign kickoff with ₹20,000 advance payment confirmation and visual creative direction.',
      detectedIntent: 'Project kickoff',
      requestedChanges: 'None',
      deadlineNotice: 'Initial deliverable due Oct 23'
    }
  },
  {
    id: 'email-trailhead-contract',
    brandName: 'Trailhead Gear',
    brandInitials: 'TG',
    brandColor: '#68716D',
    senderName: 'Sarah Jenkins',
    senderEmail: 'sarah@trailheadgear.example',
    date: '28 Sep',
    timestamp: '28 Sep 2026 · 16:30',
    subject: 'Contract confirmation and deposit voucher',
    preview: 'Deposit remittance advice attached for ₹14,000 (50% upfront retainer).',
    body: `Hi Alex,

Our accounts department has processed the 50% retainer (₹14,000) for the Autumn layering reel campaign. Reference #TR-99381.

We will dispatch the jacket and midlayer next Monday.`,
    unread: false,
    categories: ['Follow-ups', 'Brand Deals'],
    campaignId: 'camp-trailhead',
    campaignName: 'Trailhead All-Weather Layering Range',
    aiInsights: {
      summary: 'Upfront retainer deposit voucher for ₹14,000 confirmed.',
      detectedIntent: 'Payment deposit notice',
      requestedChanges: 'None',
      deadlineNotice: 'Production underway'
    }
  },
  {
    id: 'email-sunrise-payment',
    brandName: 'Sunrise Kombucha',
    brandInitials: 'SK',
    brandColor: '#68716D',
    senderName: 'Priya Sharma',
    senderEmail: 'priya@sunrisekombucha.example',
    date: '22 Sep',
    timestamp: '22 Sep 2026 · 12:00',
    subject: 'Payment remitted: INV-1039',
    preview: 'Remittance confirmation for ₹22,000. Thank you for your partnership!',
    body: `Hi Alex,

Payment for INV-1039 has cleared our bank and should appear in your accounts within 1 business day. Thank you again for the beautiful reels!`,
    unread: false,
    categories: ['Follow-ups'],
    campaignId: 'camp-sunrise',
    campaignName: 'Sunrise Kombucha Summer Refresh',
    aiInsights: {
      summary: 'Bank payment clearance notice for ₹22,000.',
      detectedIntent: 'Payment confirmation',
      requestedChanges: 'None',
      deadlineNotice: 'Settled'
    }
  }
];

export const INITIAL_PRIORITIES: PriorityItem[] = [
  {
    id: 'prio-nova',
    category: 'REVISION',
    title: 'Complete 3 requested revisions for Nova Athletics',
    isOverdue: true,
    overdueDays: 9,
    overdueText: '9 DAYS OVERDUE',
    timeframe: 'today',
    description: 'Trim the opening by around four seconds — and 2 more in Campaign Memory',
    campaignId: 'camp-nova',
    campaignName: 'Nova Athletics — Fall Pace Running Campaign',
    brandName: 'Nova Athletics',
    completed: false,
    dueDate: '23 Oct 2026'
  },
  {
    id: 'prio-peak',
    category: 'REVISION',
    title: 'Complete 2 requested revisions for Peak Audio',
    isOverdue: true,
    overdueDays: 5,
    overdueText: '5 DAYS OVERDUE',
    timeframe: 'today',
    description: 'Trim the mid-section product montage — and 1 more in Campaign Memory',
    campaignId: 'camp-peakaudio',
    campaignName: 'Peak ANC Earbuds Pro Launch',
    brandName: 'Peak Audio',
    completed: false,
    dueDate: '27 Oct 2026'
  },
  {
    id: 'prio-urban',
    category: 'DEADLINE',
    title: "Deliver Urban Brew's One coffee product video",
    isOverdue: true,
    overdueDays: 12,
    overdueText: '12 DAYS OVERDUE',
    timeframe: 'today',
    description: 'Chase invoice INV-1042 with Arjun and ask for a firm payout date.',
    campaignId: 'camp-urbanbrew',
    campaignName: 'Urban Brew Artisanal Cold Brew Launch',
    brandName: 'Urban Brew',
    completed: false,
    dueDate: '20 Oct 2026'
  },
  {
    id: 'prio-trailhead',
    category: 'DEADLINE',
    title: "Deliver Trailhead Gear's One 30-second apparel reel plus behind-the-scenes stills",
    isOverdue: true,
    overdueDays: 2,
    overdueText: '2 DAYS OVERDUE',
    timeframe: 'today',
    description: 'Shoot the layering range on 26 October and deliver the first cut by 30 October.',
    campaignId: 'camp-trailhead',
    campaignName: 'Trailhead All-Weather Layering Range',
    brandName: 'Trailhead Gear',
    completed: false,
    dueDate: '30 Oct 2026'
  },
  {
    id: 'prio-glowskin-rights',
    category: 'EMAIL',
    title: 'Respond to GlowSkin 60-day paid usage query',
    isOverdue: false,
    timeframe: 'today',
    description: 'Riya Mehta asked if 60 days paid rights across Instagram is acceptable or if you prefer a shorter window.',
    campaignId: 'camp-glowskin',
    campaignName: 'Barrier Repair Serum — Two Reels',
    brandName: 'GlowSkin',
    completed: false,
    dueDate: '1 Nov 2026'
  },
  {
    id: 'prio-nova-deadline',
    category: 'EMAIL',
    title: 'Respond to Nova Athletics review cut schedule',
    isOverdue: false,
    timeframe: 'today',
    description: 'Marketing team meets at 4pm tomorrow to sign off on the pace running reel.',
    campaignId: 'camp-nova',
    campaignName: 'Nova Athletics — Fall Pace Running Campaign',
    brandName: 'Nova Athletics',
    completed: false,
    dueDate: '1 Nov 2026'
  },
  {
    id: 'prio-glowskin-contract',
    category: 'DEADLINE',
    title: 'Finalise contract terms for Barrier Repair Serum',
    isOverdue: false,
    timeframe: 'next2days',
    description: 'Confirm management contact email and countersign base agreement for ₹30,000.',
    campaignId: 'camp-glowskin',
    campaignName: 'Barrier Repair Serum — Two Reels',
    brandName: 'GlowSkin',
    completed: false,
    dueDate: '3 Nov 2026'
  },
  {
    id: 'prio-urban-payout',
    category: 'PAYMENT',
    title: 'Track bank receipt of INV-1042 payout from Urban Brew',
    isOverdue: false,
    timeframe: 'next2days',
    description: 'Arjun indicated payment is scheduled in the bi-weekly Wednesday batch.',
    campaignId: 'camp-urbanbrew',
    campaignName: 'Urban Brew Artisanal Cold Brew Launch',
    brandName: 'Urban Brew',
    completed: false,
    dueDate: '3 Nov 2026'
  },
  {
    id: 'prio-peak-payout',
    category: 'PAYMENT',
    title: 'Submit milestone 2 invoice for Peak ANC Earbuds',
    isOverdue: false,
    timeframe: 'next2days',
    description: 'Prepare ₹15,000 completion invoice for David Chen once v2 cut is approved.',
    campaignId: 'camp-peakaudio',
    campaignName: 'Peak ANC Earbuds Pro Launch',
    brandName: 'Peak Audio',
    completed: false,
    dueDate: '4 Nov 2026'
  },
  {
    id: 'prio-trailhead-export',
    category: 'DEADLINE',
    title: 'Color grade & export Trailhead mountain footage',
    isOverdue: false,
    timeframe: 'thisweek',
    description: 'Export 4K master ProRes cut and generate 1080x1920 mobile preview with audio stems.',
    campaignId: 'camp-trailhead',
    campaignName: 'Trailhead All-Weather Layering Range',
    brandName: 'Trailhead Gear',
    completed: false,
    dueDate: '6 Nov 2026'
  }
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay-1',
    campaignId: 'camp-urbanbrew',
    campaignName: 'Urban Brew Artisanal Cold Brew Launch',
    brandName: 'Urban Brew',
    invoiceNumber: 'INV-1042',
    amount: 20000,
    currency: 'INR',
    status: 'Overdue',
    dueDate: '20 Oct 2026',
    notes: 'Final delivery fee. Awaiting confirmation from Arjun Patel.'
  },
  {
    id: 'pay-2',
    campaignId: 'camp-peakaudio',
    campaignName: 'Peak ANC Earbuds Pro Launch',
    brandName: 'Peak Audio',
    invoiceNumber: 'INV-1043',
    amount: 15000,
    currency: 'INR',
    status: 'Open',
    dueDate: '3 Nov 2026',
    notes: 'Milestone 2 payout pending approved v2 revision cut.'
  },
  {
    id: 'pay-3',
    campaignId: 'camp-nova',
    campaignName: 'Nova Athletics — Fall Pace Running Campaign',
    brandName: 'Nova Athletics',
    invoiceNumber: 'INV-1040',
    amount: 25000,
    currency: 'INR',
    status: 'Open',
    dueDate: '5 Nov 2026',
    notes: 'Final balance upon video signoff.'
  },
  {
    id: 'pay-4',
    campaignId: 'camp-nova',
    campaignName: 'Nova Athletics — Fall Pace Running Campaign',
    brandName: 'Nova Athletics',
    invoiceNumber: 'INV-1038',
    amount: 20000,
    currency: 'INR',
    status: 'Paid',
    dueDate: '1 Oct 2026',
    notes: '50% upfront project retainer.'
  },
  {
    id: 'pay-5',
    campaignId: 'camp-trailhead',
    campaignName: 'Trailhead All-Weather Layering Range',
    brandName: 'Trailhead Gear',
    invoiceNumber: 'INV-1037',
    amount: 14000,
    currency: 'INR',
    status: 'Paid',
    dueDate: '28 Sep 2026',
    notes: 'Advance production fee.'
  },
  {
    id: 'pay-6',
    campaignId: 'camp-sunrise',
    campaignName: 'Sunrise Kombucha Summer Refresh',
    brandName: 'Sunrise Kombucha',
    invoiceNumber: 'INV-1039',
    amount: 22000,
    currency: 'INR',
    status: 'Paid',
    dueDate: '15 Oct 2026',
    notes: 'Full campaign settlement.'
  }
];

export const INITIAL_ACTIVITIES: ActivityRecord[] = [
  {
    id: 'act-1',
    type: 'file',
    title: 'Uploaded new video asset',
    description: 'Uploaded WIN_20250920_09_51_43_Pro.mp4 for GlowSkin',
    brandName: 'GlowSkin',
    timestamp: '1 Nov 2026, 09:30',
    date: '1 Nov 2026'
  },
  {
    id: 'act-2',
    type: 'email',
    title: 'Received email query',
    description: 'Riya Mehta asked about 60-day paid usage terms',
    brandName: 'GlowSkin',
    timestamp: '22 Oct 2026, 16:00',
    date: '22 Oct 2026'
  },
  {
    id: 'act-3',
    type: 'revision',
    title: 'Received revision request',
    description: 'Marcus Vance submitted 3 editing notes for Fall Pace Running Reel',
    brandName: 'Nova Athletics',
    timestamp: '22 Oct 2026, 11:30',
    date: '22 Oct 2026'
  },
  {
    id: 'act-4',
    type: 'file',
    title: 'Uploaded video cut v2',
    description: 'Uploaded nova_running_cut_v2.mp4 (191 MB)',
    brandName: 'Nova Athletics',
    timestamp: '22 Oct 2026, 10:15',
    date: '22 Oct 2026'
  },
  {
    id: 'act-5',
    type: 'deliverable',
    title: 'Submitted final video',
    description: 'urbanbrew_coldbrew_final.mp4 delivered to Arjun Patel',
    brandName: 'Urban Brew',
    timestamp: '20 Oct 2026, 14:00',
    date: '20 Oct 2026'
  },
  {
    id: 'act-6',
    type: 'payment',
    title: 'Invoice payment received',
    description: 'Received ₹22,000 for INV-1039 from Sunrise Kombucha',
    brandName: 'Sunrise Kombucha',
    timestamp: '15 Oct 2026, 16:20',
    date: '15 Oct 2026'
  }
];
