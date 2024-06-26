import { Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import React from 'react'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)


function BarChart({ allName, allData, lablel }) {
    const data = {
        labels: allName,
        datasets: [{
            label: lablel,
            data: allData,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
            ],
            borderWidth: 1
        }]
    };

    const options = {
        scales: {
            y: {
                type: 'linear', // Sử dụng scale tuyến tính
                beginAtZero: true
            }
        }
    };
    return (
        <div style={{
            height: 400,
            width: '100%',
        }}>
            <Bar
                type='bar'
                data={data}
                options={options}
            >
            </Bar>
        </div>
    )
}

export default BarChart