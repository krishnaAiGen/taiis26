import paperSubmissionContent from "./paperSubmissionContent.json"
import paperRegistrationContent from "./paperRegistrationContent.json"
import conferenceTracks from "./conferenceTracks.json"
import specialSessionsContent from "./specialSessions.json"
import workshopsContent from "./workshops.json"
import sessionWorkshopShared from "./sessionWorkshopShared.json"
import doctoralSymposiumContent from "./doctoralSymposiumContent.json"
import visaInformationContent from "./visaInformationContent.json"
import hotelStayContent from "./hotelStayContent.json"
import nearbyAttractionsContent from "./nearbyAttractionsContent.json"
import venueContent from "./venueContent.json"
import internationalExcellenceImpactAwardsContent from "./internationalExcellenceImpactAwardsContent.json"
import qualityPoliciesContent from "./qualityPoliciesContent.json"
import keynoteSpeakerContent from "./keynoteSpeakerContent.json"
import invitedSpeakersContent from "./invitedSpeakersContent.json"
import journalPublicationOpportunitiesContent from "./journalPublicationOpportunitiesContent.json"

/** Enables the awards route; not linked from the main navigation. */
const AWARDS_PUBLISHED = true

/**
 * Router basename, derived from the Vite base path so a custom-domain build
 * (VITE_BASE_PATH=/) and a GitHub Pages build (/taiis2026/) both route
 * correctly. React Router wants no trailing slash, except at the root.
 */
const ROUTER_BASENAME =
  import.meta.env.BASE_URL === "/"
    ? "/"
    : import.meta.env.BASE_URL.replace(/\/$/, "")

