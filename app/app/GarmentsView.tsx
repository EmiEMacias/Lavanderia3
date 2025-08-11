import React, { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button, ScrollView } from 'react-native';
import { IGarments } from '../Interfaces';
import GarmentForm from '@/components/Garment.Form';
import { useOrder } from '../OrderContext';


const defaultGarment: IGarments = {
    type: 'Camisa',
    description: '',
    observations: '',
    services: [],
};

const AddGarment = () => {
  const { editIndex } = useLocalSearchParams<{ editIndex?: string }>();
  const editIdx = editIndex ? parseInt(editIndex) : -1;
  const { order, setOrder } = useOrder();
  const router = useRouter();

  const [garment, setGarment] = useState<IGarments>(
    editIdx >= 0
      ? { ...order.garments[editIdx], services: [...order.garments[editIdx].services] }
      : defaultGarment
  );

  const updateGarment = (key: 'type' | 'description' | 'observations', value: string) => {
    setGarment(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!garment.description.trim()) {
      alert('Agrega una descripción para la prenda.');
      return;
    }

    const updatedGarments = [...order.garments];
    if (editIdx >= 0) {
      updatedGarments[editIdx] = garment;
    } else {
      updatedGarments.push(garment);
    }

    setOrder(prev => ({ ...prev, garments: updatedGarments }));
    router.replace('/(tabs)/clients/CreateOrder');
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      <GarmentForm
        garment={garment}
        index={editIdx >= 0 ? editIdx : order.garments.length}
        onChangeGarment={updateGarment}
        onChangeService={() => {}}
        onChangeServiceFields={() => {}}
        onDeleteGarment={() => {}}
        onAddService={() => {}}
        onDeleteService={() => {}}
      />
      <Button title="Guardar Prenda" onPress={handleSave} />
    </ScrollView>
  );
};

export default AddGarment;
