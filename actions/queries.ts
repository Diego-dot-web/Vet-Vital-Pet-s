import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const createUser = async (userData) => {
  try {
    await prisma.user.create({
      data: {
        ...userData,
      },
    });
  } catch (e) {
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

export const addRefreshToken = async (email: string, token: string) => {
  await prisma.account.update({
    where: { email },
    data: { refresh_token: token },
  });
};

export const getRefreshToken = async (email: string) => {
  return await prisma.account.findUnique({ where: { email } });
};

export const addGeneralRefreshToken = async (token: string) => {
  try {
    await prisma.refreshTokens.create({ token });
  } catch (error: any) {
    throw new Error(error);
  }
};
