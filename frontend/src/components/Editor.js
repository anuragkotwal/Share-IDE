/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";

import "codemirror/theme/dracula.css";
import "codemirror/theme/3024-night.css";
import "codemirror/theme/elegant.css";
import "codemirror/theme/twilight.css";
import "codemirror/theme/vibrant-ink.css";
import "codemirror/theme/monokai.css";
import "codemirror/theme/midnight.css";
import "codemirror/theme/shadowfox.css";
import "codemirror/theme/seti.css";
import "codemirror/theme/solarized.css";

import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import axios from "axios";
import ACTIONS from "../Actions";

const Editor = ({ socketRef, roomId, username, onCodeChange }) => {
  const editorRef = useRef(null);
  const [writePerm, setWritePerm] = useState(false);
  let writePermission = false;

  useEffect(async () => {
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
        writePermission = true;
      }else{
        setWritePerm(false);
        writePermission = false;
      }
    }

    async function init() {
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          mode: { name: "javascript", json: true },
          autoCloseTags: true,
          theme: "dracula",
          autoCloseBrackets: true,
          lineNumbers: true,
          readOnly: !writePermission,
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

  }, []);
  

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
