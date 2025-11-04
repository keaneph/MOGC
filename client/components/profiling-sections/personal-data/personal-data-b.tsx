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
      religiousAffiliation: "",
      civilStatus: undefined,
      otherCivilStatus: "",
      noOfChildren: undefined,
      addressInIligan: "",
      contactNo: "",
      homeAddress: "",
      staysWith: undefined,
      workingStudent: undefined,
      talentsAndSkills: "",
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
            <div className="-mb-2 grid grid-cols-4 gap-4">
              <Controller
                name="religiousAffiliation"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Religious Affiliation:
                      </FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Catholic"
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
                          <SelectItem value="Not Legally Married">
                            Not Legally Married
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

              <Controller
                name="noOfChildren"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        No. of Children:
                      </FieldLabel>
                      <Input
                        {...field}
                        type="number"
                        value={field.value ?? ""}
                        placeholder="0"
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
                name="addressInIligan"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Address in Iligan:
                      </FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Tibanga"
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
                name="homeAddress"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Home Address:
                      </FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Tibanga, Iligan City"
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

            <div className="-mb-2 grid grid-cols-3 gap-4">
              <Controller
                name="contactNo"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Contact No:
                      </FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="09208737576"
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
                name="staysWith"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Stays With:
                      </FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue placeholder="Select stays with" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Parents/Guardians">
                            Parents/Guardians
                          </SelectItem>
                          <SelectItem value="Board/Room mates">
                            Board/Room mates
                          </SelectItem>
                          <SelectItem value="Relatives">Relatives</SelectItem>
                          <SelectItem value="Friends">Friends</SelectItem>
                          <SelectItem value="Employer">Employer</SelectItem>
                          <SelectItem value="Living on my own">
                            Living on my own
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
                name="workingStudent"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel className="text-foreground">
                        Working Student:
                      </FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes, full time">
                            Yes, full time
                          </SelectItem>
                          <SelectItem value="Yes, part time">
                            Yes, part time
                          </SelectItem>
                          <SelectItem value="No, but planning to work">
                            No, but planning to work
                          </SelectItem>
                          <SelectItem value="No, and have no plan to work">
                            No, and have no plan to work
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
              name="talentsAndSkills"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel className="text-foreground">
                      Talents and Skills:
                    </FieldLabel>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      placeholder="List your talents and skills"
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

PersonalDataBSection.displayName = "PersonalDataBSection"
