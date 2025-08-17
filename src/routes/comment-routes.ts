import { FastifyInstance } from 'fastify';
import { authenticate } from '../utils/auth';
import { 
  getCommentLikesController, 
  getCommentByIdController, 
  patchCommentController, 
  deleteCommentController, 
  getAllCommentsController,
  postCreateCommentController  
} from '../controllers/comment-controller';

// Importando os JSON Schemas corretos
import { createCommentJsonSchema, updateCommentJsonSchema } from '../schemas/main-schemas';

export async function commentRoutes(app: FastifyInstance) {
  app.get('/comment/:commentId/likes', getCommentLikesController);

  app.get('/comment/:id', getCommentByIdController);

  app.patch(
    '/comment/:id', 
    { preHandler: [authenticate], schema: { body: updateCommentJsonSchema } }, 
    patchCommentController
  );

  app.delete(
    '/comment/:id', 
    { preHandler: [authenticate] }, 
    deleteCommentController
  );

  app.get('/comments', getAllCommentsController);

  app.post(
    '/comment', 
    { preHandler: [authenticate], schema: { body: createCommentJsonSchema } }, 
    postCreateCommentController
  );
}
