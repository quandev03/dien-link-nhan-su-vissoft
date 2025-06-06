import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { UseFormReturn } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

import { FormValues } from "../schemas"

interface PersonalTabProps {
  form: UseFormReturn<FormValues>
  t: any
  setCompletedSteps: (callback: (prev: string[]) => string[]) => void
  setActiveTab: (tab: string) => void
}

export function PersonalTab({ form, t, setCompletedSteps, setActiveTab }: PersonalTabProps) {
  return (
    <div className="space-y-6">
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
                        disabled={(date) => date < new Date("1900-01-01")}
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
    </div>
  )
}