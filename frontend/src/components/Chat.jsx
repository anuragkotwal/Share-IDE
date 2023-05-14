import React, { useEffect, useState }  from 'react'
import "../../src/chat.css"

function Chat() {


class InteractiveChatbox {
    constructor(a, b, c) {
        this.args = {
            button: a,
            chatbox: b
        }
        this.icons = c;
        this.state = false; 
    }

    display() {
        const {button, chatbox} = this.args;
        
        button.addEventListener('click', () => this.toggleState(chatbox))
    }

    toggleState(chatbox) {
        this.state = !this.state;
        this.showOrHideChatBox(chatbox, this.args.button);
    }

    showOrHideChatBox(chatbox, button) {
        if(this.state) {
            chatbox.classList.add('chatbox--active')
            this.toggleIcon(true, button);
        } else if (!this.state) {
            chatbox.classList.remove('chatbox--active')
            this.toggleIcon(false, button);
        }
    }

    toggleIcon(state, button) {
        const { isClicked, isNotClicked } = this.icons;
        let b = button.children[0].innerHTML;

        if(state) {
            button.children[0].innerHTML = isClicked; 
        } else if(!state) {
            button.children[0].innerHTML = isNotClicked;
        }
    }
}


    function chatButton() {
    const chatButton = document.querySelector('.chatbox__button');
    const chatContent = document.querySelector('.chatbox__support');
    const icons = {
        isClicked: `<span>Chat</span>`,
        isNotClicked: `<span>Chat</span>`
    }
    const chatbox = new InteractiveChatbox(chatButton, chatContent, icons);
    chatbox.display();
    chatbox.toggleIcon(false, chatButton);
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
                        <div className="messages__item messages__item--visitor">
                            Can you let me talk to the support?
                        </div>
                        <div className="messages__item messages__item--operator">
                            Sure!
                        </div>
                        <div className="messages__item messages__item--visitor">
                            Need your help, I need a developer in my site.
                        </div>
                        <div className="messages__item messages__item--operator">
                            Hi... What is it? I'm a front-end developer, yay!
                        </div>
                    </div>
                </div>
                <div className="chatbox__footer">
                    <input type="text" placeholder="Write a message..."></input>
                    <button className="chatbox__send--footer">Send</button>
                    <img src="" alt=""></img>
                </div>
            </div>
            <div className="chatbox__button">
                <button onClick={chatButton}>Chat</button>
            </div>
        </div>
    </div>

  )
}

export default Chat