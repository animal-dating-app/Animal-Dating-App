import React, { useState, useEffect } from 'react';
import { Col, ListGroup, Form, Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../../firebaseConfig';

function ChatMessagesCard({ messages }) {
  const [selectedChat, setSelectedChat] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [chats, setChats] = useState({});

  const location = useLocation();
  const navigate = useNavigate();

  const shelterName = location.state?.shelterName;
  const shelterId = location.state?.shelterId;
  const [pet, setPet] = useState(location.state?.pet);

  const currentUserId = auth.currentUser.uid;

  useEffect(() => {
    const groupedMessages = messages.reduce((acc, message) => {
      const otherUserId = message.from.id === currentUserId ? message.to.id : message.from.id;
      const key = otherUserId;
      if (!acc[key]) {
        acc[key] = { messages: [], user: message.from.id === currentUserId ? message.to : message.from };
      }
      acc[key].messages.push(message);
      return acc;
    }, {});

    if (shelterId && shelterName && !groupedMessages[shelterId]) {
      groupedMessages[shelterId] = { messages: [], user: { id: shelterId, name: shelterName } };
    }

    setChats(groupedMessages);
    setSelectedChat(shelterId || Object.keys(groupedMessages)[0] || null);
  }, [messages, currentUserId, shelterId, shelterName]);

  const handleSelectChat = (userId) => {
    setSelectedChat(userId);
    setInputMessage('');
    if (pet) {
      setPet(null);  // Reset pet when changing chats
    }
  };

  const sendMessage = () => {
    console.log('Sending message:', inputMessage);
    // Additional logic to handle sending the attached pet card
    setInputMessage('');
  };

  const removePetAttachment = () => {
    setPet(null);
  };

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
                    {chats[userId].user.name}
                    <div className="text-muted small">
                      {chats[userId].messages.at(-1)?.date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} {chats[userId].messages.at(-1)?.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
              <h5 className="pb-2">{chats[selectedChat].user.name}</h5>
              <div style={{ overflowY: 'auto', height: '70vh' }}>
                {chats[selectedChat].messages.length > 0 ? chats[selectedChat].messages.map((msg, index) => (
                  <div key={index} style={{ textAlign: msg.from.id === currentUserId ? 'right' : 'left' }} className="mb-2">
                    <div style={{ backgroundColor: msg.from.id === currentUserId ? '#DDECEA' : 'grey', color: msg.from.id === currentUserId ? 'black' : 'white', display: 'inline-block', padding: '5px 15px', borderRadius: '10px' }}>
                      {msg.content}
                    </div>
                    <div className={`small p${msg.from.id === currentUserId ? 'e' : 's'}-1`} style={{ color: 'grey' }}>{msg.date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} {msg.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
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
