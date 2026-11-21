import { useParams, Link } from "react-router";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingWidgets from "@/components/FloatingWidgets";
import { useSEO } from "@/lib/seo";
import { bestPath, LOCAL_PLACES } from "@/data/localSeo";
import {
  ArrowLeft,
  Check,
  Calendar,
  MessageSquare,
} from "lucide-react";

const serviceData: Record<string, {
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  category: string;
  categoryLabel: string;
  icon: string;
  accentColor: string;
  bgColor: string;
  price: string;
  benefits: string[];
  features: string[];
  process: string[];
  faqs: { q: string; a: string }[];
}> = {
  "strategic-business-planning": {
    title: "Strategic Business Planning",
    tagline: "Chart a clear path from where you are to where you want to be",
    description: "Comprehensive business strategies aligned with your vision, market conditions and growth objectives.",
    longDescription: "Every great business starts with a clear plan. We work alongside your leadership team to map out where your business stands today, where the market is heading and exactly how to position yourself for sustainable growth. Our strategic planning engagements combine deep market research, competitive analysis and practical execution roadmaps that your team can act on immediately.",
    category: "business",
    categoryLabel: "Business Development",
    icon: "TrendingUp",
    accentColor: "text-electric",
    bgColor: "bg-electric/10",
    price: "From $2,500",
    benefits: [
      "Clear direction aligned with your business vision",
      "Data-driven decisions backed by market research",
      "Identified growth opportunities before competitors",
      "A roadmap your entire team can follow",
      "Reduced risk through informed planning",
      "Measurable milestones and accountability",
    ],
    features: [
      "Comprehensive market and competitive analysis",
      "Business model assessment and optimization",
      "Growth strategy development",
      "Financial projections and scenario planning",
      "Implementation roadmap with milestones",
      "Quarterly strategy review sessions",
    ],
    process: [
      "Discovery call to understand your business",
      "Deep-dive into current operations and market position",
      "Strategy development and scenario planning",
      "Presentation of findings and recommended approach",
      "Implementation support and ongoing guidance",
    ],
    faqs: [
      { q: "How long does a strategic planning engagement take?", a: "Typically 3–6 weeks, depending on the scope and complexity of your business." },
      { q: "Do you work with startups as well as established companies?", a: "We work with businesses at every stage — from early-stage startups to established enterprises." },
      { q: "What deliverables will I receive?", a: "You'll receive a full strategic plan including market analysis, competitive positioning, growth roadmap and financial projections." },
    ],
  },
  "cctv-surveillance-systems": {
    title: "CCTV & Surveillance Systems",
    tagline: "See everything. Miss nothing. Stay protected.",
    description: "Professional CCTV and IP camera systems designed to protect your premises with crystal-clear monitoring.",
    longDescription: "Our security team designs, installs and maintains surveillance systems tailored to your specific environment. Whether you need a simple four-camera setup for a small office or a networked HD solution across multiple facilities, we source the right equipment and build a system you can depend on. Every installation includes thorough planning, professional mounting, network configuration and full handover training.",
    category: "security",
    categoryLabel: "Security Solutions",
    icon: "Shield",
    accentColor: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    price: "Custom Quote",
    benefits: [
      "24/7 monitoring with crystal-clear image quality",
      "Deterrence that reduces incidents before they happen",
      "Remote access from your phone or computer",
      "Scalable systems that grow with your needs",
      "Professional installation and support",
      "Peace of mind for your business and property",
    ],
    features: [
      "IP and HD camera systems",
      "PTZ (pan-tilt-zoom) cameras",
      "Night vision and low-light technology",
      "Remote monitoring and mobile access",
      "Video analytics and motion detection",
      "Cloud and local storage options",
    ],
    process: [
      "On-site security assessment",
      "Custom system design and equipment selection",
      "Professional installation and configuration",
      "System testing and quality assurance",
      "Handover training and ongoing support",
    ],
    faqs: [
      { q: "How many cameras do I need?", a: "It depends on the size and layout of your property. We'll assess your premises and recommend the optimal number and placement." },
      { q: "Can I view cameras remotely?", a: "Yes — all our systems include secure remote access via smartphone app or web browser." },
      { q: "What kind of maintenance do the systems require?", a: "We offer ongoing maintenance packages to keep your system running at peak performance." },
    ],
  },
  "custom-corporate-websites": {
    title: "Custom Corporate Websites",
    tagline: "Your digital flagship, built to convert",
    description: "Bespoke websites engineered for performance, aesthetics and business results.",
    longDescription: "We build corporate websites that do more than look good — they drive real business outcomes. Every project starts with understanding your brand, your audience and your goals. We then design and develop a custom website that reflects your professional identity, loads fast on every device and guides visitors toward the actions that matter most to your business.",
    category: "digital",
    categoryLabel: "Web Development",
    icon: "Globe",
    accentColor: "text-sky-400",
    bgColor: "bg-sky-400/10",
    price: "From $5,000",
    benefits: [
      "A website that truly represents your brand",
      "Fast load times and smooth performance",
      "Mobile-first responsive design",
      "SEO-optimized architecture",
      "Easy content management",
      "Built for conversions, not just visitors",
    ],
    features: [
      "Custom UI/UX design",
      "Responsive mobile-first development",
      "SEO-optimized structure",
      "CMS integration",
      "Performance optimization",
      "Analytics and tracking setup",
    ],
    process: [
      "Discovery and requirements gathering",
      "Design concepts and wireframes",
      "Development and content integration",
      "Testing, QA and performance optimization",
      "Launch and post-launch support",
    ],
    faqs: [
      { q: "How long does it take to build a website?", a: "A typical corporate website takes 4–8 weeks from kickoff to launch, depending on scope." },
      { q: "Will I be able to update the website myself?", a: "Absolutely. We build on user-friendly CMS platforms so your team can manage content without developer support." },
      { q: "Do you provide hosting?", a: "We can recommend and set up reliable hosting for you, or work with your existing provider." },
    ],
  },
  "fmcg-order-booking": {
    title: "FMCG Order Booking",
    tagline: "Turn every outlet visit into an accurate, confirmed order",
    description: "Structured order booking for distributors and field teams — capture, confirm and route FMCG orders with accuracy.",
    longDescription: "In fast-moving consumer goods, an order taken badly is a delivery dispute waiting to happen. We design and run order-booking operations that give your field team a consistent call cycle, a clear order form and a reliable route from outlet to depot. From outlet master data and pricing rules to confirmation calls, credit checks and dispatch handoff, every step is documented so orders arrive complete, correct and on time.",
    category: "fmcg",
    categoryLabel: "FMCG Services",
    icon: "ClipboardList",
    accentColor: "text-orange-400",
    bgColor: "bg-orange-400/10",
    price: "",
    benefits: [
      "Fewer order errors and delivery disputes",
      "Predictable call cycles and outlet coverage",
      "Faster order-to-dispatch turnaround",
      "Clear visibility of daily and weekly order volumes",
      "Better credit and stock control at the point of order",
      "Field teams working from one consistent process",
    ],
    features: [
      "Outlet master data and territory mapping",
      "Standardised order forms and pricing rules",
      "Call cycle planning and route optimisation",
      "Order confirmation and credit checks",
      "Depot and dispatch handoff workflows",
      "Daily order reporting and reconciliation",
    ],
    process: [
      "Review your current order capture and delivery flow",
      "Design order forms, pricing rules and approval steps",
      "Map territories, outlets and call cycles",
      "Pilot with a field team and refine the process",
      "Roll out with training, reporting and ongoing support",
    ],
    faqs: [
      { q: "Can you work with our existing sales team?", a: "Yes. We design the process around your current team, then train them on the new order-booking standards and reporting." },
      { q: "Do you provide order-booking software?", a: "We can work with your existing system or recommend and configure a suitable order-capture tool for your route-to-market." },
      { q: "How quickly can this be running?", a: "A focused order-booking rollout typically takes 2–4 weeks, depending on the number of territories and outlets." },
    ],
  },
  "fmcg-sales": {
    title: "FMCG Sales",
    tagline: "Win the shelf and grow the basket, outlet by outlet",
    description: "Route-to-market sales programmes for fast-moving consumer goods, from distributor coverage to outlet-level execution.",
    longDescription: "FMCG sales are won in the details: the right outlets covered, the right pack sizes on shelf, the right frequency of visits and the right incentives for distributors and reps. We build route-to-market plans that connect your sales targets to real coverage, then support your team with territory plans, pricing architecture, distributor terms and performance routines that make growth measurable.",
    category: "fmcg",
    categoryLabel: "FMCG Services",
    icon: "ShoppingCart",
    accentColor: "text-orange-400",
    bgColor: "bg-orange-400/10",
    price: "From $2,000",
    benefits: [
      "Wider, smarter outlet coverage",
      "Clear pricing and pack architecture",
      "Distributor relationships built on shared targets",
      "Rep performance you can measure and coach",
      "Higher sell-through per outlet visit",
      "A repeatable route-to-market playbook",
    ],
    features: [
      "Route-to-market strategy and territory design",
      "Distributor and wholesaler coverage plans",
      "Pricing, pack and trade-term architecture",
      "Sales targets, incentives and KPI routines",
      "Field coaching and journey-plan standards",
      "Sell-in and sell-out performance reporting",
    ],
    process: [
      "Assess current coverage, pricing and distributor performance",
      "Define territories, targets and route-to-market model",
      "Build pricing and trade terms that protect margin",
      "Launch with rep and distributor training",
      "Review performance monthly and adjust the plan",
    ],
    faqs: [
      { q: "Do you sell on our behalf or help our team sell better?", a: "Both models are possible. Most clients start with a sales programme that equips their own team and distributors, with hands-on support during rollout." },
      { q: "Can this work for a new product entering Kenya?", a: "Yes. We help define the launch territory, distributor model and coverage plan before you commit to stock and field headcount." },
      { q: "How do you measure success?", a: "We agree on coverage, weighted distribution, sell-out volume and margin targets up front, then report against them each month." },
    ],
  },
  "fmcg-supplier-sourcing": {
    title: "FMCG Supplier Sourcing",
    tagline: "Reliable supply, better margins, no surprises",
    description: "Identify, vet and onboard FMCG suppliers and manufacturers with dependable quality, pricing and lead times.",
    longDescription: "Margin and availability both start with the supplier. We help retailers, distributors and brand owners find and qualify FMCG suppliers that can actually deliver — consistent quality, transparent pricing, realistic lead times and the capacity to scale. We handle shortlisting, samples, cost comparisons, terms negotiation and onboarding so you can buy with confidence instead of hoping.",
    category: "fmcg",
    categoryLabel: "FMCG Services",
    icon: "Truck",
    accentColor: "text-orange-400",
    bgColor: "bg-orange-400/10",
    price: "From $1,800",
    benefits: [
      "Access to vetted, capable suppliers",
      "Better landed cost and payment terms",
      "Consistent product quality and packaging",
      "Reduced stock-outs and emergency buying",
      "Clear contracts and service expectations",
      "A supply base that can scale with demand",
    ],
    features: [
      "Supplier market mapping and shortlisting",
      "Sample evaluation and quality checks",
      "Landed-cost and price benchmarking",
      "Negotiation support and term sheets",
      "Supplier onboarding and scorecards",
      "Backup-supplier and continuity planning",
    ],
    process: [
      "Define product specifications and volume requirements",
      "Map and shortlist qualified suppliers",
      "Evaluate samples, certifications and capacity",
      "Negotiate pricing, terms and lead times",
      "Onboard suppliers and set performance reviews",
    ],
    faqs: [
      { q: "Can you source from outside Kenya?", a: "Yes. We evaluate regional and international suppliers where landed cost, quality and lead time make commercial sense." },
      { q: "Do you handle import documentation?", a: "We coordinate with your clearing agent and advise on documentation and compliance requirements; we do not replace a licensed clearing agent." },
      { q: "What if a supplier underperforms?", a: "We build scorecards and backup sourcing into the plan so you have a tested alternative before a problem becomes a stock-out." },
    ],
  },
  "fmcg-merchandizing": {
    title: "FMCG Merchandizing",
    tagline: "Make your products impossible to miss at the shelf",
    description: "Planograms, shelf placement and in-store display standards that lift visibility and sell-through at the point of purchase.",
    longDescription: "Shoppers decide in seconds, and most of that decision is made at the shelf. We design merchandizing standards that put your products in the right place, at the right height, with the right signage and stock levels — then help your team execute them consistently across outlets. The result is better visibility, stronger basket value and fewer missed sales from empty shelves.",
    category: "fmcg",
    categoryLabel: "FMCG Services",
    icon: "Store",
    accentColor: "text-orange-400",
    bgColor: "bg-orange-400/10",
    price: "From $1,600",
    benefits: [
      "Stronger visibility in key outlets",
      "Higher sell-through per shelf facing",
      "Consistent execution across the estate",
      "Better use of available shelf space",
      "Fewer lost sales from empty shelves",
      "Photo-verified compliance you can review",
    ],
    features: [
      "Planogram design by category and channel",
      "Shelf share and facing analysis",
      "Point-of-sale material guidelines",
      "Outlet audit checklists and photo reporting",
      "Merchandiser training and coverage plans",
      "Promotional display and seasonal execution",
    ],
    process: [
      "Audit current shelf presence and compliance",
      "Design planograms and display standards",
      "Brief and train merchandisers and outlet staff",
      "Run an execution wave with photo verification",
      "Review results and tighten the standards",
    ],
    faqs: [
      { q: "Do you provide merchandisers?", a: "We can supply a managed merchandising team or train and equip your existing staff, depending on your coverage needs." },
      { q: "Which outlets do you cover?", a: "We prioritise outlets by volume and strategic value, then build a coverage plan that fits your budget and route-to-market." },
      { q: "How is compliance measured?", a: "Each visit is checked against a short checklist with photo evidence, so you can see shelf share, facings and display quality outlet by outlet." },
    ],
  },
  "fmcg-product-promotion": {
    title: "FMCG Product Promotion",
    tagline: "Move stock today and build demand for tomorrow",
    description: "Consumer promotions, trade offers and activation campaigns that drive trial, repeat purchase and distributor pull.",
    longDescription: "A good FMCG promotion does two jobs at once: it moves stock now and it builds a habit that lasts. We plan promotions around clear objectives — trial, basket size, distributor loading or new-outlet penetration — and design the mechanic, trade terms, in-store activation and measurement so you know what worked. No guesswork, no discount spiral, just campaigns that earn their place in the plan.",
    category: "fmcg",
    categoryLabel: "FMCG Services",
    icon: "Tag",
    accentColor: "text-orange-400",
    bgColor: "bg-orange-400/10",
    price: "From $2,200",
    benefits: [
      "Faster stock movement and rotation",
      "Higher trial and repeat purchase",
      "Stronger distributor and retailer pull",
      "Promotions that protect margin",
      "Clear measurement of every campaign",
      "Seasonal and launch moments fully planned",
    ],
    features: [
      "Promotion strategy and mechanic design",
      "Consumer and trade offer structures",
      "In-store and on-ground activation",
      "Distributor and retailer sell-in support",
      "SMS, social and radio amplification",
      "Redemption tracking and post-campaign review",
    ],
    process: [
      "Agree the objective, target and success measure",
      "Design the mechanic and trade terms",
      "Brief distributors, retailers and activation teams",
      "Run the campaign with weekly tracking",
      "Review results and roll learnings into the next wave",
    ],
    faqs: [
      { q: "Can you run a promotion in a single region first?", a: "Yes. A regional pilot is often the smartest way to prove the mechanic before a national rollout." },
      { q: "Do you handle the creative and media?", a: "We can produce the campaign materials and manage the channel mix, or work alongside your existing agency." },
      { q: "How do you avoid discounting away margin?", a: "We set a margin floor and a break-even volume before launch, then track redemption and sell-out weekly so the promotion stays profitable." },
    ],
  },
  "marketplace-listings": {
    title: "Marketplace Product Listings",
    tagline: "Get your products found where buyers are already shopping",
    description: "List and manage your products on Jumia, Jiji and Kilimall so you show up in the places customers are already searching.",
    longDescription: "You can have the best product and still lose sales if nobody sees it where they shop. We handle listing and visibility across Jumia, Jiji and Kilimall — correct titles, clear descriptions, strong photos, right categories, pricing that fits each platform and profiles that look credible. The goal is simple: more eyeballs on your products, more enquiries and more orders, without you spending the week fighting marketplace uploads.",
    category: "digital",
    categoryLabel: "Digital & E-Commerce",
    icon: "ShoppingBag",
    accentColor: "text-sky-400",
    bgColor: "bg-sky-400/10",
    price: "From $400 per platform",
    benefits: [
      "Products listed where buyers are already searching",
      "Consistent, credible storefronts across platforms",
      "Better visibility with platform-friendly listings",
      "Less time spent creating and updating listings",
      "A wider reach without building your own store first",
      "One team handling multiple marketplaces",
    ],
    features: [
      "Jumia product listings and store setup",
      "Jiji listings and profile optimization",
      "Kilimall listings and shop management",
      "Titles, descriptions and category optimisation",
      "Photo guidance and listing content",
      "Pricing, stock and refresh updates",
    ],
    process: [
      "Review your products, prices and targets",
      "Set up or clean up each marketplace profile",
      "Create and optimise listings for each platform",
      "Launch and monitor enquiries and performance",
      "Refresh listings and pricing as needed",
    ],
    faqs: [
      { q: "Which marketplaces do you work with?", a: "We list and manage products on Jumia, Jiji and Kilimall, and extend to other platforms when it makes sense for your market." },
      { q: "Do I need my own store before listing?", a: "No. Marketplace listings can start before you have your own site, and they often make a good first step while a store is being built." },
      { q: "How long does listing take?", a: "A first batch of listings is usually ready within a few days, depending on how many products and how much content we need to prepare." },
    ],
  },
  "account-social-media-management": {
    title: "Account & Social Media Management",
    tagline: "Your presence, kept active, on-brand and growing",
    description: "Day-to-day management of your social accounts so your brand stays visible, consistent and responding — without you having to post from scratch every day.",
    longDescription: "A social account that goes quiet looks like a business that has gone quiet. We manage your accounts end to end: content planning, posting, caption writing, community responses, basic community monitoring and a calendar that keeps the voice steady across platforms. We work with your brand reality, not a generic content factory, so the posts actually sound and look like you.",
    category: "digital",
    categoryLabel: "Digital & E-Commerce",
    icon: "Monitor",
    accentColor: "text-sky-400",
    bgColor: "bg-sky-400/10",
    price: "From $800 per month",
    benefits: [
      "Accounts that stay active and on-brand",
      "Consistent posting without the day-to-day load",
      "A content plan tied to your business goals",
      "Faster responses to customers and enquiries",
      "Clearer voice across every platform",
      "Space for you to focus on the work that pays",
    ],
    features: [
      "Content calendar and planning",
      "Post creation and scheduling",
      "Caption writing and platform formatting",
      "Community replies and moderation",
      "Profile and bio optimisation",
      "Monthly reporting and review",
    ],
    process: [
      "Review your accounts, audience and goals",
      "Agree a content direction and posting rhythm",
      "Build a calendar and content bank",
      "Publish, respond and monitor",
      "Review performance and adjust the plan",
    ],
    faqs: [
      { q: "Which platforms can you manage?", a: "We manage the platforms that matter for your business, which commonly includes Facebook, Instagram, LinkedIn, X and others where your audience is active." },
      { q: "Do I keep control of my accounts?", a: "Yes. You keep access and control. We manage on your behalf with a clear process and regular review." },
      { q: "What do I need to provide?", a: "Usually brand guidance, key messages, product or service updates and anything you want to promote, plus access to the accounts." },
    ],
  },
  "content-generation": {
    title: "Content Generation",
    tagline: "Words, visuals and ideas — produced, not just promised",
    description: "Content written, adapted and produced for your channels, from posts and captions to longer copy and campaign material.",
    longDescription: "Good content is what makes the rest of marketing work. We generate the content your business needs across formats: social posts, captions, short copy, longer explainers, product copy, campaign lines and content that feeds your website, email and ads. The content fits the channel it is going into, your brand voice and the action you want the reader to take.",
    category: "digital",
    categoryLabel: "Digital & E-Commerce",
    icon: "FileText",
    accentColor: "text-sky-400",
    bgColor: "bg-sky-400/10",
    price: "From $500 per campaign",
    benefits: [
      "Content ready for the channels you use",
      "A consistent brand voice across everything",
      "Less time spent drafting from scratch",
      "More content, better organised",
      "Material that supports sales and awareness",
      "Content that can feed ads, email and web",
    ],
    features: [
      "Social posts and captions",
      "Product and service copy",
      "Campaign and promo copy",
      "Longer explainer and website copy",
      "Content adapted for different channels",
      "Editorial review and revisions",
    ],
    process: [
      "Agree the goals, audience and tone",
      "Map the content to the channels and deadlines",
      "Create the first draft content",
      "Review, revise and approve",
      "Deliver and organise for reuse",
    ],
    faqs: [
      { q: "What kind of content can you produce?", a: "Social posts, captions, product copy, campaign copy, longer website and explainer copy, and content that feeds ads, email and other channels." },
      { q: "Will it sound like our brand?", a: "Yes. We work from your brand voice, messages and examples so the content fits rather than sounds generic." },
      { q: "How fast can content be turned around?", a: "Turnaround depends on volume and review, but a focused batch of content can usually be produced in days rather than weeks." },
    ],
  },
  "ad-generation": {
    title: "Ad Generation",
    tagline: "Ads that earn attention — made the way your market actually notices",
    description: "Create ads in the formats that work: organic-looking natural ads, AI-generated ads, video or image or both, with natural or AI voice-overs for radio-style ads too.",
    longDescription: "Ads fail when they are boring, wrong-format or built for the wrong place. We generate ads across the styles you need: natural ads that feel like part of the feed and AI-generated ads when scale or variation helps. Each ad can be image, video or both, and we also do radio-style ads with natural voice-overs or AI voice-overs, depending on the tone and budget you want. The point is not just to make an ad, but to make one that has a real chance of working where it will run.",
    category: "digital",
    categoryLabel: "Digital & E-Commerce",
    icon: "BarChart2",
    accentColor: "text-sky-400",
    bgColor: "bg-sky-400/10",
    price: "From $600 per ad set",
    benefits: [
      "Ads in the formats that actually get noticed",
      "Natural ads and AI-generated ads when each fits",
      "Video, image or both — built for the placement",
      "Radio-style ads with natural or AI voice-overs",
      "Creative that fits the channel and the goal",
      "Variation so you can test what works",
    ],
    features: [
      "Organic natural ad generation",
      "AI-generated ad creation",
      "Image ads",
      "Video ads",
      "Image + video ad sets",
      "Radio-style ads with natural voice-overs",
      "Radio-style ads with AI voice-overs",
    ],
    process: [
      "Agree the goal, audience and offer",
      "Choose the format and style for each placement",
      "Create the ad creative and versions",
      "Review, revise and approve",
      "Deliver the ads ready to run",
    ],
    faqs: [
      { q: "Can you do both image and video ads?", a: "Yes. We create image ads, video ads and combined image-plus-video ad sets, depending on what the placement and goal need." },
      { q: "What is the difference between natural and AI-generated ads?", a: "Natural ads are built to feel like part of the feed or content around them, while AI-generated ads help when you need scale, variation or faster turnarounds. We choose the approach based on the job." },
      { q: "Can you add voice-overs to radio-style ads?", a: "Yes. Radio-style ads can use a natural voice-over or an AI voice-over, depending on the tone, timing and budget you want." },
    ],
  },
  "ai-system-integration": {
    title: "AI System Integration",
    tagline: "Make your business intelligent — not just automated",
    description: "Integrate AI into existing business systems to automate workflows, improve decisions and create smarter experiences.",
    longDescription: "AI isn't a buzzword when it's woven into the fabric of how your business actually operates. We connect intelligent automation to your existing CRM, databases, websites and workflows so your team works faster, your decisions are sharper and your customers get a better experience — all without ripping out what already works.",
    category: "ai",
    categoryLabel: "AI & Automation",
    icon: "Bot",
    accentColor: "text-violet-400",
    bgColor: "bg-violet-400/10",
    price: "From $5,000",
    benefits: [
      "Faster processes through intelligent automation",
      "Better decisions powered by real-time data",
      "Improved customer experience at every touchpoint",
      "Seamless integration with your existing tools",
      "Scalable AI that grows with your business",
      "Competitive advantage through smarter operations",
      "More time back for your team every week",
      "Higher success rate on the work AI touches",
      "The feeling of winning more often — and knowing why",
      "The satisfaction of automation handling the grind",
      "The breathing room that comes from enjoying a real break",
    ],
    features: [
      "AI Workflow Automation",
      "Intelligent Document Processing",
      "AI-Powered Analytics & Reporting",
      "CRM & Business System Integration",
      "AI Agents — $3,000 setup fee",
      "AI Agents Management & Maintenance — $250 monthly",
      "Subscription — $100 per agent, monthly",
      "Multi-Agent Framework — $5,000 per skill per agent",
      "Agent Training — $300 per agent",
    ],
    process: [
      "Assessment of current systems and workflows",
      "AI opportunity identification and roadmap",
      "Solution design and development",
      "Integration, testing and deployment",
      "Training, monitoring and continuous improvement",
    ],
    faqs: [
      { q: "Do I need to replace my existing systems?", a: "No. We integrate AI into your current tools — no rip-and-replace required." },
      { q: "How long does integration take?", a: "Most projects are delivered within 4–10 weeks, depending on complexity." },
      { q: "Is my data secure?", a: "Security is built into every integration. We follow strict data protection protocols and keep your information within your control." },
      { q: "How do AI Agents pricing and subscriptions work?", a: "AI Agents are set up for $3,000, with management and maintenance at $250 monthly plus $100 per agent each month. Multi-agent skills are priced at $5,000 per skill per agent, and agent training is $300 per agent." },
    ],
  },
};

