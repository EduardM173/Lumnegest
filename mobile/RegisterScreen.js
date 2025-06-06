// RegisterScreen.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    nombre_usuario: "",
    email: "",
    password: "",
    confirm: "",
    nombres: "",
    apellidos: "",
    telefono: "",
    direccion: "",
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const slideAnim = useRef(new Animated.Value(100)).current; // empieza 100px abajo

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleRegister = () => {
    console.log("Registrando...", form);
  };

  const isFormValid =
    form.nombre_usuario &&
    form.email &&
    form.password &&
    form.confirm &&
    form.nombres &&
    form.apellidos &&
    form.telefono &&
    form.direccion &&
    acceptedTerms;

  return (
    <View style={styles.screenContainer}>
      <Animated.View style={{ transform: [{ translateY: slideAnim }], flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Registro</Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre de usuario"
            value={form.nombre_usuario}
            onChangeText={(text) => handleChange("nombre_usuario", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={form.email}
            onChangeText={(text) => handleChange("email", text)}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={form.password}
            onChangeText={(text) => handleChange("password", text)}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirmar contraseña"
            value={form.confirm}
            onChangeText={(text) => handleChange("confirm", text)}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Nombres"
            value={form.nombres}
            onChangeText={(text) => handleChange("nombres", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Apellidos"
            value={form.apellidos}
            onChangeText={(text) => handleChange("apellidos", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            value={form.telefono}
            onChangeText={(text) => handleChange("telefono", text)}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Dirección"
            value={form.direccion}
            onChangeText={(text) => handleChange("direccion", text)}
          />

          <Pressable
            style={styles.checkboxContainer}
            onPress={() => setAcceptedTerms(!acceptedTerms)}
          >
            <View style={[styles.checkbox, acceptedTerms && styles.checkedBox]}>
              {acceptedTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Acepto los términos y condiciones</Text>
          </Pressable>

          <TouchableOpacity
            style={[styles.button, !isFormValid && styles.buttonDisabled]}
            disabled={!isFormValid}
            onPress={handleRegister}
          >
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>

      {/* Barra inferior */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Home")}
        >
          <Image
            source={require("./assets/home-icon.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItemActive}
          onPress={() => navigation.navigate("Login")}
        >
          <Image
            source={require("./assets/user-icon.png")}
            style={styles.navIconActive}
          />
          <Text style={styles.navLabelActive}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} disabled>
          <Image
            source={require("./assets/cart-icon.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navLabel}>Carrito</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} disabled>
          <Image
            source={require("./assets/search-icon.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navLabel}>Buscar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#F2EFEA",
  },
  container: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    color: "#6C4F4B",
    textAlign: "center",
    marginVertical: 12,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#6C4F4B",
    borderRadius: 4,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkedBox: {
    backgroundColor: "#6C4F4B",
  },
  checkmark: {
    color: "white",
    fontWeight: "bold",
  },
  checkboxLabel: {
    color: "#3A4A58",
  },
  button: {
    backgroundColor: "#6C4F4B",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },
  buttonDisabled: {
    backgroundColor: "#aaa",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#2E3B4E",
    paddingVertical: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  navItem: {
    alignItems: "center",
  },
  navItemActive: {
    alignItems: "center",
  },
  navIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
    tintColor: "#fff",
  },
  navIconActive: {
    width: 24,
    height: 24,
    marginBottom: 4,
    tintColor: "#FFD700", // icono activo en dorado
  },
  navLabel: {
    color: "#fff",
    fontSize: 12,
  },
  navLabelActive: {
    color: "#FFD700",
    fontSize: 12,
  },
});
