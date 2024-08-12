document.addEventListener('DOMContentLoaded', () => {
    const commentInput = document.getElementById('comment-input');
    const addCommentButton = document.getElementById('add-comment');
    const commentsContainer = document.getElementById('comments-container');
    const charCounter = document.getElementById('char-counter');
    const paginationContainer = document.getElementById('pagination');
    const commentsPerPage = 5;

    const updateCharCount = () => {
        charCounter.textContent = commentInput.value.length;
    };

    commentInput.addEventListener('input', updateCharCount);

    const addComment = () => {
        const text = commentInput.value.trim();
        const cardId = addCommentButton.getAttribute('data-card-id');
        if (!user) {
            alert('먼저 로그인을 해주세요');
            commentInput.value = '';
            return;
        }
        if (text) {
            fetch('/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ comment_contents: text, card_id: cardId })
            }).then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        location.reload(); // 댓글 추가 후 페이지 새로고침
                    });
                    commentInput.value = '';
                    updateCharCount();
                } else {
                    alert('댓글 추가 실패.');
                }
            }).catch(error => {
                console.error('Error posting comment:', error);
                alert('댓글 추가 실패.');
            });
        } else {
            alert('댓글을 입력하세요.');
        }
    };

    addCommentButton.addEventListener('click', addComment);

    commentInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            addComment();
        }
    });

    const createComment = (comment, index) => {
        // 상위 2개의 댓글이고 좋아요 수가 1 이상인 경우에만 'top-comment' 클래스를 추가합니다.
        const isTopComment = index < 2 && comment.likeCount > 0;
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment' + (isTopComment ? ' top-comment' : '');
        commentDiv.dataset.id = comment.comment_id;

        const commentHeader = document.createElement('div');
        commentHeader.className = 'comment-header';

        const commentAuthor = document.createElement('div');
        commentAuthor.className = 'comment-author';
        commentAuthor.textContent = comment.User ? comment.User.nickname : '익명';

        // 순위에 따라 이모지를 추가합니다.
        if (isTopComment) {
            const emoji = document.createElement('span');
            emoji.style.marginLeft = '10px';
            if (index === 0) {
                emoji.textContent = '🥇'; // 1순위
            } else if (index === 1) {
                emoji.textContent = '🥈'; // 2순위
            }
            commentAuthor.appendChild(emoji);
        }

        const commentOptions = document.createElement('div');
        commentOptions.className = 'comment-options';
        commentOptions.textContent = new Date(comment.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\./g, '/').replace(/\s/g, '');

        if (user && user.userId === comment.userid) {
            const editButton = document.createElement('button');
            editButton.className = 'edit-comment';
            editButton.textContent = '수정';
            editButton.addEventListener('click', () => {
                editComment(commentDiv);
            });

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-comment';
            deleteButton.textContent = '삭제';
            deleteButton.addEventListener('click', () => {
                deleteComment(commentDiv);
            });

            commentOptions.appendChild(editButton);
            commentOptions.appendChild(deleteButton);
        }

        commentHeader.appendChild(commentAuthor);
        commentHeader.appendChild(commentOptions);

        const commentBody = document.createElement('div');
        commentBody.className = 'comment-body';
        commentBody.textContent = comment.comment_contents;

        const commentFooter = document.createElement('div');
        commentFooter.className = 'comment-footer';

        const likesSpan = document.createElement('span');
        likesSpan.className = 'likes';
        likesSpan.textContent = comment.likeCount || '0';

        const likeButton = document.createElement('span');
        likeButton.className = 'comment-action';
        likeButton.innerHTML = '좋아요 <span class="thumb">🔥</span>';
        likeButton.setAttribute('data-card-id', comment.card_id);
        likeButton.addEventListener('click', () => {
            toggleLike(comment.comment_id, comment.card_id, likesSpan);
        });

        commentFooter.appendChild(likesSpan);
        commentFooter.appendChild(likeButton);

        commentDiv.appendChild(commentHeader);
        commentDiv.appendChild(commentBody);
        commentDiv.appendChild(commentFooter);

        commentsContainer.appendChild(commentDiv);
    };

    const toggleLike = async (commentId, cardId, likesSpan) => {
        if (!user) {
            alert('먼저 로그인을 해주세요');
            return;
        }
        try {
            const response = await fetch('/comment/like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ comment_id: commentId, card_id: cardId })
            });
            if (response.ok) {
                const data = await response.json();
                likesSpan.textContent = data.likeCount;

                // 좋아요 수 변경 후 댓글 목록을 다시 가져와서 업데이트
                comments = data.comments;
                totalPages = data.totalPages;
                displayComments(currentPage);
                setupPagination(totalPages);
            } else {
                alert('좋아요 처리 실패.');
            }
        } catch (error) {
            console.error('Error toggling like:', error);
            alert('좋아요 처리 실패.');
        }
    };

    const editComment = (comment) => {
        const commentBody = comment.querySelector('.comment-body');
        const newText = prompt('댓글을 수정하세요:', commentBody.textContent);
        if (newText) {
            fetch(`/comment/edit/${comment.dataset.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ comment_contents: newText })
            }).then(response => {
                if (response.ok) {
                    commentBody.textContent = newText;
                } else {
                    alert('댓글 수정 실패.');
                }
            });
        }
    };

    const deleteComment = (comment) => {
        if (confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
            fetch(`/comment/delete/${comment.dataset.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            }).then(response => {
                if (response.ok) {
                    comments = comments.filter(c => c.comment_id !== comment.dataset.id);
                    totalPages = Math.ceil(comments.length / commentsPerPage);
                    if (currentPage > totalPages) {
                        currentPage = totalPages;
                    }
                    location.reload();
                } else {
                    alert('댓글 삭제 실패.');
                }
            });
        }
    };

    const displayComments = (page) => {
        commentsContainer.innerHTML = '';
        const start = (page - 1) * commentsPerPage;
        const end = start + commentsPerPage;
        const paginatedComments = comments.slice(start, end);
        paginatedComments.forEach((comment, index) => {
            createComment(comment, index);
        });
    };

    const setupPagination = (totalPages) => {
        paginationContainer.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.addEventListener('click', () => {
                currentPage = i;
                displayComments(currentPage);
                setupPagination(totalPages);
            });
            if (i === currentPage) {
                button.disabled = true;
            }
            paginationContainer.appendChild(button);
        }
    };

    displayComments(currentPage);
    setupPagination(totalPages);
    updateCharCount();
});

// 새로 추가된 코드: 창이 닫힐 때 부모 창에 메시지를 보냄
window.addEventListener('beforeunload', function () {
    if (window.opener && !window.opener.closed) {
        window.opener.postMessage('reload', '*');
    }
});