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
import { distanceLearningSchema } from "@/lib/schemas"

export interface DistanceLearningBSectionRef {
  form: UseFormReturn<z.infer<typeof distanceLearningSchema>>
}

export const DistanceLearningBSection = React.forwardRef<
  DistanceLearningBSectionRef,
  object
>((props, ref) => {
  const form = useForm<z.infer<typeof distanceLearningSchema>>({
    resolver: zodResolver(distanceLearningSchema),
    mode: "onChange",
    defaultValues: {
      meansOfInternet: [],
      otherOptionMeansOfInternet: "",
      learningReadiness: undefined,
      learningSpace: "",
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
            Distance Learning Resources
          </FieldLegend>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="internetAccess"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Internet Access and Resources:
                      </FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue placeholder="Select Internet Access" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="No internet access">
                            No internet access
                          </SelectItem>
                          <SelectItem value="Limited internet access">
                            Limited internet access
                          </SelectItem>
                          <SelectItem value="Full internet access">
                            Full internet access
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
                name="learningReadiness"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Distance Learning Readiness:
                      </FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue placeholder="Select Readiness" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Fully ready">
                            Fully ready
                          </SelectItem>
                          <SelectItem value="Ready">Ready</SelectItem>
                          <SelectItem value="A little ready">
                            A little ready
                          </SelectItem>
                          <SelectItem value="Not ready">Not ready</SelectItem>
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
              name="learningSpace"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel className="text-foreground">
                      Learning Space:
                    </FieldLabel>
                    <Textarea
                      {...field}
                      placeholder="Describe your primary learning space (e.g., 'A dedicated, quiet corner in my room with a desk,etc)."
                      value={field.value ?? ""}
                      className="min-h-[190px]"
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

DistanceLearningBSection.displayName = "DistanceLearningBSection"
