import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { userUpdateSchema } from '../schemas/main-schemas';
type UserUpdateData = z.infer<typeof userUpdateSchema>;
import { UnauthorizedError } from '../utils/errors';
import { AuthenticationError } from '../utils/errors';


import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config'

const prisma = new PrismaClient();

export async function getUserCommentsService(userId: string) {
    const userExists = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!userExists) {
        throw new Error("User not found");
    }

    const comments = await prisma.comment.findMany({
        where: {
            userId: userId
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                }
            }
        }
    });

    return comments;
}
export async function getUserLikesService(userId: string) {

    const userExists = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!userExists) {
        throw new Error("User not found");

    }

    const likes = await prisma.like.findMany({
        where: {
            userId: userId
        },
        include: {

            post: {
                select: {
                    id: true,
                    title: true,
                    content: true,
                }
            },
            comment: {
                select: {
                    id: true,
                    content: true,
                }
            },
        }
    });

    return likes
}
export async function getUserPostsService(userId: string) {

    const userExists = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!userExists) {
        throw new Error("User not found");
    }

    const posts = await prisma.post.findMany({
        where: {
            authorId: userId
        },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    photo: true,
                }
            },
            comments: true,
            likes: true
        }
    });

    return posts
}
export async function getUserService(id: string) {

    const user = await prisma.user.findUnique({
        where: {
            id: id
        },
        omit: {
            password: true
        }
    });

    if (!user) {
        throw new Error("User not found")

    }

    return user
}
export async function patchUserService(id: string, dataToUpdate: UserUpdateData, userId: string) {

    if (id !== userId) {
        throw new UnauthorizedError("You do not have permission to update this user's account");
    }

    if (dataToUpdate.password) {
        const hashedPassword = await bcryptjs.hash(dataToUpdate.password, 10);
        dataToUpdate.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
        where: { id: id },
        data: dataToUpdate,
        select: {
            id: true,
            name: true,
            email: true,
            photo: true,
        }
    });

    return updatedUser
}
export async function deleteUserService(id: string, userId: string) {
    if (id !== userId) {
        throw new UnauthorizedError("You do not have permission to delete this user's account");
    }

    const userDelete = await prisma.user.delete({
        where: {
            id: id
        }
    });

    return userDelete
}
export async function getUserReadService() {
    const getUsers = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            photo: true,
            createdAt: true
        }
    })

    return getUsers
}
export async function postCreatUserService(dataUser: any) {
    const hashedPassword = await bcryptjs.hash(dataUser.password, 10)

    const createUser = await prisma.user.create({
        data: {
            name: dataUser.name,
            email: dataUser.email,
            password: hashedPassword,
            photo: dataUser.photo
        }
    })

    return createUser
}
export async function postAcessLoginService(dataLogin: any) {
    const user = await prisma.user.findUnique({
        where: {
            email: dataLogin.email
        }
    });

    if (!user) {
        throw new AuthenticationError("Invalid email or password")

    }

    const passwordMatch = await bcryptjs.compare(dataLogin.password, user.password);

    if (!passwordMatch) {
        throw new AuthenticationError("Invalid email or password")
    }

    const payload = {
        id: user.id
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });

    return token
}


