
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/context/LanguageContext";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {language === "en" ? "🇬🇧 EN" : "🇲🇲 MY"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("en")}>
          🇬🇧 English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("my")}>
          🇲🇲 မြန်မာဘာသာ
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
