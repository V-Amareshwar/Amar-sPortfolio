# 🤖 agent.md — Student Portfolio Development Guide
### For: Antigravity Development | Project: B.Tech CS Student Portfolio

> This file is the development blueprint for building the student portfolio website.  
> Follow each phase sequentially. Each phase is independently deployable.

---

## 🧭 Project Overview

**Project Name:** Student Portfolio — Dynamic & Admin-Controlled  
**Tech Stack:** Next.js 14 · Tailwind CSS · Firebase · Framer Motion · GSAP  
**Hosting:** Vercel  
**Auth:** Firebase Authentication (Email/Password)  
**Database:** Firestore (NoSQL)  
**Storage:** Firebase Storage (images, PDFs, certificates)  

---

## 📦 Repository Structure

```
/
├── app/
│   ├── (public)/
│   │   ├── page.tsx               ← Home (all sections)
│   │   ├── blog/
│   │   │   ├── page.tsx           ← Blog listing
│   │   │   └── [slug]/page.tsx    ← Blog post
│   │   └── layout.tsx
│   ├── admin/
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── projects/page.tsx
│   │   ├── skills/page.tsx
│   │   ├── achievements/page.tsx
│   │   ├── certifications/page.tsx
│   │   ├── blog/page.tsx
│   │   ├── testimonials/page.tsx
│   │   └── settings/page.tsx
│   └── api/
│       ├── contact/route.ts
│       └── analytics/route.ts
├── components/
│   ├── sections/                  ← Public section components
│   ├── admin/                     ← Admin UI components
│   ├── ui/                        ← Shared UI primitives
│   └── motion/                    ← Animation wrappers
├── lib/
│   ├── firebase.ts
│   ├── firestore.ts
│   └── utils.ts
├── hooks/
├── types/
├── public/
└── agent.md                       ← This file
```

---

## 🗃️ Firestore Data Schema

```
firestore/
├── profile/
│   └── main → { name, tagline, bio, photo, email, github, linkedin, twitter, resumeUrl, availabilityStatus, currentlyLearning }
│
├── projects/ (collection)
│   └── {id} → { title, description, techStack[], githubUrl, liveUrl, imageUrl, featured, order, createdAt }
│
├── skills/ (collection)
│   └── {id} → { name, category, proficiency(0-100), icon, order }
│
├── achievements/ (collection)
│   └── {id} → { title, description, date, type(award|hackathon|competition|recognition), imageUrl }
│
├── certifications/ (collection)
│   └── {id} → { title, issuer, issueDate, expiryDate, credentialUrl, imageUrl, order }
│
├── timeline/ (collection)
│   └── {id} → { title, description, date, type(education|project|internship|achievement) }
│
├── blog/ (collection)
│   └── {id} → { title, slug, content(markdown), excerpt, coverImage, tags[], published, createdAt, updatedAt }
│
├── testimonials/ (collection)
│   └── {id} → { name, role, company, message, avatarUrl, approved, createdAt }
│
├── analytics/ (collection)
│   └── {date} → { views, sections{}, referrers{} }
│
└── settings/
    └── main → { adminEmail, siteTitle, seoDescription, ogImage, darkModeDefault }
```

---

## 🏗️ PHASE 1 — Project Foundation & Setup
**Duration:** Day 1–2  
**Goal:** Working skeleton app with routing, auth, and Firebase wired up

### Tasks

- [ ] Init Next.js 14 project with App Router + TypeScript
  ```bash
  npx create-next-app@latest portfolio --typescript --tailwind --app --src-dir=false
  ```
- [ ] Install core dependencies
  ```bash
  npm install firebase framer-motion gsap lenis @gsap/react
  npm install @tiptap/react @tiptap/starter-kit        # rich text editor
  npm install react-hot-toast zustand                  # toast + state
  npm install sharp                                    # image optimization
  ```
