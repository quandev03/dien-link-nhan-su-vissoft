import { UseFormReturn } from "react-hook-form"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { FormValues } from "../schemas"
import { vietnameseBanks } from "../constants"

interface FinancialTabProps {
  form: UseFormReturn<FormValues>
  t: any
  setCompletedSteps: (callback: (prev: string[]) => string[]) => void
  setActiveTab: (tab: string) => void
}

export function FinancialTab({ form, t, setCompletedSteps, setActiveTab }: FinancialTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t.fields.bankName} <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t.placeholders.selectBank} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vietnameseBanks.map((bank) => (
                        <SelectItem key={bank.code} value={bank.code}>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 relative overflow-hidden rounded-sm">
                              <Image
                                src={bank.logo}
                                alt={bank.shortName}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <span>{bank.shortName}</span>
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
    </div>
  )
}