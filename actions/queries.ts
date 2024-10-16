import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

type UserData = {
  id: string;
  username: string;
  email: string;
  password: string;
};

export const createUser = async (userData: UserData) => {
  try {
    await prisma.user.create({
      data: {
        ...userData,
      },
    });
  } catch (e: any) {
    throw new Error(e);
  }
};

export const getUser = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  } catch (error) {
    throw new Error("Failed to fetch");
  }
};

export const addGeneralRefreshToken = async (token: string) => {
  try {
    await prisma.refreshTokens.create({ data: { token } });
  } catch (error: any) {
    throw new Error(error);
  }
};
