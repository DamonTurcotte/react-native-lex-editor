import React from 'react';
import {
  WebView,
  type WebViewMessageEvent,
} from 'react-native-webview';

export interface Command {
  type: string;
  payload?: any;
  id?: string;
}

export interface EditorBridge {
  webviewRef: React.RefObject<WebView>;
  initialState?: string | object;
  customSource?: string;
  _DEV?: boolean;
  sendCommand: (command: Command) => void;
  _onMessage: (event: WebViewMessageEvent) => void;
}

export const useEditorBridge = (options?: {
  initialState?: string | object;
  customSource?: string;
  _DEV?: boolean;
}): EditorBridge => {
  const webviewRef = React.useRef<WebView>(null);

  const sendCommand = React.useCallback((command: Command) => {
    if (webviewRef.current) {
      webviewRef.current.injectJavaScript(`window.ReactNativeWebView.postMessage(${JSON.stringify(command)})`);
    }
  }, []);

  const _onMessage = React.useCallback((event: WebViewMessageEvent) => {
    const message = JSON.parse(event.nativeEvent.data);

    switch (message.type) {
      case 'EDITOR_STATE_CHANGE':
        // TODO: Handle editor state change
        console.log(JSON.stringify(message, null, 2));
        break;
      default:
        console.error('Unknown message type', message.type);
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
