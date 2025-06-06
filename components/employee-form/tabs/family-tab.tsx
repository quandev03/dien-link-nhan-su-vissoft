import { format } from "date-fns"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { UseFormReturn } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

import { FormValues } from "../schemas"
import { addChild, addFamilyMember, removeChild, removeFamilyMember } from "../form-utils"

interface FamilyTabProps {
  form: UseFormReturn<FormValues>
  t: any
  setCompletedSteps: (callback: (prev: string[]) => string[]) => void
  setActiveTab: (tab: string) => void
}

export function FamilyTab({ form, t, setCompletedSteps, setActiveTab }: FamilyTabProps) {
  return (
    <div className="space-y-6">
      {/* Contact Information (Required) */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                {t.family.contactTitle} <span className="text-red-500">*</span>
              </h3>
              <Button
                type="button"
                onClick={() => addFamilyMember(form)}
                variant="outline"
                size="sm"
                className="border-[rgb(174,48,52)] text-[rgb(174,48,52)] hover:bg-[rgb(174,48,52)] hover:text-white"
              >
                <Plus className="h-4 w-4 mr-2" /> {t.family.addMember}
              </Button>
            </div>

            {form.watch("employeeRelatives")?.map((relative, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">
                    {t.family.member}
                  </h4>
                  {index > 0 && (
                    <Button
                      type="button"
                      onClick={() => removeFamilyMember(form, index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
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
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            // Reset relationship if gender changes
                            if (form.getValues(`employeeRelatives.${index}.relationshipParamCode`) === "SPOUSE") {
                              form.setValue(`employeeRelatives.${index}.relationshipParamCode`, "");
                            }
                          }} 
                          defaultValue={field.value}
                        >
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
                            <SelectItem value="FATHER">{t.relationship.father}</SelectItem>
                            <SelectItem value="MOTHER">{t.relationship.mother}</SelectItem>
                            {form.getValues(`employeeRelatives.${index}.genderParamCode`) === "MALE" ? (
                              <SelectItem value="SPOUSE">{t.relationship.wife}</SelectItem>
                            ) : form.getValues(`employeeRelatives.${index}.genderParamCode`) === "FEMALE" ? (
                              <SelectItem value="SPOUSE">{t.relationship.husband}</SelectItem>
                            ) : (
                              <SelectItem value="SPOUSE">{t.relationship.spouse}</SelectItem>
                            )}
                            <SelectItem value="BROTHER">{t.relationship.brother}</SelectItem>
                            <SelectItem value="SISTER">{t.relationship.sister}</SelectItem>
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
      
      {/* Children Information (Optional) */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">
                {t.family.childrenTitle}
              </h3>
              <Button
                type="button"
                onClick={() => addChild(form)}
                variant="outline"
                size="sm"
                className="border-[rgb(174,48,52)] text-[rgb(174,48,52)] hover:bg-[rgb(174,48,52)] hover:text-white"
              >
                <Plus className="h-4 w-4 mr-2" /> {t.family.addChild}
              </Button>
            </div>

            {form.watch("children")?.map((child, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">
                    {t.family.child} #{index + 1}
                  </h4>
                  <Button
                    type="button"
                    onClick={() => removeChild(form, index)}
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
                    name={`children.${index}.fullName`}
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
                    name={`children.${index}.genderParamCode`}
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
                    name={`children.${index}.birthOfDate`}
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
                </div>
              </div>
            ))}

            {(!form.watch("children") || form.watch("children").length === 0) && (
              <div className="text-center py-8 text-muted-foreground">{t.family.noChildren}</div>
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
    </div>
  )
}