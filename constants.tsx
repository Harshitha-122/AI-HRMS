import React from 'react';
import { UserRole, Employee, PerformanceReview, JobOpening, HiredCandidate } from './types';
import * as Icons from './components/icons';

export const ROLES: UserRole[] = [
  UserRole.Admin,
  UserRole.Manager,
  UserRole.HR,
  UserRole.Employee,
];

// Icons are now imported from a dedicated component for better organization
export const ICONS = {
    dashboard: <Icons.DashboardIcon />,
    employees: <Icons.EmployeesIcon />,
    recruitment: <Icons.RecruitmentIcon />,
    performance: <Icons.PerformanceIcon />,
    profile: <Icons.ProfileIcon />,
    logout: <Icons.LogoutIcon />,
    assistant: <Icons.SparklesIcon />,
};

export const MOCK_EMPLOYEES: Employee[] = [
    { id: 1, name: 'John Doe', role: 'Software Engineer', department: 'Technology', email: 'john.doe@example.com', phone: '123-456-7890', hireDate: '2022-01-15', avatarUrl: 'https://i.pravatar.cc/150?u=1', performance: [85, 88, 90, 86, 92, 95], attendance: { present: 120, absent: 5, late: 2 } },
    { id: 2, name: 'Jane Smith', role: 'Product Manager', department: 'Product', email: 'jane.smith@example.com', phone: '123-456-7891', hireDate: '2021-11-20', avatarUrl: 'https://i.pravatar.cc/150?u=2', performance: [90, 91, 89, 93, 94, 96], attendance: { present: 122, absent: 3, late: 0 } },
    { id: 3, name: 'Peter Jones', role: 'UX Designer', department: 'Design', email: 'peter.jones@example.com', phone: '123-456-7892', hireDate: '2022-03-10', avatarUrl: 'https://i.pravatar.cc/150?u=3', performance: [88, 85, 87, 90, 89, 91], attendance: { present: 118, absent: 6, late: 4 } },
    { id: 4, name: 'Mary Garcia', role: 'HR Specialist', department: 'Human Resources', email: 'mary.garcia@example.com', phone: '123-456-7893', hireDate: '2020-05-25', avatarUrl: 'https://i.pravatar.cc/150?u=4', performance: [92, 93, 95, 94, 96, 97], attendance: { present: 124, absent: 1, late: 1 } },
    { id: 5, name: 'James Brown', role: 'Marketing Manager', department: 'Marketing', email: 'james.brown@example.com', phone: '123-456-7894', hireDate: '2019-08-01', avatarUrl: 'https://i.pravatar.cc/150?u=5', performance: [80, 82, 85, 84, 86, 88], attendance: { present: 121, absent: 4, late: 3 } },
];

export const MOCK_REVIEWS: PerformanceReview[] = [
    { id: 1, employeeId: 1, reviewer: 'Jane Smith', date: '2023-06-30', score: 95, comments: 'Excellent work this quarter. Consistently delivers high-quality code.' },
    { id: 2, employeeId: 2, reviewer: 'Admin', date: '2023-06-30', score: 96, comments: 'Great leadership and product vision. The team is well-aligned.' },
    { id: 3, employeeId: 3, reviewer: 'Jane Smith', date: '2023-06-30', score: 91, comments: 'Creative designs and strong user-centric focus.' },
    { id: 4, employeeId: 4, reviewer: 'Admin', date: '2023-06-30', score: 97, comments: 'Proactive and highly efficient. A valuable asset to the HR team.' },
    { id: 5, employeeId: 5, reviewer: 'Admin', date: '2023-06-30', score: 88, comments: 'Successful campaign launch. Look for more data-driven insights next quarter.' },
];

export const MOCK_JOB_OPENINGS: JobOpening[] = [
    { id: 1, title: 'Senior Frontend Engineer', department: 'Technology', status: 'Open', applications: 78, interviews: 12, hired: 1, hiringManager: 'Jane Smith' },
    { id: 2, title: 'UX/UI Designer', department: 'Design', status: 'Open', applications: 120, interviews: 15, hired: 0, hiringManager: 'Peter Jones' },
    { id: 3, title: 'Digital Marketing Specialist', department: 'Marketing', status: 'Closed', applications: 95, interviews: 10, hired: 1, hiringManager: 'James Brown' },
    { id: 4, title: 'Backend Engineer (Go)', department: 'Technology', status: 'On Hold', applications: 55, interviews: 8, hired: 0, hiringManager: 'Jane Smith' },
];

export const MOCK_HIRED_CANDIDATES: HiredCandidate[] = [
    { id: 1, name: 'Alice Johnson', jobTitle: 'Senior Frontend Engineer', expertise: ['React', 'TypeScript', 'GraphQL'], hireDate: '2024-07-15', avatarUrl: 'https://i.pravatar.cc/150?u=6' },
    { id: 2, name: 'Bob Williams', jobTitle: 'Digital Marketing Specialist', expertise: ['SEO', 'Content Marketing', 'Google Analytics'], hireDate: '2024-06-20', avatarUrl: 'https://i.pravatar.cc/150?u=7' },
];
