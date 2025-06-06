"use client"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

interface LanguageToggleProps {
  onChange: (language: "en" | "vi") => void
  currentLanguage: "en" | "vi"
}

export function LanguageToggle({ onChange, currentLanguage }: LanguageToggleProps) {
  // Save language to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', currentLanguage)
    }
  }, [currentLanguage])
  
  const handleLanguageChange = (language: "en" | "vi") => {
    onChange(language)
    // Also update localStorage immediately
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language)
    }
  }
  
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={currentLanguage === "en" ? "default" : "outline"}
        size="sm"
        onClick={() => handleLanguageChange("en")}
        className="w-12"
      >
        EN
      </Button>
      <Button
        variant={currentLanguage === "vi" ? "default" : "outline"}
        size="sm"
        onClick={() => handleLanguageChange("vi")}
        className="w-12"
      >
        VI
      </Button>
    </div>
  )
}
