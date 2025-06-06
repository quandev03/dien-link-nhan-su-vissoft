import { format } from "date-fns"
import { UseFormReturn } from "react-hook-form"
import { FormValues } from "./schemas"

// Add a new family member
export const addFamilyMember = (form: UseFormReturn<FormValues>) => {
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
export const removeFamilyMember = (form: UseFormReturn<FormValues>, index: number) => {
  const currentRelatives = form.getValues("employeeRelatives") || []
  // Ensure we always keep at least one family member
  if (currentRelatives.length > 1) {
    form.setValue(
      "employeeRelatives",
      currentRelatives.filter((_, i) => i !== index),
    )
  }
}

// Add a new child
export const addChild = (form: UseFormReturn<FormValues>) => {
  const currentChildren = form.getValues("children") || []
  form.setValue("children", [
    ...currentChildren,
    {
      fullName: "",
      genderParamCode: "",
      birthOfDate: new Date(),
    },
  ])
}

// Remove a child
export const removeChild = (form: UseFormReturn<FormValues>, index: number) => {
  const currentChildren = form.getValues("children") || []
  form.setValue(
    "children",
    currentChildren.filter((_, i) => i !== index),
  )
}

// Handle image upload
export const handleImageUpload = (
  e: React.ChangeEvent<HTMLInputElement>, 
  fieldName: string,
  form: UseFormReturn<FormValues>
) => {
  const file = e.target.files?.[0]
  if (file) {
    form.setValue(fieldName as any, file)
  }
}

// Clear saved form data
export const clearSavedData = (
  form: UseFormReturn<FormValues>,
  setHasSavedData: (value: boolean) => void
) => {
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

// Format form data for API submission
export const formatDataForApi = (data: FormValues) => {
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
    numberOfDependents: parseInt(data.dependentsCount),
    // Include both employeeRelatives and children in the same array for the API
    employeeRelatives: [
      ...data.employeeRelatives,
      ...(data.children || []).map(child => ({
        ...child,
        phone: "", // Children don't have phone numbers
        // Set relationship based on gender
        relationshipParamCode: child.genderParamCode === "MALE" ? "SON" : 
                              child.genderParamCode === "FEMALE" ? "DAUGHTER" : "CHILD"
      }))
    ]
  }
  
  // Add the JSON data to the FormData
  formData.append('data', JSON.stringify(apiData))
  
  // Add the files to the FormData
  if (data.frontIdCard) formData.append('front', data.frontIdCard)
  if (data.backIdCard) formData.append('back', data.backIdCard)
  if (data.portrait) formData.append('portrait', data.portrait)
  if (data.selfie) formData.append('selfie', data.selfie)
  if (data.certificate) formData.append('degree', data.certificate)
  
  return formData
}

// Save form data to localStorage
export const saveFormDataToLocalStorage = (data: FormValues) => {
  localStorage.setItem('employeeFormData', JSON.stringify({
    ...data,
    birthOfDate: format(data.birthOfDate, "yyyy-MM-dd"),
    dateOfIssue: format(data.dateOfIssue, "yyyy-MM-dd"),
    dateOfOnboard: data.dateOfOnboard ? format(data.dateOfOnboard, "yyyy-MM-dd") : undefined,
    // Format dates for children
    children: data.children?.map(child => ({
      ...child,
      birthOfDate: format(child.birthOfDate, "yyyy-MM-dd")
    })),
    // We can't store File objects in localStorage, so we'll just store file names
    frontIdCard: data.frontIdCard?.name,
    backIdCard: data.backIdCard?.name,
    portrait: data.portrait?.name,
    selfie: data.selfie?.name,
    certificate: data.certificate?.name,
  }))
}