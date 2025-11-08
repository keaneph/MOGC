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
import { Checkbox } from "@/components/ui/checkbox"
import * as React from "react"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, UseFormReturn } from "react-hook-form"
import { academicDataSchema } from "@/lib/schemas"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export interface AcademicDataCSectionRef {
  form: UseFormReturn<z.infer<typeof academicDataSchema>>
}

const REASON_OPTIONS = [
  "Quality education",
  "Affordable tuition fees",
  "Scholarships",
  "Proximity",
  "Only school offering my course",
  "Prestigious Institution",
  "Others",
]
const OTHERS_OPTION = "Others"

export const AcademicDataCSection = React.forwardRef<
  AcademicDataCSectionRef,
  object
>((props, ref) => {
  const form = useForm<z.infer<typeof academicDataSchema>>({
    resolver: zodResolver(academicDataSchema),
    mode: "onChange",
    defaultValues: {
      reasonsForChoosingiit: [],
      otherReasonForChoosingiit: "",
      coCurricularActivities: "",
    },
  })

  const reasonsForChoosingiitArray = form.watch("reasonsForChoosingiit")
  const isOthersSelected = reasonsForChoosingiitArray?.includes(OTHERS_OPTION)

  React.useEffect(() => {
    if (!isOthersSelected) {
      form.setValue("otherReasonForChoosingiit", "None", {
        shouldValidate: false,
      })
    }
  }, [isOthersSelected, form])

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
            <Controller
              name="reasonsForChoosingiit"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel className="text-foreground">
                      Why choose IIT? (Select all that apply):
                    </FieldLabel>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2">
                      {REASON_OPTIONS.map((option) => (
                        <div
                          key={option}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={option}
                            checked={field.value?.includes(option)}
                            onCheckedChange={(checked) => {
                              let newArray = Array.isArray(field.value)
                                ? field.value
                                : []
                              if (checked) {
                                newArray = [...newArray, option]
                              } else {
                                newArray = newArray.filter(
                                  (val) => val !== option
                                )
                              }
                              field.onChange(newArray)
                            }}
                          />
                          <label
                            htmlFor={option}
                            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
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
                      placeholder={isOthersSelected ? "Specify reason" : "N/A"}
                      value={field.value ?? ""}
                      autoComplete="off"
                      disabled={!isOthersSelected}
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
                      className="min-h-[35.5px]"
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

AcademicDataCSection.displayName = "AcademicDataCSection"
