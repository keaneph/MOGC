"use client"

import { zodResolver } from "@hookform/resolvers/zod"

import React, { useEffect, useImperativeHandle, forwardRef } from "react"

import { Controller, useForm, UseFormReturn } from "react-hook-form"

import * as z from "zod"

import { Checkbox } from "@/components/ui/checkbox"
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
import { Textarea } from "@/components/ui/textarea"

import { academicDataSchema } from "@/lib/schemas"

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

export const AcademicDataCSection = forwardRef<AcademicDataCSectionRef, object>(
  (props, ref) => {
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

    useEffect(() => {
      if (!isOthersSelected) {
        form.setValue("otherReasonForChoosingiit", "", {
          shouldValidate: false,
        })
      }
    }, [isOthersSelected, form])

    useImperativeHandle(ref, () => ({
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Controller
                    name="reasonsForChoosingiit"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldContent>
                          <FieldLabel className="text-foreground">
                            Why choose IIT? (Select all that apply):
                          </FieldLabel>

                          {REASON_OPTIONS.map((option) => (
                            <div
                              key={option}
                              className="flex items-center space-y-1 space-x-4"
                            >
                              <Checkbox
                                id={option}
                                className="hover:bg-secondary cursor-pointer"
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
                                className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {option}
                              </label>
                            </div>
                          ))}
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
                        <FieldContent className="mt-11">
                          <FieldLabel className="text-foreground">
                            If others, specify:
                          </FieldLabel>
                          <Input
                            {...field}
                            placeholder={
                              isOthersSelected ? "Specify reason" : "N/A"
                            }
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
                          className="min-h-[282px]"
                          placeholder="Basketball, Volunteering, Dance Club, etc."
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
            </FieldGroup>
          </FieldSet>
        </Field>
      </form>
    )
  }
)

AcademicDataCSection.displayName = "AcademicDataCSection"
