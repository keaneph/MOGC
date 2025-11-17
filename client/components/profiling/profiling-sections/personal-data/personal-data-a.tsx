"use client"

import { zodResolver } from "@hookform/resolvers/zod"

import { ChevronsUpDown, Check } from "lucide-react"

import React, { forwardRef, useImperativeHandle, useState } from "react"

import { Controller, useForm, UseFormReturn } from "react-hook-form"

import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select"

import { studentIndividualDataSchema } from "@/lib/schemas"
import { cn } from "@/lib/utils"

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

export interface PersonalDataASectionRef {
  form: UseFormReturn<z.infer<typeof studentIndividualDataSchema>>
}

export const PersonalDataASection = forwardRef<PersonalDataASectionRef, object>(
  (props, ref) => {
    const form = useForm<z.infer<typeof studentIndividualDataSchema>>({
      resolver: zodResolver(studentIndividualDataSchema),
      mode: "onChange",
      defaultValues: {
        idNo: "",
        course: "",
        saseScore: undefined,
        academicYear: "",
        familyName: "",
        givenName: "",
        middleInitial: "",
        studentStatus: undefined,
      },
    })

    const [open, setOpen] = useState(false)

    useImperativeHandle(ref, () => ({
      form,
    }))

    return (
      <form className="w-full">
        <Field>
          <FieldSet>
            <FieldLegend className="text-foreground font-semibold tracking-wide">
              Personal Data
            </FieldLegend>
            <FieldGroup>
              <div className="-mb-2 grid grid-cols-2 gap-4">
                <Controller
                  name="idNo"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel className="text-foreground">
                          ID No:
                        </FieldLabel>
                        <Input
                          {...field}
                          placeholder="2023-0079"
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
                  name="course"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel className="text-foreground">
                          Course
                        </FieldLabel>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={open}
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
                                        setOpen(false)
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
                  name="saseScore"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel className="text-foreground">
                          SASE Score:
                        </FieldLabel>
                        <Input
                          {...field}
                          type="number"
                          value={field.value ?? ""}
                          placeholder="120"
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
                  name="academicYear"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel className="text-foreground">
                          Academic Year:
                        </FieldLabel>
                        <Input
                          {...field}
                          placeholder="2025-2026"
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
                  name="familyName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel className="text-foreground">
                          Family Name:
                        </FieldLabel>
                        <Input
                          {...field}
                          placeholder="Ledesma"
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
                  name="givenName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel className="text-foreground">
                          Given Name:
                        </FieldLabel>
                        <Input
                          {...field}
                          placeholder="Keane Pharelle"
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
                  name="middleInitial"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel className="text-foreground">
                          Middle Initial:
                        </FieldLabel>
                        <Input {...field} placeholder="B" autoComplete="off" />
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
                  name="studentStatus"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel className="text-foreground">
                          Student Status:
                        </FieldLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ""}
                        >
                          <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="Transferee">
                              Transferee
                            </SelectItem>
                            <SelectItem value="Returnee">Returnee</SelectItem>
                            <SelectItem value="Shiftee">Shiftee</SelectItem>
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
              </div>
            </FieldGroup>
          </FieldSet>
        </Field>
      </form>
    )
  }
)

PersonalDataASection.displayName = "PersonalDataASection"
