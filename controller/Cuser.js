const { User } = require('../models');
const { hashPassword, comparePassword } = require('../utils/encrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signUp = (req, res) => {
    res.render('signup');
};

exports.logIn = (req, res) => {
    res.render('login');
};
// request가 없어도 미래에 페이지 렌더링 확장에서 필요하게 될 때 사용가능성 존재
// request사용을 통한 코드의 직관적인 모습 유지 가능

exports.postsignUp = async (req, res) => {
    try {
        const { userId, nickname, password } = req.body;
        const validatePassword = (password) => {
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/; // 최소 6자 이상, 영문자, 숫자, 특수문자
            return passwordRegex.test(password);
        };
        if (!validatePassword(password)) {
            return res.status(400).send({ message: "password error" });
        }
        const hashedPassword = await hashPassword(password);
        const newUser = await User.create({userId, nickname, password: hashedPassword });
        
        res.send({ id: newUser.id, userId: newUser.userId, nickname: newUser.nickname });
    } catch (error) {
        console.error('Error in postsignUp:', error);
        res.status(500).send({ message: error.message });
    }
};

exports.postlogIn = async (req, res) => {
    try {
        const { userId, password } = req.body;
        const user = await User.findOne({ where: { userId } });
        if (!user) {
            return res.status(400).send({ message: '존재하지 않는 아이디입니다.' });
        }
        const match = await comparePassword(password, user.password);
        // match 라는 변수에 패스워드 일치 여부 판단하는 comparePassword를 사용해서 같으면 true, 아니면 false 출력
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
// userid -> userId로 다 탈바꿈


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
        const { userId } = req.body;
        const user = await User.findOne({ where: { userId } });
        if (user) {
            return res.send({ message: '이미 사용 중인 아이디입니다.', available: false });
        }
        res.send({ message: '사용 가능한 아이디입니다.', available: true });
    } catch (error) {
        console.error('Error in checkDuplicateId:', error);
        res.status(500).send({ message: error.message });
    }
};