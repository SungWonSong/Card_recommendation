// 로그인 상태 확인 함수
function checkLoginStatus() {
    axios.get('user/authenticateToken', { withCredentials: true })
        .then(response => {
            const data = response.data;
            const loginButton = document.querySelector('.login-button');
            loginButton.textContent = data.isLoggedIn ? 'Logout' : 'Login'; // 로그인 상태에 따라 버튼 텍스트 변경
            
            if (data.isLoggedIn) {
                const mypageButton = document.createElement('button');
                mypageButton.textContent = 'My Page';
                mypageButton.classList.add('mypage-button');
                mypageButton.addEventListener('click', () => {
                    window.location.href = '/profile';
                });
                document.querySelector('.header').appendChild(mypageButton);
            }

            loginButton.addEventListener('click', () => {
                if (data.isLoggedIn) {
                    logout(); // 로그아웃 함수 호출
                } else {
                    window.location.href = '/user/login';
                }
            });
        })
        .catch(error => {
            console.error('Error fetching login status:', error);
        });
}

// 로그아웃 함수
function logout() {
    axios.post('/user/logout', {}, { withCredentials: true })
        .then(res => {
            if (res.data.message === '로그아웃 성공') {
                console.log('로그아웃 성공');
                // 로그아웃 성공 시 버튼 텍스트를 'Login'으로 변경하고 페이지를 새로고침
                const loginButton = document.querySelector('.login-button');
                loginButton.textContent = 'Login';
                window.location.href = '/index';
            }
        })
        .catch(error => {
            console.error('Error in logout:', error);
        });
}

// 페이지가 로드될 때 로그인 상태 확인
function initialize() {
    checkLoginStatus();
}

// DOMContentLoaded 이벤트 리스너 등록
if (document.readyState !== 'loading') {
    initialize();
} else {
    document.addEventListener('DOMContentLoaded', initialize);
}