- [ ] Set up Firebase project (Auth + Firestore + Storage)
- [ ] Create `lib/firebase.ts` with config from env vars
- [ ] Create `lib/firestore.ts` with typed CRUD helpers for each collection
- [ ] Set up `.env.local` with all Firebase keys
- [ ] Set up Firebase Auth — Email/Password only, one admin user
- [ ] Create admin auth middleware (`middleware.ts`) to protect `/admin/*` routes
- [ ] Set up Firestore security rules (public read, authenticated write)
- [ ] Set up Firebase Storage rules (public read, authenticated write)
- [ ] Deploy skeleton to Vercel, verify env vars work in production

### Deliverable
> App runs at `/`, admin login works at `/admin/login`, protected routes redirect correctly.

---

## 🏗️ PHASE 2 — Admin Panel (CRUD Engine)
**Duration:** Day 3–6  
**Goal:** Admin can manage all content before building the public site

> **Why admin first?** Real data in Firebase lets you build the public UI against actual content.

### Tasks

#### Admin Shell
- [ ] Build admin layout with sidebar navigation
- [ ] Dashboard page with quick-stats cards (project count, cert count, blog posts)
- [ ] Settings page: update name, email, password, availability status, "currently learning" text

#### Profile / Hero CRUD
- [ ] Edit form: name, tagline, bio (rich text), photo upload, social links
- [ ] Resume PDF upload with replace functionality
- [ ] Availability status toggle (Open to Internships / Busy / Open to Full-time)

#### Projects CRUD
- [ ] List view with drag-to-reorder
- [ ] Create/Edit form: title, description, tech stack (tag input), GitHub URL, live URL, image upload, featured toggle
- [ ] Delete with confirmation modal
- [ ] Featured projects flag (shown first on public site)

#### Skills CRUD
- [ ] Create/Edit: skill name, category (Languages/Frameworks/Tools/Soft Skills), proficiency 0–100, icon (Devicons)
- [ ] Group display by category in list view

#### Achievements CRUD
- [ ] Create/Edit: title, description, date, type, optional image upload

#### Certifications CRUD
- [ ] Create/Edit: title, issuer, dates, credential URL, certificate image upload
- [ ] Image preview in list

#### Timeline CRUD
- [ ] Create/Edit: milestone title, description, date, type
- [ ] Chronological sort in list

#### Blog CRUD
- [ ] TipTap rich text editor with image upload support
- [ ] Slug auto-generation from title
- [ ] Publish/Draft toggle
- [ ] Tag management

#### Testimonials CRUD
- [ ] List pending + approved testimonials
- [ ] Approve / Reject / Delete actions

### Deliverable
> Admin can log in and fully manage all content. All data persists in Firestore.

---

## 🏗️ PHASE 3 — Public Site (Static Sections)
**Duration:** Day 7–10  
**Goal:** Build all public-facing sections with data fetched from Firestore

### Tasks

#### Data Fetching Setup
- [ ] Server components fetch Firestore data at build/request time
- [ ] Loading skeletons for all sections
- [ ] Error boundary per section

#### Section: Hero
- [ ] Full-screen hero with name, tagline, photo (circular with gradient border)
- [ ] Social links row (GitHub, LinkedIn, Twitter, Email)
- [ ] Availability status badge (colored dot + text)
- [ ] "Currently Learning" ticker
- [ ] CTA buttons: View Projects, Download Resume
- [ ] Resume download increments counter in Firestore

#### Section: About
- [ ] Two-column layout: bio text + stats (projects, certifications, GitHub streak)
- [ ] Rich text bio rendered from Firestore

#### Section: Timeline
- [ ] Vertical alternating timeline
- [ ] Each milestone: icon by type, date, title, description
- [ ] Color-coded by type (education/project/internship/achievement)

#### Section: Skills
- [ ] Category tabs or grouped grid
- [ ] Animated progress bars (trigger on scroll enter)
- [ ] Devicon or custom icons per skill

#### Section: Projects
- [ ] Filterable grid (All / Featured / by tech tag)
- [ ] Project card: image, title, description truncated, tech stack pills, GitHub + Live buttons
- [ ] Project detail modal: full description, tech decisions, screenshots, links

#### Section: Achievements
- [ ] Masonry or card grid
- [ ] Type badge (award/hackathon etc.)
- [ ] Date display

