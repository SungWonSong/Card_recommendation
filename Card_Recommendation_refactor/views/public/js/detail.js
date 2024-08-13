
   document.addEventListener('DOMContentLoaded', () => {
    const viewDetailLink = document.getElementById('viewDetail');
    const backButton = document.getElementById('backButton');
    const card = document.querySelector('.card');
    const box = document.getElementById('box');

    // 상세보기 클릭 이벤트
    viewDetailLink.addEventListener('click', (e) => {
        e.preventDefault(); // 기본 링크 동작 방지
        card.classList.add('slide-up'); // 카드에 slide-up 클래스 추가
        viewDetailLink.style.display = 'none'; // 상세보기 버튼 숨김
        backButton.style.display = 'inline-block'; // 뒤로가기 버튼 표시

        // box 요소의 높이와 애니메이션을 설정
        box.style.display = 'flex';
        box.style.height = 'auto'; // 높이를 자동으로 설정
        box.style.opacity = '1'; // 보이도록 설정
        box.style.animation = 'slideDown 1s forwards'; // 애니메이션 적용
        box.style.transform = 'translate(-50%, 15vh)'; // 애니메이션 적용
    });

    // 좋아요를 누를 때! 좋아요 수 갱신 or 로그인 유도
    document.getElementById('likeButton').addEventListener('click', () => {
        fetch('/detail/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // 요청 본문(req.body)에 JSON 형식으로 카드 ID 포함하기 ->
            body: JSON.stringify({ cardId: '<%= card.card_id %>' })
        })
        .then(response => {
            // 응답코드가 401일 때! -> 서버에서 보낸 코드(토큰 존재 유무 확인해서 토큰이 없을 때 401 보냄)
            if (response.status === 401) {
                if (confirm('로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?')) {
                    window.location.href = '/user/login';
                    // 여기서 로그인 성공 시 다시 좋아요 화면으로 가기!! (로그인 컨트롤러랑 로그인ejs 수정 필요 )
                    // window.location.href = `/user/login?redirect=${encodeURIComponent(currentUrl)}`
                }
            }
            return response.json();
        })
        .then(data => {
            // 서버(controller/Cdetail.addLike)에서 온 응답 데이터에 likesCount 속성이 있을 때!
            if (data.likesCount !== undefined) {
                document.getElementById('likesCount').innerText = `${data.likesCount} 좋아요`;
            }
        })
        .catch(error => console.error('Error:', error));
    });
});