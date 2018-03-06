'use strict'

class Teris {
    constructor(params) {
            this.itemSize = params.itemSize,
                this.currTeris = params.currTeris,
                this.nextTeris = params.nextTeris,
                this.delay = params.delay,
                this.curLeft = params.curLeft,
                this.curWrap = params.curWrap,
                this.curTop = params.curTop,
                this.layerHeight = params.layerHeight,
                this.score = params.score
        }
        //绘制方块
    drawTeris(el, top, left, minus, curtop = 0, curLeft) {
            let square = document.createElement('span');
            square.className = el.id === 'terisNext' ? 'nextStyle' : 'moveStyle';
            square.style.top = (curtop + top * this.itemSize) + 'px';
            square.style.left = (curLeft ? curLeft + left * this.itemSize : (el.clientWidth / 2 / 20 - minus + left) * this.itemSize) + 'px'
            el.appendChild(square);
        }
        // 循环队列变量
    tranveseItem(arr, func) {
        arr.map((val1, key1) => {
            val1.map((val2, key2) => {
                if (val2 === 1) {
                    func(key1, key2, val1, val2);
                }
            })
        })
    }
    init() {
            let nextWrap = document.querySelector('.terisNext');
            this.tranveseItem(this.currTeris, (key1, key2, val1) => {
                this.drawTeris(this.curWrap, key1, key2, Math.floor(val1.length / 2));
            })
            this.stopControl = false; //控制方块动止，true暂停，false运动
            this.declineRegularly();
            this.drawNext();
        }
        /**定时下降**/
    declineRegularly() {
            let moveItem = document.getElementsByClassName('moveStyle'),
                curWrap = this.curWrap
            this.timer = setTimeout(function loop() {
                if (moveItem.length && this.canMove.bind(this)().canMoveTop) {
                    for (let v of moveItem) {
                        v.style.top = `${parseInt(v.style.top) + this.itemSize}px`
                    }
                    if (!this.stopControl) {
                        setTimeout(loop.bind(this), this.delay)
                    }
                } else {
                    for (let v of moveItem) {
                        const time = setTimeout(function() {
                            v.className = 'stopStyle';
                            clearTimeout(time);
                        }, 300)
                    }
                    setTimeout(function() {
                        if (!this.gameOver()) {
                            this.clearLines(curWrap);
                            init(this.nextTeris, this.score);
                        }
                    }.bind(this), 300)
                }
            }.bind(this), this.delay)
        }
        /**判断游戏是否结束**/
    gameOver() {
            const stopItem = document.querySelectorAll('.stopStyle');
            let tops = [];
            for (let v of stopItem) {
                tops.push(parseInt(v.style.top));
            }
            return stopItem.length ? Math.min(...tops) <= 0 : false;
        }
        /**绘制下一个待出现的方块**/
    drawNext() {
            let next = document.getElementById('terisNext');
            next.innerHTML = '';
            this.tranveseItem(this.nextTeris, (key1, key2, val1, val2) => {
                this.drawTeris(next, key1, key2, Math.floor(val1.length / 2));
            })
        }
        /**消除成行方块，其上的方块进行补位**/
    clearLines(curWrap) {
            let res = [],
                stopStyle = [...document.querySelectorAll('.stopStyle')];
            stopStyle.sort(function(a, b) {
                return parseInt(a.style.top) - parseInt(b.style.top);
            });
            for (let i = 0; i < stopStyle.length; i++) {
                let models = [];
                for (let j = 0; j < stopStyle.length; j++) {
                    if (stopStyle[i].style.top === stopStyle[j].style.top) {
                        models.push(stopStyle[j]);
                    }
                }
                res.push(models)
            }
            let removeTop = [],
                lists = [];
            for (let t = 0; t < res.length; t++) {
                for (let m = 0; m < res[t].length; m++) {
                    if (res[t].length === 10) {
                        removeTop.push(parseInt(res[t][m].style.top));
                        res[t][m].remove();

                    } else {
                        lists.push(res[t][m])
                    }
                }
            }
            if (removeTop.length) {
                lists = Array.from(new Set(lists));
                let removeLen = Array.from(new Set(removeTop));
                this.score += 100 * removeLen.length;
                document.getElementById('score').innerHTML = this.score;
                for (let i of lists) {
                    if (parseInt(i.style.top) < Math.min(...removeLen)) {
                        i.style.top = `${parseInt(i.style.top) + removeLen.length * this.itemSize}px`;
                    }
                }
            }
        }
        /**判断边界**/
    judgeHigh(i, curLeft, curTop) {
            let stopItem = document.querySelectorAll('.stopStyle');
            let lefts = [],
                rights = [],
                tops = [],
                highest = null,
                leftest = null,
                rightest = null
            if (!stopItem.length) {
                highest = this.layerHeight;
                leftest = 0;
                rightest = this.curWrap.clientWidth - this.itemSize;
            } else {
                for (let v of stopItem) {
                    let top = parseInt(v.style.top);
                    let left = parseInt(v.style.left);
                    if (curLeft === left) {
                        tops.push(top);
                    }
                    if (curTop === top) {
                        curLeft > left ? lefts.push(left) : rights.push(left);
                    }
                }
                highest = tops.length ? Math.min(...tops) : this.layerHeight;
                leftest = lefts.length ? Math.max(...lefts) + this.itemSize : 0;
                rightest = rights.length ? Math.max(...rights) - this.itemSize : this.curWrap.clientWidth - this.itemSize;
            }
            return {
                leftest: leftest,
                rightest: rightest,
                highest: highest
            }
        }
        /**是否进行移动操作**/
    canMove(change, move = {
            canMoveLeft: true,
            canMoverRight: true,
            canMoveTop: true
        }) {
            let moveItem = document.getElementsByClassName('moveStyle');
            let bound = {};
            [...moveItem].sort(function(a, b) {
                return parseInt(a.style.top) - parseInt(b.style.top);
            });
            for (let i of moveItem) {
                bound = this.judgeHigh(i, parseInt(i.style.left), parseInt(i.style.top));
                if (move.canMoveTop && parseInt(i.style.top) >= bound.highest - 20) {
                    move.canMoveTop = false;
                }
                if(change && move.canMoveTop) {
                    if(bound.highest < Number(parseInt(i.style.top) + this.currTeris[0].length * this.itemSize)) {
                        move.canMoveTop = false;
                    }
                }
                if (move.canMoveLeft && parseInt(i.style.left) <= bound.leftest) {
                    move.canMoveLeft = false;
                }
                if (!change && move.canMoverRight && parseInt(i.style.left) >= bound.rightest) {
                    move.canMoverRight = false;
                }
                if(change && (this.currTeris.length > this.currTeris[0].length)) {
                    if(Number(parseInt(i.style.left) + this.currTeris[0].length * this.itemSize) > (bound.rightest + 20)){
                        move.canMoverRight = false;
                    }
                }
            }
            return move;
        }
        /**改变形状**/
    alertShape(lists) {
            let rowList = [],
                tops = [],
                lefts = [];
            let cur = this.currTeris
            let moveItem = document.querySelectorAll('.moveStyle'),
                curWrap = document.querySelector('.terisCarry')
            for (let i = 0; i <= cur[0].length - 1; i++) {
                let colList = [];
                for (let j = cur.length - 1; j >= 0; j--) {
                    colList.push(cur[j][i]);
                }
                rowList.push(colList)
            }
            for (let i of moveItem) {
                tops.push(parseInt(i.style.top))
                lefts.push(parseInt(i.style.left))
                i.remove();
            }
            this.currTeris = rowList;
            this.tranveseItem(this.currTeris, (key1, key2, val1) => {
                this.drawTeris(curWrap, key1, key2, Math.floor(val1.length / 2), tops[Math.ceil(this.currTeris.length / 2)], Math.min(...lefts));
            })
        }
        /****/
    moveSport() {
        let btns = document.querySelectorAll('.actBtns');
        const speedTime = 350;
        for (let v of btns) {
            v.onmousedown = (e) => {
                let target = e.target
                target.classList.add('active')
                let moveItem = document.querySelectorAll('.moveStyle');
                let move = this.canMove();
                    switch (target.id) {
                        case 'leftBtn': //左移动
                            if (move.canMoveLeft) {
                                for (let item of moveItem) {
                                    item.style.left = `${parseInt(item.style.left) - this.itemSize}px`
                                }
                            }
                            break;
                        case 'rightBtn': //右移动
                            if (move.canMoverRight) {
                                for (let item of moveItem) {
                                    item.style.left = `${parseInt(item.style.left) + this.itemSize}px`
                                }
                            }
                            break;
                        case 'topBtn': //暂停功能
                            this.stopControl = !this.stopControl;
                            !this.stopControl ? this.declineRegularly() : '';
                            break;
                        case 'bottomBtn': //加速
                            this.delay -= speedTime;
                            break;
                        case 'startBtn': //重新开始
                            this.curWrap.innerHTML = '';
                            this.score = 0;
                            break;
                        case 'alterBtn': //改变形状
                            if (this.canMove(true).canMoveTop && this.canMove(true).canMoverRight) {
                                this.alertShape(moveItem);
                            }
                            break;
                        default:
                            break;
                    }
            }
            v.onmouseup = (e) => {
                e.target.classList.remove('active');
                if (e.target.id === 'bottomBtn') {
                    this.delay += speedTime;
                }
            }
        }
    }
}