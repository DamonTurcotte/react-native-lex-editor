import React from 'react';
import {
  WebView,
  type WebViewProps,
} from 'react-native-webview';

import { htmlString } from 'react-native-lex-editor-web';

export interface RichTextProps extends WebViewProps {
  _DEV_?: boolean;
}

export const RichText = ({
  _DEV_,
  ...props
}: RichTextProps ): React.JSX.Element => {

  return (
    <WebView
      {...props}
      source={props.source ? props.source : _DEV_ ? { uri: 'http://10.0.0.219:4200' } : { html: htmlString }}
    />
  );
};
