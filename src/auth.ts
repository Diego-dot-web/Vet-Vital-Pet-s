import { Lucia } from "lucia";
import { prisma } from "../actions/queries";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: import.meta.env.PROD,
    },
  },

  getUserAttributes: (attributes: any) => {
    return { username: attributes.username };
  },
});

declare module "lucia" {
  interface register {
    Lucia: typeof lucia;
    DataUserAttributes: DataUserAttributes;
  }
}

interface DataUserAttributes {
  username: string;
}
