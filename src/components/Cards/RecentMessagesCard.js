import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ListGroup, Button } from 'react-bootstrap';
import { query, collection, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";

function RecentMessagesCard() {
  const [recentMessages, setRecentMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRecentMessages() {
      const messagesRef = collection(db, "messages");
      const recentMessagesQuery = query(
          messagesRef,
          where("toId", "==", auth.currentUser.uid),
          orderBy("date", "desc"),
          limit(100)
      );

      try {
          const querySnapshot = await getDocs(recentMessagesQuery);
          const messages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          const uniqueSenders = new Set();
          const recentMessages = [];
          for (const message of messages) {
            if (uniqueSenders.size >= 5) {
              break;
            }
            if (!uniqueSenders.has(message.fromId)) {
              uniqueSenders.add(message.fromId);
              recentMessages.push(message);
            }
          }
          setRecentMessages(recentMessages);
      } catch (error) {
          console.error("Failed to fetch messages:", error);
      }
    }

    fetchRecentMessages();
  }, []);

  return (
    <div className="card mb-3">
      <div className="row g-0">
        <div className={"col-md-12"}>
          <div className="card-body text-start">
            <h4 className="card-title">Recent Messages</h4>
            <ListGroup variant="flush">
              {recentMessages.length === 0 ? (
                <ListGroup.Item>
                  You have no recent messages. Check back later!
                </ListGroup.Item>
              ) : (
                recentMessages.map((message) => (
                  <ListGroup.Item 
                    key={message.id} 
                    action 
                    onClick={() => navigate('/messages', { state: { userId: message.fromId, userName: message.fromName }})}
                    style={{ cursor: 'pointer' }}
                  >
                    <strong>{message.fromName || 'Anonymous User'}</strong>: {message.content}
                  </ListGroup.Item>
                ))
              )}
            </ListGroup>
            <Button variant="primary" className="mt-3" onClick={() => navigate('/messages')}>
              View All Messages
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecentMessagesCard;

