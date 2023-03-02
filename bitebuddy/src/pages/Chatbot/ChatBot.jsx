import React, { useEffect, useState } from "react";
import { Launcher } from "popup-chat-react";
import "./Chatbot.css";
import { converse } from "../../api/models";
// function TestArea({ onMessage }) {
//   const [state, setState] = useState("");

//   function handleSubmit(event) {
//     event.preventDefault();

//     onMessage(state);
//     setState("");
//   }

//   function onChange(event) {
//     const value = event.target.value;

//     setState(value);
//   }

//   return (
//     <div className="demo-test-area--wrapper">
//       <div className="demo-test-area--title">
//         <div className="demo-test-area--title-main">popup-chat-react demo</div>
//       </div>
//       <form className="demo-test-area" onSubmit={handleSubmit}>
//         <div className="demo-test-area--preamble">
//           Test the chat window by sending a message:
//         </div>
//         <textarea
//           className="demo-test-area--text"
//           placeholder="Write a test message...."
//           value={state}
//           onChange={onChange}
//         />
//         <button className="demo-test-area--button"> Send Message! </button>
//       </form>
//       <p className="demo-test-area--info">
//         popup-chat-react is a chat window that allows you to build and add
//         custom live chat to your sites. It includes only the react chat widget.
//         There is no backend, and no communication system baked in.
//         <br />
//         <br />
//         Usage instructions for popup-chat-react are{" "}
//         <a href="https://github.com/asliddinusmonov/popup-chat-react">
//           on Github
//         </a>
//         .
//       </p>
//     </div>
//   );
// }

export default function ChatBot() {
  const defaultMessage = `Hello, I am Bite Buddy!

I am here to help you find the best recipes or answer any questions you may have about dietry plans and food allergies.
    
You can ask me anything! Here are a few examples:

1. What are the best recipes for a vegan diet?

2. How do I make a vegan diet?

3. What are the calories in a 20gm of peanut butter?`;

  const [state, setState] = useState({
    messageList: [{
      author: "them",
      type: "text",
      data: { text: defaultMessage },
    }],
    newMessagesCount: 1,
    isOpen: false,
    fileUpload: true,
  });

  async function onMessageWasSent(message) {
    // console.log(message.data.text)

    setState((state) => ({
      ...state,
      messageList: [...state.messageList, message],
    }));

    setTimeout(async () => {
      const response = await converse({
        newMessage: message.data.text,
        oldMessages: state.messageList,
      });

      sendMessage(response);
    }, 1000);
  }

 

  function sendMessage(text) {
    if (text.length > 0) {
      const newMessagesCount = state.isOpen
        ? state.newMessagesCount
        : state.newMessagesCount + 1;

      setState((state) => ({
        ...state,
        newMessagesCount: newMessagesCount,
        messageList: [
          ...state.messageList,
          {
            author: "them",
            type: "text",
            data: { text },
          },
        ],
      }));
    }
  }

  function onClick() {
    setState((state) => ({
      ...state,
      isOpen: !state.isOpen,
      newMessagesCount: 0,
    }));
  }

  return (
    <div>
      <Launcher
        agentProfile={{
          teamName: "Bite Buddy",
          imageUrl:
            "https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png",
        }}
        onMessageWasSent={onMessageWasSent}
        messageList={state.messageList}
        newMessagesCount={state.newMessagesCount}
        onClick={onClick}
        isOpen={state.isOpen}
        showEmoji
        onFilesSelected={() => {}}
        // pinMessage={{
        //   imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png',
        //   title: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
        //   text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.'
        // }}
        placeholder="type your message here..."
      />
    </div>
  );
}