#### Section: Certifications
- [ ] Gallery grid with certificate image thumbnails
- [ ] Click to expand: full image + issuer + credential link

#### Section: Blog Preview
- [ ] Latest 3 posts with cover, title, excerpt, tags, date
- [ ] "View all posts" link to `/blog`

#### Section: Testimonials
- [ ] Horizontal scroll carousel or 3-column grid
- [ ] Name, role, company, avatar, quote

#### Section: Contact
- [ ] Name, email, message form
- [ ] Submit sends email via API route (Nodemailer or Resend)
- [ ] Toast feedback on submit

#### Footer
- [ ] Social links, copyright, "Built with" tech credits
- [ ] QR code for portfolio URL

### Deliverable
> Full public portfolio visible with real data, all sections rendering correctly.

---

## 🏗️ PHASE 4 — Motion & Animation Layer
**Duration:** Day 11–13  
**Goal:** Apply all animations, transitions, and motion design

### Animation Inventory

#### Global
- [ ] **Lenis** smooth scroll initialized in root layout
- [ ] Custom CSS cursor: ring that follows mouse, scales on hover
- [ ] Page load: logo/name reveal with clip-path animation

#### Hero Section
- [ ] Name types in letter-by-letter (GSAP SplitText or CSS)
- [ ] Tagline fades up with delay
- [ ] Photo scales in from 0 with spring physics
- [ ] Floating particle background (CSS only, subtle)
- [ ] Availability badge pulses (CSS keyframe)

#### Scroll Animations (Framer Motion `whileInView`)
- [ ] Every section heading: slide up + fade from below
- [ ] Cards: staggered reveal (0.1s delay each)
- [ ] Timeline items: draw connecting line as you scroll
- [ ] Skill bars: count up from 0 on first enter

#### Hover States
- [ ] Project cards: lift (translateY -8px) + enhanced shadow + image zoom
- [ ] Buttons: magnetic pull effect (mouse offset tracking)
- [ ] Social icons: rotate + scale on hover
- [ ] Nav links: underline draw from center

#### Section Transitions
- [ ] Alternating section backgrounds with smooth color blend
- [ ] Parallax on hero background element (GSAP ScrollTrigger)
- [ ] Sticky nav: blur background + shrink height on scroll

#### Theme Transition
- [ ] Dark/light mode toggle with smooth CSS variable transition (300ms)

### Deliverable
> Every scroll, hover, and transition is animated. Site feels premium and alive.

---

## 🏗️ PHASE 5 — AI Chat Assistant
**Duration:** Day 14–15  
**Goal:** Floating chat widget that answers questions about the student

### Tasks
- [ ] Floating chat button (bottom-right, animated entrance)
- [ ] Chat drawer component with message history
- [ ] API route `/api/chat` that:
  1. Fetches current portfolio data from Firestore
  2. Builds a system prompt with all the data
  3. Calls Claude/OpenAI API with user message
  4. Streams response back
- [ ] Rate limiting per IP (5 messages/hour)
- [ ] Suggested starter questions: *"What are his top projects?"*, *"Is he available for internships?"*
- [ ] Chat widget is dismissable, state persists in session

### System Prompt Template
```
You are a helpful assistant for {studentName}'s portfolio website.
Here is everything about them:

BIO: {bio}
SKILLS: {skills}
PROJECTS: {projects}
ACHIEVEMENTS: {achievements}
CERTIFICATIONS: {certifications}
AVAILABILITY: {status}

Answer visitor questions about this student warmly and professionally.
Keep answers concise (2-3 sentences). If asked something not in the data, say you're not sure.
```

### Deliverable
> Visitors can chat and get instant, accurate answers about the student.

---

## 🏗️ PHASE 6 — Analytics, SEO & Polish
**Duration:** Day 16–18  
**Goal:** Make the site findable, shareable, and measurable

### SEO
- [ ] Dynamic `metadata` export in `layout.tsx` from Firestore profile
- [ ] Open Graph image: auto-generated with `@vercel/og` (student name + photo + tagline)
- [ ] `robots.txt` and `sitemap.xml` generation
- [ ] JSON-LD structured data (Person schema)
- [ ] Each blog post has its own OG image

