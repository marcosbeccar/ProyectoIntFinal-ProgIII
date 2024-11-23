import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { auth, db } from "../firebase/config";
import { Ionicons } from "@expo/vector-icons";
import Post from "../components/Post";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      email: "",
      posts: [],
      cantidadPosts: 0,
    };
  }

  componentDidMount() {
    const currentUser = auth.currentUser;
    if (currentUser) {
      this.setState({
        email: currentUser.email,
      });
      db.collection("users").onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().email === currentUser.email) {
            this.setState({
              userName: doc.data().userName || "Usuario",
            });
          }
        });
      });

      db.collection("posts").onSnapshot((querySnapshot) => {
        const userPosts = [];
        querySnapshot.forEach((doc) => {
          if (doc.data().email === currentUser.email) {
            userPosts.push({ id: doc.id, data: doc.data() });
          }
        });
        this.setState({
          posts: userPosts,
          cantidadPosts: userPosts.length,
        });
      });
    }
  }

  deletePost = (postId) => {
    db.collection("posts")
      .doc(postId)
      .delete()
      .then(() => {
        console.log("Post eliminado");
        this.setState((state) => {
          const updatedPosts = state.posts.filter((post) => post.id !== postId);
          return {
            posts: updatedPosts,
            cantidadPosts: updatedPosts.length,
          };
        });
      })
      .catch((error) => {
        console.log("Error al eliminar el post: ", error);
      });
  };

  handleLogout = () => {
    auth.signOut().then(() => {
      this.props.navigation.navigate("Login");
    });
  };

  render() {
    const { userName, email, posts, cantidadPosts } = this.state;
    const currentUser = auth.currentUser;
    return (
      <View style={styles.container}>
        {currentUser ? (
          <>
            <Text style={styles.title}>Perfil de {userName}</Text>
            <Ionicons
              name="person-circle"
              size={100}
              color="#2196F3"
              style={styles.profileIcon}
            />
            <Text style={styles.email}>Email: {email}</Text>
            <Text style={styles.subtitle}>
              Cantidad de Posts: {cantidadPosts}
            </Text>
            <Text style={styles.subtitle}>Tus Posts:</Text>
            <ScrollView style={styles.postsContainer}>
              {posts.length > 0 ? (
                posts.map((post, index) => (
                  <View key={index}>
                    <Post
                      postId={post.id}
                      content={post.data.msg}
                      userName={userName}
                      mail={email}
                      likes={post.data.likes || []}
                    />
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => this.deletePost(post.id)}
                    >
                      <Text style={styles.deleteButtonText}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={styles.noPostsText}>No tienes posts.</Text>
              )}
            </ScrollView>
            <TouchableOpacity style={styles.button} onPress={this.handleLogout}>
              <Text style={styles.buttonText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.noLoginText}>No iniciaste sesión</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.props.navigation.navigate("Login")}
            >
              <Text style={styles.buttonText}>Ir al Login</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f8fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#373636",
    textAlign: "center",
    marginVertical: 10,
  },
  email: {
    fontSize: 16,
    color: "#636363",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#343434",
    marginBottom: 10,
  },
  postsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  postCard: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    marginVertical: 8,
  },
  postText: {
    fontSize: 15,
    color: "#454545",
  },
  noPostsText: {
    fontSize: 16,
    color: "#8d8c8c",
    textAlign: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#4a90e2",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  noLoginText: {
    fontSize: 18,
    color: "#858484",
    textAlign: "center",
    marginBottom: 20,
  },
  profileIcon: {
    marginBottom: 10,
    alignSelf: "center",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
