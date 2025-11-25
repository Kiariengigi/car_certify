import React from 'react';
import { Admin, Resource } from 'react-admin';
import dataProvider from './DataProvider';
import VehicleList from './vehicles/VehicleList';
import VehicleEdit from './vehicles/VehicleEdit'
import Dashboard from './dashboard'; // your PieChart dashboard

const AdminApp = () => (
    <Admin dashboard={Dashboard} dataProvider={dataProvider} basename='/admin'>
        <Resource name="vehicles" list={VehicleList} edit={VehicleEdit} />
    </Admin>
);

export default AdminApp;
