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
import { cn } from "@/lib/utils"
import * as React from "react"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, UseFormReturn } from "react-hook-form"
import { studentIndividualDataSchema } from "@/lib/schemas"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export interface PersonalDataBSectionRef {
  form: UseFormReturn<z.infer<typeof studentIndividualDataSchema>>
}

export const PersonalDataBSection = React.forwardRef<
  PersonalDataBSectionRef,
  object
>((props, ref) => {
  const form = useForm<z.infer<typeof studentIndividualDataSchema>>({
    resolver: zodResolver(studentIndividualDataSchema),
    mode: "onChange",
    defaultValues: {
      nickname: "",
      age: undefined,
      sex: undefined,
      citizenship: "",
      dateOfBirth: "",
      placeOfBirth: "",
      civilStatus: undefined,
      otherCivilStatus: "",
    },
  })

  // watch for changes to civilStatus and clear "other" field when "None" is selected
  const civilStatus = form.watch("civilStatus")
  React.useEffect(() => {
    if (civilStatus !== "Others") {
      form.setValue("otherCivilStatus", "", {
        shouldValidate: false,
      })
    }
  }, [civilStatus, form])

  React.useImperativeHandle(ref, () => ({
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
                name="nickname"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Nickname:
                      </FieldLabel>
                      <Input {...field} placeholder="Yan" autoComplete="off" />
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
                name="age"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">Age:</FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        type="number"
                        placeholder="18"
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
                name="sex"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">Sex:</FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue placeholder="Select sex" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
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
                name="citizenship"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Citizenship:
                      </FieldLabel>
                      <Input
                        {...field}
                        placeholder="Filipino"
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
                name="dateOfBirth"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Date of Birth:
                      </FieldLabel>
                      <Input
                        {...field}
                        placeholder="MM-DD-YYYY"
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
                name="placeOfBirth"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Place of Birth:
                      </FieldLabel>
                      <Input
                        {...field}
                        placeholder="City, Country"
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
                name="civilStatus"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Civil Status:
                      </FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="Married">Married</SelectItem>
                          <SelectItem value="Not legally married">
                            Not legally married
                          </SelectItem>
                          <SelectItem value="Separated">Separated</SelectItem>
                          <SelectItem value="Widowed">Widowed</SelectItem>
                          <SelectItem value="Others">Others</SelectItem>
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
                name="otherCivilStatus"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        If others, please specify:
                      </FieldLabel>
                      <Input
                        {...field}
                        placeholder="Specify civil status"
                        autoComplete="off"
                        disabled={form.watch("civilStatus") !== "Others"}
                        className={cn(
                          "transition-opacity",
                          form.watch("civilStatus") === "Others"
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
            </div>
          </FieldGroup>
        </FieldSet>
      </Field>
    </form>
  )
})

PersonalDataBSection.displayName = "PersonalDataBSection"
