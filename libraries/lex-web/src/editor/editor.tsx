import React from "react";
import { $getRoot, EditorState, LexicalEditor } from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import "./editor.css";

import { useDebounce } from "../utils/useDebounce";

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
      injectedObjectJson: () => string;
    };
  }
}

const onError = (error: unknown) => {
  const message = {
    type: "EDITOR_ERROR",
    payload: error instanceof Error ? error.message : String(error),
  };

  window.ReactNativeWebView?.postMessage(JSON.stringify(message));
}

const onChange = (
  state: EditorState,
  _latestEditor: LexicalEditor,
  tags: Set<string>
) => {
  state.read(() => {
    const plainText = $getRoot().getTextContent();

    const message = {
      type: "EDITOR_STATE_CHANGE",
      payload: {
        plainText,
        editorState: state.toJSON(),
      }
    };

    window.ReactNativeWebView?.postMessage(JSON.stringify(message));
  });
}

export function Editor(): React.JSX.Element {
  const initialData = window.ReactNativeWebView?.injectedObjectJson() ?? undefined

  const initialConfig = {
    namespace: "LexEditor",
    onError,
    editorState: initialData ? JSON.parse(initialData).initialState : undefined,
  }

  const debouncedOnChange = useDebounce(onChange, 100);

  React.useEffect(() => {
    const commandListener = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      window.ReactNativeWebView?.postMessage(JSON.stringify({
        type: "COMMAND_RESPONSE",
        payload: message,
      }));
    };

    window.onmessage = commandListener;

    return () => {
      window.onmessage = null;
    };
  }, []);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container">
        <RichTextPlugin
          contentEditable={<ContentEditable className="editor-input" />}
          placeholder={
            <div className="editor-placeholder">Start typing...</div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <OnChangePlugin onChange={debouncedOnChange} />
      </div>
    </LexicalComposer>
  );
}

export default Editor;
