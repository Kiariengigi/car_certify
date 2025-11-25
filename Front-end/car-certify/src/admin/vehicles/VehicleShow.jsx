import { Show, SimpleShowLayout, TextField, NumberField, ArrayField, Datagrid, DateField } from 'react-admin';

export const VehicleShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="numPlate" />
      <TextField source="make" />
      <TextField source="model" />
      <NumberField source="year" />
      <TextField source="engine" />
      <TextField source="fuel" />
      <TextField source="transmission" />

      {/* Mileage Reports */}
      <ArrayField source="mileageReports" label="Mileage Reports">
        <Datagrid>
          <DateField source="date" />
          <NumberField source="mileage" />
        </Datagrid>
      </ArrayField>

      {/* Accident Reports */}
      <ArrayField source="accidentReports" label="Accident Reports">
        <Datagrid>
          <DateField source="date" />
          <TextField source="severity" />
          <TextField source="location" />
        </Datagrid>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);
