import React from 'react';
import { WebView } from 'react-native-webview';

import { htmlString } from 'react-native-lex-editor-web';

const RichText = () => {
  return <WebView source={{ html: htmlString }} />;
};

export {
  RichText,
};
