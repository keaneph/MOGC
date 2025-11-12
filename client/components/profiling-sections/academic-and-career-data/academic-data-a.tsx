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
import { academicDataSchema } from "@/lib/schemas"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export interface AcademicDataASectionRef {
  form: UseFormReturn<z.infer<typeof academicDataSchema>>
}

export const AcademicDataASection = React.forwardRef<
  AcademicDataASectionRef,
  object
>((props, ref) => {
  const form = useForm<z.infer<typeof academicDataSchema>>({
    resolver: zodResolver(academicDataSchema),
    mode: "onChange",
    defaultValues: {
      generalPointAverage: "",
      scholar: undefined,
      scholarDetails: "",
      lastSchoolAttended: "",
      lastSchoolAddress: "",
      shsTrack: undefined,
      shsStrand: undefined,
      awards: "",
    },
  })

  const scholar = form.watch("scholar")
  React.useEffect(() => {
    if (scholar !== "Yes") {
      form.setValue("scholarDetails", "", { shouldValidate: false })
    }
  }, [scholar, form])

  React.useImperativeHandle(ref, () => ({
    form,
  }))

  return (
    <form className="w-full">
      <Field>
        <FieldSet>
          <FieldLegend className="text-foreground font-semibold tracking-wide">
            Academic Data
          </FieldLegend>
          <FieldGroup>
            <div className="-mb-2 grid grid-cols-3 gap-4">
              <Controller
                name="generalPointAverage"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        General Point Average
                      </FieldLabel>
                      <Input
                        {...field}
                        placeholder="1.00"
                        autoComplete="off"
                        value={field.value ?? ""}
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
                name="scholar"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Are you a Scholar?
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
                name="scholarDetails"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        if Yes, please specify
                      </FieldLabel>
                      <Input
                        {...field}
                        placeholder="Specify scholarship type"
                        value={field.value ?? ""}
                        disabled={scholar !== "Yes"}
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
            <div className="-mb-2 grid grid-cols-2 gap-4">
              <Controller
                name="lastSchoolAttended"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Last School Attended
                      </FieldLabel>
                      <Input
                        {...field}
                        placeholder="Philippine Science High School - NMCLDN"
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
                name="lastSchoolAddress"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        School Address
                      </FieldLabel>
                      <Input
                        {...field}
                        placeholder="Balo-i, Lanao del Norte"
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
                name="shsTrack"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        SHS Track
                      </FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue placeholder="Select SHS Track" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Academic">Academic</SelectItem>
                          <SelectItem value="Tech-Voc">Tech-Voc</SelectItem>
                          <SelectItem value="Arts/Design">
                            Arts/Design
                          </SelectItem>
                          <SelectItem value="Sports">Sports</SelectItem>
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
                name="shsStrand"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        SHS Strand
                      </FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue placeholder="Select SHS Strand" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GA">GA</SelectItem>
                          <SelectItem value="STEM">STEM</SelectItem>
                          <SelectItem value="ABM">ABM</SelectItem>
                          <SelectItem value="HUMSS">HUMSS</SelectItem>
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
              name="awards"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel className="text-foreground">
                      Awards/Honors
                    </FieldLabel>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      placeholder="With High Honors, 1st place in Science Fair, etc."
                      className="min-h-[35.5px]"
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

AcademicDataASection.displayName = "AcademicDataASection"
