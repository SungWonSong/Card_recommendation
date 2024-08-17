// 라우팅 분리
const userRouter = require('../routes/user');
const commentRouter = require('../routes/comment');
const indexRouter = require('../routes/index');
// const commendRouter = require('../routes/commend');
const detailRouter = require('../routes/detail');
const searchRouter = require('../routes/search');
const profileRouter = require('../routes/profile');

exports.router = (app)=>{
  app.use('/user', userRouter);
  app.use('/comment', commentRouter);
  app.use('/', indexRouter);
  // app.use('/commend', commendRouter);
  app.use('/detail', detailRouter);
  app.use('/search', searchRouter);
  app.use('/profile', profileRouter);
}
