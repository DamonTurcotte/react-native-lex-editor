import React from 'react';
import {
  WebView,
  type WebViewProps,
} from 'react-native-webview';

import { htmlString } from 'react-native-lex-editor-web';
import { type EditorBridge } from './useLexical';


export interface RichTextProps extends WebViewProps {
  editor: EditorBridge;
}

const DEV_SERVER = 'http://10.0.0.219:4200';

export const LexEditor = ({
  editor,
  ...props
}: RichTextProps ): React.JSX.Element => {
  const [initialData] = React.useState(() => ({
    initialState: editor.initialState,
  }));

  const source: WebViewProps['source'] = editor.customSource
    ? { uri: editor.customSource }
    : editor._DEV
    ? { uri: DEV_SERVER }
    : { html: htmlString };

  return (
    <WebView
      {...props}
      ref={editor.webviewRef}
      injectedJavaScriptObject={initialData}
      source={source}
      onMessage={editor._onMessage}
    />
  );
};
