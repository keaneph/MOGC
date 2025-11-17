"use client"

import Image from "next/image"

import { zodResolver } from "@hookform/resolvers/zod"

import React, { useState } from "react"

import { Controller, useForm } from "react-hook-form"

import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { send } from "@/lib/email"
import { contactFormSchema } from "@/lib/schemas"

import celebrating from "@/public/celebrating.png"
import eureka from "@/public/eureka.png"
import mochi from "@/public/mochi.png"

interface ContactDrawerProps {
  trigger: React.ReactNode
}

export function ContactDrawer({ trigger }: ContactDrawerProps) {
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  const [submitted, setSubmitted] = useState(false)

  function onSubmit(data: z.infer<typeof contactFormSchema>) {
    setSubmitted(true)
    console.log(data)
    form.reset()
    send(data)

    // reset after 5 seconds
    setTimeout(() => {
      setSubmitted(false)
    }, 7000)
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle> </DrawerTitle>
        </DrawerHeader>

        <div className="flex justify-center px-4 pb-4">
          {submitted ? (
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="mb-2 text-2xl font-semibold text-green-600">
                  ✓ Message Sent!
                </div>
                <p className="text-muted-foreground">
                  Thank you for reaching out. We&apos;ll be in touch soon.
                </p>
                <Image
                  src={celebrating}
                  alt="Message Sent"
                  className="mx-auto w-66"
                />
              </div>
            </div>
          ) : (
            <div className="relative flex flex-col items-center justify-center">
              <Image
                src={mochi}
                alt="Mochi Thinking"
                className="absolute right-160 -bottom-10 w-40 transition-transform hover:scale-105"
              />
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full max-w-xl space-y-4"
              >
                <FieldSet>
                  <FieldLegend className="text-main text-center !text-xl font-bold">
                    Get in Touch
                  </FieldLegend>
                  <FieldDescription className="text-center">
                    Have questions or feedback? Fill out the form below to
                    contact our support team.
                  </FieldDescription>
                  <FieldSeparator />
                  <FieldGroup>
                    <Controller
                      name="name"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={fieldState.invalid}
                          orientation="responsive"
                        >
                          <FieldContent>
                            <FieldLabel htmlFor="firstName">Name</FieldLabel>
                            <FieldDescription>
                              Enter name or organization
                            </FieldDescription>
                          </FieldContent>
                          <div className="flex w-full flex-col">
                            <Input
                              {...field}
                              aria-invalid={fieldState.invalid}
                              placeholder="MOGC"
                              autoComplete="off"
                              className="min-w-[250px]"
                            />
                            {fieldState.invalid && (
                              <FieldError
                                className="text-[12px]"
                                errors={[fieldState.error]}
                              />
                            )}
                          </div>
                        </Field>
                      )}
                    />
                    <Controller
                      name="email"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={fieldState.invalid}
                          orientation="responsive"
                        >
                          <FieldContent>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <FieldDescription>
                              We&apos;ll use this to get back to you.
                            </FieldDescription>
                          </FieldContent>
                          <div className="flex w-full flex-col">
                            <Input
                              {...field}
                              id="email"
                              aria-invalid={fieldState.invalid}
                              placeholder="email@example.com"
                              className="min-w-[250px]"
                            />
                            {fieldState.invalid && (
                              <FieldError
                                className="text-[12px]"
                                errors={[fieldState.error]}
                              />
                            )}
                          </div>
                        </Field>
                      )}
                    />
                    <Controller
                      name="subject"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={fieldState.invalid}
                          orientation="responsive"
                        >
                          <FieldContent>
                            <FieldLabel htmlFor="subject">Subject</FieldLabel>
                            <FieldDescription>
                              What is this message about?
                            </FieldDescription>
                          </FieldContent>
                          <div className="flex w-full flex-col">
                            <Input
                              {...field}
                              id="subject"
                              aria-invalid={fieldState.invalid}
                              placeholder="Bug report"
                              className="min-w-[250px]"
                            />
                            {fieldState.invalid && (
                              <FieldError
                                className="text-[12px]"
                                errors={[fieldState.error]}
                              />
                            )}
                          </div>
                        </Field>
                      )}
                    />
                    <Controller
                      name="message"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={fieldState.invalid}
                          orientation="responsive"
                        >
                          <FieldContent>
                            <FieldLabel htmlFor="message">Message</FieldLabel>
                            <FieldDescription>
                              Describe your concern or feedback in detail.
                            </FieldDescription>
                          </FieldContent>
                          <div className="flex w-full flex-col">
                            <Textarea
                              {...field}
                              id="message"
                              aria-invalid={fieldState.invalid}
                              placeholder="Your message here..."
                              className="max-h-[50px] min-w-[300px] resize-none"
                            />
                            {fieldState.invalid && (
                              <FieldError
                                className="text-[12px]"
                                errors={[fieldState.error]}
                              />
                            )}
                          </div>
                        </Field>
                      )}
                    />

                    <Field orientation="responsive" className="flex flex-wrap">
                      <Button
                        type="submit"
                        className="bg-main hover:bg-main/90 flex-1 cursor-pointer"
                      >
                        Send Message
                      </Button>
                      <DrawerClose asChild>
                        <Button
                          variant="outline"
                          className="flex-1 cursor-pointer bg-transparent"
                        >
                          Cancel
                        </Button>
                      </DrawerClose>
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </form>
              <Image
                src={eureka}
                alt="Thinking"
                className="absolute -bottom-15 left-160 w-55 transition-transform hover:scale-105"
              />
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
