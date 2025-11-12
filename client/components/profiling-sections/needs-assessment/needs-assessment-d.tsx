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
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import * as React from "react"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, UseFormReturn } from "react-hook-form"
import { needsAssessmentSchema } from "@/lib/schemas"

export interface NeedsAssessmentDSectionRef {
  form: UseFormReturn<z.infer<typeof needsAssessmentSchema>>
}

const PRIMARY_OPTIONS = [
  "Mother",
  "Father",
  "Brother/Sister",
  "Friends",
  "Counselor",
  "Teacher(s)",
  "Others",
]

const OTHERS_OPTION = "Others"

export const NeedsAssessmentDSection = React.forwardRef<
  NeedsAssessmentDSectionRef,
  object
>((props, ref) => {
  const form = useForm<z.infer<typeof needsAssessmentSchema>>({
    resolver: zodResolver(needsAssessmentSchema),
    mode: "onChange",
    defaultValues: {
      primaryProblemSharer: [],
      othersOptionPrimaryProblemSharer: "",
      firstQuestion: undefined,
      secondQuestion: undefined,
      thirdQuestion: undefined,
    },
  })

  const optionsForPrimaryProblemSharer = form.watch("primaryProblemSharer")
  const isOthersSelected =
    optionsForPrimaryProblemSharer?.includes(OTHERS_OPTION)

  React.useEffect(() => {
    if (!isOthersSelected) {
      form.setValue("othersOptionPrimaryProblemSharer", "", {
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Controller
                  name="primaryProblemSharer"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel className="text-foreground">
                          I can easily discuss my problems with my (Please check
                          all that apply to you.):
                        </FieldLabel>

                        {PRIMARY_OPTIONS.map((option) => (
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
                  name="othersOptionPrimaryProblemSharer"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent className="mt-6">
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
              <div className="space-y-5">
                <FieldLabel>
                  How often did you experience the following?
                </FieldLabel>
                <Controller
                  name="firstQuestion"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent className="mt-1">
                        <FieldLabel className="text-foreground">
                          I willfully came for counseling when I had a problem
                        </FieldLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ""}
                        >
                          <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Select answer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Always">Always</SelectItem>
                            <SelectItem value="Oftentimes">
                              Oftentimes
                            </SelectItem>
                            <SelectItem value="Sometimes">Sometimes</SelectItem>
                            <SelectItem value="Never">Never</SelectItem>
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
                  name="secondQuestion"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel className="text-foreground">
                          I experienced counseling upon referral by teachers,
                          friends, parents, etc
                        </FieldLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ""}
                        >
                          <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Select answer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Always">Always</SelectItem>
                            <SelectItem value="Oftentimes">
                              Oftentimes
                            </SelectItem>
                            <SelectItem value="Sometimes">Sometimes</SelectItem>
                            <SelectItem value="Never">Never</SelectItem>
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
                  name="thirdQuestion"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel className="text-foreground">
                          I know that help is available at the Guidance and
                          Counseling Center of MSU-IIT.
                        </FieldLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ""}
                        >
                          <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Select answer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Always">Always</SelectItem>
                            <SelectItem value="Oftentimes">
                              Oftentimes
                            </SelectItem>
                            <SelectItem value="Sometimes">Sometimes</SelectItem>
                            <SelectItem value="Never">Never</SelectItem>
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
            </div>
          </FieldGroup>
        </FieldSet>
      </Field>
    </form>
  )
})

NeedsAssessmentDSection.displayName = "NeedsAssessmentDSection"
