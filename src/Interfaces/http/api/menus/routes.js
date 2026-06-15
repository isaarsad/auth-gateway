import express from 'express';

const createMenusRouter = (controller) => {
  const router = express.Router();

  router.post('/', controller.postMenuController);

  return router;
};

export default createMenusRouter;
