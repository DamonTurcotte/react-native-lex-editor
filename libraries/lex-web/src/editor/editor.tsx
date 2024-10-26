import React from "react";
import { $getRoot, EditorState, LexicalEditor } from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import "./editor.css";

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
      injectedObjectJson: () => string;
    };
  }
}

const onError = (error: unknown) => {
  console.error(error);
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
        serializedEditorState: state.toJSON(),
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
        <OnChangePlugin onChange={onChange} />
      </div>
    </LexicalComposer>
  );
}

export default Editor;
