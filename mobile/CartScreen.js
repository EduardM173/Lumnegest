import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";

const paquetes = [
  {
    id: '1',
    nombre: 'Paquete Esencial',
    descripcion: 'Incluye ataúd estándar, traslado local y asesoría básica.',
    precio: 1200,
  },
  {
    id: '2',
    nombre: 'Paquete Intermedio',
    descripcion: 'Ataúd de lujo, traslado nacional, ceremonia personalizada y asesoría completa.',
    precio: 3500,
  },
  {
    id: '3',
    nombre: 'Paquete Premium',
    descripcion: 'Ataúd premium, traslado regional, servicio de catering y apoyo psicológico.',
    precio: 5200,
  },
  {
    id: '4',
    nombre: 'Paquete Familiar',
    descripcion: 'Incluye servicios para varios miembros, atención personalizada y memorial digital.',
    precio: 8000,
  },
];

export default function CartScreen({ navigation }) {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrito de Compras</Text>
      <FlatList
        data={paquetes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const isSelected = selectedId === item.id;
          return (
            <TouchableOpacity
              style={[styles.itemCard, isSelected && styles.selectedCard]}
              onPress={() => setSelectedId(item.id)}
              activeOpacity={0.8}
            >
              <View style={styles.row}>
                <Image source={require("./assets/paquete.png")} style={styles.iconoPaquete} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.nombre}>{item.nombre}</Text>
                  <Text style={styles.descripcion}>{item.descripcion}</Text>
                  <View style={styles.precioRow}>
                    <Text style={styles.precioLabel}>Precio:</Text>
                    <Text style={styles.precio}>Bs {item.precio.toLocaleString('es-BO')}</Text>
                  </View>
                </View>
                {isSelected && (
                  <Text style={styles.check}>✓</Text>
                )}
              </View>
              <TouchableOpacity
                style={[styles.selectButton, isSelected && styles.selectButtonActive]}
                onPress={() => setSelectedId(item.id)}
              >
                <Text style={[styles.selectButtonText, isSelected && styles.selectButtonTextActive]}>
                  {isSelected ? 'Seleccionado' : 'Seleccionar'}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
      <TouchableOpacity
        style={[styles.button, !selectedId && { backgroundColor: '#ccc' }]}
        onPress={() => selectedId && alert('¡Compra realizada!')}
        disabled={!selectedId}
      >
        <Text style={styles.buttonText}>Finalizar compra</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2EFEA',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6C4F4B',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0d7c6',
  },
  selectedCard: {
    borderColor: '#B59F6B',
    backgroundColor: '#f9f6f1',
    shadowOpacity: 0.18,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconoPaquete: {
    width: 48,
    height: 48,
    marginRight: 16,
    resizeMode: 'contain',
  },
  nombre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6C4F4B',
    marginBottom: 4,
  },
  descripcion: {
    fontSize: 15,
    color: '#3A4A58',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  precioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  precioLabel: {
    fontSize: 16,
    color: '#6C4F4B',
    marginRight: 8,
    fontWeight: 'bold',
  },
  precio: {
    fontSize: 18,
    color: '#B59F6B',
    fontWeight: 'bold',
  },
  check: {
    fontSize: 28,
    color: '#B59F6B',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  selectButton: {
    backgroundColor: '#e0d7c6',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    alignSelf: 'flex-end',
  },
  selectButtonActive: {
    backgroundColor: '#B59F6B',
  },
  selectButtonText: {
    color: '#6C4F4B',
    fontWeight: 'bold',
    fontSize: 15,
  },
  selectButtonTextActive: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#6C4F4B',
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
