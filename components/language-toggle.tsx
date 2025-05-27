"use client"
import { Button } from "@/components/ui/button"

interface LanguageToggleProps {
  onChange: (language: "en" | "vi") => void
  currentLanguage: "en" | "vi"
}

export function LanguageToggle({ onChange, currentLanguage }: LanguageToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={currentLanguage === "en" ? "default" : "outline"}
        size="sm"
        onClick={() => onChange("en")}
        className="w-12"
      >
        EN
      </Button>
      <Button
        variant={currentLanguage === "vi" ? "default" : "outline"}
        size="sm"
        onClick={() => onChange("vi")}
        className="w-12"
      >
        VI
      </Button>
    </div>
  )
}
