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

export interface NeedsAssessmentBSectionRef {
  form: UseFormReturn<z.infer<typeof needsAssessmentSchema>>
}

const PERSONAL_OPTIONS = [
  "Stress management",
  "Substance abuse",
  "Dealing with relationships",
  "Anxiety",
  "Handling conflicts/anger",
  "Sexual harassment",
  "Having suicidal thoughts",
  "Depression/Sadness",
  "Coping with disability",
  "Grief/loss due to parental separation",
  "Grief/loss due to death",
  "Physical abuse",
  "Bullying",
  "Cyber-bullying",
  "Others",
]
const OTHERS_OPTION = "Others"

export const NeedsAssessmentBSection = forwardRef<
  NeedsAssessmentBSectionRef,
  object
>((props, ref) => {
  const form = useForm<z.infer<typeof needsAssessmentSchema>>({
    resolver: zodResolver(needsAssessmentSchema),
    mode: "onChange",
    defaultValues: {
      personalSocialNeeds: [],
      othersOptionPersonalSocialNeeds: "",
    },
  })

  const optionsForFinancial = form.watch("personalSocialNeeds")
  const isOthersSelected = optionsForFinancial?.includes(OTHERS_OPTION)

  useEffect(() => {
    if (!isOthersSelected) {
      form.setValue("othersOptionPersonalSocialNeeds", "", {
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
            Needs Assessment
          </FieldLegend>
          <FieldGroup>
            <Controller
              name="personalSocialNeeds"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel className="text-foreground">
                      I need assistance in terms of:
                    </FieldLabel>
                    <FieldLegend className="text-foreground mt-2 font-semibold tracking-wide">
                      Personal-Social (Select all that apply):
                    </FieldLegend>

                    <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                      {PERSONAL_OPTIONS.map((option) => (
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
              name="othersOptionPersonalSocialNeeds"
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
          </FieldGroup>
        </FieldSet>
      </Field>
    </form>
  )
})

NeedsAssessmentBSection.displayName = "NeedsAssessmentBSection"
