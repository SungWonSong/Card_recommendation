// 서버에서 로그인 상태 확인
fetch('/user/checkLoginStatus')
    .then(response => response.json())
    .then(data => {
        const loginButton = document.querySelector('.login-button');
        loginButton.textContent = data.isLoggedIn ? 'Logout' : 'Login'; // 로그인 상태에 따라 버튼 텍스트 변경
        loginButton.addEventListener('click', () => {
            if (data.isLoggedIn) {
                logout(); // 로그아웃 함수 호출
            } else {
                window.location.href = '/user/login';
            }
        });
    });

// [Login] 버튼 클릭시 서버에 로그인 요청하기
function login() {
    const form = document.forms['form_login'];
    const userid = form.userid.value;
    const password = form.password.value;

    axios({
        method: 'POST',
        url: '/user/login',
        data: {
            userid: userid,
            password: password
        }
    }).then((res) => {
        console.log(res);
        // 로그인 성공 시 /index로 리디렉션
        window.location.href = '/index';
    }).catch((error) => {
        console.error('Error in login:', error);
        if (error.response && error.response.data) {
            alert(error.response.data.message);
        }
    });
}

// 로그아웃 함수
function logout() {
    axios({
        method: 'POST',
        url: '/user/logout', 
        withCredentials: true 
    }).then((res) => {
        if (res.data.message === '로그아웃 성공') {
            console.log('로그아웃 성공');
            window.location.href = '/user/login';
        }
    }).catch((error) => {
        console.error('Error in logout:', error);
    });
}