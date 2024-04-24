import React, { useState, useEffect, useRef } from 'react';
import { Col, ListGroup, Form, Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebaseConfig';
import { doc, setDoc, collection, query, where, onSnapshot, or } from "firebase/firestore";

function ChatMessagesCard() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [chats, setChats] = useState({});
  const [messages, setMessages] = useState([]); 

  const location = useLocation();
  const navigate = useNavigate();

  const messagesContainerRef = useRef(null);

  const userName = location.state?.userName;
  const userId = location.state?.userId;
  const [pet, setPet] = useState(location.state?.pet);

  const currentUserId = auth.currentUser.uid;

  useEffect(() => {
    const messagesRef = collection(db, "messages");
    const q = query(
      messagesRef,
      or(where("fromId", "==", currentUserId), where("toId", "==", currentUserId))
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        date: doc.data().date.toDate(),
        ...doc.data()
      }));
      setMessages(messages);
    }, (error) => {
      console.error("Error fetching messages: ", error);
    });

    return () => unsubscribe();
  }, [currentUserId]);

  useEffect(() => {
    const groupedMessages = messages.reduce((acc, message) => {
      const otherUserId = message.fromId === currentUserId ? message.toId : message.fromId;
      const key = otherUserId;
      if (!acc[key]) {
        acc[key] = { messages: [], user: message.fromId === currentUserId ? { id: message.toId, name: message.toName } : { id: message.fromId, name: message.fromName } };
      }
      acc[key].messages.push(message);
      return acc;
    }, {});

    if (userId && !groupedMessages[userId]) {
      groupedMessages[userId] = { messages: [], user: { id: userId, name: (userName || 'Anonymous User') } };
    }

    setChats(groupedMessages);
    setSelectedChat(userId || Object.keys(groupedMessages)[0] || null);
  }, [messages, currentUserId, userId, userName]);

  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    };
  
    scrollToBottom();
  }, [chats]);

  const handleSelectChat = (userId) => {
    setSelectedChat(userId);
    setInputMessage('');
    if (pet) {
      setPet(null);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage) return;
  
    const newMessage = {
      fromId: auth.currentUser.uid,
      toId: selectedChat,
      fromName: auth.currentUser.displayName,
      toName: chats[selectedChat].user.name,
      date: new Date(),
      content: inputMessage,
      pet: pet || undefined,
      read: false
    };
  
    try {
      await setDoc(doc(collection(db, "messages")), newMessage);
      setInputMessage('');
      setPet(null);
    } catch (error) {
      console.error("Error sending message: ", error, error.message);
    }
  };

  const removePetAttachment = () => {
    setPet(null);
  };

  useEffect(() => {
    if (!selectedChat) return;

    const markAsRead = async (userId) => {
      const unreadMessages = chats[userId].messages.filter(msg => msg.fromId !== currentUserId && (msg.read === false || msg.read === undefined) );
      if (unreadMessages.length > 0) {
        unreadMessages.forEach(async msg => {
          await setDoc(doc(db, "messages", msg.id), { ...msg, read: true });
        });
      }
    }

    markAsRead(selectedChat);
  }, [selectedChat, chats, currentUserId]);

  return (
    <div className="card mb-3">
      <div className="row g-0">
        <Col xs={12} md={4} className="bg-white rounded">
          {Object.keys(chats).length > 0 ? (
            <ListGroup variant="flush" className="pt-3">
              {Object.keys(chats).map(userId => (
                <ListGroup.Item
                  key={userId}
                  action
                  onClick={() => handleSelectChat(userId)}
                  style={{ backgroundColor: selectedChat === userId ? '#DDECEA' : 'transparent' }}
                >
                  <div className='text-start p-2'>
                    <span className={`${chats[userId].messages.filter(msg => msg.fromId !== currentUserId && !msg.read).length > 0 ? 'fw-bold' : ''}`}>
                      {chats[userId].user.name || 'Anonymous User'}
                    </span>
                    { chats[userId].messages.filter(msg => msg.fromId !== currentUserId && !msg.read).length > 0 &&
                      <span className="badge bg-secondary ms-2">{chats[userId].messages.filter(msg => msg.fromId !== currentUserId && !msg.read).length}</span>
                    }
                    <div className="text-muted small">
                      {chats[userId].messages.at(-1)?.date.toDate().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} {chats[userId].messages.at(-1)?.date.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    {chats[userId].messages.at(-1) ?
                      <div className="text-muted">
                        {chats[userId].messages.at(-1)?.content.slice(0, 30)}...
                      </div>
                      : <div className="text-muted">No messages yet</div>
                    }
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : <div className="p-4">No conversations found.<br/><br/>Start a new conversation from a pet or shelter profile page.</div>}
        </Col>
        <Col xs={12} md={8} className="bg-light rounded p-3">
          {selectedChat ? (
            <>
              <h5 className="pb-2">{chats[selectedChat].user.name || 'Anonymous User'}</h5>
              <div style={{ overflowY: 'auto', height: '70vh' }} ref={messagesContainerRef}>
                {chats[selectedChat].messages.length > 0 ? chats[selectedChat].messages.map((msg, index) => (
                  <div key={index} style={{ textAlign: msg.fromId === currentUserId ? 'right' : 'left' }} className="mb-2">
                    {msg.pet && (
                      <>
                      <div className="mb-2" style={{ backgroundColor: msg.fromId === currentUserId ? '#DDECEA' : 'grey', color: msg.fromId === currentUserId ? 'black' : 'white', display: 'inline-block', padding: '5px 15px', borderRadius: '10px' }}>
                        <div className="small p-1" style={{ color: msg.fromId === currentUserId ? 'grey' : 'white' }}>Attached Pet: <button className="btn btn-link" onClick={() => navigate('/pet', { state: { pet: msg.pet } })}
                        style={{ color: msg.fromId === currentUserId ? 'blue' : 'white' }}
                        >{msg.pet.name}</button></div>
                    </div>
                    <br/>
                    </>
                    )}
                    <div className="mb-2" style={{ backgroundColor: msg.fromId === currentUserId ? '#DDECEA' : 'grey', color: msg.fromId === currentUserId ? 'black' : 'white', display: 'inline-block', padding: '5px 15px', borderRadius: '10px' }}>
                      {msg.content}
                    </div>
                    <div className={`small p${msg.fromId === currentUserId ? 'e' : 's'}-1`} style={{ color: 'grey' }}>{msg.date.toDate().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} {msg.date.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                )) : <div>No messages in this chat.</div>}
              </div>
              {pet && (
                <Card className="mb-2">
                  <Card.Body className="d-flex justify-content-between align-items-center">
                    <div>
                      Attached Pet: <button className="btn btn-link" onClick={() => navigate('/pet', { state: { pet } })}>{pet.name}</button>
                    </div>
                    <Button variant="outline-danger" size="sm" onClick={removePetAttachment}>
                      <FontAwesomeIcon icon={faTimes} />
                    </Button>
                  </Card.Body>
                </Card>
              )}
              <Form className="d-flex mt-3">
                <Form.Control
                  type="text"
                  placeholder="Type a message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  as="textarea"
                  rows={1}
                  className='p-2 flex-grow-1 me-2'
                />
                <Button onClick={sendMessage} variant="secondary">
                  <FontAwesomeIcon icon={faPaperPlane} />
                </Button>
              </Form>
            </>
          ) : <div className="p-4">Please select a chat to view messages</div>}
        </Col>
      </div>
    </div>
  );
}

export default ChatMessagesCard;
