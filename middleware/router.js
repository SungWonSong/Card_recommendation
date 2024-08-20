const userRouter = require('../routes/user');
const indexRouter = require('../routes/index');
const detailRouter = require('../routes/detail');
const searchRouter = require('../routes/search');
const profileRouter = require('../routes/profile');

exports.router = (app)=>{
  app.use('/user', userRouter);
  app.use('/', indexRouter);
  app.use('/detail', detailRouter);
  app.use('/search', searchRouter);
  app.use('/profile', profileRouter);
}
