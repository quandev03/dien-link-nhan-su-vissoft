import * as z from "zod"

// Define the schema for contact family members (required)
export const employeeRelativeSchema = z.object({
  fullName: z.string().min(1, "Full name is required")
    .regex(/^[a-zA-ZÀ-ỹ\s]+$/, "Full name should only contain letters and spaces"),
  genderParamCode: z.string().min(1, "Gender is required"),
  phone: z.string().min(1, "Phone number is required")
    .regex(/^[0-9]{10,11}$/, "Phone number must be 10-11 digits"),
  birthOfDate: z.date({
    required_error: "Birth date is required",
  }).refine(date => date < new Date(), {
    message: "Birth date must be in the past"
  }),
  relationshipParamCode: z.string().min(1, "Relationship is required"),
})

// Define the schema for children (optional)
export const childSchema = z.object({
  fullName: z.string().min(1, "Full name is required")
    .regex(/^[a-zA-ZÀ-ỹ\s]+$/, "Full name should only contain letters and spaces"),
  genderParamCode: z.string().min(1, "Gender is required"),
  birthOfDate: z.date({
    required_error: "Birth date is required",
  }).refine(date => date < new Date(), {
    message: "Birth date must be in the past"
  }),
})

// Create a custom file validator that works in both client and server environments
export const createFileSchema = (errorMessage: string) => z.any()
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

// Update the form schema to include the new fields with enhanced validation
export const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required")
    .regex(/^[a-zA-ZÀ-ỹ\s]+$/, "Full name should only contain letters and spaces"),
  email: z.string().email("Invalid email address"),
  birthOfDate: z.date({
    required_error: "Birth date is required",
  }).refine(date => date < new Date(), {
    message: "Birth date must be in the past"
  }),
  genderParamCode: z.string().min(1, "Gender is required"),
  phone: z.string().min(1, "Phone number is required")
    .regex(/^[0-9]{10,11}$/, "Phone number must be 10-11 digits"),
  cccd: z.string().min(1, "ID card number is required")
    .regex(/^[0-9]{9,12}$/, "ID card number must be 9-12 digits"),
  dateOfIssue: z.date({
    required_error: "Date of issue is required",
  }).refine(date => date < new Date(), {
    message: "Date of issue must be in the past"
  }),
  dateOfOnboard: z.date().optional(), // Optional, can be in the future
  healthInsuranceNumber: z.string().min(1, "Health insurance number is required")
    .regex(/^[0-9]{10,15}$/, "Health insurance number must be 10-15 digits"),
  socialInsuranceNumber: z.string().min(1, "Social insurance number is required")
    .regex(/^[0-9]{10,15}$/, "Social insurance number must be 10-15 digits"),
  personalTaxCode: z.string().optional()
    .refine(val => !val || /^[0-9]{10,13}$/.test(val), {
      message: "Personal tax code must be 10-13 digits if provided"
    }),
  dependentsCount: z.string().min(1, "Number of dependents is required")
    .regex(/^[0-9]+$/, "Number of dependents must be a number"),
  permanentAddress: z.string().min(10, "Permanent address is required (min 10 characters)"),
  currentAddress: z.string().min(10, "Current address is required (min 10 characters)"),
  bankAccountNumber: z.string().min(1, "Bank account number is required")
    .regex(/^[0-9]{8,20}$/, "Bank account number must be 8-20 digits"),
  bankName: z.string().min(1, "Bank name is required"),
  bankBranch: z.string().min(1, "Bank branch is required"),
  licensePlateNumber: z.string().optional()
    .refine(val => !val || val.length >= 5, {
      message: "License plate number must be at least 5 characters if provided"
    }),
  vehicleColor: z.string().optional(),
  vehicleType: z.string().optional(),
  hobbies: z.string().min(1, "Hobbies is required"),
  favoriteQuoteAndSaying: z.string().optional(),
  employeeRelatives: z.array(employeeRelativeSchema).min(1, "At least one family member is required"), // Required minimum 1
  children: z.array(childSchema).optional(), // Optional children information
  frontIdCard: createFileSchema("Front ID card is required"),
  backIdCard: createFileSchema("Back ID card is required"),
  portrait: createFileSchema("Portrait photo is required"),
  selfie: createFileSchema("Selfie is required"),
  certificate: z.any().optional(), // Optional
})

export type FormValues = z.infer<typeof formSchema>