// vehicles/VehicleEdit.jsx
import React from 'react';
import { Edit, SimpleForm, TextInput, NumberInput, ArrayInput, SimpleFormIterator } from 'react-admin';

const VehicleEdit = (props) => (
    <Edit {...props} title="Edit Vehicle">
        {/* Scrollable container */}
        <div style={{ maxHeight: '80vh', overflowY: 'auto', paddingRight: '1rem' }}>
            <SimpleForm>
                <TextInput source="numPlate" />
                <TextInput source="make" />
                <TextInput source="model" />
                <NumberInput source="year" />
                <TextInput source="engine" />
                <TextInput source="fuel" />
                <TextInput source="transmission" />

                <ArrayInput source="mileageReports">
                    <SimpleFormIterator>
                        <NumberInput source="mileage" />
                        <TextInput source="date" />
                    </SimpleFormIterator>
                </ArrayInput>

                <ArrayInput source="accidentReports">
                    <SimpleFormIterator>
                        <TextInput source="severity" />
                        <TextInput source="date" />
                        <TextInput source="location" />
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </div>
    </Edit>
);

export default VehicleEdit;
