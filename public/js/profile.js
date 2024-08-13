const commentsPerPage = 15;
let currentPage = 1;
let totalComments = comments.length;

function renderComments(comments, page) {
    const commentList = document.getElementById('comment-list');
    commentList.innerHTML = '';

    const start = (page - 1) * commentsPerPage;
    const end = start + commentsPerPage;
    const paginatedComments = comments.slice(start, end);

    paginatedComments.forEach(comment => {
        const li = document.createElement('li');
        li.className = 'comment';
        li.innerHTML = `
            ${comment.comment_contents}
            <button type="button" onclick="deleteComment(${comment.comment_id});">삭제</button>
        `;
        commentList.appendChild(li);
    });
}

function setupPagination(totalComments) {
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');

    prevPageBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            renderComments(comments, currentPage);
        }
    };

    nextPageBtn.onclick = () => {
        if (currentPage < Math.ceil(totalComments / commentsPerPage)) {
            currentPage++;
            renderComments(comments, currentPage);
        }
    };
}

document.addEventListener('DOMContentLoaded', () => {
    renderComments(comments, currentPage);
    setupPagination(totalComments);
});

particlesJS("particles-js", {
    "particles": {
        "number": {
            "value": 80,
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "color": {
            "value": "#ffffff"
        },
        "shape": {
            "type": "triangle",
            "stroke": {
                "width": 0,
                "color": "#000000"
            },
            "polygon": {
                "nb_sides": 5
            },
            "image": {
                "src": "img/github.svg",
                "width": 100,
                "height": 100
            }
        },
        "opacity": {
            "value": 0.5,
            "random": false,
            "anim": {
                "enable": false,
                "speed": 1,
                "opacity_min": 0.1,
                "sync": false
            }
        },
        "size": {
            "value": 3,
            "random": true,
            "anim": {
                "enable": false,
                "speed": 40,
                "size_min": 0.1,
                "sync": false
            }
        },
        "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#ffffff",
            "opacity": 0.4,
            "width": 1
        },
        "move": {
            "enable": true,
            "speed": 6,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "attract": {
                "enable": false,
                "rotateX": 600,
                "rotateY": 1200
            }
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "repulse"
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            },
            "resize": true
        },
        "modes": {
            "grab": {
                "distance": 400,
                "line_linked": {
                    "opacity": 1
                }
            },
            "bubble": {
                "distance": 400,
                "size": 40,
                "duration": 2,
                "opacity": 8,
                "speed": 3
            },
            "repulse": {
                "distance": 200
            },
            "push": {
                "particles_nb": 4
            },
            "remove": {
                "particles_nb": 2
            }
        }
    },
    "retina_detect": true,
    "config_demo": {
        "hide_card": false,
        "background_color": "#b61924",
        "background_image": "",
        "background_position": "50% 50%",
        "background_repeat": "no-repeat",
        "background_size": "cover"
    }
});

document.getElementById('editNicknameBtn').onclick = function() {
    document.getElementById('nicknameModal').style.display = "block";
};

document.querySelectorAll('.close').forEach(function(element) {
    element.onclick = function() {
        document.getElementById('nicknameModal').style.display = "none";
        document.getElementById('alertModal').style.display = "none";
    };
});

document.getElementById('saveNicknameBtn').onclick = function() {
    var newNickname = document.getElementById('newNickname').value;
    if (newNickname) {
        document.getElementById('nicknameDisplay').innerText = newNickname;
        document.getElementById('nicknameModal').style.display = "none";
    }
};

window.onclick = function(event) {
    if (event.target == document.getElementById('nicknameModal')) {
        document.getElementById('nicknameModal').style.display = "none";
    }
    if (event.target == document.getElementById('confirmModal')) {
        document.getElementById('confirmModal').style.display = "none";
    }
    if (event.target == document.getElementById('alertModal')) {
        document.getElementById('alertModal').style.display = "none";
    }
};

document.getElementById('deleteAccountBtn').onclick = function() {
    document.getElementById('confirmModal').style.display = "block";
};

document.getElementById('confirmYesBtn').onclick = function() {
    document.getElementById('confirmModal').style.display = "none";
    document.getElementById('alertModal').style.display = "block";
};

document.getElementById('confirmNoBtn').onclick = function() {
    document.getElementById('confirmModal').style.display = "none";
};

document.getElementById('alertOkBtn').onclick = function() {
    document.getElementById('alertModal').style.display = "none";
};

function profileEdit() {
    const form = document.forms['form_profile'];
    const token = localStorage.getItem('token');

    axios.patch('/profile/edit', {
    nickname: form.nickname.value
    }, {
    headers: {
        'Authorization': `Bearer ${token}`
    }
    }).then(res => {
    alert('회원 정보가 수정되었습니다.');
    }).catch(error => {
    alert('회원 정보 수정 중 오류가 발생했습니다.');
    });
}

function profileDelete() {
    const token = localStorage.getItem('token');
    axios.delete('/profile/delete', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
    }).then(res => {
    alert(res.data.message);
    localStorage.removeItem('token');
    // window.location.href = '/user/sigin'; << 로그아웃 시 login 으로 이동되는 사실을 알게 된 후 변경함. 
    window.location.href = '/user/login'; 
    }).catch(error => {
    alert('회원 탈퇴 중 오류가 발생했습니다.');
    });
}

function deleteComment(commentId) {
    const token = localStorage.getItem('token');
    axios.delete(`/profile/comments/${commentId}`, {
    headers: {
        'Authorization': `Bearer ${token}`
    }
    }).then(res => {
    alert(res.data.message);
    location.reload();
    }).catch(error => {
    alert('댓글 삭제 중 오류가 발생했습니다.');
    });
}

function unlikeCard(cardId) {
    const token = localStorage.getItem('token');
    axios.delete(`/profile/cards/unlike/${cardId}`, {
    headers: {
        'Authorization': `Bearer ${token}`
    }
    }).then(res => {
    alert(res.data.message);
    location.reload();
    }).catch(error => {
    alert('좋아요 취소 중 오류가 발생했습니다.');
    });
}

function logout() {
    const token = localStorage.getItem('token');
    axios.post('/user/logout', {}, {
    headers: {
        'Authorization': `Bearer ${token}`
    }
    }).then(res => {
    alert(res.data.message);
    localStorage.removeItem('token');
    // window.location.href = '/user/signin'; 이것 역시 변경
    window.location.href = '/user/login';
    }).catch(error => {
    alert('로그아웃 중 오류가 발생했습니다.');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderComments(comments, currentPage);
    setupPagination(totalComments);
});