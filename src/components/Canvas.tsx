import './styles/canvas.sass';
import { FC, useEffect, useRef, useState} from 'react';
import imgsrc from './icons/billboard.jpg'

const NewCanvas:FC = () => {
    const ref = useRef<HTMLCanvasElement | null>(null),
        inputRef = useRef<HTMLInputElement | null>(null),
        billboard = new Image(),
        [count, setCount] = useState(0),
        balls: Array<Ball> = []
            
        billboard.src = imgsrc
        
    for (let i = 0; i < 5; i++)
    for (let j = 0; j <= i; j++){
        const rad:number = Math.round(Math.random()*5+10),
              x:number = 400+(rad+27)*i,
              y:number = 180+(rad+27)*j-i*15,
              vx:number = 0, vy:number = 0,
              color:string = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
              
              balls.push(new Ball(x, y, rad, vx, vy, color))
        }
        balls.push(new Ball(155, 180, 15, 0, 0, '#ffffff'))

        useEffect(() => {
            const canvas:HTMLCanvasElement|null = ref.current
            if (!canvas) return alert('canvas not found')
        
            const ctx:CanvasRenderingContext2D|null = canvas.getContext('2d')
            if (!ctx) return alert('ctx not found')
            
            const input = inputRef.current
            if(!input) return alert('input LOST!')

            const anim = () =>{
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.drawImage(billboard, 0,0)
                for (let i = 0; i < balls.length; i++) {
                    balls[i].draw(ctx)
                    balls[i].update(canvas)
                    for (let j = i + 1; j < balls.length; j++) {
                        balls[i].checkCollision(balls[j])
                    }
                }        
                requestAnimationFrame(anim)
            }
            anim()

            let selectedBall:number | null = null

            const rightClick = (e: MouseEvent) => {
                e.preventDefault();
                const rect = canvas.getBoundingClientRect(),
                      cx = e.clientX - rect.left,
                      cy = e.clientY - rect.top

                input.style.display = 'none'

                for (let i = 0; i < balls.length; i++) {
                    if (balls[i].checkCursor(cx, cy, false)) {
                        selectedBall = i
                        const newTop = e.clientY+20,
                              newLeft = e.clientX-25
                        input.value = balls[selectedBall].color
                        input.style.display = 'block'
                        input.style.top = `${newTop}px`;
                        input.style.left = `${newLeft}px`;
                        break 
                    }
                }
            }  

            const kickBall = (e:MouseEvent) =>{
                e.preventDefault()
                
                input.style.display = 'none'

                const rect = canvas.getBoundingClientRect(),
                    сx = e.clientX - rect.left,
                    сy = e.clientY - rect.top

                for (let i = 0; i < balls.length; i++) {
                    balls[i].checkCursor(сx, сy, true) 
                }
            }

            const inputChange = (e:Event) => {
                const color = (e.target as HTMLInputElement).value
                input.value = color
                if (selectedBall) balls[selectedBall].changeColor(color)
            }
            
            input.addEventListener('input', inputChange)
            canvas.addEventListener('click', kickBall)
            canvas.addEventListener('contextmenu', rightClick)

            return () => {
                if (canvas) {
                    canvas.removeEventListener("contextmenu", rightClick)
                    canvas.removeEventListener('click', kickBall)
                    input.removeEventListener('input', inputChange)
                }
            }
        }, [ref])
        
    return (
        <>
        <h2>Instructions:</h2>
        <h2>Left click - kick ball</h2>
        <h2>Right click - change color</h2>
        <h2>Moves {count}</h2>
        <canvas ref={ref} width={690} height={360} onClick={()=>setCount(count+1)}/>
        <input ref={inputRef} className="colorpicker" type="color"/>
        </>
    )
}

class Ball {
    x: number; y: number; rad: number; 
        vx: number; vy: number;
        color: string
    
        constructor(x: number, y: number, rad: number, vx: number, vy: number, color: string) {
            this.x = x; this.y = y; this.rad = rad;
            this.vx = vx; this.vy = vy;
            this.color = color
        }
    
        draw(ctx: CanvasRenderingContext2D) {
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.rad, 0, 2 * Math.PI)
            ctx.fillStyle = this.color
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.fill()
            ctx.stroke();
        }

        update(canvas: HTMLCanvasElement) {
            const maxSpeed = 5
            if (this.vx > maxSpeed) this.vx = maxSpeed
            if (this.vx < -maxSpeed) this.vx = -maxSpeed
            if (this.vy > maxSpeed) this.vy = maxSpeed
            if (this.vy < -maxSpeed) this.vy = -maxSpeed
            if (this.x < this.rad+20 || this.x > canvas.width - this.rad-20)this.vx = -this.vx
            if (this.y < this.rad+20 || this.y > canvas.height - this.rad-20)this.vy = -this.vy
            if (Math.abs(this.vx) < 0.005) this.vx = 0
            if (Math.abs(this.vy) < 0.005) this.vy = 0
            Math.abs(this.vx) == 0 ? 0 : this.vx > 0 ? this.vx-=0.01 : this.vx+=0.01
            Math.abs(this.vy) == 0 ? 0 : this.vy > 0 ? this.vy-=0.01 : this.vy+=0.01
            this.x += this.vx
            this.y += this.vy
        }
    
        checkCursor(cx: number, cy: number, state:boolean){
            const dx:number = cx - this.x,
                dy:number = cy - this.y, 
                d:number = Math.sqrt(dx * dx + dy * dy)

            if( d <= this.rad*1.8) {
                if (state) this.vx += -dx*0.4, this.vy += -dy*0.4
                else return true
            }
        }

        checkCollision(ball: Ball) {
            const dx:number = this.x - ball.x, 
                dy:number = this.y - ball.y, 
                dist:number = Math.sqrt(dx * dx + dy * dy)

            if (dist < this.rad + ball.rad) {
            const vx1 = this.x - ball.x,
                    vy1 = this.y - ball.y

            this.vx += vx1*0.05
            this.vy += vy1*0.05
            ball.vx += -vx1*0.05
            ball.vy += -vy1*0.05
            }
        }

        changeColor (newColor:string){
            this.color = newColor
        }
    }

    export default NewCanvas