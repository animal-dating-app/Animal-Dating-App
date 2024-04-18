import React, { useState, useEffect } from 'react';
import { Col, ListGroup, Form, Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faTimes } from '@fortawesome/free-solid-svg-icons';

function ChatMessagesCard({ messages, currentUserId, newChatUserId, petId }) {
  const [selectedChat, setSelectedChat] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [chats, setChats] = useState({});
  const [pet, setPet] = useState(null);

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

    if (newChatUserId && !groupedMessages[newChatUserId]) {
      // Initialize a new chat with 'newChatUserId' if it does not exist
      groupedMessages[newChatUserId] = { messages: [], user: { id: newChatUserId, name: 'New User' } };
    }

    setChats(groupedMessages);
    // If there's a newChatUserId, select it, otherwise select the first available chat
    setSelectedChat(newChatUserId || Object.keys(groupedMessages)[0] || null);

    if (petId) {
      setPet({ id: petId, name: 'Cute Pet', link: `/pets/${petId}` });
    }
  }, [messages, currentUserId, newChatUserId, petId]);

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
                  style={{ backgroundColor: selectedChat === userId ? 'rgb(221, 237, 234)' : 'transparent' }}
                >
                  {chats[userId].user.name}
                  <div className="text-muted small">
                    {chats[userId].messages.at(-1)?.date.toLocaleString()}
                  </div>
                  <div className="text-muted">
                    {chats[userId].messages.at(-1)?.content.slice(0, 30)}...
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : <div>No chats available</div>}
        </Col>
        <Col xs={12} md={8} className="bg-light rounded p-3">
          {selectedChat ? (
            <>
              <h5>{chats[selectedChat].user.name}</h5>
              <div style={{ overflowY: 'auto', height: '70vh' }}>
                {chats[selectedChat].messages.length > 0 ? chats[selectedChat].messages.map((msg, index) => (
                  <div key={index} style={{ textAlign: msg.from.id === currentUserId ? 'right' : 'left' }}>
                    <div style={{ backgroundColor: msg.from.id === currentUserId ? 'blue' : 'grey', color: 'white', display: 'inline-block', padding: '5px 15px', borderRadius: '10px' }}>
                      {msg.content}
                      <div className="small">{msg.date.toLocaleTimeString()}</div>
                    </div>
                  </div>
                )) : <div>No messages in this chat.</div>}
              </div>
              {pet && (
                <Card className="mb-2">
                  <Card.Body className="d-flex justify-content-between align-items-center">
                    <div>
                      Attached: {pet.name} - <a href={pet.link}>View Pet</a>
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
                <Button onClick={sendMessage} variant="primary">
                  <FontAwesomeIcon icon={faPaperPlane} />
                </Button>
              </Form>
            </>
          ) : <div>Please select a chat to view messages</div>}
        </Col>
      </div>
    </div>
  );
}

export default ChatMessagesCard;
