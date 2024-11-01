import React from "react";
import { StyleSheet, View, Button } from "react-native";
import { LexEditor, useLexical } from "react-native-lex-editor";

const initialState = '{"root": {"children": [{"children": [{"detail": 0,"format": 0,"mode": "normal","style": "","text": "Hello, Lex!","type": "text","version": 1}],"direction": "ltr","format": "","indent": 0,"type": "paragraph","version": 1,"textFormat": 0,"textStyle": ""}],"direction": "ltr","format": "","indent": 0,"type": "root","version": 1}}';

const HomeView = () => {
  const editor = useLexical({
    _DEV: true,
    initialState,
    onChangeState: (state) => {
      console.log('onChangeState:', state);
    },
  });

  const sendTestCommand = () => {
    editor.sendCommand({ type: 'TEST_COMMAND' });
  }

  return (
    <View style={styles.container}>
      <LexEditor
        editor={editor}
      />
      <Button
        title="Send Test Command"
        onPress={sendTestCommand}
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
