import { useState } from 'react';

export default function MessageInput({ onClassify }) {
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    onClassify(newMessage); // Real-time classification
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
    </div>
  );
}
