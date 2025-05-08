export interface Scholarship {
  id: string;
  title: string;
  country: string;
  institution: string;
  deadline: string;
  fields: string[];
  level: "Undergraduate" | "Masters" | "PhD" | "Research" | "Training";
  description: string;
  benefits: string[];
  requirements: string[];
  application_url: string;
  featured: boolean;
  source_url?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export const scholarships = [
  {
    id: "1",
    title: "Japan International Cooperation Agency (JICA) Scholarship",
    country: "Japan",
    institution: "Various Universities in Japan",
    deadline: "2025-10-15",
    fields: ["Engineering", "Environmental Studies", "Public Policy", "Economics"],
    level: "Masters",
    description: "The JICA Scholarship Program offers opportunities for Myanmar students to pursue Master's degrees in Japan's top universities, fully funded by the Japanese government.",
    benefits: [
      "Full tuition coverage",
      "Monthly stipend for living expenses",
      "Round-trip airfare",
      "Research allowance",
      "Medical insurance"
    ],
    requirements: [
      "Myanmar citizenship",
      "Under 35 years of age",
      "Bachelor's degree with minimum GPA of 3.0",
      "At least 2 years of relevant work experience",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    application_url: "https://www.jica.go.jp/myanmar/",
    featured: true
  },
  {
    id: "2",
    title: "Chevening Scholarship",
    country: "United Kingdom",
    institution: "Various UK Universities",
    deadline: "2025-11-02",
    fields: ["All fields available"],
    level: "Masters",
    description: "Chevening is the UK government's international scholarships program aimed at developing global leaders, offering full financial support for a one-year Master's degree at any UK university.",
    benefits: [
      "Full tuition fees",
      "Monthly stipend",
      "Travel costs to and from the UK",
      "Thesis grant",
      "Study materials allowance"
    ],
    requirements: [
      "Myanmar citizenship",
      "Completed undergraduate degree",
      "At least 2 years of work experience",
      "English language proficiency",
      "Return to Myanmar for at least two years after the scholarship"
    ],
    application_url: "https://www.chevening.org/",
    featured: true
  },
  {
    id: "3",
    title: "Australia Awards Scholarships",
    country: "Australia",
    institution: "Australian Universities",
    deadline: "2025-04-30",
    fields: ["Health", "Education", "Governance", "Economics", "Agriculture"],
    level: "Masters",
    description: "Australia Awards Scholarships are prestigious international scholarships offered by the Australian Government to the next generation of global leaders for development.",
    benefits: [
      "Full tuition fees",
      "Return air travel",
      "Establishment allowance",
      "Contribution to living expenses",
      "Health insurance"
    ],
    requirements: [
      "Myanmar citizenship",
      "Not hold Australian permanent residency",
      "Bachelor's degree",
      "English proficiency (IELTS 6.5 overall)",
      "Return to Myanmar for at least 2 years after completion"
    ],
    application_url: "https://www.dfat.gov.au/people-to-people/australia-awards/",
    featured: false
  },
  {
    id: "4",
    title: "Fulbright Foreign Student Program",
    country: "United States",
    institution: "US Universities",
    deadline: "2025-02-28",
    fields: ["All fields available"],
    level: "Masters",
    description: "The Fulbright Foreign Student Program enables graduate students, young professionals, and artists from Myanmar to study and conduct research in the United States.",
    benefits: [
      "Tuition and fees",
      "Monthly stipend",
      "Health insurance",
      "Round-trip airfare",
      "Academic training opportunities"
    ],
    requirements: [
      "Myanmar citizenship",
      "Bachelor's degree",
      "English proficiency (TOEFL minimum 90)",
      "Demonstrated leadership potential",
      "Commitment to return to Myanmar"
    ],
    application_url: "https://foreign.fulbrightonline.org/",
    featured: false
  },
  {
    id: "5",
    title: "DAAD Scholarships for Development-Related Postgraduate Courses",
    country: "Germany",
    institution: "German Universities",
    deadline: "2025-09-30",
    fields: ["Engineering", "Economics", "Environmental Sciences", "Public Health", "Urban Planning"],
    level: "Masters",
    description: "The DAAD (German Academic Exchange Service) offers scholarships for development-related postgraduate courses that address professionals from developing countries including Myanmar.",
    benefits: [
      "Full tuition fees",
      "Monthly stipend",
      "Health insurance",
      "Travel and settling-in allowance",
      "Research grant"
    ],
    requirements: [
      "Myanmar citizenship",
      "Bachelor's degree (minimum grade of 3.0)",
      "At least 2 years of relevant work experience",
      "German or English proficiency depending on the program",
      "Maximum age of 36"
    ],
    application_url: "https://www.daad.de/en/",
    featured: false
  },
  {
    id: "6",
    title: "New Zealand ASEAN Scholar Awards",
    country: "New Zealand",
    institution: "New Zealand Universities",
    deadline: "2025-03-28",
    fields: ["Agriculture and Rural Development", "Disaster Risk Management", "Public Sector Management", "Renewable Energy"],
    level: "Masters",
    description: "New Zealand ASEAN Scholar Awards (NZAS) recognize Myanmar's important relationship with New Zealand and provide an opportunity for Myanmar scholars to gain knowledge and skills in New Zealand's education institutions.",
    benefits: [
      "Full tuition fees",
      "Living allowance",
      "Establishment allowance",
      "Medical and travel insurance",
      "Travel grant"
    ],
    requirements: [
      "Myanmar citizenship",
      "Bachelor's degree with good grades",
      "English language proficiency",
      "Relevant work experience",
      "Commitment to return to Myanmar after completion"
    ],
    application_url: "https://www.mfat.govt.nz/",
    featured: true
  },
  {
    id: "7",
    title: "Italian Government Scholarships for Foreign Students",
    country: "Italy",
    institution: "Italian Higher Education Institutes",
    deadline: "2025-05-16",
    fields: ["Bachelor’s Degree", "Single Cycle Degree", "Master’s Degree", "Arts, Music, and Dance", "PhD program", "Research", "Italian Language and Culture"],
    level: "Masters",
    description: "Offered by the Ministry of Foreign Affairs and International Cooperation (MAECI), these scholarships foster international cooperation, promote Italian language and culture, and support Italy’s economic system. Grants support study, training, and research at public and legally recognized Italian institutions.",
    benefits: [
      "Possible tuition fee exemption",
      "Health and medical insurance",
      "Financial grant of 9,000 euros for most courses"
    ],
    requirements: [
      "Appropriate academic qualifications",
      "Age limits: ≤28 for Masters, ≤30 for PhD, ≤40 for Research",
      "Language skills: B2 Italian or English",
      "Eligible for citizens of specific countries, including Myanmar"
    ],
    application_url: "https://www.esteri.it/en/opportunita/borse-di-studio/per-cittadini-stranieri/borsestudio_stranieri/",
    featured: false,
    source_url: "https://www.scholars4dev.com/3282/italian-government-scholarships-for-international-students/"
  },
  {
    id: "8",
    title: "University of Sydney International Stipend Scholarship",
    country: "Australia",
    institution: "University of Sydney",
    deadline: "2025-09-12",
    fields: ["All fields"],
    level: "PhD",
    description: "This scholarship supports high-quality international postgraduate students pursuing master’s by research or PhD at the University of Sydney, funded by the university. It aims to attract talented researchers for 2026 programs.",
    benefits: [
      "Annual stipend of $41,753",
      "Support for tuition fees and living costs"
    ],
    requirements: [
      "International student status",
      "Outstanding academic achievement",
      "Unconditional offer or enrollment in a master’s by research or PhD"
    ],
    application_url: "https://sydney.edu.au/scholarships/e/university-sydney-international-scholarship.html",
    featured: false,
    source_url: "https://www.scholars4dev.com/2053/international-scholarships-at-university-of-sydney/"
  },
  {
    id: "9",
    title: "Joint Japan World Bank Graduate Scholarship Program",
    country: "Multiple Countries",
    institution: "Universities in U.S., Europe, Africa, Oceania, Japan",
    deadline: "2025-02-28",
    fields: ["Development Studies"],
    level: "Masters",
    description: "This program supports students from developing countries, including Myanmar, with professional experience in development, to pursue master’s degrees in development-related fields at participating universities worldwide.",
    benefits: [
      "Full tuition",
      "Monthly living stipend",
      "Round-trip airfare",
      "Health insurance",
      "Travel allowance"
    ],
    requirements: [
      "Citizen of a World Bank member developing country",
      "No dual citizenship of a developed country",
      "Bachelor’s degree earned 3+ years prior",
      "3 years of development-related employment",
      "Admission to a participating master’s program"
    ],
    application_url: "http://www.worldbank.org/en/programs/scholarships",
    featured: true,
    source_url: "https://www.scholars4dev.com/2735/japan-world-bank-graduate-scholarships-for-development-related-studies/"
  },
  {
    id: "10",
    title: "Bocconi Graduate Merit Awards",
    country: "Italy",
    institution: "Bocconi University",
    deadline: "2025-04-23",
    fields: ["All fields"],
    level: "Masters",
    description: "Bocconi University offers full tuition and fees waivers to top international students applying to its Master of Science programs.",
    benefits: [
      "Full tuition and fees waiver"
    ],
    requirements: [
      "Be among the top applicants based on academic achievement",
      "Apply to a Graduate Program at Bocconi University"
    ],
    application_url: "https://www.unibocconi.eu/wps/wcm/connect/bocconi/sitopubblico_en/navigation+tree/home/programs/master+of+science/funding/2024-25+graduate+award",
    featured: false,
    source_url: "https://www.scholars4dev.com/7574/scholarships-in-italy-for-international-students-at-bocconi-univiersity/"
  },
  {
    id: "11",
    title: "University of Melbourne Graduate Research Scholarships",
    country: "Australia",
    institution: "University of Melbourne",
    deadline: "2025-12-31",
    fields: ["All fields"],
    level: "PhD",
    description: "The University of Melbourne offers scholarships for international students to undertake graduate research degrees, including Masters by Research and PhD, providing full fee offset, living allowance, and other benefits.",
    benefits: [
      "Full fee offset",
      "Living allowance of $38,500 per year",
      "Relocation grant",
      "OSHC for international students"
    ],
    requirements: [
      "Applied for or enrolled in a graduate research degree at University of Melbourne"
    ],
    application_url: "https://study.unimelb.edu.au/how-to-apply/graduate-research",
    featured: false,
    source_url: "https://scholarships.unimelb.edu.au/awards/graduate-research-scholarships"
  },
  {
    id: "12",
    title: "Government of Flanders Master Mind Scholarships",
    country: "Belgium",
    institution: "Government of Flanders",
    deadline: "2025-04-27",
    fields: ["All fields"],
    level: "Masters",
    description: "The Government of Flanders offers scholarships to outstanding international students to pursue Master’s degrees in Flanders, providing a grant and tuition fee waiver.",
    benefits: [
      "Grant of €10,000 per academic year",
      "Tuition fee waiver (€136.50 for 2025-2026)"
    ],
    requirements: [
      "High academic performance (GPA 3.5/4.0)",
      "Good English language knowledge",
      "Accepted by a Flemish institution",
      "All nationalities except Russian"
    ],
    application_url: "https://www.studyinflanders.be/scholarships/master-mind-scholarships",
    featured: false,
    source_url: "https://www.scholars4dev.com/14865/government-of-flanders-master-mind-scholarships-for-international-students/"
  },
  {
    id: "13",
    title: "Université Paris-Saclay International Master’s Scholarships",
    country: "France",
    institution: "Université Paris-Saclay",
    deadline: "2025-05-12",
    fields: ["All fields"],
    level: "Masters",
    description: "Université Paris-Saclay offers scholarships to international students for its Master’s programmes, providing financial support and travel assistance.",
    benefits: [
      "Scholarship of €10,000 per year",
      "Up to €1,000 for travel and visa"
    ],
    requirements: [
      "Admitted to a Master’s programme at Université Paris-Saclay",
      "Newly arrived international students or foreign nationals living in France <1 year",
      "Age 30 and less",
      "Not previously enrolled in French higher education"
    ],
    application_url: "https://www.universite-paris-saclay.fr/en/admission/bourses-et-aides-financieres/bourses-internationales-de-master/international-masters",
    featured: false,
    source_url: "https://www.scholars4dev.com/15259/universite-paris-saclay-international-masters-scholarships-2/"
  },
  {
    id: "14",
    title: "IOE Centenary Masters Scholarships",
    country: "United Kingdom",
    institution: "UCL Institute of Education",
    deadline: "2025-05-05",
    fields: ["Education-related fields"],
    level: "Masters",
    description: "The IOE Centenary Masters Scholarships provide full tuition fees and accommodation for international students from low or lower-middle income countries to study full-time Master’s degrees at the UCL Institute of Education.",
    benefits: [
      "Full tuition fees",
      "Accommodation at International Students House"
    ],
    requirements: [
      "Domiciled in a low or lower-middle income country",
      "Unconditional offer for a full-time master’s at IOE",
      "No previous study or residence in the UK"
    ],
    application_url: "https://www.ucl.ac.uk/ioe/about-ioe/global-reach/scholarships-and-funding",
    featured: false,
    source_url: "https://www.scholars4dev.com/10515/ioe-ish-centenary-masters-scholarships-for-international-students/"
  },
  {
    id: "15",
    title: "Singapore International Graduate Award",
    country: "Singapore",
    institution: "A*STAR",
    deadline: "2025-06-01",
    fields: ["Biomedical Sciences", "Physical Sciences and Engineering"],
    level: "PhD",
    description: "The Singapore International Graduate Award (SINGA) supports international students to pursue PhD programs in biomedical sciences and physical sciences and engineering in Singapore.",
    benefits: [
      "Full tuition fees",
      "Monthly stipend of S$2,700-3,200",
      "Settlement allowance of S$1,000",
      "Airfare grant up to S$1,500"
    ],
    requirements: [
      "International graduate with excellent academic results",
      "Good English skills",
      "Good reports from academic referees"
    ],
    application_url: "https://www.a-star.edu.sg/Scholarships/For-Graduate-Studies/Singapore-International-Graduate-Award-SINGA",
    featured: true,
    source_url: "https://www.scholars4dev.com/13831/singapore-international-graduate-award/"
  },
  {
    id: "16",
    title: "South East Asia Scholarship",
    country: "United Kingdom",
    institution: "University of Essex",
    deadline: "2025-12-31",
    fields: ["All fields"],
    level: "Undergraduate",
    description: "The University of Essex offers scholarships to international undergraduate students from South East Asia, providing tuition fee discounts.",
    benefits: [
      "£3,000 for the first year of study"
    ],
    requirements: [
      "International student from listed countries including Myanmar",
      "Funding own studies"
    ],
    application_url: "https://www.essex.ac.uk/scholarships/south-east-asia-regional-scholarship",
    featured: false,
    source_url: "https://www.essex.ac.uk/scholarships/south-east-asia-regional-scholarship"
  },
  {
    id: "17",
    title: "South East Asia Scholarship",
    country: "United Kingdom",
    institution: "University of Lincoln",
    deadline: "2025-12-31",
    fields: ["All fields"],
    level: "Masters",
    description: "The University of Lincoln offers scholarships to students from South East Asia for postgraduate taught programmes, providing tuition fee discounts based on academic performance.",
    benefits: [
      "£5,000 or £4,000 tuition fee discount"
    ],
    requirements: [
      "From listed South East Asian countries including Myanmar",
      "Overseas fee status",
      "Full-time study",
      "Academic qualifications as specified"
    ],
    application_url: "https://www.lincoln.ac.uk/studywithus/scholarshipsandbursaries/southeastasiascholarship/",
    featured: false,
    source_url: "https://www.lincoln.ac.uk/studywithus/scholarshipsandbursaries/southeastasiascholarship/"
  },
  {
    id: "18",
    title: "International Scholarships for South East Asia & Taiwan Students",
    country: "United Kingdom",
    institution: "Bangor University",
    deadline: "2025-12-31",
    fields: ["All fields"],
    level: "Masters",
    description: "Bangor University offers £5,000 scholarships to students from South East Asia and Taiwan for one-year full-time Masters courses starting in 2025/2026.",
    benefits: [
      "£5,000 tuition fee discount"
    ],
    requirements: [
      "From listed countries including Myanmar",
      "Self-funding or partially funded",
      "International fee status"
    ],
    application_url: "https://www.bangor.ac.uk/international/applying/undergrad",
    featured: false,
    source_url: "https://www.bangor.ac.uk/international/international-scholarships-for-south-east-asia-taiwan-students"
  },
  {
    id: "19",
    title: "Hatfield Lioness Scholarship for Women from Developing Countries",
    country: "United Kingdom",
    institution: "University of Durham",
    deadline: "2025-03-31",
    fields: ["All fields except MBA, PhD, research master’s"],
    level: "Masters",
    description: "The Hatfield Lioness Scholarship provides full funding for women from developing countries to pursue a full-time Master’s degree at the University of Durham, excluding MBA, PhD, and research master’s programmes.",
    benefits: [
      "Full tuition fees",
      "Stipend for living expenses",
      "Accommodation at Hatfield College",
      "Return air ticket",
      "Settling in allowance",
      "Visa and health surcharge costs"
    ],
    requirements: [
      "Woman from an eligible developing country",
      "Unconditional offer for a Master’s programme",
      "No other scholarship",
      "No prior Master’s degree",
      "Financial need"
    ],
    application_url: "https://www.durham.ac.uk/colleges-and-student-experience/colleges/hatfield/hatfield-scholarships-bursaries-and-awards/hatfield-lioness-scholarship-pgt/",
    featured: true,
    source_url: "https://www.scholars4dev.com/24782/hatfield-lioness-scholarship-at-university-of-durham/"
  },
  {
    id: "20",
    title: "Allan and Nesta Ferguson Scholarships",
    country: "United Kingdom",
    institution: "SOAS University of London",
    deadline: "2025-02-07",
    fields: ["Humanities (excluding specific MA programmes)"],
    level: "Masters",
    description: "The Allan and Nesta Ferguson Scholarships provide financial support for students from low income or lower middle income countries to study full-time Master’s programmes in the College of Humanities at SOAS University of London.",
    benefits: [
      "Tuition fee support up to £32,500"
    ],
    requirements: [
      "Resident in low income or lower middle income countries",
      "First class undergraduate degree",
      "Offer from SOAS",
      "English language requirement"
    ],
    application_url: "https://www.soas.ac.uk/study/student-life/finance/scholarships/allan-and-nesta-ferguson-scholarships",
    featured: false,
    source_url: "https://www.scholars4dev.com/13964/ferguson-scholarships-for-africans-at-soas-london/"
  },
  {
    id: "21",
    title: "MEXT Scholarship for Research Students (Graduate Level)",
    country: "Japan",
    institution: "Government of Japan",
    deadline: "2025-04-23",
    fields: ["All fields"],
    level: "PhD",
    description: "The MEXT Scholarship Program supports Myanmar students to pursue research degrees (master's and PhD) in Japan, covering tuition, stipend, and travel costs.",
    benefits: [
      "Tuition fees",
      "Monthly stipend",
      "Round-trip airfare"
    ],
    requirements: [
      "Citizen of Myanmar",
      "Willing to learn Japanese",
      "Health certificate",
      "Application through MAJA"
    ],
    application_url: "https://www.studyinjapan.go.jp/en/smap-stopj-applications-research.html",
    featured: true,
    source_url: "https://www.mm.emb-japan.go.jp/itpr_en/20240402_MEXT.html"
  },
  {
    id: "22",
    title: "MEXT Scholarship for Undergraduate Students",
    country: "Japan",
    institution: "Government of Japan",
    deadline: "2025-05-07",
    fields: ["All fields"],
    level: "Undergraduate",
    description: "The MEXT Scholarship Program supports Myanmar students to pursue undergraduate degrees in Japan, covering tuition, stipend, and travel costs.",
    benefits: [
      "Tuition fees",
      "Monthly stipend",
      "Round-trip airfare"
    ],
    requirements: [
      "Citizen of Myanmar",
      "Willing to learn Japanese",
      "Health certificate",
      "Application through MAJA"
    ],
    application_url: "https://www.studyinjapan.go.jp/en/smap-stopj-applications-undergraduate.html",
    featured: true,
    source_url: "https://www.mm.emb-japan.go.jp/itpr_en/20240402_MEXT.html"
  },
  {
    id: "23",
    title: "Otsuka Toshimi Scholarship",
    country: "Japan",
    institution: "Otsuka Toshimi Foundation",
    deadline: "2025-04-21",
    fields: ["Business administration", "Human health"],
    level: "Masters",
    description: "The Otsuka Toshimi Scholarship provides partial funding for self-supporting international students residing in Japan who are studying business administration or human health-related fields.",
    benefits: [
      "Up to JPY 2,000,000 annually"
    ],
    requirements: [
      "Self-supporting international student in Japan",
      "38 years old or younger",
      "Outstanding academic record",
      "Financial need",
      "Enrolled in a degree program related to human health"
    ],
    application_url: "http://www.otsukafoundation.org/english/guide/index.html",
    featured: false,
    source_url: "https://www.wemakescholars.com/scholarships-for-burmese-students-to-study-in-japan"
  },
  {
    id: "24",
    title: "UNESCO/People's Republic of China (The Great Wall) Co-Sponsored Fellowships Programme",
    country: "China",
    institution: "UNESCO and Chinese Government",
    deadline: "2025-02-21",
    fields: ["All fields"],
    level: "Masters",
    description: "The Great Wall Fellowship Programme offers fully funded one-year programs in China for international students, including those from Myanmar, covering tuition, accommodation, stipend, and medical insurance.",
    benefits: [
      "Tuition waiver",
      "Free accommodation or subsidy",
      "Monthly stipend (CNY 3,000 for general, CNY 3,500 for senior)",
      "Medical insurance"
    ],
    requirements: [
      "Not a citizen of China",
      "Excellent health",
      "Bachelor's or master's degree",
      "Age under 45 for general, under 50 for senior"
    ],
    application_url: "https://www.unesco.org/en/fellowships/greatwall",
    featured: true,
    source_url: "https://www.wemakescholars.com/scholarships-for-burmese-students-to-study-in-china"
  },
  {
    id: "25",
    title: "Yunnan Provincial Government Scholarships",
    country: "China",
    institution: "Yunnan Provincial Government",
    deadline: "2025-04-30",
    fields: ["All fields"],
    level: "Masters",
    description: "The Yunnan Provincial Government offers full scholarships to international students, including those from Myanmar, to study at universities in Yunnan, covering tuition, accommodation, living allowance, and medical insurance.",
    benefits: [
      "Tuition fee waiver",
      "Free on-campus accommodation",
      "Monthly living allowance (CNY 1,400 for undergraduates, CNY 1,700 for master’s)",
      "Comprehensive medical insurance"
    ],
    requirements: [
      "Non-Chinese citizen",
      "Good health",
      "Bachelor’s degree for master’s applicants",
      "Age under 35 for master’s"
    ],
    application_url: "http://www.ynnu.edu.cn/",
    featured: false,
    source_url: "https://www.wemakescholars.com/scholarships-for-burmese-students-to-study-in-china"
  },
  {
    id: "26",
    title: "ASEAN Undergraduate Scholarship",
    country: "Singapore",
    institution: "National University of Singapore",
    deadline: "2025-03-15",
    fields: ["All fields except Medicine, Dentistry, Music"],
    level: "Undergraduate",
    description: "The ASEAN Undergraduate Scholarship supports outstanding students from ASEAN member countries, including Myanmar, to pursue undergraduate studies at NUS.",
    benefits: [
      "Tuition fees after MOE subsidy",
      "Annual living allowance of S$5,800",
      "One-time accommodation allowance"
    ],
    requirements: [
      "Citizen of an ASEAN member country",
      "Excellent academic results",
      "Strong leadership qualities",
      "Good co-curricular activities"
    ],
    application_url: "https://www.nus.edu.sg/oam/scholarships/asean-undergraduate-scholarship",
    featured: true,
    source_url: "https://www.nus.edu.sg/oam/scholarships/asean-undergraduate-scholarship"
  },
  {
    id: "27",
    title: "Swiss Government Excellence Scholarships",
    country: "Switzerland",
    institution: "Swiss Universities",
    deadline: "2025-12-01",
    fields: ["All fields available"],
    level: "PhD",
    description: "The Swiss Government Excellence Scholarships provide Myanmar students and other international students from developing countries the opportunity to pursue doctoral or postdoctoral research in Switzerland.",
    benefits: [
      "Monthly stipend",
      "Tuition fee waiver",
      "Health insurance",
      "Airfare",
      "Housing allowance"
    ],
    requirements: [
      "Myanmar citizenship",
      "Master’s degree for PhD applicants",
      "Under 35 years of age for PhD",
      "English or German proficiency",
      "Research proposal"
    ],
    application_url: "https://www.sbfi.admin.ch/scholarships_eng",
    featured: false,
    source_url: "https://www.sbfi.admin.ch/scholarships_eng"
  },
  {
    id: "28",
    title: "VLIR-UOS Scholarships",
    country: "Belgium",
    institution: "Flemish Universities",
    deadline: "2025-02-01",
    fields: ["Development Studies", "Public Health", "Environmental Sciences", "Technology"],
    level: "Masters",
    description: "VLIR-UOS scholarships support students from developing countries, including Myanmar, to pursue Master’s programs in development-related fields at Flemish universities in Belgium.",
    benefits: [
      "Full tuition fees",
      "Monthly allowance",
      "Travel costs",
      "Insurance",
      "Accommodation support"
    ],
    requirements: [
      "Myanmar citizenship",
      "Bachelor’s degree",
      "English proficiency (IELTS 6.5 or TOEFL 90)",
      "Under 40 years of age",
      "Relevant professional experience"
    ],
    application_url: "https://www.vliruos.be/en/scholarships",
    featured: false,
    source_url: "https://www.vliruos.be/en/scholarships"
  },
  {
    id: "29",
    title: "Thailand International Postgraduate Programme (TIPP)",
    country: "Thailand",
    institution: "Thai Universities",
    deadline: "2025-07-31",
    fields: ["Sustainable Development", "Public Health", "Agriculture", "Environmental Management"],
    level: "Masters",
    description: "The Thailand International Postgraduate Programme (TIPP) offers scholarships to students from developing countries, including Myanmar, to pursue Master’s degrees in Thailand, focusing on sustainable development.",
    benefits: [
      "Full tuition fees",
      "Living allowance",
      "Accommodation",
      "Round-trip airfare",
      "Health insurance"
    ],
    requirements: [
      "Myanmar citizenship",
      "Bachelor’s degree",
      "English proficiency",
      "Under 50 years of age",
      "Good health"
    ],
    application_url: "https://tica-thailand.org/en/tipp",
    featured: false,
    source_url: "https://tica-thailand.org/en/tipp"
  },
  {
    id: "30",
    title: "Konrad-Adenauer-Stiftung Scholarships",
    country: "Germany",
    institution: "German Universities",
    deadline: "2025-07-15",
    fields: ["Social Sciences", "Law", "Economics", "Political Science"],
    level: "Masters",
    description: "The Konrad-Adenauer-Stiftung offers scholarships to international students from developing countries, including Myanmar, to pursue Master’s degrees in Germany, focusing on democracy and development.",
    benefits: [
      "Monthly stipend",
      "Health insurance",
      "Family allowance",
      "Research support"
    ],
    requirements: [
      "Myanmar citizenship",
      "Bachelor’s degree",
      "English or German proficiency",
      "Commitment to democratic values",
      "Under 30 years of age"
    ],
    application_url: "https://www.kas.de/en/web/begabtenfoerderung-und-kultur/scholarships",
    featured: false,
    source_url: "https://www.kas.de/en/web/begabtenfoerderung-und-kultur/scholarships"
  },
  {
    id: "31",
    title: "Chinese Government Scholarship",
    country: "China",
    institution: "Chinese Universities",
    deadline: "2025-03-31",
    fields: ["All fields"],
    level: "Masters",
    description: "The Chinese Government Scholarship supports international students, including those from Myanmar, to study in China, covering tuition, accommodation, and living expenses.",
    benefits: [
      "Full tuition fees",
      "Free accommodation",
      "Monthly stipend",
      "Comprehensive medical insurance"
    ],
    requirements: [
      "Non-Chinese citizen",
      "Bachelor’s degree for master’s applicants",
      "Under 35 years of age",
      "Good health",
      "English or Chinese proficiency"
    ],
    application_url: "http://www.csc.edu.cn/studyinchina",
    featured: true,
    source_url: "http://www.csc.edu.cn/studyinchina"
  },
  {
    id: "32",
    title: "Erasmus Mundus Joint Master Degrees",
    country: "Multiple (Europe)",
    institution: "Various European Universities",
    deadline: "2025-03-15",
    fields: ["Science", "Technology", "Engineering", "Social Sciences", "Humanities"],
    level: "Masters",
    description: "The Erasmus Mundus Joint Master Degrees (EMJMD) offer fully-funded scholarships for students from developing countries, including Myanmar, to pursue Master’s programs across multiple European universities.",
    benefits: [
      "Full tuition fees",
      "Monthly subsistence allowance",
      "Travel and installation costs",
      "Health insurance"
    ],
    requirements: [
      "Myanmar citizenship or residency in a developing country",
      "Bachelor’s degree with good grades",
      "English proficiency (IELTS 6.5 or equivalent)",
      "Relevant academic or professional background"
    ],
    application_url: "https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en",
    featured: false,
    source_url: "https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en"
  },
  {
    id: "33",
    title: "ADB-Japan Scholarship Program",
    country: "Multiple (Asia, Pacific)",
    institution: "Participating Universities in Asia-Pacific",
    deadline: "2025-05-31",
    fields: ["Economics", "Management", "Science and Technology", "Development Studies"],
    level: "Masters",
    description: "The Asian Development Bank-Japan Scholarship Program provides opportunities for students from ADB member countries, including Myanmar, to pursue postgraduate studies in development-related fields.",
    benefits: [
      "Full tuition fees",
      "Monthly subsistence allowance",
      "Housing allowance",
      "Travel expenses",
      "Medical insurance"
    ],
    requirements: [
      "Myanmar citizenship",
      "Bachelor’s degree",
      "At least 2 years of full-time professional experience",
      "English proficiency",
      "Under 35 years of age"
    ],
    application_url: "https://www.adb.org/work-with-us/careers/japan-scholarship-program",
    featured: true,
    source_url: "https://www.adb.org/work-with-us/careers/japan-scholarship-program"
  },
  {
    id: "34",
    title: "Korea Government Scholarship Program (KGSP)",
    country: "South Korea",
    institution: "Korean Universities",
    deadline: "2025-03-31",
    fields: ["All fields"],
    level: "Masters",
    description: "The Korea Government Scholarship Program supports international students, including those from Myanmar, to pursue graduate studies in South Korea, including a one-year Korean language course.",
    benefits: [
      "Full tuition fees",
      "Monthly stipend",
      "Round-trip airfare",
      "Medical insurance",
      "Settlement allowance"
    ],
    requirements: [
      "Myanmar citizenship",
      "Bachelor’s degree",
      "Under 40 years of age",
      "Good health",
      "English or Korean proficiency"
    ],
    application_url: "http://www.studyinkorea.go.kr/en/sub/gks/allnew_invite.do",
    featured: false,
    source_url: "http://www.studyinkorea.go.kr/en/sub/gks/allnew_invite.do"
  },
  {
    id: "35",
    title: "Taiwan International Higher Education Scholarship Program",
    country: "Taiwan",
    institution: "Taiwanese Universities",
    deadline: "2025-03-31",
    fields: ["All fields"],
    level: "Undergraduate",
    description: "The Taiwan International Higher Education Scholarship Program supports students from developing countries, including Myanmar, to pursue undergraduate studies in Taiwan.",
    benefits: [
      "Tuition fee waiver up to NTD 40,000 per semester",
      "Monthly stipend",
      "Travel allowance"
    ],
    requirements: [
      "Myanmar citizenship",
      "High school diploma",
      "Good academic record",
      "English or Chinese proficiency"
    ],
    application_url: "https://www.taiwanscholarship.moe.gov.tw/",
    featured: false,
    source_url: "https://www.taiwanscholarship.moe.gov.tw/"
  },
  {
    id: "36",
    title: "Malaysia International Scholarship (MIS)",
    country: "Malaysia",
    institution: "Malaysian Universities",
    deadline: "2025-06-30",
    fields: ["Science and Engineering", "Economics", "Islamic Finance", "Information Technology"],
    level: "Masters",
    description: "The Malaysia International Scholarship supports outstanding international students, including those from Myanmar, to pursue postgraduate studies at Malaysian universities.",
    benefits: [
      "Full tuition fees",
      "Monthly living allowance",
      "Airfare",
      "Medical insurance"
    ],
    requirements: [
      "Myanmar citizenship",
      "Bachelor’s degree with minimum CGPA of 3.0",
      "English proficiency (IELTS 6.5 or equivalent)",
      "Under 40 years of age"
    ],
    application_url: "https://biasiswa.mohe.gov.my/INTER/",
    featured: false,
    source_url: "https://biasiswa.mohe.gov.my/INTER/"
  },
  {
    id: "37",
    title: "Reach Oxford Scholarship",
    country: "United Kingdom",
    institution: "University of Oxford",
    deadline: "2025-02-15",
    fields: ["All fields except Medicine"],
    level: "Undergraduate",
    description: "The Reach Oxford Scholarship provides full funding for students from low-income countries, including Myanmar, to pursue undergraduate studies at the University of Oxford.",
    benefits: [
      "Full tuition fees",
      "Living allowance",
      "Return airfare per year"
    ],
    requirements: [
      "Citizen of a low-income country",
      "Outstanding academic record",
      "Admission to Oxford",
      "Financial need",
      "Commitment to return to home country"
    ],
    application_url: "https://www.ox.ac.uk/admissions/undergraduate/fees-and-funding/oxford-support/reach-oxford-scholarship",
    featured: true,
    source_url: "https://www.ox.ac.uk/admissions/undergraduate/fees-and-funding/oxford-support/reach-oxford-scholarship"
  },
  {
    id: "38",
    title: "Clarendon Fund Scholarships",
    country: "United Kingdom",
    institution: "University of Oxford",
    deadline: "2025-01-31",
    fields: ["All fields"],
    level: "Masters",
    description: "The Clarendon Fund offers fully-funded scholarships to outstanding graduate students, including those from Myanmar, to pursue Master’s or DPhil degrees at Oxford.",
    benefits: [
      "Full tuition fees",
      "Annual living stipend",
      "Study support grants"
    ],
    requirements: [
      "Outstanding academic merit",
      "Admission to a graduate program at Oxford",
      "No citizenship restrictions"
    ],
    application_url: "https://www.ox.ac.uk/clarendon",
    featured: false,
    source_url: "https://www.ox.ac.uk/clarendon"
  },
  {
    id: "39",
    title: "Gates Cambridge Scholarship",
    country: "United Kingdom",
    institution: "University of Cambridge",
    deadline: "2025-12-03",
    fields: ["All fields"],
    level: "PhD",
    description: "The Gates Cambridge Scholarship supports outstanding international students, including those from Myanmar, to pursue PhD studies at the University of Cambridge.",
    benefits: [
      "Full tuition fees",
      "Maintenance allowance",
      "Airfare",
      "Visa costs",
      "Academic development funding"
    ],
    requirements: [
      "Citizen of any country outside the UK",
      "Admission to a PhD program at Cambridge",
      "Outstanding intellectual ability",
      "Leadership potential"
    ],
    application_url: "https://www.gatescambridge.org/",
    featured: true,
    source_url: "https://www.gatescambridge.org/"
  },
  {
    id: "40",
    title: "Rhodes Scholarship",
    country: "United Kingdom",
    institution: "University of Oxford",
    deadline: "2025-10-01",
    fields: ["All fields"],
    level: "Masters",
    description: "The Rhodes Scholarship is a prestigious award for outstanding students from selected countries, including Myanmar, to pursue postgraduate studies at Oxford.",
    benefits: [
      "Full tuition fees",
      "Annual stipend",
      "Airfare",
      "Health insurance",
      "Settling-in allowance"
    ],
    requirements: [
      "Citizen of an eligible country including Myanmar",
      "Bachelor’s degree with high academic standing",
      "Age 19-25",
      "Leadership and character"
    ],
    application_url: "https://www.rhodeshouse.ox.ac.uk/scholarships/",
    featured: true,
    source_url: "https://www.rhodeshouse.ox.ac.uk/scholarships/"
  },
  {
    id: "41",
    title: "Commonwealth Scholarship",
    country: "United Kingdom",
    institution: "UK Universities",
    deadline: "2025-10-15",
    fields: ["All fields"],
    level: "Masters",
    description: "The Commonwealth Scholarship supports students from Commonwealth countries, including Myanmar, to pursue Master’s degrees in the UK, focusing on development impact.",
    benefits: [
      "Full tuition fees",
      "Living allowance",
      "Airfare",
      "Thesis grant",
      "Study travel grant"
    ],
    requirements: [
      "Citizen of a Commonwealth country",
      "Bachelor’s degree with upper second-class honors",
      "English proficiency",
      "Commitment to development"
    ],
    application_url: "https://cscuk.fcdo.gov.uk/scholarships/",
    featured: true,
    source_url: "https://cscuk.fcdo.gov.uk/scholarships/"
  },
  {
    id: "42",
    title: "Said Foundation Scholarships",
    country: "United Kingdom",
    institution: "Partner UK Universities",
    deadline: "2025-10-31",
    fields: ["All fields"],
    level: "Masters",
    description: "The Said Foundation offers scholarships for students from selected countries, including Myanmar, to pursue Master’s degrees at partner UK universities, focusing on leadership and development.",
    benefits: [
      "Full tuition fees",
      "Living expenses",
      "Travel costs"
    ],
    requirements: [
      "Citizen of an eligible country including Myanmar",
      "Bachelor’s degree",
      "English proficiency",
      "Work experience",
      "Commitment to home country development"
    ],
    application_url: "https://www.saidfoundation.org/scholarships",
    featured: false,
    source_url: "https://www.saidfoundation.org/scholarships"
  },
  {
    id: "43",
    title: "KAUST Fellowship",
    country: "Saudi Arabia",
    institution: "King Abdullah University of Science and Technology",
    deadline: "2025-01-31",
    fields: ["Science", "Engineering", "Technology"],
    level: "Masters",
    description: "The KAUST Fellowship supports international students, including those from Myanmar, to pursue graduate studies in science and technology at KAUST.",
    benefits: [
      "Full tuition fees",
      "Monthly living allowance",
      "Housing",
      "Medical insurance",
      "Relocation support"
    ],
    requirements: [
      "Bachelor’s degree in a relevant field",
      "Strong academic record",
      "English proficiency (TOEFL 79 or IELTS 6.5)",
      "GRE recommended"
    ],
    application_url: "https://admissions.kaust.edu.sa/",
    featured: false,
    source_url: "https://admissions.kaust.edu.sa/"
  },
  {
    id: "44",
    title: "Türkiye Scholarships",
    country: "Turkey",
    institution: "Turkish Universities",
    deadline: "2025-02-28",
    fields: ["All fields"],
    level: "Undergraduate",
    description: "Türkiye Scholarships provide full funding for international students, including those from Myanmar, to pursue undergraduate studies in Turkey.",
    benefits: [
      "Full tuition fees",
      "Monthly stipend",
      "Accommodation",
      "Airfare",
      "Health insurance"
    ],
    requirements: [
      "Non-Turkish citizen",
      "High school diploma",
      "Minimum 70% academic average",
      "Under 21 years of age",
      "Good health"
    ],
    application_url: "https://www.turkiyeburslari.gov.tr/",
    featured: false,
    source_url: "https://www.turkiyeburslari.gov.tr/"
  },
  {
    id: "45",
    title: "Humboldt Research Fellowship",
    country: "Germany",
    institution: "German Research Institutions",
    deadline: "2025-11-30",
    fields: ["All fields"],
    level: "Research",
    description: "The Humboldt Research Fellowship supports international researchers, including those from Myanmar, to conduct research in Germany with a host institution.",
    benefits: [
      "Monthly stipend of €2,670",
      "Travel allowance",
      "Language fellowship",
      "Family allowances"
    ],
    requirements: [
      "Doctorate or equivalent",
      "Research proposal",
      "Host institution in Germany",
      "English or German proficiency"
    ],
    application_url: "https://www.humboldt-foundation.de/en/apply/sponsorship-programmes/humboldt-research-fellowship",
    featured: false,
    source_url: "https://www.humboldt-foundation.de/en/apply/sponsorship-programmes/humboldt-research-fellowship"
  }
];

export const data = { scholarships };
