import React from 'react';
import { Text, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import constants from '../Constants';
import { IGarments } from '../Interfaces';
import { SafeAreaView } from 'react-native-safe-area-context';

const { garments} = constants;

interface Props {
  garment: IGarments;
  index: number;
  onChangeGarment: (key: 'type' | 'description' | 'observations', value: string, ig: number) => void;
  onChangeService: (value: string, ig: number, is: number) => void;
  onChangeServiceFields: (key: 'name' | 'quantity' | 'unitPrice', value: string, ig: number, is: number) => void;
  onDeleteGarment: () => void;
  onAddService: () => void;
  onDeleteService: (is: number) => void;
}

const GarmentForm = ({
  garment, index, onChangeGarment,
}: Props) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', padding: 20 }}>
      <Text style={styles.title}>#{index + 1}</Text>
      <Text>Tipo de prenda:</Text>
      <Picker
        selectedValue={garment.type}
        onValueChange={(value) => onChangeGarment('type', value, index)}
        style={{ color: 'black' }}
        >
        {garments.map((g, idx) => (
          <Picker.Item key={idx} label={g} value={g} color="black" />
        ))}
      </Picker>

      <Text>Descripción:</Text>
      <TextInput
        style={styles.input}
        value={garment.description}
        onChangeText={(value) => onChangeGarment('description', value, index)}
      />

      <Text>Observaciones:</Text>
      <TextInput
        style={styles.input}
        value={garment.observations}
        onChangeText={(value) => onChangeGarment('observations', value, index)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
});

export default GarmentForm;
