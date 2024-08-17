//서버에서 로그인 상태 확인
    fetch('/user/checkLoginStatus')
        .then(response => response.json())
        .then(data => {
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
        });

    //로그아웃 함수
    function logout() {
        axios({
            method: 'POST',
            url: '/user/logout',
            withCredentials: true
        }).then((res) => {
            if (res.data.message === '로그아웃 성공') {
                console.log('로그아웃 성공');
                // 로그아웃 성공 시 버튼 텍스트를 'Login'으로 변경하고 페이지를 새로고침
                const loginButton = document.querySelector('.login-button');
                loginButton.textContent = 'Login';
                window.location.href = '/index';
            }
        }).catch((error) => {
            console.error('Error in logout:', error);
        });
    }

    const items = document.querySelectorAll('.item');
    const expand = (item, i) => {
        items.forEach((it, ind) => {
            if (i === ind) return;
            it.clicked = false;
        });
        gsap.to(items, {
            width: item.clicked ? '15vw' : '8vw',
            duration: 2,
            ease: 'elastic(1, .6)'
        });
        item.clicked = !item.clicked;
        gsap.to(item, {
            width: item.clicked ? '42vw' : '15vw',
            duration: 2.5,
            ease: 'elastic(1, .3)'
        });
    };
    items.forEach((item, i) => {
        item.clicked = false;
        item.addEventListener('click', () => {
            expand(item, i);
            // 페이지 이동 코드 추가
            if (!item.clicked) {
                const category = item.getAttribute('data-category');
                window.location.href = `/search/category?category=${category}`;
            }
        });
    });

    // 검색 버튼 클릭 이벤트
    const searchButton = document.querySelector('.search-button');
    const searchInput = document.querySelector('.search-input');

    searchButton.addEventListener('click', () => {
        const query = searchInput.value;
        if (query) {
            window.location.href = `/search/search?query=${encodeURIComponent(query)}`;
        }
    });

    // 엔터 키로 검색 버튼 클릭 이벤트
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });