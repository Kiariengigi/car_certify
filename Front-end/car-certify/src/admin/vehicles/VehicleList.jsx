import { List, Datagrid, TextField, NumberField, DateField, ImageField, ReferenceArrayField, ArrayField } from 'react-admin';

export const VehicleList = () => (
  <List resource="vehicles" perPage={10}>
    <Datagrid rowClick="show"> {/* Clicking a row goes to Show view */}
      <TextField source="numPlate" />
      <TextField source="make" />
      <TextField source="model" />
      <NumberField source="year" />
      <TextField source="engine" />
      <TextField source="fuel" />
      <TextField source="transmission" />
      <ImageField source="image[0]" label="Thumbnail" />
    </Datagrid>
  </List>
);

export default VehicleList