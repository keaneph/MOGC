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
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import { psychosocialDataSchema } from "@/lib/schemas"

export interface PsychosocialDataBSectionRef {
  form: UseFormReturn<z.infer<typeof psychosocialDataSchema>>
}

const PROBLEM_SHARERS = [
  "Mother",
  "Father",
  "Brother/Sister",
  "Friends",
  "Counselor",
  "Others",
]
const OTHERS_OPTION = "Others"

export const PsychosocialDataBSection = forwardRef<
  PsychosocialDataBSectionRef,
  object
>((props, ref) => {
  const form = useForm<z.infer<typeof psychosocialDataSchema>>({
    resolver: zodResolver(psychosocialDataSchema),
    mode: "onChange",
    defaultValues: {
      problemSharers: [],
      otherOptionProblemSharer: "",
      needsImmediateCounseling: undefined,
      concernsToDiscuss: "",
    },
  })

  const optionsForProblemSharer = form.watch("problemSharers")
  const isOthersSelected = optionsForProblemSharer?.includes(OTHERS_OPTION)

  useEffect(() => {
    if (!isOthersSelected) {
      form.setValue("otherOptionProblemSharer", "", {
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
            Data on Psychosocial Well-Being
          </FieldLegend>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Controller
                  name="problemSharers"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel className="text-foreground">
                          To whom do you share your problems with? (Select all
                          that apply):
                        </FieldLabel>

                        {PROBLEM_SHARERS.map((option) => (
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
                  name="otherOptionProblemSharer"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent className="mt-12">
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
              <div>
                <Controller
                  name="needsImmediateCounseling"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel className="text-foreground">
                          Need immediate counseling?
                        </FieldLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ""}
                        >
                          <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
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
                  name="concernsToDiscuss"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent className="mt-4">
                        <FieldLabel className="text-foreground">
                          Future Concerns for Counselor Discussion
                        </FieldLabel>
                        <Textarea
                          className="min-h-[201px]"
                          {...field}
                          value={field.value ?? ""}
                          placeholder="List specific difficulties you want to address."
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
            </div>
          </FieldGroup>
        </FieldSet>
      </Field>
    </form>
  )
})

PsychosocialDataBSection.displayName = "PsychosocialDataBSection"
