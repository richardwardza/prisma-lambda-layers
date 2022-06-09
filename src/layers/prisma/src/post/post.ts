import { Prisma } from '@prisma/client';
import { prisma } from '../prismaClient';

export const addPost = async (postDetails: Prisma.PostCreateInput) => await prisma.post.create({ data: postDetails });
