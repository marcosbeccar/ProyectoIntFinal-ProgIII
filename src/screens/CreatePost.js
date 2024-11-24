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
        email: auth.currentUser.email,
        msg: this.state.postText,
        time: Date.now(),
        likes: [], 
    })
    .then(this.props.navigation.navigate("Home"))
    .catch( e => console.log(e))

  }

  render() {
    return (
      <View style={styles.container}>
         <Text style={styles.titulo}>𝕬𝖗𝖊𝖙𝖊</Text>
        <View style={styles.content}>
        <Text>Crear Post</Text>
        <TextInput
          style={styles.field}
          keyboardType="default"
          placeholder="Tu texto"
          onChangeText={ text => this.setState({postText: text})}
          value={this.state.postText}
        />
        <TouchableOpacity onPress={() => this.handlePost()}>
            <Text>Post!</Text>
        </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#c3e6fa",
    },
    field: {
        margin: "5%",
    },
    content:{
      flex: 1,
      width:"90%", 
      margin:"2%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
      borderRadius: 8,
      borderColor: "blue",
      borderWidth: 1,
      shadowColor: "black",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    titulo:{
      fontSize: 60,
      color: 'blue',
      alignSelf: 'center'
    },
    

});
