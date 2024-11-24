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

      db.collection("posts").orderBy("time", "desc").onSnapshot((querySnapshot) => {
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
        const currentPosts = this.state.posts;
        const updatedPosts = currentPosts.filter((post) => post.id !== postId);
        this.setState({
          posts: updatedPosts,
          cantidadPosts: updatedPosts.length,
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
    
    return (
      <View style={styles.container}>
      
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
              Cantidad de posts: {cantidadPosts}
            </Text>
            <Text style={styles.subtitle}>Tus Posts:</Text>
            <ScrollView style={styles.postsContainer}>
              {posts.length > 0 ? (
                posts.map((post, index) => (
                  <View key={index} style={styles.postContainer}>
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
        
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#c3e6fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#228bfa",
    textAlign: "center",
    marginVertical: 10,
  },
  email: {
    fontSize: 16,
    color: "#3386F9",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4a90e2",
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
  postContainer: {
    marginBottom: 20, 
    backgroundColor: "#84C1FA", 
    padding: 15, 
    borderRadius: 8, 
    shadowColor: "#000", 
    shadowOpacity: 0.1,
    shadowRadius: 6,
    
    
  },
  deleteButton: {
    backgroundColor: "#4a90e2",
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
