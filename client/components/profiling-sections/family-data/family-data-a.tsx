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

export interface FamilyDataASectionRef {
  form: UseFormReturn<z.infer<typeof familyDataSchema>>
}

export const FamilyDataASection = React.forwardRef<
  FamilyDataASectionRef,
  object
>((props, ref) => {
  const form = useForm<z.infer<typeof familyDataSchema>>({
    resolver: zodResolver(familyDataSchema),
    mode: "onChange",
    defaultValues: {
      fathersName: "",
      fathersStatus: undefined,
      fathersOccupation: "",
      fathersContactNo: "",
      mothersName: "",
      mothersStatus: undefined,
      mothersOccupation: "",
      mothersContactNo: "",
      parentsMaritalStatus: undefined,
      familyMonthlyIncome: undefined,
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
            <div className="-mb-2 grid grid-cols-2 gap-4">
              <Controller
                name="fathersName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Father&apos;s Name:
                      </FieldLabel>
                      <Input
                        {...field}
                        placeholder="Juan Dela Cruz"
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
                name="fathersStatus"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Father&apos;s Status:
                      </FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Living">Living</SelectItem>
                          <SelectItem value="Deceased">Deceased</SelectItem>
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
                name="fathersOccupation"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Father&apos;s Occupation:
                      </FieldLabel>
                      <Input
                        {...field}
                        placeholder="Teacher"
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
                name="fathersContactNo"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Father&apos;s Contact No.:
                      </FieldLabel>
                      <Input
                        {...field}
                        placeholder="09171234567"
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
                name="mothersName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Mother&apos;s Name:
                      </FieldLabel>
                      <Input
                        {...field}
                        placeholder="Juanita Dela Cruz"
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
                name="mothersStatus"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Mother&apos;s Status:
                      </FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Living">Living</SelectItem>
                          <SelectItem value="Deceased">Deceased</SelectItem>
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
                name="mothersOccupation"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Mother&apos;s Occupation:
                      </FieldLabel>
                      <Input
                        {...field}
                        placeholder="Doctor"
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
                name="mothersContactNo"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Mother&apos;s Contact No.:
                      </FieldLabel>
                      <Input
                        {...field}
                        placeholder="09171234567"
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
                name="parentsMaritalStatus"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Parents&apos; Marital Status:
                      </FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Married">Married</SelectItem>
                          <SelectItem value="Not legally married">
                            Not legally married
                          </SelectItem>
                          <SelectItem value="Separated">Separated</SelectItem>
                          <SelectItem value="Both parents remarried">
                            Both parents remarried
                          </SelectItem>
                          <SelectItem value="One parent remarried">
                            One parent remarried
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
                name="familyMonthlyIncome"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Family Monthly Income:
                      </FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue placeholder="Select monthly income" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Below 3,000">
                            Below 3,000
                          </SelectItem>
                          <SelectItem value="3,001-5,000">
                            3,001-5,000
                          </SelectItem>
                          <SelectItem value="5,001-8,000">
                            5,001-8,000
                          </SelectItem>
                          <SelectItem value="8,001-10,000">
                            8,001-10,000
                          </SelectItem>
                          <SelectItem value="10,001-15,000">
                            10,001-15,000
                          </SelectItem>
                          <SelectItem value="15,001-20,000">
                            15,001-20,000
                          </SelectItem>
                          <SelectItem value="Above 20,001">
                            Above 20,001
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
          </FieldGroup>
        </FieldSet>
      </Field>
    </form>
  )
})

FamilyDataASection.displayName = "FamilyDataASection"
