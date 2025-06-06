import { Loader2, Upload } from "lucide-react"
import { UseFormReturn } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { FormValues } from "../schemas"
import { handleImageUpload } from "../form-utils"

interface DocumentsTabProps {
  form: UseFormReturn<FormValues>
  t: any
  setActiveTab: (tab: string) => void
  isSubmitting: boolean
}

export function DocumentsTab({ form, t, setActiveTab, isSubmitting }: DocumentsTabProps) {
  return (
    <div className="space-y-6">
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
                      onChange={(e) => handleImageUpload(e, "frontIdCard", form)}
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
                      onChange={(e) => handleImageUpload(e, "backIdCard", form)}
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
                      onChange={(e) => handleImageUpload(e, "portrait", form)}
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
                      onChange={(e) => handleImageUpload(e, "selfie", form)}
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
                      onChange={(e) => handleImageUpload(e, "certificate", form)}
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
    </div>
  )
}