window.onload = () => {
    let canva = document.querySelector('.terisContainer');
    let {
        width, height, left, top
    } = window.getComputedStyle(canva);
    let terisSize = {
        width: parseInt(width),
        height: parseInt(height),
        left: parseInt(left),
        top: parseInt(top)
    }
    let start = document.getElementById('startBtn');
    window.curLeft = parseInt((terisSize.width / 2));
    window.curTop = parseInt(terisSize.top);
    window.layerHeight = parseInt(terisSize.height);
    //箭头函数的this指向定义时所在的对象，而不是运行时所在的对象。
    start.onmousedown = (e) => {
        let name = start.classList;
        start.innerHTML = name.contains('active') ? 'start' : 'restart';
        name.toggle('active');init();
    }
    start.onmouseup = (e) => {
        e.target.classList.remove('active');
    }
}
const shapeArr = [
    //L
    [
        [1, 1, 1],
        [1, 0, 0]
    ],
    [
        [1, 1],
        [0, 1],
        [0, 1]
    ],
    [
        [0, 0, 1],
        [1, 1, 1]
    ],
    [
        [1, 0],
        [1, 0],
        [1, 1]
    ],
    //反L
    [
        [1, 1, 1],
        [0, 0, 1]
    ],
    [
        [0, 1],
        [0, 1],
        [1, 1]
    ],
    [
        [1, 0, 0],
        [1, 1, 1]
    ],
    [
        [1, 1],
        [1, 0],
        [1, 0]
    ],
    //田
    [
        [1, 1],
        [1, 1]
    ],
    [
        [1, 1],
        [1, 1]
    ],
    [
        [1, 1],
        [1, 1]
    ],
    [
        [1, 1],
        [1, 1]
    ],
    //T
    [
        [0, 1, 0],
        [1, 1, 1]
    ],
    [
        [1, 0],
        [1, 1],
        [1, 0]
    ],
    [
        [1, 1, 1],
        [0, 1, 0]
    ],
    [
        [0, 1],
        [1, 1],
        [0, 1]
    ],
    //1
    [
        [1],
        [1],
        [1],
        [1]
    ],
    [
        [1, 1, 1, 1]
    ],
    [
        [1],
        [1],
        [1],
        [1]
    ],
    [
        [1, 1, 1, 1]
    ],
    //Z
    [
        [1, 1, 0],
        [0, 1, 1]
    ],
    [
        [0, 1],
        [1, 1],
        [1, 0]
    ],
    [
        [1, 1, 0],
        [0, 1, 1]
    ],
    [
        [0, 1],
        [1, 1],
        [1, 0]
    ],
    //倒Z
    [
        [0, 1, 1],
        [1, 1, 0]
    ],
    [
        [1, 0],
        [1, 1],
        [0, 1]
    ],
    [
        [0, 1, 1],
        [1, 1, 0]
    ],
    [
        [1, 0],
        [1, 1],
        [0, 1]
    ]
]
const init = (nextOne,score) => {
    const delay = 500,
        nextRandom = parseInt(Math.random() * shapeArr.length);
        curRandom = nextRandom?nextRandom:parseInt(Math.random() * shapeArr.length),
        itemSize = 20;
    params = {
        currTeris: nextOne ? nextOne : shapeArr[curRandom],
        nextTeris: shapeArr[nextRandom],
        delay: delay,
        curTop: curTop,
        curLeft: curLeft,
        itemSize: itemSize,
        curWrap: document.querySelector('.terisCarry'),
        layerHeight: layerHeight,
        score: score ? score : 0
    }
    document.querySelector('#scoreWrap').style.display = 'block';
    let teris = new Teris(params);
    teris.init();
    teris.moveSport();
}