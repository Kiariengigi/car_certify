import React, { useEffect, useState } from 'react';
import { Title } from 'react-admin';
import { Card, CardContent } from '@mui/material';  // <-- use MUI here
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dataProvider from './dataProvider';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA00FF'];

const Dashboard = () => {
    const [vehicleData, setVehicleData] = useState([]);
    useEffect(() => {
        // Fetch all vehicles
        dataProvider.getList('vehicles', { pagination: { page: 1, perPage: 1000 }, sort: { field: 'make', order: 'ASC' }, filter: {} })
            .then(({ data }) => {
                // Count vehicle types
                const counts = {};
                data.forEach(v => {
                    counts[v.make] = (counts[v.make] || 0) + 1;
                });

                // Format for Recharts
                const chartData = Object.keys(counts).map((key) => ({ name: key, value: counts[key] }));
                setVehicleData(chartData);
            })
            .catch(err => console.error('Dashboard fetch error:', err));
    }, []);

    return (
        <Card>
            <CardContent>
                <Title title="Vehicle Types Distribution" />
                {vehicleData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={vehicleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                {vehicleData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <p>No vehicles to display</p>
                )}
            </CardContent>
        </Card>
    );
};

export default Dashboard;