export const siteConfig = {
  awardsPublished: AWARDS_PUBLISHED,
  root: ROUTER_BASENAME,
  meta: {
    title: "TAIIS 2026",
    description:
      "International Conference on Trustworthy AI and Intelligent IoT Systems — December 3–5, 2026, Taichung, Taiwan",
  },
  conference: {
    shortName: "TAIIS 2026",
    fullName:
      "International Conference on Trustworthy AI and Intelligent IoT Systems",
    acronym: "TAIIS 2026",
    dates: "December 03–05, 2026",
    datesShort: "Dec 3–5, 2026",
    location: "Taichung, Taiwan",
    locationFull: "Asia University, Taichung, Taiwan",
    countdownTarget: "2026-12-03T09:00:00+08:00",
    email: "taiis2026@cyber-conf.com",
    organizer: "TAIIS 2026 Organizing Committee",
  },
  navigation: [
    { label: "Home", path: "/" },
    {
      label: "Authors",
      children: [
        { label: "Call For Papers", path: "/call-for-papers" },
        { label: "Quality Policies", path: "/quality-policies" },
        { label: "Special Sessions", path: "/special-sessions" },
        { label: "Workshops", path: "/workshops" },
        {
          label: "Doctoral Research Symposium",
          path: "/doctoral-research-symposium",
        },
        { label: "Paper Submission", path: "/paper-submission" },
        { label: "Paper Registration", path: "/paper-registration" },
        { label: "Publication & Indexing", path: "/publication-indexing" },
        {
          label: "Extended Journal Publication Opportunities",
          path: "/journal-publication-opportunities",
        },
        ...(AWARDS_PUBLISHED
          ? [
              {
                label: "International Excellence and Impact Awards",
                path: "/awards/international-excellence-and-impact-awards",
              },
            ]
          : []),
      ],
    },
    { label: "Important Dates", path: "/important-dates" },
    {
      label: "Program",
      children: [
        { label: "Committees", path: "/committees" },
        { label: "Keynote Speakers", path: "/keynote-speaker" },
        {
          label: "Distinguished Invited Speakers",
          path: "/invited-speakers",
        },
      ],
    },
    {
      label: "Travel Guide",
      children: [
        { label: "Venue", path: "/venue" },
        { label: "Visa Information", path: "/visa-information" },
        { label: "Hotels", path: "/hotel-stay" },
        { label: "Nearby Attractions", path: "/nearby-attractions" },
      ],
    },
    { label: "Contact Us", path: "/contact-us" },
  ],
  hero: {
    ctaPrimary: { label: "Call For Papers", path: "/call-for-papers" },
    ctaSubmissionGuidelines: {
      label: "Submission Guidelines",
      path: "/paper-submission",
    },
    ctaSecondary: { label: "Extended Dates", path: "/important-dates" },
    ctaSpecialSessions: {
      label: "Special Sessions",
      path: "/special-sessions",
    },
    ctaWorkshops: { label: "Workshops", path: "/workshops" },
    ctaDoctoralSymposium: {
      label: "Doctoral Symposium",
      path: "/doctoral-research-symposium",
    },
    ctaExtendedJournalPublication: {
      label: "Extended Journal Publication Opportunities",
      path: "/journal-publication-opportunities",
    },
    ctaSubmit: {
      label: "Submit Paper",
      url: paperSubmissionContent.cmtUrl,
    },
    slider: {
      intervalMs: 6000,
    },
  },
  publicationPartners: {
    title: "Publication Partners",
    slider: {
      intervalMs: 4500,
      marqueeDurationSec: 28,
    },
    partners: [
      {
        name: "Lecture Notes in Electrical Engineering",
        logo: "images/publication-partners/lnee.jpg",
        alt: "Lecture Notes in Electrical Engineering — Springer series logo",
      },
      {
        name: "Springer",
        logo: "images/publication-partners/springer.jpg",
        alt: "Springer publication partner logo",
      },
      {
        name: "Scopus",
        logo: "images/publication-partners/scopus.png",
        alt: "Scopus indexing partner logo",
      },
      {
        name: "Compendex",
        logo: "images/publication-partners/compendex.jpg",
        alt: "Compendex Engineering Index partner logo",
      },
    ],
  },
  home: {
    highlights: [
      {
        label: "Conference dates",
        value: "Dec 3–5, 2026",
        hint: "Three days of research & networking",
      },
      {
        label: "Host city",
        value: "Taichung",
        hint: "Culture, night markets & coast",
      },
      {
        label: "Venue",
        value: "Asia University",
        hint: "Taichung, Taiwan",
      },
    ],
    taichungShowcase: {
      eyebrow: "Host city",
      title: "Experience Taichung",
      subtitle:
        "TAIIS 2026 welcomes you to Taichung — a vibrant city where innovative research meets rich culture, scenic wetlands, iconic architecture, and warm Taiwanese hospitality.",
      ctaLabel: "Venue & travel",
      ctaPath: "/venue",
      textureImage: "images/hero/gaomei-wetlands.jpg",
      photoNote:
        "Landmark photos from Wikimedia Commons (CC). Stored locally in public/images/.",
      places: [
        {
          name: "National Taichung Theater",
          description:
            "An architectural landmark by Toyo Ito — a stunning venue for the arts in the heart of the city.",
          image: "images/hero/national-taichung-theater.jpg",
          alt: "National Taichung Theater exterior",
          credit: "Photo: Wikimedia Commons / CC BY-SA",
        },
        {
          name: "Gaomei Wetlands",
          description:
            "Famous for dramatic sunsets and the iconic wind turbines along the coast.",
          image: "images/hero/gaomei-wetlands.jpg",
          alt: "Gaomei Wetlands at sunset",
          credit: "Photo: Wikimedia Commons / CC BY-SA",
        },
        {
          name: "Rainbow Village",
          description:
            "A beloved pocket of street art and color — a must-see photo stop for visitors.",
          image: "images/hero/rainbow-village.jpg",
          alt: "Rainbow Village murals in Taichung",
          credit: "Photo: Wikimedia Commons / CC BY-SA",
        },
        {
          name: "Taichung Park",
          description:
            "A serene oasis with pavilions and lakes — perfect for a stroll between sessions.",
          image: "images/hero/taichung-park.jpg",
          alt: "Taichung Park lake pavilion",
          credit: "Photo: Wikimedia Commons / CC BY-SA",
        },
        {
          name: "Miyahara",
          description:
            "Historic red-brick building turned creative hub — sweets, souvenirs, and heritage.",
          image: "images/taichung/miyahara.jpg",
          alt: "Miyahara building in Taichung",
          credit: "Photo: Wikimedia Commons / CC BY-SA",
        },
      ],
    },
    aimAndScope: {
      title: "Aim and Scope",
      slider: {
        intervalMs: 5500,
        slides: [
          {
            src: "images/hero/national-taichung-theater.jpg",
            alt: "National Taichung Theater",
          },
          {
            src: "images/hero/gaomei-wetlands.jpg",
            alt: "Gaomei Wetlands, Taichung",
          },
          {
            src: "images/hero/rainbow-village.jpg",
            alt: "Rainbow Village, Taichung",
          },
          {
            src: "images/hero/taichung-park.jpg",
            alt: "Taichung Park",
          },
          {
            src: "images/hero/taichung-city.jpg",
            alt: "Taichung city",
          },
          {
            src: "images/taichung/miyahara.jpg",
            alt: "Miyahara, Taichung",
          },
        ],
      },
      paragraphs: [
        "The International Conference on Trustworthy AI and Intelligent IoT Systems (TAIIS 2026) will be held December 3–5, 2026, in Taiwan. The conference aims to provide a premier international forum for researchers, academicians, industry professionals, policymakers, and practitioners to present and discuss the latest advances in trustworthy artificial intelligence (AI), intelligent Internet of Things (IoT) systems, and secure cyber-physical technologies.",
        "As AI and IoT continue to drive digital transformation across industries, ensuring security, privacy, reliability, transparency, and ethical deployment has become increasingly important. TAIIS 2026 seeks to foster interdisciplinary collaboration by bringing together experts from academia, industry, and government to address emerging challenges and opportunities in building intelligent, secure, resilient, and trustworthy digital ecosystems.",
        "The conference welcomes original research contributions, innovative methodologies, practical implementations, industrial case studies, and visionary perspectives covering theoretical foundations, enabling technologies, and real-world applications. TAIIS 2026 encourages discussions on next-generation AI, edge intelligence, cybersecurity, intelligent networking, digital twins, autonomous systems, privacy-preserving computing, and sustainable intelligent infrastructures, with the goal of advancing trustworthy AI-enabled solutions for future smart societies.",
        "Researchers are invited to submit high-quality, original, and unpublished work that contributes to the advancement of trustworthy AI, intelligent IoT systems, and their applications across healthcare, manufacturing, transportation, smart cities, critical infrastructure, consumer technologies, and other emerging domains.",
      ],
    },
    publicationPreview: {
      title: "Publication & Indexing",
      readMoreLabel: "View Full Details",
      readMorePath: "/publication-indexing",
      noticeBeforeLink:
        'It is planned to publish the peer reviewed and selected papers of conference as proceedings with Springer in their prestigious "Lecture Notes in Electrical Engineering" series. For detailed instructions for author and editors of conference proceedings, kindly visit the following link: ',
      springerUrl:
        "https://www.springer.com/us/authors-editors/conference-proceedings",
      noticeAfterLink:
        ". Select papers from the conference will be published by Springer as a proceedings book volume. Springer will conduct quality checks on the accepted papers and only papers that pass these checks will be published. Springer Nature does not charge any money for publication of Non-Open Access content. Abstracts/extended abstracts and short papers (less than 4 pages) are not considered for publication.",
    },
    topicsPreview: {
      title: "Topics of Interest",
      subtitle:
        "TAIIS 2026 welcomes original research contributions in, but not limited to, the following topics:",
      viewAllLabel: "View All Topics",
      viewAllPath: "/call-for-papers",
    },
    knowledgePartner: {
      title: "Knowledge Partners",
      partners: [
        {
          name: "University of Ottawa",
          logo: "images/knowledge-partners/uottawa.png",
          alt: "University of Ottawa (uOttawa) logo",
          url: "https://www.uottawa.ca",
        },
        {
          name: "Hong Kong Metropolitan University",
          logo: "images/knowledge-partners/hkmu.png",
          alt: "Hong Kong Metropolitan University logo",
          url: "https://www.hkmu.edu.hk",
        },
        {
          name: "NBSC",
          logo: "images/knowledge-partners/nbsc.jpg",
          alt: "NBSC logo",
        },
        {
          name: "Universitas Budi Luhur",
          logo: "images/knowledge-partners/budi-luhur.jpg",
          alt: "Universitas Budi Luhur logo",
          url: "https://www.budiluhur.ac.id",
        },
        {
          name: "Kalbis University",
          logo: "images/knowledge-partners/kalbis-university.jpg",
          alt: "Kalbis University logo",
          url: "https://kalbis.ac.id",
        },
      ],
    },
    industryPartner: {
      title: "Industry Partners",
      partners: [
        {
          name: "NextQ",
          logo: "images/partners/nextq.png",
          alt: "NextQ Industry Partner logo",
        },
        {
          name: "ArQus Solutions",
          logo: "images/partners/arqus-solutions.png",
          alt: "ArQus Solutions — Quantum-Resilient Network Planning",
          url: "https://arqus-solutions.eu",
        },
        {
          name: "eLe'ai",
          logo: "images/partners/eleai.png",
          alt: "eLe'ai industry partner logo",
        },
      ],
    },
    quickLinks: {
      title: "Conference at a Glance",
      items: [
        {
          title: "Submit Your Paper",
          description: "Share your original research via Microsoft CMT.",
          path: "/paper-submission",
          icon: "file-text",
        },
        {
          title: "Special Sessions",
          description: "Browse themed tracks and their submission scopes.",
          path: "/special-sessions",
          icon: "layers",
        },
        {
          title: "Workshops",
          description: "Explore co-located workshops at TAIIS 2026.",
          path: "/workshops",
          icon: "wrench",
        },
        {
          title: "Important Dates",
          description: "Track submission deadlines and conference milestones.",
          path: "/important-dates",
          icon: "calendar",
        },
        {
          title: "Venue",
          description: "Asia University, Taichung, Taiwan.",
          path: "/venue",
          icon: "map-pin",
        },
        {
          title: "Contact Us",
          description: "Reach the organizing committee for inquiries.",
          path: "/contact-us",
          icon: "mail",
        },
      ],
    },
    countdown: {
      title: "Countdown to Conference",
      subtitle: "Join us in Taichung, Taiwan",
      backgroundImage: "images/hero/gaomei-wetlands.jpg",
      labels: {
        days: "Days",
        hours: "Hours",
        minutes: "Minutes",
        seconds: "Seconds",
      },
    },
  },
  callForPapers: {
    title: "Call For Papers",
    intro:
      "We solicit original research and technical papers not published elsewhere. The papers can be theoretical, practical and application oriented on the following conference tracks but not limited to:",
    topicsTitle: "Conference Tracks",
    tracks: conferenceTracks,
  },
  specialSessions: {
    title: specialSessionsContent.title,
    intro: specialSessionsContent.intro,
    focusLabel: specialSessionsContent.focusLabel,
    sectionTitles: specialSessionsContent.sectionTitles,
    committeesNote: sessionWorkshopShared.committeesNote,
    submissionDates: sessionWorkshopShared.submissionDates,
    submission: sessionWorkshopShared.submission,
    sessions: specialSessionsContent.sessions,
  },
  workshops: {
    title: workshopsContent.title,
    intro: workshopsContent.intro,
    sectionTitles: workshopsContent.sectionTitles,
    committeesNote: sessionWorkshopShared.committeesNote,
    submissionDates: sessionWorkshopShared.submissionDates,
    submission: sessionWorkshopShared.submission,
    workshops: workshopsContent.workshops,
  },
  doctoralSymposium: doctoralSymposiumContent,
  visaInformation: visaInformationContent,
  hotelStay: hotelStayContent,
  nearbyAttractions: nearbyAttractionsContent,
  awardsNav: {
    title: "Awards & Recognition",
  },
  internationalExcellenceImpactAwards: internationalExcellenceImpactAwardsContent,
  qualityPolicies: qualityPoliciesContent,
  publicationIndexing: {
    title: "Publication & Indexing",
  },
  paperSubmission: {
    title: paperSubmissionContent.title,
    cmtUrl: paperSubmissionContent.cmtUrl,
    cmtLinkText: paperSubmissionContent.cmtLinkText,
    pageLimit: paperSubmissionContent.pageLimit,
    pageLimitNote: paperSubmissionContent.pageLimitNote,
    guidelinesTitle: paperSubmissionContent.guidelinesTitle,
    guidelines: paperSubmissionContent.guidelines,
    templatesTitle: paperSubmissionContent.templatesTitle,
    templatesIntro: paperSubmissionContent.templatesIntro,
    templates: paperSubmissionContent.templates,
    methodTitle: paperSubmissionContent.methodTitle,
    methodIntro: paperSubmissionContent.methodIntro,
    cmtAcknowledgment: paperSubmissionContent.cmtAcknowledgment,
  },
  paperRegistration: paperRegistrationContent,
  importantDates: {
    title: "Important Dates",
    dates: [
      { label: "Call for Papers", date: "July 01, 2026" },
      {
        label: "Paper Submission Deadline",
        date: "October 12, 2026 (Hard Deadline)",
        supersededDate: "September 30, 2026",
      },
      {
        label: "Doctoral Symposium Submission Deadline",
        date: "October 20, 2026 (Hard Deadline)",
      },
      {
        label: "Acceptance Notification",
        date: "October 30, 2026",
        supersededDate: "October 15, 2026",
      },
      {
        label: "Camera-Ready Submission & Early Bird Registration",
        date: "November 05, 2026",
      },
      { label: "Conference Dates", date: "December 3–5, 2026", highlight: true },
    ],
  },
  committees: {
    title: "Committees",
    groups: [
      {
        role: "Honorary Chair",
        members: [
          {
            name: "Jeffrey J. P. Tsai",
            affiliation: "President, Asia University, Taiwan",
          },
          {
            name: "Amiya Nayak",
            affiliation:
              "School of Electrical Engineering and Computer Science, University of Ottawa, Canada",
          },
          {
            name: "Gregorio Martinez Perez",
            affiliation: "University of Murcia (UMU), Spain",
          },
          { name: "Andrew Ip", affiliation: "University of Saskatchewan, Canada" },
          {
            name: "Francesco Palmieri",
            affiliation: "University of Salerno, Italy",
          },
        ],
      },
      {
        role: "General Chair",
        members: [
          { name: "Ching-Hsien Hsu", affiliation: "Asia University, Taiwan" },
          {
            name: "Nadia Nedjah",
            affiliation: "State University of Rio de Janeiro, Brazil",
          },
          { name: "Chun-Yuan Lin", affiliation: "Asia University, Taiwan" },
          { name: "Sudhan Majhi", affiliation: "Indian Institute of Science, Bangalore, India" },
        ],
      },
      {
        role: "Program Chairs",
        members: [
          {
            name: "Arcangelo Castiglione",
            affiliation: "University of Salerno, Fisciano, Salerno, Italy",
          },
          {
            name: "Kwok Tai Chui",
            affiliation: "Hong Kong Metropolitan University, Hong Kong",
          },
          { name: "Chi-Wen Lung", affiliation: "Asia University, Taiwan" },
        ],
      },
      {
        role: "Publicity Chairs",
        members: [
          {
            name: "Priyanka Chaurasia",
            affiliation: "University of Ulster, UK",
          },
          {
            name: "Mosiur Rahaman",
            affiliation: "King Mongkut's University of Technology Thonburi, Thailand",
          },
          {
            name: "Agung Mulyo Widodo",
            affiliation: "Esa Unggul University, Indonesia",
          },
          {
            name: "Megha Quamara",
            affiliation: "King's College London, UK",
          },
        ],
      },
      {
        role: "Workshop Chairs",
        members: [
          { name: "Dragan Peraković", affiliation: "University of Zagreb, Croatia" },
          {
            name: "Tzu-Chuen Lu",
            affiliation: "National Chin-Yi University of Technology, Taiwan",
          },
          { name: "Akshat Gaurav", affiliation: "Ronin Institute, USA" },
        ],
      },
      {
        role: "Local Arrangement Chairs",
        members: [
          {
            name: "Vincent Shin-Hung Pan",
            affiliation: "Chaoyang University of Technology, Taiwan",
          },
          { name: "Brij Gupta", affiliation: "Asia University, Taiwan" },
          {
            name: "Mu-Yen Chen",
            affiliation: "National Cheng Kung University, Tainan, Taiwan",
          },
        ],
      },
      {
        role: "Industry Chair",
        members: [
          {
            name: "Sugam Sharma",
            affiliation:
              "Founder, Iowa State University SUF/eLegalls ai, USA",
          },
        ],
      },
      {
        role: "Technical Program Committee",
        members: [
          {
            name: "Michael Sheng",
            affiliation: "Macquarie University, Sydney, Australia",
          },
          {
            name: "Shingo Yamaguchi",
            affiliation: "Yamaguchi University, Japan",
          },
          {
            name: "Awaneesh Kumar Yadav",
            affiliation: "Indian Institute of Technology (BHU) Varanasi, India",
          },
          {
            name: "Athanasios V. Vasilakos",
            affiliation: "University of Agder (UiA), Grimstad, Norway",
          },
          {
            name: "Zeeshan A. Khan",
            affiliation: "National Yunlin University of Science and Technology, Taiwan",
          },
          {
            name: "Ammar Almomani",
            affiliation: "Al-Balqa Applied University, Jordan",
          },
          { name: "Abhay Ratnaparkhi", affiliation: "eBay Inc., USA" },
          {
            name: "Ayan Mondal",
            affiliation: "Indian Institute of Technology Indore, India",
          },
          {
            name: "Nitin Auluck",
            affiliation: "Indian Institute of Technology Ropar, India",
          },
          {
            name: "Anupama Mishra",
            affiliation: "Swami Rama Himalayan University, Dehradun, India",
          },
          {
            name: "Yining Liu",
            affiliation: "Guilin University of Electronic Technology, China",
          },
          {
            name: "Santosh Kumar Vishwakarma",
            affiliation: "Institute of Technology Indore, India",
          },
          { name: "Vijayakumar Pandi", affiliation: "SRM University, India" },
          { name: "Jinsong Wu", affiliation: "University of Chile, Chile" },
          {
            name: "Andrea Bruno",
            affiliation: "University of Salerno, Italy",
          },
          { name: "Sahil Garg", affiliation: "Canadian University, Dubai, UAE" },
          {
            name: "Surya Prakash",
            affiliation: "Institute of Technology Indore, India",
          },
          { name: "Ivan Cvitić", affiliation: "University of Zagreb, Croatia" },
          {
            name: "Liang Zhou",
            affiliation:
              "Shanghai University of Medicine and Health Sciences, Shanghai 201318, China",
          },
          {
            name: "Yuk Ming TANG",
            affiliation: "Hong Kong Polytechnic University, Hong Kong",
          },
          { name: "Meena Malik", affiliation: "Chandigarh University, Punjab, India" },
          {
            name: "Wadee Alhalabi",
            affiliation: "King Abdulaziz University, Jeddah, Saudi Arabia",
          },
          { name: "Muhammet Deveci", affiliation: "University College London, UK" },
          {
            name: "Dragan Pamucar",
            affiliation: "Vilnius Gediminas Technical University, Vilnius, Lithuania",
          },
          {
            name: "Balwinder Raj",
            affiliation: "National Institute of Technology Jalandhar, India",
          },
          { name: "Xiaochun Cheng", affiliation: "Swansea University, UK" },
          {
            name: "Aniket Mahanti",
            affiliation: "The University of Auckland, New Zealand",
          },
          {
            name: "Suryadip Chakraborty",
            affiliation: "Johnson C. Smith University, USA",
          },
          { name: "Virendra Bhavsar", affiliation: "Univ. of New Brunswick, Canada" },
          {
            name: "Chinthaka Premachandra",
            affiliation: "Shibaura Institute of Technology, Japan",
          },
          {
            name: "T. Perumal",
            affiliation: "Universiti Putra Malaysia (UPM), Malaysia",
          },
          {
            name: "Marjan Kuchaki Rafsanjani",
            affiliation: "Shahid Bahonar University of Kerman, Kerman, Iran",
          },
          {
            name: "Sugam Sharma",
            affiliation: "Iowa State University, United States",
          },
          {
            name: "Pethuru Raj",
            affiliation: "Vice President, Reliance Jio Infocomm. Ltd (RJIL), India",
          },
          {
            name: "S. K. Gupta",
            affiliation: "Indian Institute of Technology Delhi, India",
          },
          { name: "Angela Amphawan", affiliation: "Sunway University, Malaysia" },
          {
            name: "Ahmed A. Abd El-Latif",
            affiliation: "Menoufia University, Egypt",
          },
          {
            name: "Domenico Santaniello",
            affiliation: "University of Salerno, Italy",
          },
          { name: "Vimal Kumar", affiliation: "CYUT, Taichung, Taiwan" },
          {
            name: "Muhammad Khurram Khan",
            affiliation: "King Saud University, Riyadh, Kingdom of Saudi Arabia",
          },
          {
            name: "Elhadj Benkhelifa",
            affiliation: "Staffordshire University, UK",
          },
          {
            name: "Chang Choi",
            affiliation: "Gachon University, Rep. of Korea",
          },
          {
            name: "Mamoun Alazab",
            affiliation: "Charles Darwin University, Australia",
          },
          {
            name: "Konstantinos Psannis",
            affiliation: "University of Macedonia, Greece",
          },
          {
            name: "Anupam Shukla",
            affiliation: "National Institute of Technology Surat, India",
          },
          {
            name: "Shaohua Wan",
            affiliation: "Zhongnan University of Economics and Law, China",
          },
          {
            name: "Amit Kumar Singh",
            affiliation: "National Institute of Technology Patna, India",
          },
          {
            name: "Manjur S. Kolhar",
            affiliation: "Prince Sattam Bin Abdulaziz University, KSA",
          },
          {
            name: "Byung-Gyu Kim",
            affiliation: "Sookmyung Women's University, Seoul, Rep. of Korea",
          },
          {
            name: "Awadhesh Kumar Singh",
            affiliation: "National Institute of Technology Kurukshetra, India",
          },
          {
            name: "Imran Razzak",
            affiliation:
              "Mohamed bin Zayed University of Artificial Intelligence (MBZUAI), Abu Dhabi, UAE",
          },
          {
            name: "Raffaele Pizzolante",
            affiliation: "University of Salerno, Italy",
          },
          { name: "Harish Kumar", affiliation: "Galgotias University, India" },
          {
            name: "Hamideh Fatemidokht",
            affiliation: "Shahid Bahonar University of Kerman, Kerman, Iran",
          },
        ],
      },
    ],
  },
  keynoteSpeaker: keynoteSpeakerContent,
  invitedSpeakers: invitedSpeakersContent,
  journalPublicationOpportunities: journalPublicationOpportunitiesContent,
  venue: {
    title: "Venue",
    subtitle: "Asia University · Taichung, Taiwan",
    name: "Asia University, Taichung, Taiwan",
    note: "TAIIS 2026 will be hosted at Asia University in Taichung. Detailed room assignments, campus maps, and shuttle information will be announced closer to the conference dates.",
    map: {
      embedTitle: "Asia University, Taichung — Google Maps",
      address:
        "500, Lioufeng Rd., Wufeng Dist., Taichung City 41354, Taiwan (Asia University)",
      embedUrl:
        "https://www.google.com/maps?q=Asia+University,+500+Lioufeng+Road,+Wufeng+District,+Taichung+City,+Taiwan&hl=en&z=16&output=embed",
      openUrl:
        "https://www.google.com/maps/search/?api=1&query=Asia+University+Taichung+Taiwan",
    },
    galleryTitle: venueContent.galleryTitle,
    gallery: venueContent.gallery,
  },
  contact: {
    title: "Contact Us",
    message: "All questions about submissions should e-mail to:",
  },
  topics: conferenceTracks.flatMap((track) => track.topics),
  footer: {
    tagline:
      "Advancing trustworthy AI and intelligent IoT systems for future smart societies.",
    quickLinksTitle: "Quick Links",
    conferenceInfoTitle: "Conference Info",
    copyright: "© 2026 TAIIS. All rights reserved.",
    poweredBy: "International Conference on Trustworthy AI and Intelligent IoT Systems",
  },
  notFound: {
    title: "404",
    heading: "Page Not Found",
    message:
      "The page you are looking for does not exist or may have been moved.",
    backHome: "Back to Home",
  },
  breadcrumbs: {
    home: "Home",
  },
  ui: {
    scrollToTop: "Scroll to top",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    comingSoon: "Coming Soon",
    learnMore: "Learn more",
    goBack: "Go Back",
  },
} as const

export type SiteConfig = typeof siteConfig
