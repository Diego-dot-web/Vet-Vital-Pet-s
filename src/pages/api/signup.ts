// pages/api/signup.ts
import { lucia } from "../../auth";
import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { z } from "zod";

import type { APIContext } from "astro";
import { createUser } from "../../../actions/queries";

export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData();
  const email = formData.get("email");
  const username = formData.get("username");
  const password = formData.get("password");
  // username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
  // keep in mind some database (e.g. mysql) are case insensitive
  const formSchema = z
    .object({
      username: z.string().min(3).max(31),
      email: z.string().email().min(5),
      password: z.string().min(8),
    })
    .safeParse({ username, email, password });

  if (!formSchema.success) {
    console.log(formSchema.error.issues);
    return new Response("Data invalid", { status: 400 });
  }

  const userId = generateIdFromEntropySize(10); // 16 characters long
  const passwordHash = await hash(password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  // TODO: check if username is already used
  await createUser({ id: userId, email, password: passwordHash, username });

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  context.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return context.redirect("/");
}
