import { Component } from "react";
import { Text, View, FlatList, StyleSheet } from "react-native-web";
import Post from "../components/Post";
import { auth, db } from "../firebase/config";

export default class HomeMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
    };
  }

  componentDidMount() {
    db.collection("posts").onSnapshot((docs) => {
      let posts = [];
      docs.forEach((doc) => {
        posts.push({ id: doc.id, data: doc.data() });
      });
      console.log(posts);
      this.setState({
        posts: posts,
      });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Home</Text>
        <View style={styles.postContainer}>
        {this.state.posts.length != 0 && (
          <FlatList
            data={this.state.posts}
            keyExtractor={(post) => post.id}
            renderItem={({ item }) => <Post content={item.data.msg} userName={item.data.user} mail={item.data.mail} likes={`${item.data.likes}`} />}
          />
        )}
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  postContainer: {
    flex: 1,
    flexDirection: "Row",
    width:"90%"
  }
});
