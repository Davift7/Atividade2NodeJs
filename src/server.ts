// src/server.ts
import Fastify from 'fastify';
import { userRoutes } from './routes/user-routes';
import { postRoutes } from './routes/post-routes';
import { commentRoutes } from './routes/comment-routes';
import { likeRoutes } from './routes/like-routes';

const app = Fastify({
    logger: true,
});



app.register(userRoutes, { prefix: '/api/v1/users' });
app.register(postRoutes, { prefix: '/api/v1/posts' });
app.register(commentRoutes, { prefix: '/api/v1/comments' });
app.register(likeRoutes, { prefix: '/api/v1/likes' });

const start = async () => {
    try {
        await app.listen({ port: 3000 });
        app.log.info(`Server is running on http://localhost:3000`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();