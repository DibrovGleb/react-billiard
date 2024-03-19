import './styles/canvas.sass';
import { FC, useEffect, useRef} from 'react';
import imgsrc from './icons/billboard.jpg'

const NewCanvas:FC = () => {
    const ref = useRef<HTMLCanvasElement | null>(null),
          billboard = new Image(),
          balls: Array<Ball> = []
    billboard.src = imgsrc
   

    for (let i = 0; i < 5; i++)
    for (let j = 0; j <= i; j++){
        const x = 450+30*i,
        y = 180+31*j-i*15,
        rad = 15, 
        vx = 0, vy = 0,
        color = '#'+Math.floor(Math.random()*16777215).toString(16)

        balls.push(new Ball(x, y, rad, vx, vy, color))
    }
    balls.push(new Ball(155, 180, 15, 0, 0, '#fff'))


    useEffect(() => {
        const canvas = ref.current
        if (!canvas) return alert('canvas not found')
        
        const ctx = canvas.getContext('2d')
        if (!ctx) return alert('ctx not found')
                
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
        canvas.addEventListener('mousemove', (e) => {
            
            e.preventDefault()
            const rect = canvas.getBoundingClientRect()
            const сx = e.clientX - rect.left
            const сy = e.clientY - rect.top
            for (let i = 0; i < balls.length; i++) {
                balls[i].checkCursor(сx, сy)
            }
        })
    }, [])
    

    
    return (
        <canvas ref={ref} width={690} height={360}/>
    )
}

class Ball {x: number; y: number; rad: number; 
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
        ctx.fill()
    }

    update(canvas: HTMLCanvasElement) {
        const maxSpeed = 5
        if (this.vx > maxSpeed) this.vx = maxSpeed
        if (this.vx < -maxSpeed) this.vx = -maxSpeed
        if (this.vy > maxSpeed) this.vy = maxSpeed
        if (this.vy < -maxSpeed) this.vy = -maxSpeed
        if (this.x < this.rad+20 || this.x > canvas.width - this.rad-20)this.vx = -this.vx
        if (this.y < this.rad+20 || this.y > canvas.height - this.rad-20)this.vy = -this.vy
        if (Math.abs(this.vx) < 0.010) this.vx = 0
        if (Math.abs(this.vy) < 0.010) this.vy = 0
        Math.abs(this.vx) == 0 ? 0 : this.vx > 0 ? this.vx-=0.01 : this.vx+=0.01
        Math.abs(this.vy) == 0 ? 0 : this.vy > 0 ? this.vy-=0.01 : this.vy+=0.01
        this.x += this.vx
        this.y += this.vy
    }
  
    checkCursor(cx: number, cy: number){
        const dx = cx - this.x, dy = cy - this.y, 
              d = Math.sqrt(dx * dx + dy * dy)

        if( d <= this.rad*1.3) {
            this.vx += -dx*0.05
            this.vy += -dy*0.05
        }
    }
    checkCollision(ball: Ball) {
        const dx = this.x - ball.x, dy = this.y - ball.y, 
        dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < this.rad + ball.rad) {
          const vx1 = this.x - ball.x,
                vy1 = this.y - ball.y
          this.vx += vx1*0.05
          this.vy += vy1*0.05
          ball.vx += -vx1*0.05
          ball.vy += -vy1*0.05
        }
      }
}

export default NewCanvas