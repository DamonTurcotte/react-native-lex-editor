import React from "react";
import { StyleSheet, View } from "react-native";
import { RichText, useEditorBridge } from "react-native-lex-editor";

const initialState = '{"root": {"children": [{"children": [{"detail": 0,"format": 0,"mode": "normal","style": "","text": "Hello, Lex!","type": "text","version": 1}],"direction": "ltr","format": "","indent": 0,"type": "paragraph","version": 1,"textFormat": 0,"textStyle": ""}],"direction": "ltr","format": "","indent": 0,"type": "root","version": 1}}';

const HomeView = () => {
  const editor = useEditorBridge({
    _DEV: true,
    initialState,
    onChangeState: (state) => {
      console.log('onChangeState:', state);
    }
  });

  return (
    <View style={styles.container}>
      <RichText
        editor={editor}
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
