const prefix = '20살 돈이 ';
const skills = [
    '있다??',
    '없다..',
    '없다 그래서 카드가 필요 없다??',
    '없다, 아니 그래서 The Check 카드가 필요하다!!!',
].map(s => `${s}`);
const delay = 1;
const step = 1;
const tail = 5;
const timeout = 40;
const p = document.createElement('p');
document.body.appendChild(p);
const colors = [
    'red',
    'green',
    'blue',
    'yellow',
    'cyan',
    'magenta',
];
function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}
function getRandomChar() {
    return String.fromCharCode(Math.random() * (127 - 33) + 33);
}
function getRandomColoredString(n) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < n; i++) {
        const char = document.createElement('span');
        char.textContent = getRandomChar();
        char.style.color = getRandomColor();
        fragment.appendChild(char);
    }
    return fragment;
}
const $ = {
    text: '',
    prefixP: -tail,
    skillI: 0,
    skillP: 0,
    direction: 'forward',
    delay,
    step,
};
function render() {
    const skill = skills[$.skillI];
    if ($.step) {
        $.step--;
    } else {
        $.step = step;
        if ($.prefixP < prefix.length) {
            if ($.prefixP >= 0) {
                $.text += prefix[$.prefixP];
            }
            $.prefixP++;
        } else {
            if ($.direction === 'forward') {
                if ($.skillP < skill.length) {
                    $.text += skill[$.skillP];
                    $.skillP++;
                } else {
                    if ($.delay) {
                        $.delay--;
                    } else {
                        $.direction = 'backward';
                        $.delay = delay;
                    }
                }
            } else {
                if ($.skillP > 0) {
                    $.text = $.text.slice(0, -1);
                    $.skillP--;
                } else {
                    $.skillI = ($.skillI + 1) % skills.length;
                    $.direction = 'forward';
                }
            }
        }
    }
    p.textContent = $.text;
    p.appendChild(getRandomColoredString(
        $.prefixP < prefix.length ?
        Math.min(tail, tail + $.prefixP) :
        Math.min(tail, skill.length - $.skillP)));

    // 페이지 이동 조건 추가
    if ($.skillI === skills.length - 1 && $.skillP === skill.length && $.direction === 'forward' && $.delay === 0) {
        setTimeout(() => {
            window.location.href = '/index';
        }, 400); // 0.4초 후 페이지 이동
        return; // 페이지 이동 후 렌더링 중단
    }

    setTimeout(render, timeout);
}
// 브라우저의 어느 곳을 클릭해도 페이지 이동 이벤트 추가
document.body.addEventListener('click', () => {
    window.location.href = '/index';
});
setTimeout(render, 500);

// 엔터 키로 페이지 이동 이벤트 추가
document.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        window.location.href = '/index';
    }
});