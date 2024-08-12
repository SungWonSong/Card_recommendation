function addCardMovement() {
    var cards = document.querySelectorAll('.card');

    cards.forEach(function(card) {
        card.addEventListener('mousemove', function(event) {
            var e = -(card.offsetWidth / 2 - event.offsetX) / 10; // 좌우 움직임 조정
            var n = (card.offsetHeight / 2 - event.offsetY) / 10; // 상하 움직임 조정
            card.style.transform = "rotateY(" + e + "deg) rotateX(" + n + "deg)";
        });

        card.addEventListener('mouseleave', function() { // 마우스가 카드에서 벗어날 때 초기화
            card.style.transform = "rotateY(0deg) rotateX(0deg)";
        });
    });
}

// 모든 카드에 이벤트 리스너 추가
addCardMovement();

// 모달 창 열기
const openModal = (url) => {
    const modal = document.getElementById("comment-modal");
    const iframe = document.getElementById("comment-iframe");
    iframe.src = url;
    modal.style.display = "block";
};

// 모달 창 닫기
const closeModal = () => {
    const modal = document.getElementById("comment-modal");
    modal.style.display = "none";
    location.reload(); // 모달 창 닫을 때 페이지 새로고침
};

// 이벤트 리스너 추가
document.querySelectorAll('.comment-body').forEach(comment => {
    comment.addEventListener('click', (event) => {
        const cardId = comment.getAttribute('data-card-id');
        openModal(`/comment?card_id=${cardId}`);
    });
});

document.querySelector('.close').addEventListener('click', closeModal);
window.addEventListener('click', (event) => {
    const modal = document.getElementById("comment-modal");
    if (event.target === modal) {
        closeModal();
    }
});

window.addEventListener("DOMContentLoaded", (event) => {
    const cards = document.querySelectorAll(".thumb");
    cards.forEach((e) => { 
        // 카드 클릭 이벤트 리스너 추가
        // 카드를 클릭했을 때 data-url 속성에 지정된 URL로 이동
        e.addEventListener("click", (event) => {
            const url = e.getAttribute("data-url");
            if (url) {
                window.location.href = url;
            }
        });
    });

    // 새롭게 추가된 코드: .no-comments 요소 클릭 이벤트 리스너
    const noComments = document.querySelectorAll('.no-comments');
    noComments.forEach(noComment => {
        noComment.addEventListener('click', (event) => {
            const url = noComment.getAttribute("data-url");
            if (url) {
                openModal(url);
            }
        });
    });
});