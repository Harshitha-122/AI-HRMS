import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// FIX: Corrected import path for types.
import { Employee } from '../types';

interface PerformanceChartProps {
    data: Employee[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
    
    const chartData = data[0]?.performance.map((score, index) => {
        const entry: {[key: string]: string | number} = { month: `Month ${index + 1}`};
        data.forEach(employee => {
            entry[employee.name] = employee.performance[index];
        });
        return entry;
    });

    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f97316', '#8b5cf6'];

    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-96">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Performance Trend</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {data.map((employee, index) => (
                         <Line key={employee.id} type="monotone" dataKey={employee.name} stroke={colors[index % colors.length]} activeDot={{ r: 8 }} />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PerformanceChart;