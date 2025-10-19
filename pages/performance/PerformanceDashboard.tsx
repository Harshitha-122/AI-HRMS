import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
// FIX: Corrected import paths for components, constants, and types.
import StatCard from '../../components/StatCard';
import { ICONS, MOCK_REVIEWS, MOCK_EMPLOYEES } from '../../constants';
import { Employee } from '../../types';

const getPerformanceCategory = (score: number) => {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Good';
  if (score >= 70) return 'Meets Expectations';
  return 'Needs Improvement';
};

const PerformanceDashboard: React.FC<{ employees?: Employee[] }> = ({ employees = MOCK_EMPLOYEES }) => {
  const reviews = MOCK_REVIEWS.filter(r => employees.some(e => e.id === r.employeeId));
  const avgPerformance = (reviews.reduce((acc, review) => acc + review.score, 0) / reviews.length).toFixed(1);

  const performanceDistribution = reviews.reduce((acc, review) => {
    const category = getPerformanceCategory(review.score);
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys(performanceDistribution).map(key => ({
    name: key,
    count: performanceDistribution[key],
  }));

  const sortedEmployees = [...employees].sort((a, b) => b.performance.slice(-1)[0] - a.performance.slice(-1)[0]);
  const topPerformers = sortedEmployees.slice(0, 3);
  const needsSupport = sortedEmployees.filter(e => e.performance.slice(-1)[0] < 80).slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Employees" value={employees.length.toString()} icon={ICONS.employees} color="bg-blue-100 text-blue-600" />
        <StatCard title="Avg. Performance" value={`${avgPerformance}%`} icon={ICONS.performance} color="bg-green-100 text-green-600" />
        <StatCard title="Reviews Completed" value={reviews.length.toString()} icon={ICONS.profile} color="bg-purple-100 text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md h-96">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Performance Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Employees">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6', '#f97316', '#ef4444'][index % 4]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-green-700 mb-4">Top Performers</h3>
            <ul className="space-y-3">
              {topPerformers.map(emp => (
                <li key={emp.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img src={emp.avatarUrl} alt={emp.name} className="w-10 h-10 rounded-full" />
                    <span className="ml-3 font-medium text-gray-800">{emp.name}</span>
                  </div>
                  <span className="font-bold text-green-600">{emp.performance.slice(-1)[0]}%</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-red-700 mb-4">Needs Support</h3>
             <ul className="space-y-3">
              {needsSupport.map(emp => (
                <li key={emp.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img src={emp.avatarUrl} alt={emp.name} className="w-10 h-10 rounded-full" />
                    <span className="ml-3 font-medium text-gray-800">{emp.name}</span>
                  </div>
                  <span className="font-bold text-red-600">{emp.performance.slice(-1)[0]}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;