import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./pages/login";
import CadastrarUsuario from "./pages/cadastro";
import Dashboard from "./pages/dashboard";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false
          // title: "LOGIN",
          // headerLeft: null,
          // headerTitleAlign: "center",
          // headerStyle: {
          //   backgroundColor: "#1E1E1E",
          // },
          // headerTitleStyle: {
          //   color: "#fff",
          //   fontWeight: "bold",
          // },
        }}
      />
      <Stack.Screen
        name="CadastrarUsuario"
        component={CadastrarUsuario}
        options={{
          title: "CADASTRO DE USUÁRIOS",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#1E1E1E",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            color: "#fff",
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={({ navigation }) => ({
          headerLeft: null,
          title: "DASHBOARD",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#1E1E1E",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerRight: () => (
            <Ionicons
              name="log-out-outline"
              size={24}
              color="#fff"
              style={{ marginRight: 15 }}
              onPress={async () => {
                try {
                  await AsyncStorage.removeItem("userToken");
                  navigation.replace("Login");
                } catch (error) {
                  console.error("Erro ao realizar o logout:", error);
                }
              }}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
}
