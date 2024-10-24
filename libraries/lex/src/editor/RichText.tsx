import React from 'react';
import {
  WebView,
  type WebViewMessageEvent,
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
  const webviewRef = React.useRef<WebView>(null);

  const onMessage = React.useCallback((event: WebViewMessageEvent) => {
    const message = JSON.parse(event.nativeEvent.data);

    switch (message.type) {
      case 'EDITOR_STATE_CHANGE':
        // TODO: Handle editor state change
        console.log(JSON.stringify(message, null, 2));
        break;
      case "EDITOR_READY":
        const commandMessage = {
          command: "INIT_SERIALIZED_EDITOR_STATE",
          payload: {
            root: {
              children: [
                {
                  children: [
                    {
                      detail: 0,
                      format: 0,
                      mode: "normal",
                      style: "",
                      text: "Initial text",
                      type: "text",
                      version: 1,
                    },
                  ],
                  direction: "ltr",
                  format: "",
                  indent: 0,
                  type: "paragraph",
                  version: 1,
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              type: "root",
              version: 1,
            },
          },
        };

          webviewRef.current?.postMessage(JSON.stringify(commandMessage));
          break;
      default:
        console.error('Unknown message type', message.type);
    }
  }, []);

  return (
    <WebView
      {...props}
      ref={webviewRef}
      source={props.source ? props.source : _DEV_ ? { uri: 'http://10.0.0.219:4200' } : { html: htmlString }}
      onMessage={onMessage}
    />
  );
};
