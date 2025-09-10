import { useState } from 'react';

export default function MessageInput({ message, setMessage, onClassify }) {
  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleClassifyClick = () => {
    onClassify(message);
  };

  return (
    <div>
      <textarea
        placeholder="Type your message here..."
        value={message}
        onChange={handleChange}
        rows="5"
        cols="50"
      />
      <button onClick={handleClassifyClick}>Classify Now</button>
    </div>
  );
}
