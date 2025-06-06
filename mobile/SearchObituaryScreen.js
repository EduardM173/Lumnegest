import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, Image } from "react-native";

const obituariosMock = [
  {
    id: '1',
    titulo: 'En memoria de Juan Pérez',
    mensaje: 'Siempre estarás en nuestros corazones.',
    fecha: '2024-06-01',
    difunto: 'Juan Pérez',
    lugar: 'Capilla San José',
    hora: '16:00',
    familia: 'Familia Pérez López',
  },
  {
    id: '2',
    titulo: 'Recordando a María Gómez',
    mensaje: 'Tu luz nunca se apagará.',
    fecha: '2024-06-03',
    difunto: 'María Gómez',
    lugar: 'Salón Memorial Paz',
    hora: '10:30',
    familia: 'Familia Gómez Rojas',
  },
  {
    id: '3',
    titulo: 'Homenaje a Carlos Sánchez',
    mensaje: 'Gracias por tu ejemplo y amor.',
    fecha: '2024-06-05',
    difunto: 'Carlos Sánchez',
    lugar: 'Iglesia Central',
    hora: '14:00',
    familia: 'Familia Sánchez Flores',
  },
  {
    id: '4',
    titulo: 'Despedida a Ana Torres',
    mensaje: 'Tu bondad y alegría vivirán en nosotros.',
    fecha: '2024-06-07',
    difunto: 'Ana Torres',
    lugar: 'Capilla La Esperanza',
    hora: '09:00',
    familia: 'Familia Torres Aguilar',
  },
  {
    id: '5',
    titulo: 'En honor a Luis Fernández',
    mensaje: 'Siempre serás recordado por tu generosidad.',
    fecha: '2024-06-08',
    difunto: 'Luis Fernández',
    lugar: 'Salón Memorial Paz',
    hora: '11:30',
    familia: 'Familia Fernández Castro',
  },
  {
    id: '6',
    titulo: 'Con cariño a Rosa Méndez',
    mensaje: 'Tu sonrisa iluminó nuestras vidas.',
    fecha: '2024-06-09',
    difunto: 'Rosa Méndez',
    lugar: 'Iglesia Central',
    hora: '15:00',
    familia: 'Familia Méndez Vargas',
  },
  {
    id: '7',
    titulo: 'Hasta siempre, Pedro Ramírez',
    mensaje: 'Tu ejemplo de vida nos inspira.',
    fecha: '2024-06-10',
    difunto: 'Pedro Ramírez',
    lugar: 'Capilla San José',
    hora: '17:00',
    familia: 'Familia Ramírez Salinas',
  },
  {
    id: '8',
    titulo: 'Recuerdo eterno a Julia Salazar',
    mensaje: 'Tu amor y dedicación nunca serán olvidados.',
    fecha: '2024-06-11',
    difunto: 'Julia Salazar',
    lugar: 'Capilla La Esperanza',
    hora: '13:00',
    familia: 'Familia Salazar Pinto',
  },
];

export default function SearchObituaryScreen() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState(obituariosMock);

  const handleSearch = (text) => {
    setSearch(text);
    setData(
      obituariosMock.filter((item) =>
        item.difunto.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Obituario</Text>
      <TextInput
        style={styles.input}
        placeholder="Buscar por nombre del difunto..."
        value={search}
        onChangeText={handleSearch}
      />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.titulo}</Text>
            <View style={styles.difuntoRow}>
              <Image source={require("./assets/difunto.png")} style={styles.difuntoIcon} />
              <Text style={styles.cardField}><Text style={styles.bold}>Difunto:</Text> {item.difunto}</Text>
            </View>
            <Text style={styles.cardField}><Text style={styles.bold}>Mensaje:</Text> {item.mensaje}</Text>
            <Text style={styles.cardField}><Text style={styles.bold}>Fecha de publicación:</Text> {item.fecha}</Text>
            <Text style={styles.cardField}><Text style={styles.bold}>Lugar del velorio:</Text> {item.lugar}</Text>
            <Text style={styles.cardField}><Text style={styles.bold}>Hora:</Text> {item.hora}</Text>
            <Text style={styles.cardField}><Text style={styles.bold}>Familia:</Text> {item.familia}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noResults}>No se encontraron obituarios.</Text>}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
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
  input: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    fontSize: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#e0d7c6',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0d7c6',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6C4F4B',
    marginBottom: 8,
    textAlign: 'center',
  },
  difuntoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  difuntoIcon: {
    width: 28,
    height: 28,
    marginRight: 8,
    resizeMode: 'contain',
  },
  cardField: {
    fontSize: 15,
    color: '#3A4A58',
    marginBottom: 4,
  },
  bold: {
    fontWeight: 'bold',
    color: '#6C4F4B',
  },
  noResults: {
    textAlign: 'center',
    color: '#B59F6B',
    fontSize: 16,
    marginTop: 30,
  },
});
