export interface EmployeeRelativeDTO {
  fullName: string
  genderParamCode: string
  phone: string
  birthOfDate: Date
  preEmployeesId?: string
  relationshipParamCode: string
}

export interface EmployeeDTO {
  preEmployeesId?: string
  fullName: string
  email: string
  birthOfDate: Date
  genderParamCode: string
  phone: string
  cccd: string
  dateOfIssue: Date
  dateOfOnboard: Date
  permanentAddress: string
  currentAddress: string
  fillEnabled: boolean
  bankAccountNumber: string
  bankName: string
  bankBranch: string
  personalTaxCode?: string
  licensePlateNumber?: string
  vehicleColor?: string
  vehicleType?: string
  hobbies?: string
  favoriteQuoteAndSaying?: string
  contractPreEmployeeCode?: string
  candidateCvId?: string
  employeeRelatives?: EmployeeRelativeDTO[]
}
