"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2, Plus, Trash2, Upload, Check } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { LanguageToggle } from "@/components/language-toggle"
import { translations, type Language } from "@/lib/translations"

const vietnameseBanks = [
  {
    code: "BIDV",
    name: "Ngân hàng Thương mại cổ phần Đầu tư và Phát triển Việt Nam",
    shortName: "BIDV",
    logo: "/images/banks/bidv.png",
  },
  {
    code: "VCB",
    name: "Ngân hàng Thương mại cổ phần Ngoại thương Việt Nam",
    shortName: "Vietcombank",
    logo: "/images/banks/vietcombank.png",
  },
  {
    code: "VTB",
    name: "Ngân hàng Thương mại cổ phần Công thương Việt Nam",
    shortName: "VietinBank",
    logo: "/images/banks/vietinbank.png",
  },
  {
    code: "ACB",
    name: "Ngân hàng Thương mại cổ phần Á Châu",
    shortName: "ACB",
    logo: "/images/banks/acb.png",
  },
  {
    code: "TCB",
    name: "Ngân hàng Thương mại cổ phần Kỹ thương Việt Nam",
    shortName: "Techcombank",
    logo: "/images/banks/techcombank.png",
  },
  {
    code: "MB",
    name: "Ngân hàng Thương mại cổ phần Quân đội",
    shortName: "MB Bank",
    logo: "/images/banks/mbbank.png",
  },
  {
    code: "VPB",
    name: "Ngân hàng Thương mại cổ phần Việt Nam Thịnh vượng",
    shortName: "VPBank",
    logo: "/images/banks/vpbank.png",
  },
  {
    code: "TPB",
    name: "Ngân hàng Thương mại cổ phần Tiên Phong",
    shortName: "TPBank",
    logo: "/images/banks/tpbank.png",
  },
  {
    code: "STB",
    name: "Ngân hàng Thương mại cổ phần Sài Gòn Thương Tín",
    shortName: "Sacombank",
    logo: "/images/banks/sacombank.png",
  },
  {
    code: "EIB",
    name: "Ngân hàng Thương mại cổ phần Xuất Nhập khẩu Việt Nam",
    shortName: "Eximbank",
    logo: "/images/banks/eximbank.png",
  },
]

// Define the schema for family members
const employeeRelativeSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  genderParamCode: z.string().min(1, "Gender is required"),
  phone: z.string().min(1, "Phone number is required"),
  birthOfDate: z.date({
    required_error: "Birth date is required",
  }),
  relationshipParamCode: z.string().min(1, "Relationship is required"),
})

// Create a custom file validator that works in both client and server environments
const createFileSchema = (errorMessage: string) => z.any()
  .refine(
    (file) => {
      // Skip validation during SSR
      if (typeof window === 'undefined') return true
      // Validate as File object on client
      // Use type checking instead of instanceof to avoid ReferenceError
      return file && typeof file === 'object' && 'name' in file && 'size' in file && 'type' in file
    },
    { message: errorMessage }
  )

// Update the form schema to include the new fields
const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  birthOfDate: z.date({
    required_error: "Birth date is required",
  }),
  genderParamCode: z.string().min(1, "Gender is required"),
  phone: z.string().min(1, "Phone number is required"),
  cccd: z.string().min(1, "ID card number is required"),
  dateOfIssue: z.date({
    required_error: "Date of issue is required",
  }),
  dateOfOnboard: z.date().optional(), // Optional
  healthInsuranceNumber: z.string().min(1, "Health insurance number is required"),
  socialInsuranceNumber: z.string().min(1, "Social insurance number is required"),
  personalTaxCode: z.string().optional(), // Optional
  dependentsCount: z.string().min(1, "Number of dependents is required"),
  permanentAddress: z.string().min(1, "Permanent address is required"),
  currentAddress: z.string().min(1, "Current address is required"),
  bankAccountNumber: z.string().min(1, "Bank account number is required"),
  bankName: z.string().min(1, "Bank name is required"),
  bankBranch: z.string().min(1, "Bank branch is required"),
  licensePlateNumber: z.string().optional(), // Optional
  vehicleColor: z.string().optional(), // Optional
  vehicleType: z.string().optional(), // Optional
  hobbies: z.string().min(1, "Hobbies is required"),
  favoriteQuoteAndSaying: z.string().optional(), // Optional
  employeeRelatives: z.array(employeeRelativeSchema).min(1, "At least one family member is required"), // Required minimum 1
  frontIdCard: createFileSchema("Front ID card is required"),
  backIdCard: createFileSchema("Back ID card is required"),
  portrait: createFileSchema("Portrait photo is required"),
  selfie: createFileSchema("Selfie is required"),
  certificate: z.any().optional(), // Optional
})

