"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [month, setMonth] = React.useState<Date>(props.defaultMonth || new Date())
  
  // Get current language from URL or localStorage if available
  const isVietnamese = typeof window !== 'undefined' && 
    (window.location.href.includes('lang=vi') || localStorage.getItem('language') === 'vi');
  
  // Localized month names
  const monthNames = isVietnamese ? 
    ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", 
     "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"] :
    ["January", "February", "March", "April", "May", "June", 
     "July", "August", "September", "October", "November", "December"]
  
  // Localized day names
  const weekdayLabels = isVietnamese ? 
    { 0: 'CN', 1: 'T2', 2: 'T3', 3: 'T4', 4: 'T5', 5: 'T6', 6: 'T7' } :
    { 0: 'Su', 1: 'Mo', 2: 'Tu', 3: 'We', 4: 'Th', 5: 'Fr', 6: 'Sa' };
  
  // Generate years from 1900 to current year + 10 (for future dates)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1900 + 11 }, (_, i) => currentYear + 10 - i)
  
  // Custom caption component
  function CustomCaption() {
    return (
      <div className="flex justify-center items-center gap-2 py-2">
        <Select
          value={month.getMonth().toString()}
          onValueChange={(value) => {
            const newMonth = new Date(month)
            newMonth.setMonth(parseInt(value))
            setMonth(newMonth)
          }}
        >
          <SelectTrigger className="w-[110px] h-8 text-sm">
            <SelectValue placeholder={isVietnamese ? "Tháng" : "Month"} />
          </SelectTrigger>
          <SelectContent>
            {monthNames.map((monthName, index) => (
              <SelectItem key={index} value={index.toString()}>
                {monthName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select
          value={month.getFullYear().toString()}
          onValueChange={(value) => {
            const newMonth = new Date(month)
            newMonth.setFullYear(parseInt(value))
            setMonth(newMonth)
          }}
        >
          <SelectTrigger className="w-[90px] h-8 text-sm">
            <SelectValue placeholder={isVietnamese ? "Năm" : "Year"} />
          </SelectTrigger>
          <SelectContent className="max-h-[200px]">
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      <CustomCaption />
      <DayPicker
        month={month}
        onMonthChange={setMonth}
        showOutsideDays={showOutsideDays}
        className={cn("p-3", className)}
        weekStartsOn={1} // Start week on Monday
        formatters={{ 
          formatWeekdayName: (day) => weekdayLabels[day.getDay()]
        }}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center hidden", // Hide default caption
          caption_label: "text-sm font-medium",
          nav: "space-x-1 flex items-center hidden", // Hide navigation buttons
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell:
            "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
          ),
          day_range_end: "day-range-end",
          day_selected:
            "bg-[rgb(174,48,52)] text-white hover:bg-[rgb(174,48,52)] hover:text-white focus:bg-[rgb(174,48,52)] focus:text-white",
          day_today: "bg-accent text-accent-foreground font-bold",
          day_outside:
            "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        {...props}
      />
    </div>
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
