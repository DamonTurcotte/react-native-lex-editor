import React from "react";
import { StyleSheet, View } from "react-native";
import { RichText } from "react-native-lex-editor";

const HomeView = () => {
  return (
    <View style={styles.container}>
      <RichText
        _DEV_={true}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeView;
