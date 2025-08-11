import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import constants from '../Constants';
import { IService } from '../Interfaces';

const { services } = constants;

interface Props {
  service: IService;
  ig: number;
  is: number;
  onChangeService: (value: string, ig: number, is: number) => void;
  onChangeServiceFields: (key: 'name' | 'quantity' | 'unitPrice', value: string, ig: number, is: number) => void;
  onDelete: () => void;
  canDelete: boolean;
}

const ServiceForm = ({ service, ig, is, onChangeService, onChangeServiceFields, onDelete, canDelete }: Props) => {
  return (
    <View style={styles.serviceContainer}>
      {canDelete && <Button title="Eliminar servicio" onPress={onDelete} />}

      <Picker
        selectedValue={service.name}
        onValueChange={(itemValue) => onChangeService(itemValue, ig, is)}>
        {services.map(({ name }, index) => (
          <Picker.Item key={index} label={name} value={name} color="black" />
        ))}
      </Picker>

      <Text>Cantidad:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={service.quantity.toString()}
        onChangeText={(value) => onChangeServiceFields('quantity', value, ig, is)}
      />

      <Text>Precio unitario:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={service.unitPrice.toString()}
        onChangeText={(value) => onChangeServiceFields('unitPrice', value, ig, is)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  serviceContainer: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
});

export default ServiceForm;
