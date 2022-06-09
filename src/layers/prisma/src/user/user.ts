import { prisma } from '../prismaClient';
import { CreateUserData } from "@shared/types/user";

export const createUser = async (userDetails: CreateUserData) => {
  return await prisma.user.create({
    data: userDetails,
  });
};

export const users = async () => await prisma.user.findMany();
