import React from "react"
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts"
export interface ChartData{
    fitness:number;
    name:string;
}
export interface ChartProps {
    data:ChartData[]
}
export const Chart=(props:ChartProps)=>{
    const {data} = props;
    return (
        <>
        <ResponsiveContainer width="100%" height="100%">
          
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <XAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="fitness" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>

      </>
    )
}