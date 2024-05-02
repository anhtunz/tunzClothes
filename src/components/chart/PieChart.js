import { Pie } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js'
import React from 'react'

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
)

function PieChart({ label, dataa }) {

    const data = {
        labels: label,
        datasets: [
            {
                data: dataa,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)',
                    'rgb(105, 105, 205)',
                    'rgb(153, 102, 255)',
                    'rgb(210, 150, 255)',
                    'rgb(255, 199, 132)',
                    'rgb(0, 128, 0)',
                    'rgb(255, 0, 0)',
                    'rgb(0, 0, 255)',
                    'rgb(128, 0, 128)',
                    'rgb(255, 140, 0)',
                    'rgb(0, 255, 255)',
                    'rgb(255, 255, 0)',
                    'rgb(128, 128, 128)',
                    'rgb(255, 255, 255)',
                    'rgb(0, 0, 58)',
                    'rgb(165, 42, 42)',
                    'rgb(255, 192, 203)',
                    'rgb(255, 165, 0)',
                    'rgb(0, 255, 0)',
                    'rgb(192, 192, 192)',
                    'rgb(128, 0, 0)'
                ],
                hoverOffset: 4
            },
        ],
    };
    return (
        <div style={{
            height: 400,
            width: '100%',
        }}>
            <Pie type='doughnut' data={data}></Pie>
        </div>
    )
}

export default PieChart