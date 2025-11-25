import { Create, SimpleForm, TextInput, NumberInput } from "react-admin";

export const VehicleCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="numPlate" />
      <TextInput source="make" />
      <TextInput source="model" />
      <NumberInput source="year" />
    </SimpleForm>
  </Create>
);
