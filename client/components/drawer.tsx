"use client"

import * as React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
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
  FieldTitle,
} from "@/components/ui/field"

interface ContactDrawerProps {
  trigger: React.ReactNode
}

export function ContactDrawer({ trigger }: ContactDrawerProps ) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    setSubmitted(true)

    // reset form after 5 seconds
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" })
      setSubmitted(false)
    }, 5000)
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {trigger}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-xl sr-only">Get in Touch</DrawerTitle>
          <DrawerDescription className="sr-only">We&apos;ll get back to you as soon as possible.</DrawerDescription>
        </DrawerHeader>

        <div className="px-4 pb-4 flex justify-center">
          {submitted ? (
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-semibold text-green-600 mb-2">✓ Message Sent!</div>
                <p className="text-muted-foreground">Thank you for reaching out. We&apos;ll be in touch soon.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-xl">
              <FieldSet>
                <FieldLegend className="text-center">Get in Touch</FieldLegend>
                <FieldDescription className="text-center">
                  Have questions or feedback? Fill out the form below to contact our support team.
                </FieldDescription>
                <FieldSeparator />

                <FieldGroup>
                  {/* name */}
                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="firstName">Name</FieldLabel>
                      <FieldDescription>
                        Enter name or organization
                      </FieldDescription>
                    </FieldContent>
                    <Input
                      id="Name"
                      name="Name"
                      placeholder="MOGC"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Field>

                  {/* email */}
                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <FieldDescription>
                        We’ll use this to get back to you.
                      </FieldDescription>
                    </FieldContent>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Field>

                  {/* subject */}
                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="subject">Subject</FieldLabel>
                      <FieldDescription>
                        What is this message about?
                      </FieldDescription>
                    </FieldContent>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Bug report"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </Field>

                  {/* message */}
                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel htmlFor="message">Message</FieldLabel>
                      <FieldDescription>
                        Describe your concern or feedback in detail.
                      </FieldDescription>
                    </FieldContent>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Your message here..."
                      value={formData.message}
                      onChange={handleChange}
                      className="max-h-[50px] resize-none sm:max-w-[300px]"
                      required
                    />
                  </Field>

                  {/* buttons */}
                  <Field orientation="responsive" className="flex flex-wrap">
                    <Button
                      type="submit"
                      className="cursor-pointer flex-1 bg-main hover:bg-main/90"
                    >
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
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}