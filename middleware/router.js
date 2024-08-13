// 라우팅 분리
const userRouter = require('../Card_Recommendation_refactor/routes/user');
const commentRouter = require('../Card_Recommendation_refactor/routes/comment');
const indexRouter = require('../Card_Recommendation_refactor/routes/index');
const commendRouter = require('../Card_Recommendation_refactor/routes/commend');
const detailRouter = require('../Card_Recommendation_refactor/routes/detail');
const searchRouter = require('../Card_Recommendation_refactor/routes/search');
const profileRouter = require('../Card_Recommendation_refactor/routes/profile');

exports.router=(app)=>{
  app.use('/user', userRouter);
  app.use('/comment', commentRouter);
  app.use('/', indexRouter);
  app.use('/commend', commendRouter);
  app.use('/detail', detailRouter);
  app.use('/search', searchRouter);
  app.use('/profile', profileRouter);
}