type FormValues = z.infer<typeof formSchema>

export default function EmployeeForm() {
  const [activeTab, setActiveTab] = useState("personal")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [language, setLanguage] = useState<Language>("vi")
  
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
      bankName: "BIDV", // Set default bank
    },
  })

  // Load saved form data from localStorage when component mounts
  useEffect(() => {
    // Only run this once and only on the client side
    if (typeof window !== 'undefined' && !loadedSavedData) {
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
  }, [loadedSavedData, form])

  const steps = [
    { id: "personal", label: t.steps.personal, icon: "1" },
    { id: "address", label: t.steps.address, icon: "2" },
    { id: "financial", label: t.steps.financial, icon: "3" },
    { id: "family", label: t.steps.family, icon: "4" },
    { id: "documents", label: t.steps.documents, icon: "5" },
  ]

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      console.log("Form data:", data)
      
      // Create a FormData object for the API call
      const formData = new FormData()
      
      // Format the data according to the API requirements
      const apiData = {
        preEmployeesId: "PE00123", // This would typically come from your backend or URL params
        fullName: data.fullName,
        email: data.email,
        birthOfDate: format(data.birthOfDate, "yyyy-MM-dd"),
        genderParamCode: data.genderParamCode,
        phone: parseFloat(data.phone),
        cccd: data.cccd,
        dateOfIssue: format(data.dateOfIssue, "yyyy-MM-dd"),
        dateOfOnboard: data.dateOfOnboard ? format(data.dateOfOnboard, "yyyy-MM-dd") : undefined,
        permanentAddress: data.permanentAddress,
        currentAddress: data.currentAddress,
        fillEnabled: true,
        bankAccountNumber: data.bankAccountNumber,
        bankName: data.bankName,
        bankBranch: data.bankBranch,
        personalTaxCode: data.personalTaxCode || undefined,
        licensePlateNumber: data.licensePlateNumber || undefined,
        vehicleColor: data.vehicleColor || undefined,
        vehicleType: data.vehicleType || undefined,
        hobbies: data.hobbies,
        favoriteQuoteAndSaying: data.favoriteQuoteAndSaying || undefined,
        contractPreEmployeeCode: "PEC" + format(new Date(), "yyyyMMdd") + "001", // Generate a code based on current date
        candidateCvId: "CV" + Math.floor(100000 + Math.random() * 900000), // Generate a random CV ID
        healthInsuranceNumber: data.healthInsuranceNumber,
        socialInsuranceNumber: data.socialInsuranceNumber,
        numberOfDependents: parseInt(data.dependentsCount)
      }
      
      // Add the JSON data to the FormData
      formData.append('data', JSON.stringify(apiData))
      
      // Add the files to the FormData
      if (data.frontIdCard) formData.append('front', data.frontIdCard)
      if (data.backIdCard) formData.append('back', data.backIdCard)
      if (data.portrait) formData.append('portrait', data.portrait)
      if (data.selfie) formData.append('selfie', data.selfie)
      if (data.certificate) formData.append('degree', data.certificate)
      
      // Make the API call
      const response = await fetch(
        'http://localhost:8080/api/v1/recruitment-management/fill-information-pre-employee?code=01JVNSQSRZ6V6MH8A6F7P0WSAA',
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
      alert("Form submitted successfully!")
      
      // Save the form data to localStorage for persistence
      localStorage.setItem('employeeFormData', JSON.stringify({
        ...data,
        birthOfDate: format(data.birthOfDate, "yyyy-MM-dd"),
        dateOfIssue: format(data.dateOfIssue, "yyyy-MM-dd"),
        dateOfOnboard: data.dateOfOnboard ? format(data.dateOfOnboard, "yyyy-MM-dd") : undefined,
        // We can't store File objects in localStorage, so we'll just store file names
        frontIdCard: data.frontIdCard?.name,
        backIdCard: data.backIdCard?.name,
        portrait: data.portrait?.name,
        selfie: data.selfie?.name,
        certificate: data.certificate?.name,
      }))
      setHasSavedData(true)
      
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("An error occurred while submitting the form.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Add a new family member
  const addFamilyMember = () => {
    const currentRelatives = form.getValues("employeeRelatives") || []
    form.setValue("employeeRelatives", [
      ...currentRelatives,
      {
        fullName: "",
        genderParamCode: "",
        phone: "",
        birthOfDate: new Date(),
        relationshipParamCode: "",
      },
    ])
  }

  // Remove a family member
  const removeFamilyMember = (index: number) => {
    const currentRelatives = form.getValues("employeeRelatives") || []
    form.setValue(
      "employeeRelatives",
      currentRelatives.filter((_, i) => i !== index),
    )
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue(fieldName as any, file)
    }
  }
  
  // Clear saved form data
  const clearSavedData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('employeeFormData')
      setHasSavedData(false)
      // Reset the form to default values
      form.reset({
        employeeRelatives: [
          {
            fullName: "",
            genderParamCode: "",
            phone: "",
            birthOfDate: new Date(),
            relationshipParamCode: "",
          },
        ],
        bankName: "BIDV",
      })
      alert("Saved form data has been cleared.")
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
            onClick={clearSavedData}
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
            onClick={clearSavedData}
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
            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t.fields.fullName} <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder={t.fields.fullName} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t.fields.email} <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder={t.fields.email} type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="birthOfDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>
                            {t.fields.birthDate} <span className="text-red-500">*</span>
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>{t.placeholders.pickDate}</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="genderParamCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t.fields.gender} <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t.placeholders.selectGender} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="MALE">{t.gender.male}</SelectItem>
                              <SelectItem value="FEMALE">{t.gender.female}</SelectItem>
                              <SelectItem value="OTHER">{t.gender.other}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t.fields.phone} <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder={t.fields.phone} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cccd"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t.fields.idCard} <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder={t.fields.idCard} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dateOfIssue"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>
                            {t.fields.dateOfIssue} <span className="text-red-500">*</span>
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>{t.placeholders.pickDate}</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dateOfOnboard"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>{t.fields.dateOfOnboard}</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>{t.placeholders.pickDate}</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="healthInsuranceNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t.fields.healthInsuranceNumber} <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder={t.fields.healthInsuranceNumber} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="socialInsuranceNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t.fields.socialInsuranceNumber} <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder={t.fields.socialInsuranceNumber} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="personalTaxCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.fields.personalTaxCode}</FormLabel>
                          <FormControl>
                            <Input placeholder={t.fields.personalTaxCode} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dependentsCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t.fields.dependentsCount} <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input type="number" min="0" placeholder={t.fields.dependentsCount} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hobbies"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>
                            {t.fields.hobbies} <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea placeholder={t.placeholders.hobbies} className="resize-none" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="favoriteQuoteAndSaying"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>{t.fields.favoriteQuote}</FormLabel>
                          <FormControl>
                            <Textarea placeholder={t.placeholders.favoriteQuote} className="resize-none" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={() => {
                    setCompletedSteps((prev) => [...new Set([...prev, "personal"])])
                    setActiveTab("address")
                  }}
                  style={{ backgroundColor: "rgb(174, 48, 52)" }}
                >
                  {t.next}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="address" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 gap-6">
                    <FormField
                      control={form.control}
                      name="permanentAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t.fields.permanentAddress} <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea placeholder={t.fields.permanentAddress} className="resize-none" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="currentAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t.fields.currentAddress} <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea placeholder={t.fields.currentAddress} className="resize-none" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="licensePlateNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t.fields.licensePlate}</FormLabel>
                            <FormControl>
                              <Input placeholder={t.fields.licensePlate} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="vehicleColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t.fields.vehicleColor}</FormLabel>
                            <FormControl>
                              <Input placeholder={t.fields.vehicleColor} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="vehicleType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t.fields.vehicleType}</FormLabel>
                            <FormControl>
                              <Input placeholder={t.fields.vehicleType} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setActiveTab("personal")}>
                  {t.previous}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setCompletedSteps((prev) => [...new Set([...prev, "address"])])
                    setActiveTab("financial")
                  }}
                  style={{ backgroundColor: "rgb(174, 48, 52)" }}
                >
                  {t.next}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="financial" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="bankAccountNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t.fields.bankAccountNumber} <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder={t.fields.bankAccountNumber} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bankName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t.fields.bankName} <span className="text-red-500">*</span>
                          </FormLabel>
                          <div className="mb-2">
                            <p className="text-sm text-amber-600 font-medium">
                              {t.bankRequirement}
                            </p>
                          </div>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn ngân hàng">
                                  {field.value && (
                                    <div className="flex items-center gap-2">
                                      <img
                                        src={
                                          vietnameseBanks.find((bank) => bank.code === field.value)?.logo ||
                                          "/placeholder.svg"
                                        }
                                        alt=""
                                        className="w-6 h-6 object-contain"
                                      />
                                      <span>
                                        {vietnameseBanks.find((bank) => bank.code === field.value)?.shortName}
                                      </span>
                                    </div>
                                  )}
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {vietnameseBanks.map((bank) => (
                                <SelectItem 
                                  key={bank.code} 
                                  value={bank.code}
                                  className={bank.code === "BIDV" ? "bg-amber-50" : ""}
                                >
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={bank.logo || "/placeholder.svg"}
                                      alt={bank.shortName}
                                      className="w-6 h-6 object-contain"
                                    />
                                    <span>{bank.shortName}</span>
                                    {bank.code === "BIDV" && (
                                      <span className="ml-2 text-xs text-amber-600 font-medium">
                                        {t.recommended}
                                      </span>
                                    )}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bankBranch"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t.fields.bankBranch} <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder={t.fields.bankBranch} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setActiveTab("address")}>
                  {t.previous}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setCompletedSteps((prev) => [...new Set([...prev, "financial"])])
                    setActiveTab("family")
                  }}
                  style={{ backgroundColor: "rgb(174, 48, 52)" }}
                >
                  {t.next}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="family" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">
                        {t.family.title} <span className="text-red-500">*</span>
                      </h3>
                      <Button
                        type="button"
                        onClick={addFamilyMember}
                        variant="outline"
                        size="sm"
                        className="border-[rgb(174,48,52)] text-[rgb(174,48,52)] hover:bg-[rgb(174,48,52)] hover:text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" /> {t.family.addMember}
                      </Button>
                    </div>

                    {form.watch("employeeRelatives")?.map((relative, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">
                            {t.family.member} #{index + 1}
                          </h4>
                          <Button
                            type="button"
                            onClick={() => removeFamilyMember(index)}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`employeeRelatives.${index}.fullName`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {t.fields.fullName} <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder={t.fields.fullName} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`employeeRelatives.${index}.genderParamCode`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {t.fields.gender} <span className="text-red-500">*</span>
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder={t.placeholders.selectGender} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="MALE">{t.gender.male}</SelectItem>
                                    <SelectItem value="FEMALE">{t.gender.female}</SelectItem>
                                    <SelectItem value="OTHER">{t.gender.other}</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`employeeRelatives.${index}.phone`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {t.fields.phone} <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder={t.fields.phone} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`employeeRelatives.${index}.birthOfDate`}
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>
                                  {t.fields.birthDate} <span className="text-red-500">*</span>
                                </FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "w-full pl-3 text-left font-normal",
                                          !field.value && "text-muted-foreground",
                                        )}
                                      >
                                        {field.value ? (
                                          format(field.value, "PPP")
                                        ) : (
                                          <span>{t.placeholders.pickDate}</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`employeeRelatives.${index}.relationshipParamCode`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {t.family.relationship} <span className="text-red-500">*</span>
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder={t.placeholders.selectRelationship} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="PARENT">{t.relationship.parent}</SelectItem>
                                    <SelectItem value="SPOUSE">{t.relationship.spouse}</SelectItem>
                                    <SelectItem value="CHILD">{t.relationship.child}</SelectItem>
                                    <SelectItem value="SIBLING">{t.relationship.sibling}</SelectItem>
                                    <SelectItem value="OTHER">{t.relationship.other}</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}

                    {(!form.watch("employeeRelatives") || form.watch("employeeRelatives").length === 0) && (
                      <div className="text-center py-8 text-muted-foreground">{t.family.noMembers}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setActiveTab("financial")}>
                  {t.previous}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setCompletedSteps((prev) => [...new Set([...prev, "family"])])
                    setActiveTab("documents")
                  }}
                  style={{ backgroundColor: "rgb(174, 48, 52)" }}
                >
                  {t.next}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">{t.documents.frontIdCard}</h3>
                      <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                        {form.watch("frontIdCard") ? (
                          <div className="space-y-2 text-center">
                            <p className="text-sm text-muted-foreground">{form.watch("frontIdCard").name}</p>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => form.setValue("frontIdCard", undefined)}
                            >
                              {t.documents.remove}
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2 text-center">
                            <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                            <div className="text-sm text-muted-foreground">
                              <label
                                htmlFor="frontIdCard"
                                className="cursor-pointer text-[rgb(174,48,52)] hover:underline"
                              >
                                {t.documents.upload} <span className="text-red-500">*</span>
                              </label>{" "}
                              {t.documents.dragDrop}
                            </div>
                            <input
                              id="frontIdCard"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, "frontIdCard")}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">{t.documents.backIdCard}</h3>
                      <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                        {form.watch("backIdCard") ? (
                          <div className="space-y-2 text-center">
                            <p className="text-sm text-muted-foreground">{form.watch("backIdCard").name}</p>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => form.setValue("backIdCard", undefined)}
                            >
                              {t.documents.remove}
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2 text-center">
                            <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                            <div className="text-sm text-muted-foreground">
                              <label
                                htmlFor="backIdCard"
                                className="cursor-pointer text-[rgb(174,48,52)] hover:underline"
                              >
                                {t.documents.upload} <span className="text-red-500">*</span>
                              </label>{" "}
                              {t.documents.dragDrop}
                            </div>
                            <input
                              id="backIdCard"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, "backIdCard")}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">{t.documents.portrait}</h3>
                      <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                        {form.watch("portrait") ? (
                          <div className="space-y-2 text-center">
                            <p className="text-sm text-muted-foreground">{form.watch("portrait").name}</p>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => form.setValue("portrait", undefined)}
                            >
                              {t.documents.remove}
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2 text-center">
                            <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                            <div className="text-sm text-muted-foreground">
                              <label
                                htmlFor="portrait"
                                className="cursor-pointer text-[rgb(174,48,52)] hover:underline"
                              >
                                {t.documents.upload} <span className="text-red-500">*</span>
                              </label>{" "}
                              {t.documents.dragDrop}
                            </div>
                            <input
                              id="portrait"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, "portrait")}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">{t.documents.selfie}</h3>
                      <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                        {form.watch("selfie") ? (
                          <div className="space-y-2 text-center">
                            <p className="text-sm text-muted-foreground">{form.watch("selfie").name}</p>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => form.setValue("selfie", undefined)}
                            >
                              {t.documents.remove}
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2 text-center">
                            <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                            <div className="text-sm text-muted-foreground">
                              <label htmlFor="selfie" className="cursor-pointer text-[rgb(174,48,52)] hover:underline">
                                {t.documents.upload} <span className="text-red-500">*</span>
                              </label>{" "}
                              {t.documents.dragDrop}
                            </div>
                            <input
                              id="selfie"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, "selfie")}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">{t.documents.certificate}</h3>
                      <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                        {form.watch("certificate") ? (
                          <div className="space-y-2 text-center">
                            <p className="text-sm text-muted-foreground">{form.watch("certificate").name}</p>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => form.setValue("certificate", undefined)}
                            >
                              {t.documents.remove}
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2 text-center">
                            <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                            <div className="text-sm text-muted-foreground">
                              <label
                                htmlFor="certificate"
                                className="cursor-pointer text-[rgb(174,48,52)] hover:underline"
                              >
                                {t.documents.upload}
                              </label>{" "}
                              {t.documents.dragDrop}
                            </div>
                            <input
                              id="certificate"
                              type="file"
                              accept="image/*,.pdf"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, "certificate")}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setActiveTab("family")}>
                  {t.previous}
                </Button>
                <Button type="submit" disabled={isSubmitting} style={{ backgroundColor: "rgb(174, 48, 52)" }}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t.submitting}
                    </>
                  ) : (
                    t.submit
                  )}
                </Button>
              </div>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  )
}
