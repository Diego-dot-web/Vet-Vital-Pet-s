import type { APIContext } from "astro";
import { transporter } from "../../../actions/vetController.ts";

const errors = { username: "", email: "", tel: "", service: "", message: "" };

export async function POST(context: APIContext) {
  try {
    const data = await context.request.formData();
    const name = data.get("nombre");
    const email = data.get("email");
    const message = data.get("mensaje");
    const tel = data.get("telefono");

    const hasErrors = Object.values(errors).some((msg) => msg);
    if (!hasErrors) {
      //send message to the email
      try {
        const mailData = {
          from: import.meta.env.EMAIL,
          to: "sugo4354@gmail.com",
          subject: "Contacto Next",
          text: `Hola ${name} ${email} ${tel} ${message} `,
        };

        await transporter.sendMail(mailData);
        context.redirect("/contact");
      } catch (error: any) {
        throw new Error(error);
      }
    }
    return context.redirect("/contact");
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
}
