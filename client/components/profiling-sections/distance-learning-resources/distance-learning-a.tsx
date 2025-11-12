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
import { distanceLearningSchema } from "@/lib/schemas"

export interface DistanceLearningASectionRef {
  form: UseFormReturn<z.infer<typeof distanceLearningSchema>>
}

// enum
const GADGET_OPTIONS = [
  "None",
  "Mobile phone",
  "Smart phone",
  "Tablet/Ipad",
  "Laptop/Netbook",
  "PC/Desktop",
  "Others",
]
const OTHERS_GADGET_OPTIONS = "Others"

// enum
const INTERNET_CONNECTIVITY = [
  "Home Internet",
  "Relatives Internet",
  "Neighbours Internet",
  "Mobile Data",
  "Piso Net",
  "Internet Cafe",
  "No Internet",
  "Other",
]
const OTHERS_CONNECTIVITY_OPTIONS = "Other"

export const DistanceLearningASection = React.forwardRef<
  DistanceLearningASectionRef,
  object
>((props, ref) => {
  const form = useForm<z.infer<typeof distanceLearningSchema>>({
    resolver: zodResolver(distanceLearningSchema),
    mode: "onChange",
    defaultValues: {
      technologyGadgets: [],
      otherOptionTechnologyGadgets: "",
      meansOfInternet: [],
      otherOptionMeansOfInternet: "",
    },
  })

  const optionsForGadgets = form.watch("technologyGadgets")
  const isOthersGadgetSelected = optionsForGadgets?.includes(
    OTHERS_GADGET_OPTIONS
  )

  const optionsForConnectivity = form.watch("meansOfInternet")
  const isOthersConnectivitySelected = optionsForConnectivity?.includes(
    OTHERS_CONNECTIVITY_OPTIONS
  )

  React.useEffect(() => {
    if (!isOthersGadgetSelected) {
      form.setValue("otherOptionTechnologyGadgets", "", {
        shouldValidate: false,
      })
    }
  }, [isOthersGadgetSelected, form])

  React.useEffect(() => {
    if (!isOthersConnectivitySelected) {
      form.setValue("otherOptionMeansOfInternet", "", {
        shouldValidate: false,
      })
    }
  }, [isOthersConnectivitySelected, form])

  React.useImperativeHandle(ref, () => ({
    form,
  }))

  return (
    <form className="w-full">
      <Field>
        <FieldSet>
          <FieldLegend className="text-foreground font-semibold tracking-wide">
            Distance Learning Resources
          </FieldLegend>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Controller
                  name="technologyGadgets"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel className="text-foreground">
                          Technology Gadgets (Select all that apply):
                        </FieldLabel>
                        {GADGET_OPTIONS.map((optionGadgets) => (
                          <div
                            key={optionGadgets}
                            className="flex items-center space-y-1 space-x-4"
                          >
                            <Checkbox
                              id={optionGadgets}
                              className="cursor-pointer hover:bg-red-800"
                              checked={field.value?.includes(optionGadgets)}
                              onCheckedChange={(checked) => {
                                let newArray = Array.isArray(field.value)
                                  ? field.value
                                  : []
                                if (checked) {
                                  newArray = [...newArray, optionGadgets]
                                } else {
                                  newArray = newArray.filter(
                                    (val) => val !== optionGadgets
                                  )
                                }
                                field.onChange(newArray)
                              }}
                            />
                            <label
                              htmlFor={optionGadgets}
                              className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {optionGadgets}
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
                  name="otherOptionTechnologyGadgets"
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
                            isOthersGadgetSelected ? "Specify reason" : "N/A"
                          }
                          value={field.value ?? ""}
                          autoComplete="off"
                          disabled={!isOthersGadgetSelected}
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
                  name="meansOfInternet"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel className="text-foreground">
                          Means of Internet Connectivity (Select all that
                          apply):
                        </FieldLabel>

                        {INTERNET_CONNECTIVITY.map((connectivityOption) => (
                          <div
                            key={connectivityOption}
                            className="flex items-center space-y-1 space-x-4"
                          >
                            <Checkbox
                              id={connectivityOption}
                              className="hover:bg-secondary cursor-pointer"
                              checked={field.value?.includes(
                                connectivityOption
                              )}
                              onCheckedChange={(checked) => {
                                let newArray = Array.isArray(field.value)
                                  ? field.value
                                  : []
                                if (checked) {
                                  newArray = [...newArray, connectivityOption]
                                } else {
                                  newArray = newArray.filter(
                                    (val) => val !== connectivityOption
                                  )
                                }
                                field.onChange(newArray)
                              }}
                            />
                            <label
                              htmlFor={connectivityOption}
                              className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {connectivityOption}
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
                  name="otherOptionMeansOfInternet"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent className="mt-4.5">
                        <FieldLabel className="text-foreground">
                          If others, specify:
                        </FieldLabel>
                        <Input
                          {...field}
                          placeholder={
                            isOthersConnectivitySelected
                              ? "Specify reason"
                              : "N/A"
                          }
                          value={field.value ?? ""}
                          autoComplete="off"
                          disabled={!isOthersConnectivitySelected}
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

DistanceLearningASection.displayName = "DistanceLearningASection"
