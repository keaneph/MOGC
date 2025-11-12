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
import * as React from "react"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, UseFormReturn } from "react-hook-form"
import { familyDataSchema } from "@/lib/schemas"
import { Textarea } from "@/components/ui/textarea"

export interface FamilyDataCSectionRef {
  form: UseFormReturn<z.infer<typeof familyDataSchema>>
}

export const FamilyDataCSection = React.forwardRef<
  FamilyDataCSectionRef,
  object
>((props, ref) => {
  const form = useForm<z.infer<typeof familyDataSchema>>({
    resolver: zodResolver(familyDataSchema),
    mode: "onChange",
    defaultValues: {
      describeEnvironment: "",
    },
  })

  React.useImperativeHandle(ref, () => ({
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
})

FamilyDataCSection.displayName = "FamilyDataCSection"
