import React, { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Button } from 'react-native';
import ServiceForm from '@/components/ServiceForm';
import { IService } from '../Interfaces';
import { useOrder } from '../OrderContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from '../Constants';

const defaultService: IService = {
    name: 'Lavado',
    quantity: 1,
    unitPrice: 22,
};

const AddService = () => {
    const { gIndex, sIndex } = useLocalSearchParams<{ gIndex: string, sIndex?: string, index?: string; }>();
    const { order, setOrder } = useOrder();
    const router = useRouter();
    const { index } = useLocalSearchParams<{ index: string }>();
    const garmentIndex = gIndex ? parseInt(gIndex) : parseInt(index ?? '-1');
    const serviceIndex = sIndex ? parseInt(sIndex) : -1;
    const [service, setService] = useState<IService>(defaultService);
    const [isEditing, setIsEditing] = useState(false);

    React.useEffect(() => {
        if (sIndex !== undefined && gIndex !== undefined) {
            const garmentIdx = parseInt(gIndex);
            const serviceIdx = parseInt(sIndex);

            if (order.garments[garmentIdx]?.services[serviceIdx]) {
                setService({ ...order.garments[garmentIdx].services[serviceIdx] });
                setIsEditing(true);
            }
        }
    }, [gIndex, sIndex, order.garments]);


    const updateField = (key: 'name' | 'quantity' | 'unitPrice', value: string) => {
        setService(prev => ({
            ...prev,
            [key]: key === 'name' ? value : Number(value),
        }));
    };

    const saveService = () => {
        const updatedGarments = [...order.garments];
        const updatedGarment = { ...updatedGarments[garmentIndex] };

        updatedGarment.services = Array.isArray(updatedGarment.services) ? [...updatedGarment.services] : [];

        if (serviceIndex >= 0 && isEditing) {
            updatedGarment.services[serviceIndex] = service;
        } else {
            updatedGarment.services.push(service);
        }

        updatedGarments[garmentIndex] = updatedGarment;
        setOrder(prev => ({ ...prev, garments: updatedGarments }));

        router.replace('/(tabs)/clients/CreateOrder');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ flex: 1, padding: 20 }}>
                <ServiceForm
                    service={service}
                    ig={garmentIndex}
                    is={0}
                    onChangeService={(selectedName) => {
                        const fullService = Constants.services.find(s => s.name === selectedName);
                        if (fullService) {
                            setService({
                                name: fullService.name,
                                quantity: 1,
                                unitPrice: fullService.unitPrice
                            });
                        }
                    }}
                    onChangeServiceFields={updateField}
                    onDelete={() => { }}
                    canDelete={false}
                />
                <Button title="Guardar Servicio" onPress={saveService} />
            </View>
        </SafeAreaView>
    );
};

export default AddService;
