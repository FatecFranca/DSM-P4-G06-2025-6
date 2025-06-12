import React, { useState } from "react";
import api from "../services/api";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const CadastrarUsuario = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=(?:.*[A-Za-z]){3,})(?=(?:.*\d){3,}).{6,}$/;

  const handleCadastro = async () => {
    if (!name || !email || !password) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (!emailRegex.test(email)) {
      setEmailError("E-mail inválido");
      return;
    }

    if (!passwordRegex.test(password)) {
      setPasswordError("A senha deve conter no mínimo 3 letras e 3 números");
      return;
    }

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      if (response.status === 201 || response.status === 200) {
        Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
        navigation.navigate("Login");
      } else {
        Alert.alert("Erro", "Não foi possível cadastrar o usuário.");
      }
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      const msg = error.response?.data?.message || "Erro ao conectar com o servidor.";
      Alert.alert("Erro", msg);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.headerText}>Crie sua conta</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="person" size={20} color="#64B5F6" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#A0A0A0"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="mail" size={20} color="#64B5F6" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError(emailRegex.test(text) ? "" : "E-mail inválido");
            }}
            placeholderTextColor="#A0A0A0"
          />
        </View>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed" size={20} color="#64B5F6" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError(passwordRegex.test(text)
                ? ""
                : "Mínimo 3 letras e 3 números");
            }}
            placeholderTextColor="#A0A0A0"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color="#64B5F6"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleCadastro}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.linkText}>Já tem uma conta? Entrar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 20,
    padding: 25,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    marginTop: 60,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#E0E0E0",
    marginBottom: 25,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2C",
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: "#E0E0E0",
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkText: {
    color: "#A0A0A0",
    marginTop: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  errorText: {
    color: "#f44336",
    fontSize: 13,
    marginBottom: 10,
    marginLeft: 5,
  },
});

export default CadastrarUsuario;
