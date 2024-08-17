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