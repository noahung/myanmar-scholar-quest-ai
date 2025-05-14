
import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Define the available languages
export type Language = "en" | "my"; // en = English, my = Burmese

// Define the type for translations
type TranslationValues = {
  [key in Language]: string;
};

type TranslationDictionary = {
  [key: string]: TranslationValues;
};

// Create the initial translations dictionary
const initialTranslations: TranslationDictionary = {
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
  "Translations": {
    en: "Translations",
    my: "ဘာသာပြန်ဆိုမှုများ"
  },
  "Educational Guides": {
    en: "Educational Guides",
    my: "ပညာရေးဆိုင်ရာလမ်းညွှန်များ"
  },
  "Community Posts": {
    en: "Community Posts",
    my: "အသိုင်းအဝိုင်းပို့စ်များ"
  },
  "Comments": {
    en: "Comments",
    my: "မှတ်ချက်များ"
  },
  "Saved Scholarships": {
    en: "Saved Scholarships",
    my: "သိမ်းဆည်းထားသော ပညာသင်ဆုများ"
  },
  "My Posts": {
    en: "My Posts",
    my: "ကျွန်ုပ်၏ပို့စ်များ"
  },
  "My Notes": {
    en: "My Notes",
    my: "ကျွန်ုပ်၏မှတ်စုများ"
  },
  "Chat History": {
    en: "Chat History",
    my: "စကားပြောမှတ်တမ်း"
  },
  "Preparation Helper": {
    en: "Preparation Helper",
    my: "ပြင်ဆင်မှုအကူအညီ"
  }
};

// Create the language context
type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  translations: TranslationDictionary;
  updateTranslation: (key: string, values: { en: string, my: string }) => void;
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
  
  // Store translations in state so they can be updated dynamically
  const [translations, setTranslations] = useState<TranslationDictionary>(initialTranslations);

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);
  
  // Load translations from database on init
  useEffect(() => {
    fetchTranslations();
  }, []);
  
  // Fetch translations from the database
  const fetchTranslations = async () => {
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('*');
        
      if (error) {
        console.error("Error fetching translations:", error);
        // If there's an error, we'll just use the initial translations
        return;
      }
      
      if (data && data.length > 0) {
        // Convert the database format to our dictionary format
        const dbTranslations: TranslationDictionary = {};
        
        data.forEach(item => {
          dbTranslations[item.key] = {
            en: item.en,
            my: item.my
          };
        });
        
        // Merge with our initial translations to ensure we have all needed keys
        setTranslations({
          ...initialTranslations,
          ...dbTranslations
        });
      }
    } catch (error) {
      console.error("Error in fetchTranslations:", error);
    }
  };

  // Translation function
  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    // If translation is not found, return the key
    return key;
  };
  
  // Function to update a translation
  const updateTranslation = (key: string, values: { en: string, my: string }) => {
    setTranslations(prev => ({
      ...prev,
      [key]: {
        en: values.en,
        my: values.my
      }
    }));
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      translations, 
      updateTranslation 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
