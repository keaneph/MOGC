"use client"

import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ChevronsUpDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import * as React from "react"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, UseFormReturn } from "react-hook-form"
import { academicDataSchema } from "@/lib/schemas"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const courses = [
  {
    value: "BA English Language Studies",
    label: "BA English Language Studies",
  },
  {
    value: "BA Filipino",
    label: "BA Filipino",
  },
  {
    value: "BA History",
    label: "BA History",
  },
  {
    value: "BA Panitikan",
    label: "BA Panitikan",
  },
  {
    value: "BA Political Science",
    label: "BA Political Science",
  },
  {
    value: "BA Psychology",
    label: "BA Psychology",
  },
  {
    value: "BA Sociology",
    label: "BA Sociology",
  },
  {
    value: "BS Psychology",
    label: "BS Psychology",
  },
  {
    value: "BS Philosophy-Applied Ethics",
    label: "BS Philosophy-Applied Ethics",
  },
  {
    value: "BS Accountancy",
    label: "BS Accountancy",
  },
  {
    value: "BS Economics",
    label: "BS Economics",
  },
  {
    value: "BS Entrepreneurship",
    label: "BS Entrepreneurship",
  },
  {
    value: "BS Hospitality Management",
    label: "BS Hospitality Management",
  },
  {
    value: "BSBA Business Economics",
    label: "BSBA Business Economics",
  },
  {
    value: "BSBA Marketing Management",
    label: "BSBA Marketing Management",
  },
  {
    value: "BS Biology (Animal Biology)",
    label: "BS Biology (Animal Biology)",
  },
  {
    value: "BS Biology (Plant Biology)",
    label: "BS Biology (Plant Biology)",
  },
  {
    value: "BS Biology (Microbiology)",
    label: "BS Biology (Microbiology)",
  },
  {
    value: "BS Biology (Biodiversity)",
    label: "BS Biology (Biodiversity)",
  },
  {
    value: "BS Chemistry",
    label: "BS Chemistry",
  },
  {
    value: "BS Marine Biology",
    label: "BS Marine Biology",
  },
  {
    value: "BS Mathematics",
    label: "BS Mathematics",
  },
  {
    value: "BS Physics",
    label: "BS Physics",
  },
  {
    value: "BS Statistics",
    label: "BS Statistics",
  },
  {
    value: "BS Computer Applications",
    label: "BS Computer Applications",
  },
  {
    value: "BS Computer Science",
    label: "BS Computer Science",
  },
  {
    value: "BS Information Systems",
    label: "BS Information Systems",
  },
  {
    value: "BS Information Technology",
    label: "BS Information Technology",
  },
  {
    value: "BS Nursing",
    label: "BS Nursing",
  },
  {
    value: "BS Ceramics Engineering",
    label: "BS Ceramics Engineering",
  },
  {
    value: "BS Chemical Engineering",
    label: "BS Chemical Engineering",
  },
  {
    value: "BS Civil Engineering",
    label: "BS Civil Engineering",
  },
  {
    value: "BS Computer Engineering",
    label: "BS Computer Engineering",
  },
  {
    value: "BS Electrical Engineering",
    label: "BS Electrical Engineering",
  },
  {
    value: "BS Environmental Engineering",
    label: "BS Environmental Engineering",
  },
  {
    value: "BS Electronics Engineering",
    label: "BS Electronics Engineering",
  },
  {
    value: "BS Industrial Automation and Mechatronics",
    label: "BS Industrial Automation and Mechatronics",
  },
  {
    value: "BS Mechanical Engineering",
    label: "BS Mechanical Engineering",
  },
  {
    value: "BS Metallurgical Engineering",
    label: "BS Metallurgical Engineering",
  },
  {
    value: "BS Mining Engineering",
    label: "BS Mining Engineering",
  },
  {
    value: "BET Chemical Engineering Technology",
    label: "BET Chemical Engineering Technology",
  },
  {
    value: "BET Civil Engineering Technology",
    label: "BET Civil Engineering Technology",
  },
  {
    value: "BET Electrical Engineering Technology",
    label: "BET Electrical Engineering Technology",
  },
  {
    value: "BET Electronics Engineering Technology",
    label: "BET Electronics Engineering Technology",
  },
  {
    value: "BET Mechanical Engineering Technology",
    label: "BET Mechanical Engineering Technology",
  },
  {
    value: "BET Metallurgical and Materials Processing Engineering Technology",
    label: "BET Metallurgical and Materials Processing Engineering Technology",
  },
  {
    value: "BEEd Language Education",
    label: "BEEd Language Education",
  },
  {
    value: "BEEd Science and Mathematics",
    label: "BEEd Science and Mathematics",
  },
  {
    value: "BSEd Biology",
    label: "BSEd Biology",
  },
  {
    value: "BSEd Chemistry",
    label: "BSEd Chemistry",
  },
  {
    value: "BSEd Mathematics",
    label: "BSEd Mathematics",
  },
  {
    value: "BSEd Physics",
    label: "BSEd Physics",
  },
  {
    value: "BSEd Filipino",
    label: "BSEd Filipino",
  },
  {
    value: "BTVTEd Drafting Technology",
    label: "BTVTEd Drafting Technology",
  },
  {
    value: "BTLEd Home Economics",
    label: "BTLEd Home Economics",
  },
  {
    value: "BTLEd Industrial Arts",
    label: "BTLEd Industrial Arts",
  },
  {
    value: "BPEd Physical Education",
    label: "BPEd Physical Education",
  },
]

