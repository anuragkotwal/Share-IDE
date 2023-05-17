import "../../src/chat.css";
import React, { useState, useEffect } from "react";
import ACTIONS from "../Actions";
import moment from "moment";
import { IoMdSend } from "react-icons/io";

const Chat = ({ socket, roomId, username }) => {
  const [messagesRecieved, setMessagesReceived] = useState([]);
  const [msg, setMsg] = useState("");
  class InteractiveChatbox {
    constructor(a, b, c) {
      this.args = {
        button: a,
        chatbox: b,
      };
      this.icons = c;
      this.state = false;
    }

    display() {
      const { button, chatbox } = this.args;
      button.addEventListener("click", () => this.toggleState(chatbox));
    }

    toggleState(chatbox) {
      this.state = !this.state;
      this.showOrHideChatBox(chatbox, this.args.button);
    }

    showOrHideChatBox(chatbox, button) {
      if (this.state) {
        chatbox.classList.add("chatbox--active");
        this.toggleIcon(true, button);
      } else if (!this.state) {
        chatbox.classList.remove("chatbox--active");
        this.toggleIcon(false, button);
      }
    }

    toggleIcon(state, button) {
      const { isClicked, isNotClicked } = this.icons;
      if (state) {
        button.children[0].innerHTML = isClicked;
      } else if (!state) {
        button.children[0].innerHTML = isNotClicked;
      }
    }
  }

  useEffect(() => {
    if (socket.current) {
      socket.current.on(ACTIONS.MESSAGE, (data) => {
        const messages = [...messagesRecieved]
        messages.push({
          message: data.msg,
          username: data.username,
          createdTime: data.createdAt,
        })
        setMessagesReceived(messages);
      });
      return () => socket.current.off(ACTIONS.MESSAGE);
    }
  }, [socket.current, messagesRecieved]);

  async function chatButton() {
    const chatButton = document.querySelector(".chatbox__button");
    const chatContent = document.querySelector(".chatbox__support");
    const icons = {
      isClicked: `<span>Chat</span>`,
      isNotClicked: `<span>Chat</span>`,
    };
    const chatbox = new InteractiveChatbox(chatButton, chatContent, icons);
    chatbox.display();
    chatbox.toggleIcon(false, chatButton);
  }

  async function sendMessage() {
    if(msg !== "") {
      socket.current.emit(
        ACTIONS.SENDMESSAGE,
        { msg, roomId, username },
      );
      setMsg("");
    }
  }

  return (
    <div className="container">
      <div className="chatbox">
        <div className="chatbox__support">
          <div className="chatbox__header">
            <div className="chatbox__content--header">
              <h4 className="chatbox__heading--header">Live Chat</h4>
            </div>
          </div>
          <div className="chatbox__messages">
            <div>
              {messagesRecieved.map((message, i) => {
                return (
                  <div
                    className="messages__item messages__item--visitor"
                    key={i}>
                    <span className="text-sm font-semibold">
                      {message.username}
                    </span>
                    <span className="text-xs ml-2">
                      {moment(message.createdAt).format("h:mm a")}
                    </span>
                    <p className="">{message.message}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="chatbox__footer">
            <input
              type="text"
              placeholder="Write a message..."
              onChange={(e) => setMsg(e.target.value)}
              value={msg}></input>
            <button className="chatbox__send--footer" onClick={sendMessage} 
            >
              <IoMdSend />
            </button>
          </div>
        </div>
        <div className="chatbox__button">
          <button onClick={chatButton}>Chat</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
