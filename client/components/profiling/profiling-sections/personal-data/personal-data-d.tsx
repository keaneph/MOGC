"use client"

import { zodResolver } from "@hookform/resolvers/zod"

import React, { forwardRef, useEffect, useImperativeHandle } from "react"

import { Controller, useForm, UseFormReturn } from "react-hook-form"

import * as z from "zod"

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

import { studentIndividualDataSchema } from "@/lib/schemas"
import { cn } from "@/lib/utils"

export interface PersonalDataDSectionRef {
  form: UseFormReturn<z.infer<typeof studentIndividualDataSchema>>
}

export const PersonalDataDSection = forwardRef<PersonalDataDSectionRef, object>(
  (props, ref) => {
    const form = useForm<z.infer<typeof studentIndividualDataSchema>>({
      resolver: zodResolver(studentIndividualDataSchema),
      mode: "onChange",
      defaultValues: {
        leisureAndRecreationalActivities: "",
        seriousMedicalCondition: "None",
        otherSeriousMedicalCondition: "",
        physicalDisability: "None",
        otherPhysicalDisability: "",
        genderIdentity: undefined,
        sexualAttraction: undefined,
      },
    })

    // watch for changes to seriousMedicalCondition and clear "other" field when "None" is selected
    const seriousMedicalCondition = form.watch("seriousMedicalCondition")
    useEffect(() => {
      if (seriousMedicalCondition === "None") {
        form.setValue("otherSeriousMedicalCondition", "", {
          shouldValidate: false,
        })
      }
    }, [seriousMedicalCondition, form])

    // watch for changes to physicalDisability and clear "other" field when "None" is selected
    const physicalDisability = form.watch("physicalDisability")
    useEffect(() => {
      if (physicalDisability === "None") {
        form.setValue("otherPhysicalDisability", "", { shouldValidate: false })
      }
    }, [physicalDisability, form])

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
                  name="seriousMedicalCondition"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel className="text-foreground">
                          Serious Medical Condition:
                        </FieldLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ""}
                        >
                          <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="None" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="None">None</SelectItem>
                            <SelectItem value="Existing">Existing</SelectItem>
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
                  name="otherSeriousMedicalCondition"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel className="text-foreground">
                          If existing, please specify:
                        </FieldLabel>
                        <Input
                          {...field}
                          placeholder="Specify medical condition"
                          autoComplete="off"
                          disabled={
                            form.watch("seriousMedicalCondition") !== "Existing"
                          }
                          className={cn(
                            "transition-opacity",
                            form.watch("seriousMedicalCondition") === "Existing"
                              ? "opacity-100"
                              : "opacity-50"
                          )}
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
                  name="physicalDisability"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel className="text-foreground">
                          Physical Disability:
                        </FieldLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ""}
                        >
                          <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="None" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="None">None</SelectItem>
                            <SelectItem value="Existing">Existing</SelectItem>
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
                  name="otherPhysicalDisability"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel className="text-foreground">
                          If existing, please specify:
                        </FieldLabel>
                        <Input
                          {...field}
                          placeholder="Specify physical disability"
                          autoComplete="off"
                          disabled={
                            form.watch("physicalDisability") !== "Existing"
                          }
                          className={cn(
                            "transition-opacity",
                            form.watch("physicalDisability") === "Existing"
                              ? "opacity-100"
                              : "opacity-50"
                          )}
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
                  name="genderIdentity"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel className="text-foreground">
                          Gender Identity:
                        </FieldLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ""}
                        >
                          <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Select identity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male/Man">Male/Man</SelectItem>
                            <SelectItem value="Female/Woman">
                              Female/Woman
                            </SelectItem>
                            <SelectItem value="Transgender Male/Man">
                              Transgender Male/Man
                            </SelectItem>
                            <SelectItem value="Transgender Female/Woman">
                              Transgender Female/Woman
                            </SelectItem>
                            <SelectItem value="Gender Variant/Nonconforming">
                              Gender Variant/Nonconforming
                            </SelectItem>
                            <SelectItem value="Not listed">
                              Not listed
                            </SelectItem>
                            <SelectItem value="Prefer not to answer">
                              Prefer not to answer
                            </SelectItem>
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
                  name="sexualAttraction"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <FieldLabel className="text-foreground">
                          To whom are you attracted to?
                        </FieldLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ""}
                        >
                          <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Select attraction" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="My same gender">
                              My same gender
                            </SelectItem>
                            <SelectItem value="Opposite my gender">
                              Opposite my gender
                            </SelectItem>
                            <SelectItem value="Both men and women">
                              Both men and women
                            </SelectItem>
                            <SelectItem value="All genders">
                              All genders
                            </SelectItem>
                            <SelectItem value="Neither gender">
                              Neither gender
                            </SelectItem>
                            <SelectItem value="Prefer not to answer">
                              Prefer not to answer
                            </SelectItem>
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
              <Controller
                name="leisureAndRecreationalActivities"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Leisure and Recreational Activities:
                      </FieldLabel>
                      <Textarea
                        className="min-h-[35.5px]"
                        {...field}
                        value={field.value ?? ""}
                        placeholder="List your leisure and recreational activities"
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
  }
)

PersonalDataDSection.displayName = "PersonalDataDSection"
