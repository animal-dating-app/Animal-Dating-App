import React from "react";

function RecentMessagesCard({ shelter }) {
  return (
    <div className="card mb-3">
      <div className="row g-0">
        <div className={"col-md-12"}>
          <div
            className="card-body text-start"
            style={{ padding: "2rem", paddingBottom: "3rem" }}
          >
            <h4 className="card-title">Recent Messages</h4>

            {(!shelter.messages || shelter.messages.length === 0) ? (
              <p className="card-text">
                You have no recent messages. Check back later!
              </p>
            ) : 
            (
            shelter.messages.slice(-5).map((message) => (
              <div key={message.id} className="card-text">
                <strong>{message.user}</strong>: {message.message}
              </div>
            ))
            ) }
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecentMessagesCard;
