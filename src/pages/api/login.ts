import { lucia } from "../../auth";
import { verify } from "@node-rs/argon2";
import { z } from "zod";

import type { APIContext } from "astro";
import { getUser } from "../../../actions/queries";

export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  const formSchema = z
    .object({
      email: z.string().email().min(5),
      password: z.string().min(8),
    })
    .safeParse({ email, password });

  if (!formSchema.success) {
    console.log(formSchema.error.issues);
    return new Response("Error incorrect data", { status: 400 });
  }
  const existingUser = await getUser(email as string);
  if (!existingUser) {
    // NOTE:
    // Returning immediately allows malicious actors to figure out valid usernames from response times,
    // allowing them to only focus on guessing passwords in brute-force attacks.
    // As a preventive measure, you may want to hash passwords even for invalid usernames.
    // However, valid usernames can be already be revealed with the signup page among other methods.
    // It will also be much more resource intensive.
    // Since protecting against this is non-trivial,
    // it is crucial your implementation is protected against brute-force attacks with login throttling etc.
    // If usernames are public, you may outright tell the user that the username is invalid.
    return new Response("Incorrect username or password", {
      status: 400,
    });
  }

  const validPassword = await verify(existingUser.password, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  if (!validPassword) {
    return new Response("Incorrect username or password", {
      status: 400,
    });
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  context.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return context.redirect("/");
}
