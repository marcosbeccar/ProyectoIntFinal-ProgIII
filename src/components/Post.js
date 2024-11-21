import { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native-web'

export default class Post extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userName: this.props.userName,
      content: this.props.content,
      likes: this.props.likes,
      mail: this.props.mail
    }
  }
  render() {
    return (
      <View style ={styles.container}>
      <Text style={styles.mainText}>{this.state.content}</Text>
      <Text style={styles.bold}>Por {this.state.mail}</Text>
      <Text>Likes: {this.state.likes.length}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    margin: "5%",
    backgroundColor: "#22c6e2",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 15,
  },
  mainText: {
    fontSize: 30,
  },
  bold:{
    fontWeight: "bold"
  }
});