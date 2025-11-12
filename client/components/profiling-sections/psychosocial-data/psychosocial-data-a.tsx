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
import { Textarea } from "@/components/ui/textarea"
import * as React from "react"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, UseFormReturn } from "react-hook-form"
import { psychosocialDataSchema } from "@/lib/schemas"

export interface PsychosocialDataASectionRef {
  form: UseFormReturn<z.infer<typeof psychosocialDataSchema>>
}

export const PsychosocialDataASection = React.forwardRef<
  PsychosocialDataASectionRef,
  object
>((props, ref) => {
  const form = useForm<z.infer<typeof psychosocialDataSchema>>({
    resolver: zodResolver(psychosocialDataSchema),
    mode: "onChange",
    defaultValues: {
      personalCharacteristics: "",
      copingMechanismBadDay: "",
      hadCounseling: undefined,
      seekProfessionalHelp: undefined,
      perceiveMentalHealth: "",
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
            Data on Psychosocial Well-Being
          </FieldLegend>
          <FieldGroup>
            <div className="-mb-2 grid grid-cols-2 gap-4">
              <Controller
                name="personalCharacteristics"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        What are some characteristics of your personality?:
                      </FieldLabel>
                      <Input
                        {...field}
                        placeholder="List all characteristics"
                        value={field.value ?? ""}
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
              <Controller
                name="copingMechanismBadDay"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        How do you usually deal with a bad day?
                      </FieldLabel>
                      <Textarea
                        className="min-h-[35.5px]"
                        {...field}
                        value={field.value ?? ""}
                        placeholder="List your coping mechanism during bad day"
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
            <FieldLegend className="text-foreground font-semibold tracking-wide">
              Have you experienced:
            </FieldLegend>
            <div className="-mt-10 -mb-2 grid grid-cols-2 gap-4">
              <Controller
                name="hadCounseling"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Counseling before?
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
                name="seekProfessionalHelp"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Seeking help from a psychologist/psychiatrist?
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
            </div>
            <Controller
              name="perceiveMentalHealth"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel className="text-foreground">
                      How do you perceive your mental health at present?
                    </FieldLabel>
                    <Textarea
                      className="min-h-[80px]"
                      {...field}
                      value={field.value ?? ""}
                      placeholder="Describe your current state (e.g., 'Very well,' 'Neutral,' or 'Struggling') and briefly explain why."
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

PsychosocialDataASection.displayName = "PsychosocialDataASection"
