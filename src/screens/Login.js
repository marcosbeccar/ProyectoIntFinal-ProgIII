import React, { Component } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { auth } from "../firebase/config";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      errorMSG: "",
    };
  }

  handleSubmit = () => {
    const { email, password } = this.state;

    if (!email.includes("@")) {
        this.setState({ errorMSG: "Email mal formateado" });
        return;
      }
  
      if (password.length < 6) {
        this.setState({ errorMSG: "La password debe tener una longitud mínima de 6 caracteres" });
        return;
      }
    

    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ errorMSG: "" });
        this.props.navigation.navigate("HomeMenu"); // Debería redirigir al Home si funciona
      })
      .catch(() => {
        this.setState({ errorMSG: "Credenciales incorrectas" });
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textoInicial}>Inicia sesión desde tu cuenta</Text>

        <TextInput
          style={styles.input}
          keyboardType="email-address"
          placeholder="Email"
          onChangeText={(text) => this.setState({ email: text })}
          value={this.state.email}
        />
        <TextInput
          style={styles.input}
          keyboardType="default"
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({ password: text })}
          value={this.state.password}
        />

        <TouchableOpacity style={styles.button} onPress={this.handleSubmit}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {this.state.errorMSG && <Text style={styles.errorText}>{this.state.errorMSG}</Text>}

        <Text style={styles.accountText}>Don't have an account?</Text>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("Register")}
        >
          <Text style={styles.loginButtonText}>Register</Text>
        </TouchableOpacity>

        <Text style={styles.accountText}>Go back</Text>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("HomeMenu")}
        >
          <Text style={styles.loginButtonText}>Home</Text>
        </TouchableOpacity>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#E4F1FE",
  },
  input: {
    height: 50,
    borderColor: "#ced4da",
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: "100%",
    backgroundColor: "#F5FBFD",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  textoInicial:{
    color: "#4182FA",
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#40A6FA",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#E8F1FA",
    textAlign: "center",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  accountText: {
    marginTop: 20,
    fontSize: 16,
    color: "#555",
  },
  loginButtonText: {
    fontSize: 16,
    color: "#2196F3",
    fontWeight: "bold",
  },
});
