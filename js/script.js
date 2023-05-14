const canvasEl = document.querySelector("canvas")
const canvasCtx = canvasEl.getContext("2d")

const gapX = 10

const mouse = { x: 0, y: 0 }

const field = {
    w: window.innerWidth,
    h: window.innerHeight,
    draw: function () {
        // desenha o campo
        canvasCtx.fillStyle = "#24448B"
        canvasCtx.fillRect(0, 0, this.w, this.h)
    },
}

const line = {
    w: 15,
    h: field.h,
    draw: function () {
        // desenha a linha central
        canvasCtx.fillStyle = "#f1faee"
        canvasCtx.fillRect(field.w / 2 - this.w / 2, 0, this.w, this.h)
    },
}

const leftPaddle = {
    x: gapX,
    y: 0,
    w: line.w,
    h: 200,
    _move: function () {
        this.y = mouse.y - this.h / 2
    },
    draw: function () {
        // desenha a raquete da esquerda
        canvasCtx.fillStyle = "#f1faee"
        canvasCtx.fillRect(this.x, this.y, this.w, this.h)
        this._move()
    },
}

const rightPaddle = {
    x: field.w - line.w - gapX,
    y: 0,
    w: line.w,
    h: 200,
    speed: 5,
    _move: function () {
        if (this.y + this.h / 2 < ball.y + ball.r) {
            this.y += this.speed
        } else {
            this.y -= this.speed
        }
    },
    speedUp: function () {
        this.speed += 1
    },
    draw: function () {
        // desenha a raquete da direita
        canvasCtx.fillStyle = "#f1faee"
        canvasCtx.fillRect(this.x, this.y, this.w, this.h)
        this._move()
    },
}

const score = {
    human: 0,
    computer: 0,
    increaseHuman: function () {
        this.human++;
    },
    increaseComputer: function () {
        this.computer++;
    },
    draw: function () {
        //desenha o placar
        canvasCtx.font = "bold 72px Arial"
        canvasCtx.textAlign = "center"
        canvasCtx.textBaseline = "top"
        canvasCtx.fillStyle = "#f1faee"
        canvasCtx.fillText(this.human, field.w / 4, 25)
        canvasCtx.fillText(this.computer, field.w / 4 + field.w / 2, 25)
    },
}

const ball = {
    x: field.w / 2,
    y: field.h / 2,
    r: 20,
    speed: 5,
    directionX: 1,
    directionY: 1,
    _calcPosition: function () {
        // verifica se o jogador 1 fez um ponto (x > largura do campo)
        if (this.x > field.w - this.r - rightPaddle.w - gapX) {
            // verifica se a raquete da direita está na posição y da bola
            if (this.y + this.r > rightPaddle.y && this.y - this.r < rightPaddle.y + rightPaddle.h) {
                // rebate a bola
                this._reverseX()
            } else {
                // ponto para o jogador 1
                score.increaseHuman()
                this._pointUp()
                setTimeout(() => {
                    if (score.human >= 10) {
                        alert(`10 x ${score.computer} Parabéns! você ganhou, vamos jogar novamente`)
                        this.speed = 5
                        rightPaddle.speed = 5
                        score.computer = 0
                        score.human = 0
                    }
                }, 500);
            }
        }

        // verifica se o jogador 2 fez um ponto (x < 0)
        if (this.x < this.r + leftPaddle.w + gapX) {
            // verifica se a raquete esquerda esta na posição Y da bola
            if (this.y + this.r > leftPaddle.y && this.y - this.r < leftPaddle.y + leftPaddle.h) {
                // rebate a bola
                this._reverseX()
            } else {
                // ponto para o jogador 2
                score.increaseComputer()
                this._pointUp()
                setTimeout(() => {
                    if (score.computer >= 10) {
                        alert(`${score.human} x 10 você perdeu, vamos jogar novamente`)
                        this.speed = 5
                        rightPaddle.speed = 5
                        score.computer = 0
                        score.human = 0
                    }
                }, 500);
            }
        }

        // verifica se a bola passou da parte superior e inferior do campo
        if ((this.y - this.r < 0 && this.directionY < 0) || (this.y > field.h - this.r && this.directionY > 0)) {
            // rebate a bola invertendo o sinal do eixo Y
            this._reverseY()
        }
    }, _reverseX: function () {
        this.directionX *= -1
    },
    _reverseY: function () {
        this.directionY *= -1
    },
    _speedUp: function () {
        this.speed += 3
    },
    _pointUp: function () {
        this._speedUp()
        rightPaddle.speedUp()

        this.x = field.w / 2
        this.y = field.h / 2
    },
    _move: function () {
        this.x += this.directionX * this.speed
        this.y += this.directionY * this.speed
    },
    draw: function () {
        // desenha a bola
        canvasCtx.fillStyle = "#FD7905"
        canvasCtx.beginPath()
        canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
        canvasCtx.fill()

        this._calcPosition()
        this._move()
    }
}

function setup() {
    canvasEl.width = canvasCtx.width = field.w
    canvasEl.height = canvasCtx.height = field.h
}

function draw() {
    field.draw()
    line.draw()

    leftPaddle.draw()
    rightPaddle.draw()

    score.draw()
    ball.draw()
}

// deixa a animação mais "suave", 
window.animateFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestionAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60)
        }
    )
})()

function main() {
    animateFrame(main)
    draw()
}

setup()
main()

canvasEl.addEventListener('mousemove', function (e) {
    mouse.x = e.pageX
    mouse.y = e.pageY
})