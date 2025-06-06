import { UseFormReturn } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { FormValues } from "../schemas"

interface AddressTabProps {
  form: UseFormReturn<FormValues>
  t: any
  setCompletedSteps: (callback: (prev: string[]) => string[]) => void
  setActiveTab: (tab: string) => void
}

export function AddressTab({ form, t, setCompletedSteps, setActiveTab }: AddressTabProps) {
  return (
    <div className="space-y-6">
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
    </div>
  )
}