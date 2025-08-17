//Leitura de Comentários com base no Usuário
app.get('/user/:userId/comments', async (request, reply) => {
    try {
        const { userId } = request.params as { userId: string };

        const userExists = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!userExists) {
            return reply.status(404).send({ error: "User not found" });
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

        return reply.status(200).send(comments);

    } catch (err) {
        console.error(err);
        return reply.status(500).send({
            error: "Internal Server Error"
        });
    }
});
//leitura de likes com base no Usuário
app.get('/user/:userId/likes', async (request, reply) => {
    try {
        const { userId } = request.params as { userId: string };


        const userExists = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!userExists) {
            return reply.status(404).send({ error: "User not found" });
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

        return reply.status(200).send(likes);

    } catch (err) {
        console.error(err);
        return reply.status(500).send({
            error: "Internal Server Error"
        });
    }
});

//leitura de post com base no usuario 
app.get('/user/:userId/posts', async (request, reply) => {
    try {
        const { userId } = request.params as { userId: string };

        const userExists = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!userExists) {
            return reply.status(404).send({ error: "User not found" });
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

        return reply.status(200).send(posts);

    } catch (err) {
        console.error(err);
        return reply.status(500).send({
            error: "Internal Server Error"
        });
    }
});

//leitura de usuario
    app.get('/user/:id', async (request, reply) => {
        try {
            const { id } = request.params as { id: string };

            const user = await prisma.user.findUnique({
                where: {
                    id: id
                },
                omit: {
                    password: true
                }
            });

            if (!user) {
                return reply.status(404).send({ error: "User not found" });
            }

            return reply.status(200).send(user);

        } catch (err) {
            console.error(err);
            return reply.status(500).send({
                error: "Internal Server Error"
            });
        }
    });

     //atualização do usuário
    app.patch('/user/:id', { preHandler: [authenticate] }, async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const userId = request.user.id;

            const dataToUpdate = userUpdateSchema.parse(request.body);

            if (id !== userId) {
                return reply.status(403).send({ error: "You do not have permission to update this user's account" });
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

            return reply.status(200).send(updatedUser);

        } catch (err) {
            if (err instanceof z.ZodError) {
                return reply.status(400).send({ error: "Validation Failed", issues: err.flatten().fieldErrors });
            }

            if (err.code === 'P2025') {
                return reply.status(404).send({ error: 'User not found' });
            }
            if (err.code === 'P2002') {
                return reply.status(409).send({ error: 'Email already in use' });
            }

            console.error(err);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });
//delação de usuário
    app.delete('/user/:id', { preHandler: [authenticate] }, async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const userId = request.user.id;

            if (id !== userId) {
                return reply.status(403).send({ error: "You do not have permission to delete this user's account" });
            }

            const deletedUser = await prisma.user.delete({
                where: {
                    id: id
                }
            });

            return reply.status(204).send();

        } catch (err) {
            if (err.code === 'P2025') {
                return reply.status(404).send({ error: 'User not found' });
            }

            console.error(err);
            return reply.status(500).send({
                error: "Internal Server Error"
            });
        }
    });

    //leitura de usuários
    app.get('/users', async (request, reply) => {
        try {

            const getUsers = await prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    photo: true,
                    createdAt: true
                }
            })

            return reply.status(200).send(getUsers)

        } catch (err) {
            console.error(err)
            return reply.status(500).send({
                error: "Internal Server Error"
            })
        }

    })

    
    // criação do usuário
    app.post('/user', async (request, reply) => {
        try {
            const dataUser = userSchema.parse(request.body)

            const hashedPassword = await bcryptjs.hash(dataUser.password, 10)


            const createUser = await prisma.user.create({
                data: {
                    name: dataUser.name,
                    email: dataUser.email,
                    password: hashedPassword,
                    photo: dataUser.photo
                }
            })

            return reply.status(201).send(createUser)

        } catch (err) {
            if (err instanceof z.ZodError) {
                return reply.status(400).send({
                    error: "Validation Failed",
                    issues: err.flatten().fieldErrors
                })
            }

            console.error(err)
            return reply.status(500).send({
                error: "Internal Server Error"
            })
        }
    })

     //procura do login e criação do token
    app.post('/login', async (request, reply) => {
        try {
            const dataLogin = loginSchema.parse(request.body);

            const user = await prisma.user.findUnique({
                where: {
                    email: dataLogin.email
                }
            });

            if (!user) {
                return reply.status(401).send({ error: "Invalid email or password" });
            }

            const passwordMatch = await bcryptjs.compare(dataLogin.password, user.password);

            if (!passwordMatch) {
                return reply.status(401).send({ error: "Invalid email or password" });
            }

            const payload = {
                id: user.id
            };

            const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

            return reply.status(200).send({
                message: 'Login successful',
                token: token,
            });

        } catch (err) {
            if (err instanceof z.ZodError) {
                return reply.status(400).send({
                    error: "Validation Failed",
                    issues: err.flatten().fieldErrors
                });
            }

            console.error(err);
            return reply.status(500).send({
                error: "Internal Server Error"
            });
        }
    });

 //Criação de post
    app.post('/post', { preHandler: [authenticate] }, async (request, reply) => {
        try {
            const { title, content } = postSchema.parse(request.body)
            const userId = request.user.id

            const newPost = await prisma.post.create({
                data: {
                    title,
                    content,
                    authorId: userId
                }
            })

            return reply.status(201).send(newPost)

        } catch (err) {
            if (err instanceof z.ZodError) {
                return reply.status(400).send({
                    error: "Validation Failed",
                    issues: err.flatten().fieldErrors
                })
            }
            console.error(err)
            return reply.status(500).send({
                error: "Internal Server Error"
            })
        }
    })

        //leitura de posts
        app.get('/posts', async (request, reply) => {
            try {
    
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
    
                return reply.status(200).send(getPost)
    
            } catch (err) {
                console.error(err)
                return reply.status(500).send({
                    error: "Internal Server Error"
                })
            }
    
        })