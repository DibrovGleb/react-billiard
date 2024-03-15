import './styles/canvas.sass';
import { FC, useEffect, useRef} from 'react';

const Canvas:FC = () => {
    return (
    <>
    <CreateCanvas/>
    <div className="btn-container">
        {/* <button onClick={()=> {ref.current.getContext('2d').clearRect(0, 0, ref.current.width, ref.current.height)}}>Clear</button> */}
        <button>Add</button>
        <button>Add 10</button>
        <button>Delete</button>
        <button>Delete all</button>
    </div>
    </>
    )
}

const CreateCanvas:FC = () =>{
    const ref = useRef<HTMLCanvasElement | null>(null),
          circle = { x: 100, y: 100, radius: 20, vx: 0, vy: 0};

    useEffect(()=>{
        const canvas = ref.current
        if (!canvas) return alert('canvas not found')
        canvas.width = window.innerWidth/1.1
        canvas.height = window.innerHeight/2.5
        
        const pen = canvas.getContext('2d')
        if (!pen) return alert('pen not found')
        const draw = () => {

            pen.clearRect(0, 0, canvas.width, canvas.height)
            pen.beginPath()
            circle.x+circle.radius > canvas.width || circle.x-circle.radius < 0 
            ? circle.vx = - circle.vx : circle.vx = +circle.vx
            circle.y + circle.radius > canvas.height || circle.y-circle.radius < 0
            ? circle.vy = - circle.vy : circle.vy = +circle.vy
            pen.arc(circle.x+=circle.vx, circle.y+=circle.vy, circle.radius, 0, 2 * Math.PI)
            circle.vx > 0 ? circle.vx -= 0.005 : circle.vx+=0.005
            circle.vy > 0 ? circle.vy -= 0.005 : circle.vy+=0.005
            pen.fillStyle = 'blue'
            pen.fill()
      
            requestAnimationFrame(draw);
          };
      
          draw();
      
          const onMouseMove = (event: MouseEvent) => {
            const dx = event.clientX-23;
            const dy = event.clientY-10;
            console.log(dx,dy,Math.trunc(circle.x),Math.trunc(circle.y))
            if (dx == Math.trunc(circle.x) || dy == Math.trunc(circle.y)){
                circle.vx = 2, circle.vy = 2;
            }
          };
      
          window.addEventListener('mousemove', onMouseMove);

    })
    
    return (
        <canvas ref={ref}/>
    )
}

export default Canvas