//Import de dependencias
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config'
//import de utils
import { UnauthorizedError, ConflictError,AuthenticationError,NotFoundError } from '../utils/errors';


const prisma = new PrismaClient();
export async function postCreateLikeService(postId: string | undefined, userId: string, commentId: string | undefined) {
    if (!postId && !commentId) {
        throw new Error("You must provide either a postId or a commentId.");
    }
    
    let newLike;

    if (postId) {
        const postExists = await prisma.post.findUnique({ where: { id: postId } });
        if (!postExists) {
            throw new NotFoundError("Post not found");
        }

        const existingLike = await prisma.like.findFirst({
            where: { userId: userId, postId: postId }
        });
        if (existingLike) {
            throw new ConflictError("You have already liked this post");
        }

        newLike = await prisma.like.create({
            data: {
                userId: userId,
                postId: postId
            }
        });
    } else if (commentId) {
        const commentExists = await prisma.comment.findUnique({ where: { id: commentId } });
        if (!commentExists) {
            throw new NotFoundError("Comment not found");
        }
        
        const existingLike = await prisma.like.findFirst({
            where: { userId: userId, commentId: commentId }
        });
        if (existingLike) {
            throw new ConflictError("You have already liked this comment");
        }
        
        newLike = await prisma.like.create({
            data: {
                userId: userId,
                commentId: commentId
            }
        });
    }

    return newLike;
}
export async function deleteLikeService(id: string, userId: string) {
    const like = await prisma.like.findUnique({
        where: { id: id }
    });

    if (!like) {
        throw new NotFoundError("Like not found");
    }

    if (like.userId !== userId) {
        throw new UnauthorizedError("You do not have permission to delete this like");
    }

    const deletedLike = await prisma.like.delete({
        where: { id: id }
    });

    return deletedLike;
}
export async function getLikeByIdService(id: string) {
    const like = await prisma.like.findUnique({
        where: { id: id },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    photo: true,
                }
            },
            post: true,
            comment: true,
        }
    });

    if (!like) {
        throw new NotFoundError("Like not found");
    }

    return like;
}