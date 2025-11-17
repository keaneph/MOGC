"use client"

import { zodResolver } from "@hookform/resolvers/zod"

import React, { forwardRef, useImperativeHandle } from "react"

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
import { Textarea } from "@/components/ui/textarea"

import { familyDataSchema } from "@/lib/schemas"

export interface FamilyDataCSectionRef {
  form: UseFormReturn<z.infer<typeof familyDataSchema>>
}

export const FamilyDataCSection = forwardRef<FamilyDataCSectionRef, object>(
  (props, ref) => {
    const form = useForm<z.infer<typeof familyDataSchema>>({
      resolver: zodResolver(familyDataSchema),
      mode: "onChange",
      defaultValues: {
        describeEnvironment: "",
      },
    })

    useImperativeHandle(ref, () => ({
      form,
    }))

    return (
      <form className="w-full">
        <Field>
          <FieldSet>
            <FieldLegend className="text-foreground font-semibold tracking-wide">
              Family Data
            </FieldLegend>
            <FieldGroup>
              <Controller
                name="describeEnvironment"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Describe your home environment:
                      </FieldLabel>
                      <Textarea
                        className="min-h-[280px]"
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Describe your home environment..."
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

FamilyDataCSection.displayName = "FamilyDataCSection"
