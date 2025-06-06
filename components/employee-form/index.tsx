"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Check, CheckCircle, Loader2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { LanguageToggle } from "@/components/language-toggle"
import { translations, type Language } from "@/lib/translations"

import { formSchema, FormValues } from "./schemas"
import { domain, check_code_path, url_path, getFormSteps } from "./constants"
import { clearSavedData, formatDataForApi, saveFormDataToLocalStorage } from "./form-utils"
import { PersonalTab } from "./tabs/personal-tab"
import { AddressTab } from "./tabs/address-tab"
import { FinancialTab } from "./tabs/financial-tab"
import { FamilyTab } from "./tabs/family-tab"
import { DocumentsTab } from "./tabs/documents-tab"

export default function EmployeeForm() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("personal")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [language, setLanguage] = useState<Language>("vi")
  const [isLoading, setIsLoading] = useState(true)
  
  // State to track if we've loaded saved data
  const [loadedSavedData, setLoadedSavedData] = useState(false)
  const [hasSavedData, setHasSavedData] = useState(false)

  const t = translations[language]
  
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeRelatives: [
        {
          fullName: "",
          genderParamCode: "",
          phone: "",
          birthOfDate: new Date(),
          relationshipParamCode: "",
        },
      ],
      children: [], // Empty array for children
      bankName: "BIDV", // Set default bank
    },
  })

  // Check code validity and load saved form data when component mounts
  useEffect(() => {
    const checkCodeValidity = async () => {
      if (typeof window !== 'undefined') {
        try {
          // Extract code from URL
          const urlParams = new URLSearchParams(window.location.search)
          const codeParam = urlParams.get('code')
          
          if (!codeParam) {
            // If no code is provided, redirect to the information submitted page
            router.push('/information-submitted')
            return
          }
          
          // Check code validity
          const response = await fetch(
            `${domain}${check_code_path}?code=${codeParam}`,
            {
              method: 'GET',
              headers: {
                'accept': '*/*'
              }
            }
          )
          
          if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`)
          }
          
          const result = await response.json()
          console.log("Code check response:", result)
          
          // If result is false, redirect to the information submitted page
          if (!result.result) {
            router.push('/information-submitted')
            return
          }
          
          // If we reach here, the code is valid, so we can load saved data
          if (!loadedSavedData) {
            const savedData = localStorage.getItem('employeeFormData')
            if (savedData) {
              try {
                const parsedData = JSON.parse(savedData)
                
                // Convert string dates back to Date objects
                const formattedData = {
                  ...parsedData,
                  birthOfDate: parsedData.birthOfDate ? new Date(parsedData.birthOfDate) : new Date(),
                  dateOfIssue: parsedData.dateOfIssue ? new Date(parsedData.dateOfIssue) : new Date(),
                  dateOfOnboard: parsedData.dateOfOnboard ? new Date(parsedData.dateOfOnboard) : undefined,
                  // We can't restore File objects from localStorage
                }
                
                // Reset the form with saved values
                Object.keys(formattedData).forEach(key => {
                  // Skip file fields as they can't be restored from localStorage
                  if (!['frontIdCard', 'backIdCard', 'portrait', 'selfie', 'certificate'].includes(key)) {
                    form.setValue(key as any, formattedData[key])
                  }
                })
                
                setHasSavedData(true)
                console.log("Loaded saved form data from localStorage")
              } catch (error) {
                console.error("Error loading saved form data:", error)
              }
            }
            setLoadedSavedData(true)
          }
        } catch (error) {
          console.error("Error checking code validity:", error)
          // If there's an error, redirect to the information submitted page
          router.push('/information-submitted')
        } finally {
          setIsLoading(false)
        }
      }
    }
    
    checkCodeValidity()
  }, [router, loadedSavedData, form])

  const steps = getFormSteps(t)
  
  // Show loading state while checking code validity
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">
          {language === "vi" ? "Đang kiểm tra..." : "Checking..."}
        </p>
      </div>
    )
  }
  
  // Show success message after form submission
  if (showSuccessMessage) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center max-w-md text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">
            {language === "vi" ? "Gửi thành công!" : "Submission Successful!"}
          </h2>
          <p className="text-gray-600 mb-4">
            {language === "vi" 
              ? "Thông tin của bạn đã được gửi thành công. Đang chuyển hướng..." 
              : "Your information has been submitted successfully. Redirecting..."}
          </p>
          <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
            <div className="bg-green-500 h-1 animate-progress"></div>
          </div>
        </div>
      </div>
    )
  }

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      console.log("Form data:", data)
      
      // Format data for API
      const formData = formatDataForApi(data)
      
      // Extract code from URL
      const urlParams = new URLSearchParams(window.location.search)
      const codeParam = urlParams.get('code')
      
      // Make the API call with the code from URL
      const response = await fetch(
        `${domain}${url_path}?code=${codeParam}`,
        {
          method: 'POST',
          body: formData,
        }
      )
      
      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`)
      }
      
      const result = await response.json()
      console.log("API response:", result)
      
      // Save the form data to localStorage for persistence
      saveFormDataToLocalStorage(data)
      setHasSavedData(true)
      
      // Show success message
      setShowSuccessMessage(true)
      
      // Redirect to the information submitted page after 3 seconds
      setTimeout(() => {
        router.push('/information-submitted')
      }, 3000)
      
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("An error occurred while submitting the form.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Image src="/images/vissoft-logo.png" alt="VISSOFT Logo" width={50} height={50} />
          <h1 className="text-2xl font-bold">{t.title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => clearSavedData(form, setHasSavedData)}
            className="text-xs"
          >
            {t.clearSavedData}
          </Button>
          <LanguageToggle onChange={setLanguage} currentLanguage={language} />
        </div>
      </div>
      
      {/* Show message when data is loaded from localStorage */}
      {loadedSavedData && hasSavedData && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 flex items-center justify-between">
          <p className="text-sm">
            {t.dataLoadedMessage}
          </p>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => clearSavedData(form, setHasSavedData)}
            className="text-xs hover:bg-green-100"
          >
            {t.clearData}
          </Button>
        </div>
      )}

      {/* Progress Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute left-0 top-1/2 h-0.5 w-full bg-gray-200 -translate-y-1/2" />
          <div
            className="absolute left-0 top-1/2 h-0.5 bg-[rgb(174,48,52)] -translate-y-1/2 transition-all duration-300"
            style={{
              width: `${(steps.findIndex((s) => s.id === activeTab) / (steps.length - 1)) * 100}%`,
            }}
          />

          {/* Steps */}
          {steps.map((step, index) => {
            const isActive = step.id === activeTab
            const isCompleted = completedSteps.includes(step.id)
            const isPast = steps.findIndex((s) => s.id === activeTab) > index

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveTab(step.id)}
                className={cn(
                  "relative z-10 flex flex-col items-center gap-2 bg-background",
                  isActive || isPast || isCompleted ? "cursor-pointer" : "cursor-not-allowed",
                )}
                disabled={!isActive && !isPast && !isCompleted}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200",
                    isActive
                      ? "bg-[rgb(174,48,52)] text-white ring-4 ring-[rgb(174,48,52)]/20"
                      : isCompleted || isPast
                        ? "bg-[rgb(174,48,52)] text-white"
                        : "bg-gray-200 text-gray-500",
                  )}
                >
                  {isCompleted || isPast ? <Check className="w-5 h-5" /> : step.icon}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium transition-colors duration-200 hidden sm:block",
                    isActive
                      ? "text-[rgb(174,48,52)]"
                      : isCompleted || isPast
                        ? "text-foreground"
                        : "text-muted-foreground",
                  )}
                >
                  {step.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Mobile Step Label */}
        <div className="mt-4 text-center sm:hidden">
          <p className="text-sm font-medium">
            {t.stepOf} {steps.findIndex((s) => s.id === activeTab) + 1} {t.of} {steps.length}
          </p>
          <p className="text-xs text-muted-foreground">{steps.find((s) => s.id === activeTab)?.label}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <TabsContent value="personal">
              <PersonalTab 
                form={form} 
                t={t} 
                setCompletedSteps={setCompletedSteps} 
                setActiveTab={setActiveTab} 
              />
            </TabsContent>

            <TabsContent value="address">
              <AddressTab 
                form={form} 
                t={t} 
                setCompletedSteps={setCompletedSteps} 
                setActiveTab={setActiveTab} 
              />
            </TabsContent>

            <TabsContent value="financial">
              <FinancialTab 
                form={form} 
                t={t} 
                setCompletedSteps={setCompletedSteps} 
                setActiveTab={setActiveTab} 
              />
            </TabsContent>

            <TabsContent value="family">
              <FamilyTab 
                form={form} 
                t={t} 
                setCompletedSteps={setCompletedSteps} 
                setActiveTab={setActiveTab} 
              />
            </TabsContent>

            <TabsContent value="documents">
              <DocumentsTab 
                form={form} 
                t={t} 
                setActiveTab={setActiveTab} 
                isSubmitting={isSubmitting} 
              />
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  )
}