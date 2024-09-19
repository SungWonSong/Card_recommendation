let isNicknameChecked = false;
let isIdChecked = false;

const nicknameInput = document.getElementById('nickname');
const userIdInput = document.getElementById('userId');
const passwordInput = document.getElementById('password');
const registerButton = document.querySelector('.register-button');

function validatePassword(password) {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
}

// 프론트에서의 중복검사(inputType -> nickname, userId)
function checkDuplicate(inputType) {
    const value = inputType === 'nickname' ? nicknameInput.value : userIdInput.value;
    const url = `/user/check-${inputType === 'nickname' ? 'nickname' : 'userId'}`;
    const checkResult = document.getElementById(`${inputType === 'nickname' ? 'nickname-check-result' : 'id-check-result'}`);

    console.log(`Sending request to ${url} with value: ${value}`); // 요청이 보내지는지 확인하는 로그
    console.log(`checkResult for ${inputType}:`, checkResult); // 요소가 제대로 선택되었는지 확인하는 로그

    if (!checkResult) {
        console.error(`Element with id ${inputType}-check-result not found.`);
        return;
    }

    axios.post(url, { [inputType]: value })
        .then(response => {
            console.log('Response:', response.data); // 응답 데이터 로그
            checkResult.textContent = response.data.message;
            checkResult.style.color = response.data.available ? 'skyblue' : 'red';

            if (inputType === 'nickname') {
                isNicknameChecked = response.data.available;
                if (isNicknameChecked) {
                    enableIdInput();
                }
            } else if (inputType === 'userId') {
                isIdChecked = response.data.available;
                if (isIdChecked) {
                    enablePasswordInput();
                }
            }
        })
        .catch(error => {
            console.error('Error:', error); // 오류 로그
            checkResult.textContent = '오류가 발생했습니다.';
            checkResult.style.color = 'red';

            if (inputType === 'nickname') isNicknameChecked = false;
            if (inputType === 'userId') isIdChecked = false;
        });
}

function checkNicknameFirst() {
    if (!isNicknameChecked) {
        alert('닉네임 중복 확인을 먼저 해주세요.');
        nicknameInput.focus();
    }
}

function register(event) {
    event.preventDefault();

    const userId = userIdInput.value;
    const password = passwordInput.value;
    const nickname = nicknameInput.value;

    if (!validatePassword(password)) {
        alert('비밀번호가 유효하지 않습니다. 최소 6자 이상, 영어, 숫자, 특수문자를 포함해야 합니다.');
        return;
    }

    if (!isNicknameChecked) {
        alert('닉네임 중복 확인을 해주세요.');
        return;
    }

    if (!isIdChecked) {
        alert('아이디 중복 확인을 해주세요.');
        return;
    }

    axios.post('/user/signup', { userId: userId, password: password, nickname: nickname })
        .then(res => {
            console.log(res);
            editCancel();
            window.location.href = '/user/login';
        })
        .catch(error => {
            console.error('Error in register:', error);
            if (error.response && error.response.data) {
                alert(error.response.data.message);
            }
        });
}

function editCancel() {
    nicknameInput.value = '';
    userIdInput.value = '';
    passwordInput.value = '';
}

function enableIdInput() {
    userIdInput.disabled = false;
    document.querySelector('.id-container button').disabled = false;
}

function enablePasswordInput() {
    passwordInput.disabled = false;
    registerButton.disabled = false;
}