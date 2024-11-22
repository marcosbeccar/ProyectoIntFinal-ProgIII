import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { db, auth } from "../firebase/config";
import firebase from "firebase";

import { FontAwesome } from "@expo/vector-icons"; //íconos usados para el corazón del like

export default class Post extends Component {
  handleLike = () => {  //hago así la funcion, porque sino no me deja usar ".this" por alguna razón
    const { postId } = this.props;

    db.collection("posts")
      .doc(postId)
      .update({
        likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email),
      })
      .catch((err) => console.log(err));
  };

  handleUnLike = () => {
    const { postId } = this.props;

    db.collection("posts")
      .doc(postId)
      .update({
        likes: firebase.firestore.FieldValue.arrayRemove(
          auth.currentUser.email
        ),
      })
      .catch((err) => console.log(err));
  };

  render() {
    const { content, userName, mail, likes, postId } = this.props;
    const currentUser = auth.currentUser;

    const isLiked = likes.includes(currentUser.email);

    return (
      <View style={styles.container}>
        <Text style={styles.content}>{content}</Text>
        <Text style={styles.userInfo}>
          {userName} ({mail})
        </Text>
        <Text style={styles.likesCount}>{likes.length} Likes</Text>

        {isLiked ? (
          <TouchableOpacity onPress={this.handleUnLike} style={styles.button}>
            <FontAwesome name="heart" size={24} color="red" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={this.handleLike} style={styles.button}>
            <FontAwesome name="heart-o" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 8,
    borderColor: "#e1dfdf",
    borderWidth: 1,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
    flexWrap: "wrap",
    overflow: "hidden",
  },
  userInfo: {
    fontSize: 14,
    color: "grey",
    marginBottom: 8,
  },
  likesCount: {
    fontSize: 14,
    color: "grey",
    marginBottom: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
  },
});
