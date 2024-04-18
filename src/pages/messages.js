import React, { useEffect, useState } from "react";
import { auth } from "../firebaseConfig";

import FullScreenLoader from "../components/FullScreenLoader";
import { useNavigate } from "react-router-dom";
import RecentMessagesCard from "../components/Cards/RecentMessagesCard";
import ChatMessagesCard from "../components/Cards/ChatMessagesCard";

const Messages = () => {
    const [loading, setLoading] = useState(true);
    const [fadingOut, setFadingOut] = useState(false);
    const [shelter, setShelter] = useState({});

    const navigate = useNavigate();

    // if user is not logged in, redirect to sign in page
    if (!auth.currentUser) window.location.href = "/sign-in";

    useEffect(() => {
      setLoading(false);
    }, []);

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
        { loading && <FullScreenLoader fadingOut={fadingOut} /> }
            <div className="container mb-4">
                <ChatMessagesCard messages={messages} />
            </div>
        </>
    );
};

export default Messages;
