// LoginScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import logo from './assets/logo.png';

const { width } = Dimensions.get('window');

// 1️⃣ Host + puerto -> apunta a tu backend en ejecución
const HOST = Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001';
// 2️⃣ Prefijo /api según app.ts → app.use('/api', ...)
axios.defaults.baseURL = `${HOST}/api`;

export default function LoginScreen() {
  const navigation = useNavigation();
  const [loginField, setLoginField] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const slideAnim = useRef(new Animated.Value(-width)).current;
  useEffect(() => {
    Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }).start();
  }, []);

  const handleLogin = async () => {
    try {
      // 👉 El endpoint real es POST /api/auth/login
      const { data } = await axios.post('/auth/login', {
        login: loginField,
        password,
      });
      await AsyncStorage.setItem('token', data.token);
      navigation.replace('Home');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || `Error ${err.response?.status || ''}`;
      Alert.alert('Login falló', msg);
    }
  };

  return (
    <View style={styles.screenContainer}>
      <Animated.View style={[styles.container, { transform: [{ translateX: slideAnim }] }]}>        
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>Iniciar Sesión</Text>

        <TextInput
          style={styles.input}
          placeholder="Email o usuario"
          value={loginField}
          onChangeText={setLoginField}
          autoCapitalize="none"
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputFlex}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconContainer}>
            <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color="#6C4F4B" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Ingresar</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: '#F2EFEA' },
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  logo: { width: 80, height: 80, resizeMode: 'contain', marginBottom: 20 },
  title: { fontSize: 28, color: '#6C4F4B', textAlign: 'center', marginBottom: 24 },
  input: {
    backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', width: '100%', marginBottom: 12,
  },
  inputContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 12 },
  inputFlex: { flex: 1, backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  iconContainer: { position: 'absolute', right: 12 },
  button: { backgroundColor: '#6C4F4B', padding: 14, borderRadius: 10, alignItems: 'center', width: '100%' },
  buttonText: { color: '#fff', fontSize: 16 },
});
