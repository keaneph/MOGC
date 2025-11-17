"use client"

import { zodResolver } from "@hookform/resolvers/zod"

import React, { forwardRef, useEffect, useImperativeHandle } from "react"

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

import { needsAssessmentSchema } from "@/lib/schemas"

export interface NeedsAssessmentASectionRef {
  form: UseFormReturn<z.infer<typeof needsAssessmentSchema>>
}

const NEEDS_OPTIONS = [
  "Study habits",
  "Time-management skills",
  "Career decision/choices",
  "Reading comprehension",
  "Memory skills",
  "Grade point average",
  "Others",
]
const OTHERS_NEEDS_OPTION = "Others"

const FINANCIAL_OPTIONS = [
  "Personal budget",
  "Grants/scholarships",
  "Loans",
  "Others",
]

const OTHERS_FINANCIAL_OPTION = "Others"

export const NeedsAssessmentASection = forwardRef<
  NeedsAssessmentASectionRef,
  object
>((props, ref) => {
  const form = useForm<z.infer<typeof needsAssessmentSchema>>({
    resolver: zodResolver(needsAssessmentSchema),
    mode: "onChange",
    defaultValues: {
      improvementNeeds: [],
      othersOptionImprovementNeeds: "",
      financialAssistanceNeeds: [],
      othersOptionfinancialAssistanceNeeds: "",
    },
  })

  const optionsForNeeds = form.watch("improvementNeeds")
  const isOthersNeedsSelected = optionsForNeeds?.includes(OTHERS_NEEDS_OPTION)

  const optionsForFinancial = form.watch("financialAssistanceNeeds")
  const isOthersFinancialSelected = optionsForFinancial?.includes(
    OTHERS_FINANCIAL_OPTION
  )

  useEffect(() => {
    if (!isOthersNeedsSelected) {
      form.setValue("othersOptionImprovementNeeds", "", {
        shouldValidate: false,
      })
    }
  }, [isOthersNeedsSelected, form])

  useEffect(() => {
    if (!isOthersFinancialSelected) {
      form.setValue("othersOptionfinancialAssistanceNeeds", "", {
        shouldValidate: false,
      })
    }
  }, [isOthersFinancialSelected, form])

  useImperativeHandle(ref, () => ({
    form,
  }))

  return (
    <form className="w-full">
      <Field>
        <FieldSet>
          <FieldLegend className="text-foreground font-semibold tracking-wide">
            Needs Assessment
          </FieldLegend>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Controller
                  name="improvementNeeds"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel className="text-foreground">
                          I have the need to improve the following: (Select all
                          that apply):
                        </FieldLabel>
                        {NEEDS_OPTIONS.map((optionNeeds) => {
                          const uniqueId = `needs-${optionNeeds}`
                          return (
                            <div
                              key={optionNeeds}
                              className="flex items-center space-y-1 space-x-4"
                            >
                              <Checkbox
                                id={uniqueId}
                                className="hover:bg-secondary cursor-pointer"
                                checked={field.value?.includes(optionNeeds)}
                                onCheckedChange={(checked) => {
                                  let newArray = Array.isArray(field.value)
                                    ? field.value
                                    : []
                                  if (checked) {
                                    newArray = [...newArray, optionNeeds]
                                  } else {
                                    newArray = newArray.filter(
                                      (val) => val !== optionNeeds
                                    )
                                  }
                                  field.onChange(newArray)
                                }}
                              />
                              <label
                                htmlFor={uniqueId}
                                className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {optionNeeds}
                              </label>
                            </div>
                          )
                        })}
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
                  name="othersOptionImprovementNeeds"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent className="mt-5.5">
                        <FieldLabel className="text-foreground">
                          If others, specify:
                        </FieldLabel>
                        <Input
                          {...field}
                          placeholder={
                            isOthersNeedsSelected ? "Specify reason" : "N/A"
                          }
                          value={field.value ?? ""}
                          autoComplete="off"
                          disabled={!isOthersNeedsSelected}
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
              <div>
                <Controller
                  name="financialAssistanceNeeds"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel className="text-foreground">
                          I need assistance in terms of:
                        </FieldLabel>
                        <FieldLegend className="text-foreground mt-2 font-semibold tracking-wide">
                          Financial (Select all that apply):
                        </FieldLegend>

                        {FINANCIAL_OPTIONS.map((optionFinancial) => (
                          <div
                            key={optionFinancial}
                            className="flex items-center space-y-1 space-x-4"
                          >
                            <Checkbox
                              id={optionFinancial}
                              className="hover:bg-secondary cursor-pointer"
                              checked={field.value?.includes(optionFinancial)}
                              onCheckedChange={(checked) => {
                                let newArray = Array.isArray(field.value)
                                  ? field.value
                                  : []
                                if (checked) {
                                  newArray = [...newArray, optionFinancial]
                                } else {
                                  newArray = newArray.filter(
                                    (val) => val !== optionFinancial
                                  )
                                }
                                field.onChange(newArray)
                              }}
                            />
                            <label
                              htmlFor={optionFinancial}
                              className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {optionFinancial}
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
                  name="othersOptionfinancialAssistanceNeeds"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent className="mt-17.5">
                        <FieldLabel className="text-foreground">
                          If others, specify:
                        </FieldLabel>
                        <Input
                          {...field}
                          placeholder={
                            isOthersFinancialSelected ? "Specify reason" : "N/A"
                          }
                          value={field.value ?? ""}
                          autoComplete="off"
                          disabled={!isOthersFinancialSelected}
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
            </div>
          </FieldGroup>
        </FieldSet>
      </Field>
    </form>
  )
})

NeedsAssessmentASection.displayName = "NeedsAssessmentASection"
