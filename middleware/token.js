const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.cookies['token']; // 쿠키에서 토큰을 가져옵니다.
  
  // 토큰이 없는 경우
  if (token === undefined) {
    req.user = null; // 사용자 정보 없음
    res.locals.isLoggedIn = false;
    return next(); // 로그인 상태 false 반환
  }

  // 토큰 검증
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: '토큰이 만료되었습니다.', isLoggedIn: false });
      }
      console.error('토큰 인증에 실패했습니다.', err);
      return res.status(500).json({ message: '인증된 유저가 아닙니다', isLoggedIn: false });
    }

    req.user = decodedToken; 
    res.locals.isLoggedIn = true; // 로그인 상태 true로 설정
    return next();
  });
};

const checkLoginStatus = (req, res) => {
  res.json({ isLoggedIn: res.locals.isLoggedIn, user: req.user });
};

module.exports = {
  authenticateToken,
  checkLoginStatus

};