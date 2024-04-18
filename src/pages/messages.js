import React from "react";
import { auth } from "../firebaseConfig";

import ChatMessagesCard from "../components/Cards/ChatMessagesCard";

const Messages = () => {

    // if user is not logged in, redirect to sign in page
    if (!auth.currentUser) window.location.href = "/sign-in";

    const messages = [
      { from: { id: 1, name: 'Alice' }, to: { id: 2, name: 'Bob' }, date: new Date(), content: 'Hello, how are you?' },
      { from: { id: 2, name: 'Bob' }, to: { id: 1, name: 'Alice' }, date: new Date(), content: 'I am good, thanks!' },
      { from: { id: 1, name: 'Alice' }, to: { id: 2, name: 'Bob' }, date: new Date(), content: 'Great to hear!' },
      { from: { id: 2, name: 'Bob' }, to: { id: 1, name: 'Alice' }, date: new Date(), content: 'How about you?' },
      { from: { id: 3, name: 'Charlie' }, to: { id: 1, name: 'Alice' }, date: new Date(), content: 'Hi Alice, I am interested in adopting a pet. This is a long string of text that will be wrapped in the chat message card.' },
      { from: { id: 1, name: 'Alice' }, to: { id: 3, name: 'Charlie' }, date: new Date(), content: 'Hi Charlie, I am glad to hear that you are interested in adopting a pet. I can help you with that.' },
    ];

    return (
      <>
        <div className="container mb-4">
            <ChatMessagesCard messages={messages} />
        </div>
      </>
    );
};

export default Messages;
