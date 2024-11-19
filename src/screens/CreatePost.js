import { Component } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native-web";
import { db, auth } from "../firebase/config";

export default class CreatePost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      postText: "",
      
    };
  }

  handlePost(){
    db.collection("posts").add({
        mail: auth.currentUser.email,
        msg: this.state.postText,
        time: Date.now(),
        likes: [], //cambié esto a una lista, quizá haya que borrar los post que ya existan por si se rompen
        user: auth.currentUser.user //posible error
    })
    .then()
    .catch( e => console.log(e))
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Crear Post</Text>
        <TextInput
          style={styles.field}
          keyboardType="default"
          placeholder="tu texto"
          onChangeText={ text => this.setState({postText: text})}
          value={this.state.postText}
        />
        <TouchableOpacity onPress={() => this.handlePost()}>
            <Text>Post!</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        
        backgroundColor: "#22c6e2",
        flex:1,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "black",
        borderRadius: 15, 
    },
    field: {
        margin: "5%"
    }

});
