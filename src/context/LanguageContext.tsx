
import React, { createContext, useState, useContext, useEffect } from "react";

// Define the available languages
export type Language = "en" | "my"; // en = English, my = Burmese

// Define the type for translations
type TranslationDictionary = {
  [key: string]: {
    [key in Language]: string;
  };
};

// Create our translations dictionary
const translations: TranslationDictionary = {
  // Navigation
  "Scholarships": {
    en: "Scholarships",
    my: "ပညာသင်ဆုများ"
  },
  "Community": {
    en: "Community",
    my: "အသိုင်းအဝိုင်း"
  },
  "Guides": {
    en: "Guides",
    my: "လမ်းညွှန်များ"
  },
  "Login": {
    en: "Login",
    my: "ဝင်ရန်"
  },
  "Profile": {
    en: "Profile",
    my: "ပရိုဖိုင်"
  },
  "Admin Dashboard": {
    en: "Admin Dashboard",
    my: "စီမံခန့်ခွဲမှု ဒက်ရှ်ဘုတ်"
  },
  "Search...": {
    en: "Search...",
    my: "ရှာဖွေရန်..."
  },
  // Home page
  "Discover Opportunities for Myanmar Students": {
    en: "Discover Opportunities for Myanmar Students",
    my: "မြန်မာကျောင်းသားများအတွက် အခွင့်အလမ်းများကို ရှာဖွေပါ"
  },
  "Find scholarships, connect with fellow students, and access guides for studying abroad.": {
    en: "Find scholarships, connect with fellow students, and access guides for studying abroad.",
    my: "ပညာသင်ဆုများ ရှာဖွေပါ၊ ကျောင်းသားများနှင့် ချိတ်ဆက်ပါ၊ နိုင်ငံရပ်ခြားတွင် ပညာသင်ကြားရန် လမ်းညွှန်ချက်များကို ရယူပါ။"
  },
  // Buttons
  "Search": {
    en: "Search",
    my: "ရှာဖွေရန်"
  },
  "Submit": {
    en: "Submit",
    my: "တင်သွင်းရန်"
  },
  "Cancel": {
    en: "Cancel",
    my: "ပယ်ဖျက်ရန်"
  },
  "Sign Out": {
    en: "Sign Out",
    my: "ထွက်ရန်"
  },
  // Admin
  "Create Guide": {
    en: "Create Guide",
    my: "လမ်းညွှန် ဖန်တီးရန်"
  },
  "Create Post": {
    en: "Create Post",
    my: "ပို့စ် ဖန်တီးရန်"
  },
  "Users": {
    en: "Users",
    my: "သုံးစွဲသူများ"
  },
  // Add more translations as needed
};

// Create the language context
type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Custom hook to access the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// Language provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to get the stored language from localStorage, default to 'en'
  const [language, setLanguage] = useState<Language>(() => {
    const storedLanguage = localStorage.getItem("language") as Language;
    return storedLanguage === "my" ? "my" : "en";
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    // If translation is not found, return the key
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
