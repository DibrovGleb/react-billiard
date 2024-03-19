import './styles/canvas.sass';
import { FC, useEffect, useRef} from 'react';

class Ball {x: number; y: number; rad: number; 
    vx: number; vy: number; 
    color: string; mass: number;
  
    constructor(x: number, y: number, rad: number, vx: number, vy: number, color: string, mass: number) {
        this.x = x; this.y = y; this.rad = rad;
        this.vx = vx; this.vy = vy;
        this.color = color; this.mass = mass;
    }
  
    draw(ctx: CanvasRenderingContext2D) {
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.rad, 0, 2 * Math.PI)
      ctx.fillStyle = this.color
      ctx.fill()
    }
  
    update(canvas: HTMLCanvasElement) {
      this.x += this.vx
      this.y += this.vy
      // Обработка столкновений с границами
      if (this.x < 0 + this.rad || this.x > canvas.width - this.rad)this.vx = -this.vx
      if (this.y < 0 + this.rad || this.y > canvas.height - this.rad)this.vy = -this.vy
      Math.abs(this.vx) == 0 ? 0 : this.vx > 0 ? this.vx-=0.025 : this.vx+=0.025
      Math.abs(this.vy) == 0 ? 0 : this.vy > 0 ? this.vy-=0.025 : this.vy+=0.025
    }
  
    checkCollision(ball: Ball) {
        const dx = this.x - ball.x, dy = this.y - ball.y, 
        dist = Math.sqrt(dx * dx + dy * dy)
      
        // Проверка, пересекаются ли шары
        if (dist < this.rad + ball.rad) {
          // Расчет сил отталкивания
          const force = (this.mass + ball.mass) * (dist - this.rad - ball.rad) / dist, angle = Math.atan2(dy, dx)
      
          // Обновление скорости шаров
          this.vx += force * Math.cos(angle) / this.mass
          this.vy += force * Math.sin(angle) / this.mass
          ball.vx -= force * Math.cos(angle) / ball.mass
          ball.vy -= force * Math.sin(angle) / ball.mass
      
          // Изменение направления движения после столкновения
          const theta1 = Math.atan2(this.vy, this.vx),
          theta2 = Math.atan2(ball.vy, ball.vx),
          newvx1 = this.vx * Math.cos(theta1 - angle) - this.vy * Math.sin(theta1 - angle),
          newvy1 = this.vx * Math.sin(theta1 - angle) + this.vy * Math.cos(theta1 - angle),
          newvx2 = ball.vx * Math.cos(theta2 - angle) - ball.vy * Math.sin(theta2 - angle),
          newvy2 = ball.vx * Math.sin(theta2 - angle) + ball.vy * Math.cos(theta2 - angle)
          this.vx = newvx1
          this.vy = newvy1
          ball.vx = newvx2
          ball.vy = newvy2
          
        }
      }
    
    checkCursor(dx: number, dy: number){
      const bx = this.x - dx, by = this.y - dy, 
        dist = Math.sqrt(bx * bx + by * by)
      if(dist < this.rad){
        const force = (this.mass) * (dist - this.rad-1) / dist, 
              angle = Math.atan2(by, bx)
        this.vx += force * Math.cos(angle) / this.mass
        this.vy += force * Math.sin(angle) / this.mass
      }
      //console.log(Math.trunc(this.x+this.y),dx+dy)
      //console.log(Math.trunc(this.x), Math.trunc(this.y), dx,dy)
    }
}

const NewCanvas:FC = () => {
    
    const ref = useRef<HTMLCanvasElement | null>(null),
          balls: Array<Ball> = []

    function CreateBalls(canvas:HTMLCanvasElement){
      for (let i = 0; i < 3; i++) {
        const x = Math.random() * canvas.width, 
        y = Math.random() * canvas.height,
        rad = Math.random() * 10 + 10, 
        vx = 0, vy = 0,
        color = '#'+Math.floor(Math.random()*16777215).toString(16),
        mass = rad * rad

        balls.push(new Ball(x, y, rad, vx, vy, color, mass))
      }
    }
    
    useEffect(()=>{
        const canvas = ref.current
        if (!canvas) return alert('canvas not found')
        canvas.width = window.innerWidth-40
        canvas.height = window.innerHeight/2.5
        
        const ctx = canvas.getContext('2d')
        if (!ctx) return alert('ctx not found')
        //ctx.globalCompositeOperation='destination-over'
        CreateBalls(canvas)
        
        

        const anim = () =>{
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < balls.length; i++) {
                balls[i].draw(ctx)
                balls[i].update(canvas)
                // Проверка столкновений
                for (let j = i + 1; j < balls.length; j++) {
                  balls[i].checkCollision(balls[j])
                }
            }
            ctx.fillStyle = "#18cf0060";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            requestAnimationFrame(anim)
            
        }
        anim()

        window.addEventListener('resize', ()=> {
          canvas.width = window.innerWidth-40 
          canvas.height = window.innerHeight/2.5
        })
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect()
            const dx:number = e.clientX - rect.left
            const dy:number = e.clientY - rect.top
            for (let i = 0; i < balls.length; i++) {
              balls[i].checkCursor(dx,dy)
            }
            //console.log(`dx: ${dx}, dy: ${dy}`)
        })
    },[balls])

    return (
        <canvas ref={ref}/>
    )
}

export default NewCanvas