import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail() {
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "kakkirenivishwas@gmail.com",
      subject: "Hello World",
      html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
    });
    console.log("Email sent successfully:", data);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

sendEmail();
