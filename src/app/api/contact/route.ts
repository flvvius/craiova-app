import { NextResponse } from "next/server";
import { createTransport } from "nodemailer";
import type { Transporter, SendMailOptions } from "nodemailer";
import { auth } from "@clerk/nextjs/server";

interface ContactFormData {
  name: string;
  message: string;
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "You must be logged in to send a message" },
        { status: 401 },
      );
    }

    const { name, message } = (await request.json()) as ContactFormData;
    const userEmail = request.headers.get("x-user-email");

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 },
      );
    }

    const transporter = createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    }) as Transporter;

    const mailOptions: SendMailOptions = {
      from: process.env.EMAIL_USER,
      to: "dicaancax@gmail.com",
      subject: `New Contact Form Submission from ${name}`,
      text: `
Name: ${name}
Email: ${userEmail}
Message: ${message}
      `,
      html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${userEmail}</p>
<p><strong>Message:</strong></p>
<p>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error: unknown) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
