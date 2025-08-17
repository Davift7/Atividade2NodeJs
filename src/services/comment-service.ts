import { NotFoundError, UnauthorizedError } from '../utils/errors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getCommentLikesService(commentId: string) {
    const commentExists = await prisma.comment.findUnique({
        where: { id: commentId }
    });

    if (!commentExists) {
        throw new NotFoundError("Comment not found");
    }

    const likes = await prisma.like.findMany({
        where: {
            commentId: commentId
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

    return likes;
}
export async function getCommentByIdService(id: string) {
    const comment = await prisma.comment.findUnique({
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
            post: {
                select: {
                    id: true,
                    title: true,
                    content: true
                }
            },
            likes: true
        }
    });

    if (!comment) {
        throw new NotFoundError("Comment not found");
    }

    return comment;
}
export async function updateCommentService(id: string, userId: string, content: string) {
    const comment = await prisma.comment.findUnique({
        where: { id: id }
    });

    if (!comment) {
        throw new NotFoundError("Comment not found");
    }

    if (comment.userId !== userId) {
        throw new UnauthorizedError("You do not have permission to update this comment");
    }

    const updatedComment = await prisma.comment.update({
        where: { id: id },
        data: { content },
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

    return updatedComment;
}
export async function deleteCommentService(id: string, userId: string) {
    const comment = await prisma.comment.findUnique({
        where: { id: id }
    });

    if (!comment) {
        throw new NotFoundError("Comment not found");
    }

    if (comment.userId !== userId) {
        throw new UnauthorizedError("You do not have permission to delete this comment");
    }

    const deletedComment = await prisma.comment.delete({
        where: { id: id }
    });

    return deletedComment;
}
export async function getAllCommentsService() {
    const comments = await prisma.comment.findMany({
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

    return comments;
}

export async function postCreateCommentService(userId: string, content: string, postId: string) {
    const postExists = await prisma.post.findUnique({
        where: { id: postId }
    });

    if (!postExists) {
        throw new NotFoundError("Post not found");
    }

    const newComment = await prisma.comment.create({
        data: {
            content,
            postId,
            userId
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

    return newComment;
}

