"use client"

import { useState, useEffect } from "react"
import { LanguageToggle } from "@/components/language-toggle"
import { translations, type Language } from "@/lib/translations"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function InformationSubmitted() {
  const [language, setLanguage] = useState<Language>("vi")
  const t = translations[language]

  return (
    <main className="container mx-auto py-10 px-4 min-h-screen flex flex-col items-center justify-center">
      <div className="absolute top-4 right-4">
        <LanguageToggle currentLanguage={language} onChange={setLanguage} />
      </div>
      
      <Card className="w-full max-w-2xl shadow-lg">
        <CardContent className="p-8 flex flex-col items-center text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
          
          <h1 className="text-2xl font-bold mb-4">
            {t.informationSubmitted.title}
          </h1>
          
          <p className="text-gray-600 mb-6">
            {t.informationSubmitted.message}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link href="https://vissoft.vn" passHref>
              <Button variant="outline" className="w-full sm:w-auto">
                {t.informationSubmitted.backToHome}
              </Button>
            </Link>
            
            <Link href="mailto:hr@vissoft.vn" passHref>
              <Button className="w-full sm:w-auto">
                {t.informationSubmitted.contactHR}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}