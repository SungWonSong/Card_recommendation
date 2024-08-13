require('dotenv').config(); // dotenv 패키지를 사용하여 .env 파일 로드
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser'); 
const { sequelize } = require('./models'); // Sequelize 인스턴스 가져오기
const port = process.env.PORT || 8080; // 포트를 환경 변수에서 가져오기
const {router} =require('./middleware/router');

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('./public')); 

router(app);

// 404 에러 처리
app.get('*', (req, res) => {
  res.render('404');
});

sequelize
  // force : true ; 서버 실행할 때마다 테이블 재생성
  // force : false ; 서버 실행 시 테이블이 없으면 생성
  .sync({ force: false })
  .then(() => {
    app.listen(port, () => {
      console.log(`${port}에 연결됨`);
      console.log(`Database connection succeeded!`);
    });
  })
  .catch((err) => {
    console.error(err);
  });