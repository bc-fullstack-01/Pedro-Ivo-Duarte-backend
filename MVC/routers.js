const express = require('express');

const { PostController, CommentController } = require('./controllers');

const router = express.Router();

router
  .route('/posts')
  .all(PostController.beforeAll)
  .get(PostController.list)
  .post(PostController.add)
router
  .route('posts/new')
  .get(PostController.new)

router
  .param('id', PostController.beforeById)
  .route('/posts/:id')
  .get(PostController.show)
  .put(PostController.save)
  .delete(PostController.delete)

router
  .param('id', PostController.beforeById)
  .route('/posts/:id/edit')
  .get(PostController.edit)

const nRouter = express.Router();

nRouter
  .param('postId', CommentController.beforeById)
  .route('/:postId/comments')
  .all(CommentController.beforeAll)
  .get(CommentController.list)
  .post(CommentController.add)
nRouter
  .route('/postId/comments/new')
  .get(CommentController.new)
nRouter
  .param('id', CommentController.beforeById)
  .route('/:postId/comments/:id')
  .get(CommentController.show)
  .put(CommentController.save)
  .delete(CommentController.delete)
nRouter
  .param('id', CommentController.beforeById)
  .route('/postId/comments/:id/edit')
  .get(CommentController.edit)

router.use('/posts', nRouter);

module.exports = router;