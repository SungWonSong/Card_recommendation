require('dotenv').config(); // dotenv 패키지를 사용하여 .env 파일 로드
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');// JWT 토큰을 사용하기 위해 추가 >> 예은
const cookieParser = require('cookie-parser'); // >> 예은
const { sequelize } = require('./models'); // Sequelize 인스턴스 가져오기
const port = process.env.PORT || 8080; // 포트를 환경 변수에서 가져오기
const {router} =require('./middleware/router');

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './views');

// 데이터베이스 동기화
sequelize.sync();

//정적폴더 호출은 라우팅 호출 밑으로! 

app.use(express.static('./views/public')); 

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