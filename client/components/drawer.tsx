"use client"

import * as React from "react"
import Image from "next/image";
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
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

import celebrating from "@/public/celebrating.png"
import eureka from "@/public/eureka.png"
import mochi from "@/public/mochi.png"
import { contactFormSchema } from "@/lib/schemas"
import { send } from "@/lib/email"

interface ContactDrawerProps {
  trigger: React.ReactNode
}

export function ContactDrawer({ trigger }: ContactDrawerProps ) {

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
      <DrawerTrigger asChild>
        {trigger}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle> </DrawerTitle>
        </DrawerHeader>

        <div className="px-4 pb-4 flex justify-center">
          {submitted ? (
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-semibold text-green-600 mb-2">✓ Message Sent!</div>
                <p className="text-muted-foreground">Thank you for reaching out. We&apos;ll be in touch soon.</p>
                <Image src={celebrating} alt="Message Sent" className="mx-auto w-66" />
              </div>
            </div>
          ) : (    
            <div className="relative flex flex-col items-center justify-center">
                <Image src={mochi} alt="Mochi Thinking" className="absolute -bottom-10 right-160 w-40 transition-transform hover:scale-105" />
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full max-w-xl">
                  <FieldSet>
                      <FieldLegend className="text-center font-bold text-main !text-xl">Get in Touch</FieldLegend>
                      <FieldDescription className="text-center ">
                          Have questions or feedback? Fill out the form below to contact our support team.
                      </FieldDescription>
                      <FieldSeparator />
                      <FieldGroup>
                          <Controller
                              name="name"
                              control={form.control}
                              render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid} orientation="responsive">
                                  <FieldContent>
                                      <FieldLabel htmlFor="firstName">
                                          Name
                                      </FieldLabel>
                                      <FieldDescription>
                                          Enter name or organization
                                      </FieldDescription>
                                  </FieldContent>
                                  <div className="flex flex-col w-full">
                                    <Input
                                        {...field}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="MOGC"
                                        autoComplete="off"
                                        className="min-w-[250px]"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                  </div>
                              </Field>
                              )}
                          />
                          <Controller
                              name="email"
                              control={form.control}
                              render={({ field, fieldState }) => (
                                  <Field data-invalid={fieldState.invalid} orientation="responsive">
                                      <FieldContent>
                                          <FieldLabel htmlFor="email">
                                              Email
                                          </FieldLabel>
                                          <FieldDescription>
                                              We&apos;ll use this to get back to you.
                                          </FieldDescription>
                                      </FieldContent>
                                      <div className="flex flex-col w-full">
                                        <Input
                                            {...field}
                                            id="email"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="email@example.com"
                                            className="min-w-[250px]"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                      </div>
                                  </Field>
                              )}
                          />
                          <Controller
                              name="subject"
                              control={form.control}
                              render={({ field, fieldState }) => (
                                  <Field data-invalid={fieldState.invalid} orientation="responsive">
                                      <FieldContent>
                                          <FieldLabel htmlFor="subject">
                                              Subject
                                          </FieldLabel>
                                          <FieldDescription>
                                              What is this message about?
                                          </FieldDescription>
                                      </FieldContent>
                                      <div className="flex flex-col w-full">
                                        <Input
                                            {...field}
                                            id="subject"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Bug report"
                                            className="min-w-[250px]"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                      </div>
                                  </Field>
                              )}
                          />
                          <Controller
                              name="message"
                              control={form.control}
                              render={({ field, fieldState }) => (
                                  <Field data-invalid={fieldState.invalid} orientation="responsive">
                                      <FieldContent>
                                      <FieldLabel htmlFor="message">Message</FieldLabel>
                                      <FieldDescription>
                                          Describe your concern or feedback in detail.
                                      </FieldDescription>
                                      </FieldContent>
                                      <div className="flex flex-col w-full">
                                        <Textarea
                                            {...field}
                                            id="message"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Your message here..."
                                            className="max-h-[50px] resize-none min-w-[300px]"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                      </div>
                                  </Field>
                              )}
                          />

                          <Field orientation="responsive" className="flex flex-wrap">
                              <Button type="submit" className="cursor-pointer flex-1 bg-main hover:bg-main/90">
                                  Send Message
                              </Button>
                              <DrawerClose asChild>
                              <Button variant="outline" className="cursor-pointer flex-1 bg-transparent">
                                  Cancel
                              </Button>
                              </DrawerClose>
                          </Field>
                      </FieldGroup>
                  </FieldSet>
              </form>
              <Image src={eureka} alt="Thinking" className="absolute -bottom-15 left-160 w-55 transition-transform hover:scale-105" />
            </div>
          )}   
        </div>
      </DrawerContent>
    </Drawer>
  )
}