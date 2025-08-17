//Import de dependencias
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config'
//import de utils
import { UnauthorizedError } from '../utils/errors';
import { AuthenticationError } from '../utils/errors';
import { NotFoundError } from '../utils/errors';

const prisma = new PrismaClient();

export async function postCreatePostService(userId: string, dataPost: any) {
    const newPost = await prisma.post.create({
        data: {
            title: dataPost.title,
            content: dataPost.content,
            authorId: userId
        }
    })

    return newPost
}
export async function getPostService() {
    const getPost = await prisma.post.findMany({
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
    })

    return getPost
}
export async function deletePostService(id: string, userId: String) {
    const post = await prisma.post.findUnique({
        where: {
            id: id
        }
    });

    if (!post) {
        throw new Error("Post not found");
    }

    if (post.authorId !== userId) {
        throw new UnauthorizedError("You do not have permission to delete this post")
    }

    const deletedPost = await prisma.post.delete({
        where: {
            id: id
        }
    });

    return deletedPost
}
export async function patchAttPostService(id: string, userId: String, dataToUpdate: any) {

    const post = await prisma.post.findUnique({
        where: {
            id: id
        }
    });

    if (post.authorId !== userId) {
        throw new UnauthorizedError("You do not have permission to update this post")
    }

    const updatedPost = await prisma.post.update({
        where: { id: id },
        data: dataToUpdate,
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

    return updatedPost

}
export async function getPostIdService(id: string) {

    const post = await prisma.post.findUnique({
        where: {
            id: id
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
    if (!post) {
        throw new NotFoundError("Post not found");
    }
    return post

}
export async function getLikesByPostService(postId: string) {
    const postExists = await prisma.post.findUnique({
        where: { id: postId }
    });

    if (!postExists) {
        throw new NotFoundError("Post not found")
    }
    const likes = await prisma.like.findMany({
        where: {
            postId: postId
        },
        include: {

            author: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    photo: true,
                }
            }
        }
    });

    return likes
}
export async function getcommentsByPosttService(postId: string) {
    const postExists = await prisma.post.findUnique({
        where: { id: postId }
    });

    if (!postExists) {
        throw new NotFoundError("Post not found")
    }

    const comments = await prisma.comment.findMany({
        where: {
            postId: postId
        },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    photo: true,
                }
            }
        }
    });

    return comments

}




