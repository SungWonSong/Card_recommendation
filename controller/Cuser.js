const { User } = require('../models');
const { hashPassword, comparePassword } = require('../utils/encrypt');
const jwt = require('jsonwebtoken');
const { checkLoginStatus } = require('../middleware/token'); // 변경된 부분: checkLoginStatus를 middleware에서 가져옴
require('dotenv').config();

exports.signUp = (req, res) => {
    res.render('signup');
};

exports.logIn = (req, res) => {
    res.render('login');
};

exports.postsignUp = async (req, res) => {
    try {
        const { userid, nickname, password } = req.body;
        const validatePassword = (password) => {
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/; // 최소 6자 이상, 영문자, 숫자, 특수문자
            return passwordRegex.test(password);
        };
        if (!validatePassword(password)) {
            return res.status(400).send({ message: "password error" });
        }
        const hashedPassword = await hashPassword(password);
        const newUser = await User.create({ userid, nickname, password: hashedPassword });
        res.send({ id: newUser.id, userid, nickname });
    } catch (error) {
        console.error('Error in postsignUp:', error);
        res.status(500).send({ message: error.message });
    }
};

exports.postlogIn = async (req, res) => {
    try {
        const { userid, password } = req.body;
        const user = await User.findOne({ where: { userid } });
        if (!user) {
            return res.status(400).send({ message: '존재하지 않는 아이디입니다.' });
        }
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(400).send({ message: '비밀번호가 잘못 되었습니다. 비밀번호를 정확히 입력해 주세요.' });
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 3600000 // 1시간 (밀리초 기준)
        });
        res.send({ message: '로그인 성공', token });
    } catch (error) {
        console.error('Error in postlogIn:', error); // 오타 수정 (기존: postsignIn)
        res.status(500).send({ message: error.message });
    }
};

exports.logout = (req, res) => {
    try {
        res.clearCookie('token', { path: '/' });
        res.send({ message: '로그아웃 성공' });
    } catch (error) {
        console.error('Error in logout:', error);
        res.status(500).send({ message: '로그아웃 중 오류가 발생했습니다.' });
    }
};

// 변경 전 로그인 확인 함수 - 단순히 쿠키에 토큰이 있는지 여부만 확인함
// // 로그인 상태 확인 함수 
// exports.checkLoginStatus = (req, res) => {
//     if (req.cookies.token) {
//         res.json({ isLoggedIn: true });
//     } else {
//         res.json({ isLoggedIn: false });
//     }
// };

// 로그인 상태 확인 함수 - middleware/token.js로 이동
// exports.checkLoginStatus = (req, res) => {
//     const token = req.cookies.token;
//     if (token) {
//         jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//             if (err) {
//                 return res.json({ isLoggedIn: false });
//             } else {
//                 return res.json({ isLoggedIn: true });
//             }
//         });
//     } else {
//         return res.json({ isLoggedIn: false });
//     }
// };

// 닉네임 중복 확인 함수
exports.checkDuplicateNickname = async (req, res) => {
    try {
        const { nickname } = req.body;
        const user = await User.findOne({ where: { nickname } });
        if (user) {
            return res.send({ message: '이미 사용중인 닉네임입니다. 다른 닉네임을 입력해주세요.', available: false });
        }
        res.send({ message: '사용할 수 있는 닉네임입니다.', available: true });
    } catch (error) {
        console.error('Error in checkDuplicateNickname:', error);
        res.status(500).send({ message: error.message });
    }
};

// 아이디 중복 확인 함수
exports.checkDuplicateId = async (req, res) => {
    try {
        const { userid } = req.body;
        const user = await User.findOne({ where: { userid } });
        if (user) {
            return res.send({ message: '이미 사용 중인 아이디입니다.', available: false });
        }
        res.send({ message: '사용 가능한 아이디입니다.', available: true });
    } catch (error) {
        console.error('Error in checkDuplicateId:', error);
        res.status(500).send({ message: error.message });
    }
};

// 로그인 상태 확인 함수 (middleware/token.js에서 가져옴)
exports.checkLoginStatus = checkLoginStatus; // 변경된 부분