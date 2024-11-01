import React from 'react';
import {
  WebView,
  type WebViewMessageEvent,
} from 'react-native-webview';

export type Command = {
  type: string;
  payload?: any
  id?: string;
}

export type EditorBridge = {
  webviewRef: React.RefObject<WebView>;
  initialState?: string | object;
  customSource?: string;
  sendCommand: (command: Command) => void;
  onChangeState?: (editorState: string) => void;
  _onMessage: (event: WebViewMessageEvent) => void;
  _DEV?: boolean;
}

export const useLexical = (options?: {
  initialState?: string | object;
  customSource?: string;
  onChangeState: (editorState: string) => void;
  _DEV?: boolean;
}): EditorBridge => {
  const webviewRef = React.useRef<WebView>(null);

  const sendCommand = React.useCallback(({ type, payload }: Command) => {
    // Generate a random id to ensure the command isn't duplicated by the webview
    const id = Math.random().toString(36).substring(7);
    const command = { type, payload, id };

    if (webviewRef.current) {
      webviewRef.current.injectJavaScript(`window.postMessage('${JSON.stringify(command)}')`);
    }
  }, []);

  const _onMessage = React.useCallback((event: WebViewMessageEvent) => {
    const message = JSON.parse(event.nativeEvent.data);

    switch (message.type) {
      case 'EDITOR_STATE_CHANGE':
        if (options?.onChangeState) {
          options.onChangeState(message.payload.editorState);
        }
        break;
      case 'EDITOR_ERROR':
        console.error('WebView Error:', message.payload);
        break;
      case 'COMMAND_RESPONSE':
        console.log('WebView Command received:', JSON.stringify(message.payload, null, 2));
        break;
      default:
        console.warn('Unknown message type from WebView:', message);
    }
  }, []);

  const editorInstance = {
    webviewRef,
    initialState: options?.initialState,
    customSource: options?.customSource,
    _DEV: options?._DEV,
    sendCommand,
    _onMessage,
  } as EditorBridge;

  return editorInstance;
};
