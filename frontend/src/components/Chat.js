import "../../src/chat.css";
import React, { useState, useEffect } from "react";
import ACTIONS from "../Actions";

const Chat = ({socket, roomId, username}) =>{
    const [messagesRecieved, setMessagesReceived] = useState([]);
    class InteractiveChatbox{
        constructor(a, b, c) {
            this.args = {
                button: a,
                chatbox: b
            }
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
            let b = button.children[0].innerHTML;
            if (state) {
              button.children[0].innerHTML = isClicked;
            } else if (!state) {
              button.children[0].innerHTML = isNotClicked;
            }
          }
    }

    useEffect(() => {
        socket.current.on(ACTIONS.MESSAGE, (data) => {
            console.log(data);
            setMessagesReceived((state) => [
              ...state,
              {
                message: data.message,
                username: data.username,
                createdTime: data.createdTime,
              },
            ]);
          });
      return () => socket.current.off(ACTIONS.MESSAGE);
    },[socket]);

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
  
    async function sendMessgage() {
      const msg = document.getElementById("msg").value;
      socket.current.emit(ACTIONS.SENDMESSAGE, {msg, roomId, username}, () => {
        msg.value = "";
      });
    }
  
    async function formatDateFromTimestamp(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleString();
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
                {messagesRecieved.map((msg, i) => (
                  <div key={i}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}>
                      <span>{msg.username}</span>
                      <span>{formatDateFromTimestamp(msg.createdTime)}</span>
                    </div>
                    <p>{msg.message}</p>
                    <br />
                  </div>
                ))}
              </div>
            </div>
            <div className="chatbox__footer">
              <input
                type="text"
                placeholder="Write a message..."
                id="msg"></input>
              <button className="chatbox__send--footer" onClick={sendMessgage}>
                Send
              </button>
            </div>
          </div>
          <div className="chatbox__button">
            <button onClick={chatButton}>Chat</button>
          </div>
        </div>
      </div>
    );
}

export default Chat;
