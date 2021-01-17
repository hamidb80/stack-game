class Stack {
    constructor(pos, size) {
        this.color = [random(255), random(255), random(255), random(255)] // rgb
        this.position = [...pos] // x, y
        this.size = [...size] // x, y, z
    }

    top_of_you_size(another_stack) {
        if (this.position[0] < another_stack.position[0]) {
            let size = this.position[0] + this.size[0] - another_stack.position[0]

            if (size > 0)
                return size
        }

        else {
            let size = another_stack.position[0] + another_stack.size[0] - this.position[0]

            if (size > 0)
                return size
        }

        return 0
    }

    draw() {
        push()

        strokeWeight(0.5);
        stroke(0, 0, 0, 0);

        translate(...this.position)

        fill(...this.color)
        box(...this.size)

        pop()
    }
}

const speedPerFrame = 10,
    framePerSec = 60,
    stacks = []

let last_width = 300

function setup() {
    frameRate(framePerSec)
    createCanvas(710, 400, WEBGL)

    stacks.push(new Stack([0, height / 2 - 15], [last_width, 30, 10]))
    stacks.push(new Stack([0, height / 2 - 45], [last_width, 30, 10]))
}

let move_towards = true
function draw() {
    background(230)
    play_animations()

    let last_stack = stacks[stacks.length - 1]

    if (move_towards == false && last_stack.position[0] < -width / 2)
        move_towards = true

    else if (move_towards == true && last_stack.position[0] > width / 2)
        move_towards = false

    last_stack.position[0] += (move_towards ? 1 : -1) * speedPerFrame

    for (const s of stacks)
        s.draw()

}

function keyPressed() {
    let last_stack = stacks[stacks.length - 1]
    let posY = last_stack.position[1] - last_stack.size[1]

    if (stacks.length >= 2) {
        prelast_stack = stacks[stacks.length - 2]

        let tpu = prelast_stack.top_of_you_size(last_stack)
        if (tpu === 0)
            alert('you lost')

        else {

            if (prelast_stack.position[0] < last_stack.position[0])
                last_stack.position[0] = prelast_stack.position[0] + prelast_stack.size[0] / 2 - tpu / 2
            else
                last_stack.position[0] = prelast_stack.position[0] - prelast_stack.size[0] / 2 + tpu / 2


            last_stack.size[0] = tpu
            last_width = tpu
        }
    }

    stacks.push(new Stack([last_stack.position[0], posY], [last_width, 30, 10]))

    if (stacks.length > 8)
        add_animation(() => stacks.map(s => s.position[1] += 1), 30)

    document.getElementById('score').innerHTML = stacks.length - 1
}

animations = [] // [{func:, times:}]
function play_animations() {
    non_zeroes = []

    for (anime of animations) {
        anime.func()
        anime.times -= 1

        if (anime.times > 0)
            non_zeroes.push(anime)

        animations = non_zeroes
    }
}
function add_animation(func, times) {
    animations.push({ func, times })
}
