import React from "react";
import { Circle } from "react-konva";

export default function PolyVertice({vertex, ...rest}){
  const ref = React.useRef(null)

  React.useEffect(()=>{
    ref.current.x(vertex[0])
    ref.current.y(vertex[1])
  }, [vertex])

  return <Circle ref={ref} x={vertex[0]} y={vertex[1]} {...rest}/>
}