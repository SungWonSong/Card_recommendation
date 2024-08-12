document.addEventListener('DOMContentLoaded', (event) => {
            function updateCardSize() {
                const cardCount = document.querySelectorAll('.stack').length;
                const root = document.documentElement;
                if (cardCount > 70) {
                    root.style.setProperty('--cardW', '9em');
                    root.style.setProperty('--cardH', '5em');
                } else if (cardCount > 30) {
                    root.style.setProperty('--cardW', '10em');
                    root.style.setProperty('--cardH', '6em');
                } else {
                    root.style.setProperty('--cardW', '14em');
                    root.style.setProperty('--cardH', '8em');
                }

                // 카드가 20개 이하일 때 가로 간격 좁게 설정
                if (cardCount <= 20) {
                    root.style.setProperty('--cardColumnGap', '0.5em');
                } else {
                    root.style.setProperty('--cardColumnGap', '1.5em');
                }

                const mainElement = document.querySelector('main');
                const cardsElement = document.querySelector('.cards');
                let cardsPerRow;

                if (window.innerWidth >= 1281) {
                    cardsPerRow = 5;
                } else if (window.innerWidth >= 961) {
                    cardsPerRow = 4;
                } else if (window.innerWidth >= 641) {
                    cardsPerRow = 3;
                } else if (window.innerWidth >= 361) {
                    cardsPerRow = 2;
                } else {
                    cardsPerRow = 1;
                }
                
                const rows = Math.ceil(cardCount / cardsPerRow);
                mainElement.style.height = `calc((var(--cardH) + 8em) * ${rows} + ${(rows - 1)} * 8em)`;
                cardsElement.style.height = `calc((var(--cardH) + 8em) * ${rows} + ${(rows - 1)} * 8em)`;
                document.querySelectorAll('.card-image').forEach(img => {
                    img.addEventListener('load', () => {
                        const card = img.parentElement;
                        const aspectRatio = img.naturalWidth / img.naturalHeight;
                        card.style.width = `${aspectRatio * parseFloat(getComputedStyle(card).height)}px`;
                    });
                });
            }

            function scrollGrid() {
                const mainElement = document.querySelector("main");
                const cardsElement = document.querySelector(".cards");
                if (mainElement && cardsElement) {
                    let bodyHeight = document.body.offsetHeight,
                        mainHeight = mainElement.offsetHeight,
                        transY = (window.pageYOffset / (mainHeight - bodyHeight)) * -100;
                    cardsElement.style.setProperty("--scroll", transY + "%");
                }
            }

            window.addEventListener("resize", () => {
                updateCardSize();
                scrollGrid();
            });
            window.addEventListener("scroll", scrollGrid);
            updateCardSize();
            scrollGrid();

            document.querySelectorAll('.card.top').forEach(card => {
                card.addEventListener('click', () => {
                    const cardId = card.getAttribute('data-id');
                    window.location.href = `/detail/${cardId}`;
                });
            });
        });