### Analytics
- [ ] Page view tracking: increment Firestore counter on each visit
- [ ] Section visibility tracking (IntersectionObserver → API route)
- [ ] Resume download counter
- [ ] Admin dashboard: total visits, top sections, daily chart (recharts)
- [ ] Referrer tracking (utm_source parsing)

### GitHub Integration
- [ ] Fetch GitHub stats via GitHub REST API (public repos, stars, followers)
- [ ] Display contribution streak and top languages
- [ ] Cache response for 1 hour (Next.js `revalidate`)

### Performance
- [ ] All images optimized via `next/image`
- [ ] Lazy load below-fold sections
- [ ] Font subsetting (only load characters used)
- [ ] Lighthouse score target: 90+ on all metrics

### Deliverable
> Site is indexed, shareable with rich previews, and admin can see visitor data.

---

## 🏗️ PHASE 7 — Testing, QA & Launch
**Duration:** Day 19–20  
**Goal:** Bug-free, cross-browser, mobile-perfect launch

### QA Checklist

#### Functional
- [ ] Admin login / logout works
- [ ] All CRUD operations persist correctly
- [ ] File uploads (image, PDF) work in production
- [ ] Contact form delivers email
- [ ] Resume download works and increments counter
- [ ] AI chat responds correctly
- [ ] Blog posts render markdown correctly

#### Visual / Responsive
- [ ] Mobile (375px): all sections stack correctly
- [ ] Tablet (768px): layout transitions tested
- [ ] Desktop (1440px): max-width containers look good
- [ ] Dark mode: all sections look correct
- [ ] All animations don't break on mobile (disable heavy effects on small screens)

#### Performance
- [ ] Run Lighthouse audit — fix any score below 85
- [ ] Test slow 3G simulation — skeleton loaders appear
- [ ] Test with ad blockers (analytics should fail gracefully)

#### Browser Testing
- [ ] Chrome ✓ | Firefox ✓ | Safari ✓ | Edge ✓

### Launch Steps
- [ ] Point custom domain to Vercel (if student has one)
- [ ] Set all production env vars in Vercel dashboard
- [ ] Enable Vercel Analytics for traffic monitoring
- [ ] Create first admin account and seed with student's real data
- [ ] Test full admin flow in production once
- [ ] Share with student for final review

---

## 🔐 Environment Variables

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Email (Resend or Nodemailer)
RESEND_API_KEY=
CONTACT_EMAIL=

# AI Chat
ANTHROPIC_API_KEY=
# or OPENAI_API_KEY=

# GitHub (for stats integration)
GITHUB_TOKEN=
GITHUB_USERNAME=
```

---

## 📋 Phase Summary

| Phase | Focus | Days | Outcome |
|-------|-------|------|---------|
| 1 | Foundation & Setup | 1–2 | Skeleton app + auth working |
| 2 | Admin Panel | 3–6 | Full CRUD in admin |
| 3 | Public Sections | 7–10 | All sections with real data |
| 4 | Motion & Animation | 11–13 | Premium animated experience |
| 5 | AI Chat Widget | 14–15 | Interactive portfolio assistant |
| 6 | Analytics & SEO | 16–18 | Findable, shareable, measurable |
| 7 | QA & Launch | 19–20 | Bug-free production launch |

**Total Estimated Time:** ~20 development days (solo developer)

---

## 🧪 Dev Commands

```bash
# Development
npm run dev

# Build & check for errors
npm run build

# Type checking
npm run type-check

# Deploy to Vercel
vercel --prod
```

---

## 📝 Notes for Developer

- Always build admin panel features before the corresponding public section — lets you test with real data
- Use **server components** for data fetching (SEO) and **client components** only where interactivity is needed
- Keep animations in a separate `motion/` folder — makes it easy to disable on mobile
- Use **Framer Motion's `AnimatePresence`** for route transitions between pages
- The AI chat feature is the #1 wow factor — prioritize it even if it means simplifying something else
- Mobile-first: design every section on 375px first, then scale up

---

*agent.md v1.0 | Antigravity Development | Student Portfolio Project*