export interface AcademicDataBSectionRef {
  form: UseFormReturn<z.infer<typeof academicDataSchema>>
}

export const AcademicDataBSection = React.forwardRef<
  AcademicDataBSectionRef,
  object
>((props, ref) => {
  const form = useForm<z.infer<typeof academicDataSchema>>({
    resolver: zodResolver(academicDataSchema),
    mode: "onChange",
    defaultValues: {
      firstChoice: "",
      secondChoice: "",
      thirdChoice: "",
      studentOrg: "",
      courseChoiceActor: undefined,
      otherCourseChoiceActor: "",
      reasonsForChoosingiit: undefined,
      otherReasonForChoosingiit: "",
      reasonForCourse: "",
      careerPursuingInFuture: "",
      coCurricularActivities: "",
    },
  })

  const [openFirst, setOpenFirst] = React.useState(false)
  const [openSecond, setOpenSecond] = React.useState(false)
  const [openThird, setOpenThird] = React.useState(false)

  const courseChoiceActor = form.watch("courseChoiceActor")
  React.useEffect(() => {
    if (courseChoiceActor !== "Others") {
      form.setValue("otherCourseChoiceActor", "", {
        shouldValidate: false,
      })
    }
  }, [courseChoiceActor, form])

  const reasonsForChoosingiit = form.watch("reasonsForChoosingiit")
  React.useEffect(() => {
    if (reasonsForChoosingiit !== "Others") {
      form.setValue("otherReasonForChoosingiit", "None", {
        shouldValidate: false,
      })
    }
  }, [reasonsForChoosingiit, form])

  React.useImperativeHandle(ref, () => ({
    form,
  }))

  return (
    <form className="w-full">
      <Field>
        <FieldSet>
          <FieldLegend className="text-foreground font-semibold tracking-wide">
            Academic Data
          </FieldLegend>
          <FieldGroup>
            <div className="-mb-2 grid grid-cols-4 gap-4">
              <Controller
                name="firstChoice"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        1st Course Choice
                      </FieldLabel>
                      <Popover open={openFirst} onOpenChange={setOpenFirst}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openFirst}
                            className={cn(
                              "w-auto cursor-pointer justify-between overflow-hidden",
                              field.value ? "text-foreground" : "text-main4"
                            )}
                          >
                            {field.value
                              ? courses.find((c) => c.value === field.value)
                                  ?.label
                              : "Select course..."}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[260px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search course..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No course found.</CommandEmpty>
                              <CommandGroup>
                                {courses.map((c) => (
                                  <CommandItem
                                    key={c.value}
                                    value={c.value}
                                    onSelect={(v) => {
                                      field.onChange(v)
                                      setOpenFirst(false)
                                    }}
                                  >
                                    {c.label}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        c.value === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {fieldState.invalid && (
                        <FieldError
                          className="text-[12px]"
                          errors={[fieldState.error]}
                        />
                      )}
                    </FieldContent>
                  </Field>
                )}
              />
              <Controller
                name="secondChoice"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        2nd Course Choice
                      </FieldLabel>
                      <Popover open={openSecond} onOpenChange={setOpenSecond}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openSecond}
                            className={cn(
                              "w-auto cursor-pointer justify-between overflow-hidden",
                              field.value ? "text-foreground" : "text-main4"
                            )}
                          >
                            {field.value
                              ? courses.find((c) => c.value === field.value)
                                  ?.label
                              : "Select course..."}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[260px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search course..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No course found.</CommandEmpty>
                              <CommandGroup>
                                {courses.map((c) => (
                                  <CommandItem
                                    key={c.value}
                                    value={c.value}
                                    onSelect={(v) => {
                                      field.onChange(v)
                                      setOpenSecond(false)
                                    }}
                                  >
                                    {c.label}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        c.value === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {fieldState.invalid && (
                        <FieldError
                          className="text-[12px]"
                          errors={[fieldState.error]}
                        />
                      )}
                    </FieldContent>
                  </Field>
                )}
              />
              <Controller
                name="thirdChoice"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        3rd Course Choice
                      </FieldLabel>
                      <Popover open={openThird} onOpenChange={setOpenThird}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openThird}
                            className={cn(
                              "w-auto cursor-pointer justify-between overflow-hidden",
                              field.value ? "text-foreground" : "text-main4"
                            )}
                          >
                            {field.value
                              ? courses.find((c) => c.value === field.value)
                                  ?.label
                              : "Select course..."}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[260px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search course..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No course found.</CommandEmpty>
                              <CommandGroup>
                                {courses.map((c) => (
                                  <CommandItem
                                    key={c.value}
                                    value={c.value}
                                    onSelect={(v) => {
                                      field.onChange(v)
                                      setOpenThird(false)
                                    }}
                                  >
                                    {c.label}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        c.value === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {fieldState.invalid && (
                        <FieldError
                          className="text-[12px]"
                          errors={[fieldState.error]}
                        />
                      )}
                    </FieldContent>
                  </Field>
                )}
              />
              <Controller
                name="studentOrg"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Student Organizations
                      </FieldLabel>
                      <Input {...field} placeholder="AIM" autoComplete="off" />
                      {fieldState.invalid && (
                        <FieldError
                          className="text-[12px]"
                          errors={[fieldState.error]}
                        />
                      )}
                    </FieldContent>
                  </Field>
                )}
              />
            </div>
            <div className="-mb-2 grid grid-cols-4 gap-4">
              <Controller
                name="courseChoiceActor"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Course was choosen by:
                      </FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Own Choice">Own Choice</SelectItem>
                          <SelectItem value="Parents Choice">
                            Parents Choice
                          </SelectItem>
                          <SelectItem value="Siblings Choice">
                            Siblings Choice
                          </SelectItem>
                          <SelectItem value="Relatives Choice">
                            Relatives Choice
                          </SelectItem>
                          <SelectItem value="According to MSU-SASE score/slot">
                            According to MSU-SASE score/slot
                          </SelectItem>
                          <SelectItem value="Others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError
                          className="text-[12px]"
                          errors={[fieldState.error]}
                        />
                      )}
                    </FieldContent>
                  </Field>
                )}
              />
              <Controller
                name="otherCourseChoiceActor"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        If others, specify:
                      </FieldLabel>
                      <Input
                        {...field}
                        placeholder="Specify who"
                        value={field.value ?? ""}
                        autoComplete="off"
                        disabled={form.watch("courseChoiceActor") !== "Others"}
                      />
                      {fieldState.invalid && (
                        <FieldError
                          className="text-[12px]"
                          errors={[fieldState.error]}
                        />
                      )}
                    </FieldContent>
                  </Field>
                )}
              />
              <Controller
                name="reasonsForChoosingiit"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Why choose IIT?:
                      </FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Quality education">
                            Quality education
                          </SelectItem>
                          <SelectItem value="Affordable tuition fees">
                            Affordable tuition fees
                          </SelectItem>
                          <SelectItem value="Scholarships">
                            Scholarships
                          </SelectItem>
                          <SelectItem value="Proximity">Proximity</SelectItem>
                          <SelectItem value="Only school offering my course">
                            Only school offering my course
                          </SelectItem>
                          <SelectItem value="Prestigious Institution">
                            Prestigious Institution
                          </SelectItem>
                          <SelectItem value="Others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError
                          className="text-[12px]"
                          errors={[fieldState.error]}
                        />
                      )}
                    </FieldContent>
                  </Field>
                )}
              />
              <Controller
                name="otherReasonForChoosingiit"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        If others, specify:
                      </FieldLabel>
                      <Input
                        {...field}
                        placeholder="Specify why IIT"
                        value={field.value ?? ""}
                        autoComplete="off"
                        disabled={
                          form.watch("reasonsForChoosingiit") !== "Others"
                        }
                      />
                      {fieldState.invalid && (
                        <FieldError
                          className="text-[12px]"
                          errors={[fieldState.error]}
                        />
                      )}
                    </FieldContent>
                  </Field>
                )}
              />
            </div>
            <div className="-mb-2 grid grid-cols-2 gap-4">
              <Controller
                name="reasonForCourse"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        What is your (or parents&#39;/other&#39;s) reason for
                        choosing the course?
                      </FieldLabel>
                      <Input
                        {...field}
                        placeholder="Specify your reason for choosing your course"
                        value={field.value ?? ""}
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError
                          className="text-[12px]"
                          errors={[fieldState.error]}
                        />
                      )}
                    </FieldContent>
                  </Field>
                )}
              />
              <Controller
                name="careerPursuingInFuture"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        What career do you see yourself pursuing after college
                        education?
                      </FieldLabel>
                      <Input
                        {...field}
                        placeholder="Specify what career you want to pursue"
                        value={field.value ?? ""}
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError
                          className="text-[12px]"
                          errors={[fieldState.error]}
                        />
                      )}
                    </FieldContent>
                  </Field>
                )}
              />
            </div>
            <Controller
              name="coCurricularActivities"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel className="text-foreground">
                      Co-Curricular Activities
                    </FieldLabel>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      placeholder=" basketball, volunteering, dance club"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError
                        className="text-[12px]"
                        errors={[fieldState.error]}
                      />
                    )}
                  </FieldContent>
                </Field>
              )}
            />
          </FieldGroup>
        </FieldSet>
      </Field>
    </form>
  )
})

AcademicDataBSection.displayName = "AcademicDataBSection"
