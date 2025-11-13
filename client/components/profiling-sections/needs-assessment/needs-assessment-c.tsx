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
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import * as React from "react"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, UseFormReturn } from "react-hook-form"
import { needsAssessmentSchema } from "@/lib/schemas"

export interface NeedsAssessmentCSectionRef {
  form: UseFormReturn<z.infer<typeof needsAssessmentSchema>>
}

const UPSET_OPTIONS = [
  "Tried to be funny and make light of it all",
  "Talked to a teacher or counselor in school",
  "Ate food",
  "Tried to stay away from home",
  "Drank beer, wine, liquor",
  "Used drugs not prescribed by doctor",
  "Listened to music",
  "Watched movies or TV shows",
  "Smoked",
  "Tried to solve my problem",
  "Read books, novels, etc.",
  "Worked hard on school work/projects",
  "Attempted to end my life",
  "Got more involved in school activities",
  "Tried to make my own decision",
  "Talked things out with parents",
  "Cried",
  "Tried to improve myself (get body in shape, get good grades, etc.)",
  "Strolled around on a car/jeepney-ride",
  "Tried to think of the good things in life",
  "Prayed",
  "Thought it would be better dead",
  "Talked to a minister/priest/pastor",
  "Told myself the problem is not important",
  "Blamed others for what went wrong",
  "Played video games",
  "Surfed the internet",
  "Hurt myself",
  "Talked to a friend",
  "Daydreamed about how I would like things to be",
  "Got professional counseling",
  "Went to church",
  "Slept",
  "Got angry",
  "Kept my silence",
  "Others",
]

const OTHERS_OPTION = "Others"

export const NeedsAssessmentCSection = React.forwardRef<
  NeedsAssessmentCSectionRef,
  object
>((props, ref) => {
  const form = useForm<z.infer<typeof needsAssessmentSchema>>({
    resolver: zodResolver(needsAssessmentSchema),
    mode: "onChange",
    defaultValues: {
      upsetResponses: [],
      othersOptionUpsetResponses: "",
    },
  })

  const optionsForUpsetResponse = form.watch("upsetResponses")
  const isOthersSelected = optionsForUpsetResponse?.includes(OTHERS_OPTION)

  React.useEffect(() => {
    if (!isOthersSelected) {
      form.setValue("othersOptionUpsetResponses", "", {
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
            Needs Assessment
          </FieldLegend>
          <FieldGroup>
            <Controller
              name="upsetResponses"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel className="text-foreground">
                      When upset or pushed to the limit in the past, how did you
                      react? (Please check all that apply to you.):
                    </FieldLabel>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2">
                      {UPSET_OPTIONS.map((option) => (
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
              name="othersOptionUpsetResponses"
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

NeedsAssessmentCSection.displayName = "NeedsAssessmentCSection"
