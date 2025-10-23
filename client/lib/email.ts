"use server"

import { z } from "zod"
import { contactFormSchema } from "./schemas"
import { Resend } from "resend"

const resend = new Resend("re_ebE3WYb5_JqNHMTRgEsHGFapEJLsARhV9")

export const send = async (data: z.infer<typeof contactFormSchema>) => {
  try {
    const validated = contactFormSchema.parse(data)

    console.log("Sending contact form data:", validated)

    const response = await resend.emails.send({
      from: "MSU-IIT OGC Contact Form <onboarding@resend.dev>",
      to: "nearpharelle@gmail.com",
      subject: `New Message from ${validated.name}`,
      html: `
        <h3>New contact form submission</h3>
        <p><strong>Name:</strong> ${validated.name}</p>
        <p><strong>Email:</strong> ${validated.email}</p>
        <p><strong>Subject:</strong> ${validated.subject}</p>
        <p><strong>Message:</strong><br>${validated.message}</p>
      `,
    })

    console.log("Email sent successfully:", response)
    return { success: true }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error: String(error) }
  }
}



