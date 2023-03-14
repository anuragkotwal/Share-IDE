/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import axios from "axios";
import ACTIONS from "../Actions";

const Editor = ({ socketRef, roomId, username, onCodeChange }) => {
  const editorRef = useRef(null);
  const [writePerm, setWritePerm] = useState(false);

  const writePermission = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/user/getusers`,
      {
        params: {
          roomId: roomId,
          username: username,
        },
      }
    );
    if (response.data.success) {
      // eslint-disable-next-line react-hooks/exhaustive-deps, array-callback-return
      if(response.data.data.role === "0") {
        setWritePerm(true);
      }else{
        setWritePerm(false);
      }
    }
  };

  useEffect(() => {
    writePermission();
  }, []);

  useEffect(() => {
    async function init() {
      console.log(writePerm)
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          mode: { name: "javascript", json: true },
          autoCloseTags: true,
          theme: "dracula",
          autoCloseBrackets: true,
          lineNumbers: true,
          readOnly: !writePerm,
        }
      );

      editorRef.current.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    }
    init();
  }, [writePerm]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }

    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  return <textarea id="realtimeEditor"></textarea>;
};

export default Editor;
