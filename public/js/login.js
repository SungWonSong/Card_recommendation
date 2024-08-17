// [Login] 버튼 클릭시 서버에 로그인 요청하기
function login() {
    const form = document.forms['form_login'];
    const userId = form.userId.value;
    const password = form.password.value;

    axios({
        method: 'POST',
        url: '/user/login',
        data: {
            userId: userId,
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
