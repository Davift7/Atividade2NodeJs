import { FastifyInstance } from 'fastify';
import { authenticate } from '../utils/auth';
import { 
  deleteLikeController, 
  getLikeByIdController, 
  postCreateLikeController 
} from '../controllers/like-controller';

// Importando JSON Schema do like
import { likeJsonSchema } from '../schemas/main-schemas';

export async function likeRoutes(app: FastifyInstance) {
  app.get('/like/:id', getLikeByIdController);

  app.delete(
    '/like/:id', 
    { preHandler: [authenticate] }, 
    deleteLikeController
  );

  app.post(
    '/like', 
    { preHandler: [authenticate], schema: { body: likeJsonSchema } }, 
    postCreateLikeController
  );
}
