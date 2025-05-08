
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

export const scholarships: Scholarship[] = [
  {
    id: "1",
    title: "Japan International Cooperation Agency (JICA) Scholarship",
    country: "Japan",
    institution: "Various Universities in Japan",
    deadline: "2025-10-15",
    fields: ["Engineering", "Environmental Studies", "Public Policy", "Economics"],
    level: "Masters",
    description: "The JICA Scholarship Program offers opportunity for Myanmar students to pursue Master's degrees in Japan's top universities, fully funded by the Japanese government.",
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
    description: "Chevening is the UK government's international scholarships program aimed at developing global leaders. Funded by the UK Foreign, Commonwealth and Development Office, it offers full financial support for a one-year Master's degree at any UK university.",
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
  }
];
