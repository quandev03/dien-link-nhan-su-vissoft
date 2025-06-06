// Constants for employee form

export const vietnameseBanks = [
  {
    code: "BIDV",
    name: "Ngân hàng Thương mại cổ phần Đầu tư và Phát triển Việt Nam",
    shortName: "BIDV",
    logo: "https://static.wixstatic.com/media/9d8ed5_0581c29a11f546b98a50fac0b6e24a7f~mv2.jpg",
  },
  {
    code: "VCB",
    name: "Ngân hàng Thương mại cổ phần Ngoại thương Việt Nam",
    shortName: "Vietcombank",
    logo: "https://hienlaptop.com/wp-content/uploads/2024/12/logo-vietcombank-vector-11.png",
  },
  {
    code: "VTB",
    name: "Ngân hàng Thương mại cổ phần Công thương Việt Nam",
    shortName: "VietinBank",
    logo: "https://ipay.vietinbank.vn/logo.png",
  },
  {
    code: "ACB",
    name: "Ngân hàng Thương mại cổ phần Á Châu",
    shortName: "ACB",
    logo: "https://static.wixstatic.com/media/9d8ed5_e6ced15f72434992af9b5926526c78f6~mv2.jpg/v1/fill/w_980,h_980,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/9d8ed5_e6ced15f72434992af9b5926526c78f6~mv2.jpg",
  },
  {
    code: "TCB",
    name: "Ngân hàng Thương mại cổ phần Kỹ thương Việt Nam",
    shortName: "Techcombank",
    logo: "https://dongphucvina.vn/wp-content/uploads/2023/05/logo-techcombank-dongphucvina.vn_.png",
  },
  {
    code: "MB",
    name: "Ngân hàng Thương mại cổ phần Quân đội",
    shortName: "MB Bank",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Logo_MB_new.png/1200px-Logo_MB_new.png",
  },
  {
    code: "TPB",
    name: "Ngân hàng Thương mại cổ phần Tiên Phong",
    shortName: "TPBank",
    logo: "https://brandlogos.net/wp-content/uploads/2021/10/tpbank-logo.png",
  }
]

export const domain: string = "https://gw-staging.vissoft.vn/insight-service"
export const url_path: string = "/api/v1/recruitment-management/fill-information-pre-employee"
export const check_code_path: string = "/api/v1/recruitment-management/check-code-enter-information"

// Form steps
export const getFormSteps = (t: any) => [
  { id: "personal", label: t.steps.personal, icon: "1" },
  { id: "address", label: t.steps.address, icon: "2" },
  { id: "financial", label: t.steps.financial, icon: "3" },
  { id: "family", label: t.steps.family, icon: "4" },
  { id: "documents", label: t.steps.documents, icon: "5" },
]