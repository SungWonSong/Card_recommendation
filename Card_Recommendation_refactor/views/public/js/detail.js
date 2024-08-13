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
        const cardId = card.getAttribute('data-card-id'); // HTML에서 cardId 가져오기

        fetch('/detail/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cardId: cardId }) // 가져온 cardId 사용
        })
        .then(response => {
            if (response.status === 401) {
                if (confirm('로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?')) {
                    window.location.href = '/user/login';
                }
            }
            return response.json();
        })
        .then(data => {
            if (data.likesCount !== undefined) {
                document.getElementById('likesCount').innerText = `${data.likesCount} 좋아요`;
            }
        })
        .catch(error => console.error('Error:', error));
    });
});