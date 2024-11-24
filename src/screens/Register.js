import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { auth, db } from "../firebase/config";

export default class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      userName: "",
      password: "",
      registered: false,
      errorMSG: "",
    }; 
  }

  handleSubmit = () => {

    auth
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((response) => {
       
        if (response) {
          db.collection("users")
            .add({ 
              email: this.state.email, 
              userName: this.state.userName,
              createdAt: Date.now(),
            })

            .then(this.props.navigation.navigate("Login")) 
            .catch((err) => console.log(err));

          this.setState({ registered: true, errorMSG: "" });
        }

      })

      .catch((err) => this.setState({ errorMSG: err.message }));
  };

  render() {
    const { email, userName, password } = this.state;

    return (
      <View style={styles.container}>
        <Text  style={styles.textoPrincipal}>Registrate para ingresar</Text>

        <TextInput
          style={styles.input}
          keyboardType="default"
          placeholder="UserName"
          onChangeText={(text) => this.setState({ userName: text })}
          value={this.state.userName}
        />
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

        {email && userName && password ? (
          <TouchableOpacity style={styles.button} onPress={this.handleSubmit}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        ) : null}


        {this.state.errorMSG && <Text>{this.state.errorMSG}</Text>}

        <Text style={styles.texto}>¿Ya tenes una cuenta?</Text>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("Login")}
        >
        <Text style={styles.loginButtonText}>Login</Text>
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
    backgroundColor: "#4990FA",
  },
  input: {
    height: 40,
    borderColor: "#64748B",
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: "100%",
    backgroundColor: "#F3F3FC",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  textoPrincipal: {
    fontSize: 17, 
    color: "#E5F6FA", 
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#BA9BFA",
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 15,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  texto: {
    marginTop: 20,
    fontSize: 17,
    color: "#E5F6FA",
    marginBottom: 20
  },
  loginButtonText: {
    fontSize: 18,
    color: "#2373FA",
    fontWeight: "bold",
    backgroundColor: "#9AD2FA",
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 25, 
    textAlign: "center", 
    shadowColor: "#000", 
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
