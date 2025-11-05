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
import * as React from "react"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, UseFormReturn } from "react-hook-form"
import { familyDataSchema } from "@/lib/schemas"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export interface FamilyDataBSectionRef {
  form: UseFormReturn<z.infer<typeof familyDataSchema>>
}

export const FamilyDataBSection = React.forwardRef<
  FamilyDataBSectionRef,
  object
>((props, ref) => {
  const form = useForm<z.infer<typeof familyDataSchema>>({
    resolver: zodResolver(familyDataSchema),
    mode: "onChange",
    defaultValues: {
      guardianName: "",
      guardianOccupation: "",
      guardianContactNo: "",
      relationshipWithGuardian: "",
      ordinalPosition: undefined,
      noOfSiblings: undefined,
      describeEnvironment: "",
    },
  })

  React.useImperativeHandle(ref, () => ({
    form,
  }))

  const ordinalPosition = form.watch("ordinalPosition")
  React.useEffect(() => {
    if (ordinalPosition === "Only Child") {
      form.setValue("noOfSiblings", 0, { shouldValidate: false })
    }
  }, [ordinalPosition, form])

  return (
    <form className="w-full">
      <Field>
        <FieldSet>
          <FieldLegend className="text-foreground font-semibold tracking-wide">
            Family Data
          </FieldLegend>
          <FieldGroup>
            <div className="-mb-2 grid grid-cols-3 gap-4">
              <Controller
                name="guardianName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Guardian&apos;s Name:
                      </FieldLabel>
                      <Input
                        {...field}
                        placeholder="Pedro Santos"
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
                name="guardianOccupation"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Guardian&apos;s Occupation:
                      </FieldLabel>
                      <Input
                        {...field}
                        placeholder="Engineer"
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
                name="guardianContactNo"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Guardian&apos;s Contact No:
                      </FieldLabel>
                      <Input
                        {...field}
                        placeholder="09171234567"
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
                name="relationshipWithGuardian"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Relationship with Guardian:
                      </FieldLabel>
                      <Input
                        {...field}
                        placeholder="Grandmother"
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
                name="ordinalPosition"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Ordinal Position:
                      </FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Only Child">Only Child</SelectItem>
                          <SelectItem value="Eldest">Eldest</SelectItem>
                          <SelectItem value="Middle">Middle</SelectItem>
                          <SelectItem value="Youngest">Youngest</SelectItem>
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
                name="noOfSiblings"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        No. of Siblings:
                      </FieldLabel>
                      <Input
                        {...field}
                        type="number"
                        placeholder="0"
                        value={field.value ?? ""}
                        disabled={
                          form.watch("ordinalPosition") === "Only Child"
                        }
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

FamilyDataBSection.displayName = "FamilyDataBSection"
