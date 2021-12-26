import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{
  Route.post('createComment', 'Comment/CommentController.createComment')
  Route.get('getComment/:id', 'Comment/CommentController.getComment')
  Route.get('getReply/:parrentId', 'Comment/CommentController.getReply')

  // like a comment...
  Route.post('likeComment', 'Comment/CommentController.likeComment')
  Route.post('editComment', 'Comment/CommentController.editComment')
  Route.post('deleteComment', 'Comment/CommentController.deleteComment')
}).prefix('comment').middleware('auth')
 

    //App-routes
Route.group(()=>{
  Route.post('createComment', 'Comment/CommentController.createComment')
  Route.get('getComment/:id', 'Comment/CommentController.getComment')
  Route.get('getReply/:parrentId', 'Comment/CommentController.getReply')

  // like a comment...
  Route.post('likeComment', 'Comment/CommentController.likeComment')
  Route.post('editComment', 'Comment/CommentController.editComment')
  Route.post('deleteComment', 'Comment/CommentController.deleteComment')
}).prefix('app/comment').middleware('auth:api')