// Fallback for services not yet in the detail data
function getDefaultService(slug: string) {
  return {
    title: slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    tagline: "A tailored solution for your business",
    description: "Professional services delivered with precision and care.",
    longDescription: "We deliver this service with the same attention to detail and commitment to results that defines everything we do at Yasir Zayed. Our team works closely with you to understand your specific needs and craft a solution that delivers real, measurable impact for your business.",
    category: "business",
    categoryLabel: "Our Services",
    icon: "TrendingUp",
    accentColor: "text-electric",
    bgColor: "bg-electric/10",
    price: "Custom Quote",
    benefits: [
      "Tailored to your specific business needs",
      "Delivered by experienced professionals",
      "Measurable results and clear outcomes",
      "Ongoing support and guidance",
    ],
    features: [
      "Comprehensive needs assessment",
      "Custom solution design",
      "Professional implementation",
      "Quality assurance and testing",
      "Training and handover",
    ],
    process: [
      "Initial consultation and discovery",
      "Solution design and planning",
      "Development and implementation",
      "Review, testing and launch",
      "Ongoing support and optimization",
    ],
    faqs: [
      { q: "How do I get started?", a: "Book a free consultation and we'll discuss your needs, timeline and budget." },
      { q: "What's the typical timeline?", a: "Most projects are completed within 2–8 weeks, depending on scope." },
    ],
  };
}

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const service = serviceData[slug || ""] || getDefaultService(slug || "");

  useSEO({
    title: `${service.title} — ${service.categoryLabel}`,
    description: service.description || service.longDescription?.slice(0, 155) || `Professional ${service.title.toLowerCase()} from Yasir Zayed.`,
    path: `/services/${slug ?? ""}`,
    keywords: `${service.title}, ${service.categoryLabel}, ${service.title} Kenya, business services, Yasir Zayed`,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: service.title,
        serviceType: service.categoryLabel,
        description: service.longDescription,
        url: `https://yasirzayed.com/services/${slug ?? ""}`,
        provider: {
          "@type": "Organization",
          "@id": "https://yasirzayed.com/#organization",
          name: "Yasir Zayed",
          url: "https://yasirzayed.com/",
          telephone: "+254-114-712-989",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Nairobi",
            addressCountry: "KE",
          },
        },
        areaServed: ["Kenya", "East Africa", "Global"],
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: service.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://yasirzayed.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: "https://yasirzayed.com/services",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: service.title,
            item: `https://yasirzayed.com/services/${slug ?? ""}`,
          },
        ],
      },
    ],
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-16 sm:pt-36 sm:pb-20 bg-navy-dark overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern-dark" />
        <div className="absolute top-1/4 right-1/3 w-[400px] h-[400px] bg-electric/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-white/40 mb-8"
          >
            <Link to="/" className="hover:text-white/70 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/services" className="hover:text-white/70 transition-colors">Services</Link>
            <span>/</span>
            <span className="text-white/70">{service.title}</span>
          </motion.div>

          <div className="grid lg:grid-cols-[1fr,auto] gap-12 items-center">
            <div>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`inline-block px-3 py-1 rounded-full ${service.bgColor} ${service.accentColor} text-xs font-semibold uppercase tracking-wider mb-4`}
              >
                {service.categoryLabel}
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4"
              >
                {service.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg sm:text-xl text-white/50 leading-relaxed max-w-2xl mb-8"
              >
                {service.tagline}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-3"
              >
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-electric text-white font-semibold text-sm rounded-lg hover:bg-electric-dark transition-all shadow-lg shadow-electric/20"
                >
                  <Calendar className="w-4 h-4" />
                  Open an Account
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white/80 font-medium text-sm rounded-lg hover:bg-white/5 hover:border-white/30 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  Ask a Question
                </Link>
              </motion.div>
            </div>

            {/* Price card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="hidden lg:block p-8 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm min-w-[240px]"
            >
              <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Starting At</p>
              <p className="text-2xl font-bold text-white mb-4">Order-booking is set up through a live account</p>
              <Link
                to="/contact"
                className="block w-full text-center px-5 py-3 bg-electric text-white font-semibold text-sm rounded-lg hover:bg-electric-dark transition-all"
              >
                Book a Consultation
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr,360px] gap-16">
            {/* Main content */}
            <div>
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">Overview</h2>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {service.longDescription}
                </p>
              </motion.div>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">What You Get</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {service.benefits.map((b) => (
                    <div key={b} className="flex items-start gap-3 p-4 rounded-xl bg-muted/50">
                      <div className="w-6 h-6 rounded-full bg-electric/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-electric" />
                      </div>
                      <span className="text-sm text-foreground font-medium">{b}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">What's Included</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {service.features.map((f) => (
                    <div key={f} className="flex items-center gap-3 p-3 rounded-lg border border-border/50">
                      <div className="w-1.5 h-1.5 rounded-full bg-electric shrink-0" />
                      <span className="text-sm text-foreground">{f}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Process */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">How It Works</h2>
                <div className="space-y-4">
                  {service.process.map((step, i) => (
                    <div key={step} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-navy text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </div>
                      <div className="pt-1">
                        <p className="text-foreground font-medium">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* FAQs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">Common Questions</h2>
                <div className="space-y-4">
                  {service.faqs.map((faq) => (
                    <div key={faq.q} className="p-5 rounded-xl bg-muted/50 border border-border/50">
                      <h3 className="font-semibold text-foreground text-sm mb-2">{faq.q}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:sticky lg:top-24 h-fit space-y-6">
              {/* CTA Card */}
              <div className="p-6 rounded-2xl bg-navy text-white">
                <h3 className="font-display text-lg font-bold mb-2">Ready to set up order booking?</h3>
                <p className="text-white/50 text-sm mb-5">
                  This service is activated for businesses that have an account with Yasir Zayed. Open an account first, then we configure the order-booking process for your outlets, pricing rules and dispatch handoff.
                </p>
                <Link
                  to="/contact"
                  className="block w-full text-center px-5 py-3 bg-electric text-white font-semibold text-sm rounded-lg hover:bg-electric-dark transition-all"
                >
                  Open an Account
                </Link>
              </div>

              {/* Local coverage — links every location variant of this service */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h3 className="font-semibold text-foreground text-sm mb-4">Where we deliver this</h3>
                <div className="space-y-1">
                  {LOCAL_PLACES.map((place) => (
                    <Link
                      key={place.slug}
                      to={bestPath(slug ?? "", place.slug)}
                      className="block p-2.5 rounded-lg hover:bg-muted text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {service.title} in {place.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Related Services */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h3 className="font-semibold text-foreground text-sm mb-4">Related Services</h3>
                <div className="space-y-2">
                  <Link to="/services" className="block p-3 rounded-lg hover:bg-muted text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Browse All Services
                  </Link>
                  <Link to="/contact" className="block p-3 rounded-lg hover:bg-muted text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Open an Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back link */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all services
        </Link>
      </div>

      <Footer />
      <FloatingWidgets />
    </div>
  );
}
