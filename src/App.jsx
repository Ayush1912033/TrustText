import { useState } from 'react';
import MessageInput from './components/MessageInput';
import ResultsDisplay from './components/ResultsDisplay';
import CsvUpload from './components/CsvUpload';
import ExtensionDownload from './components/ExtensionDownload';

function App() {
  const [result, setResult] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [spamWords, setSpamWords] = useState([]);
  const [message, setMessage] = useState('');

  const classifyMessage = async (msg) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      });

      if (!response.ok) {
        console.error('Server error:', response.statusText);
        return;
      }

      const data = await response.json();
      setResult(data.result);
      setConfidence(data.confidence);
      setSpamWords(data.spamWords);

    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handleCsvUpload = (csvData) => {
    console.log('CSV Uploaded:', csvData);
    // You can parse CSV and run classification here
  };

  return (
    <div className="container">
      <h1>Spam Classification Website</h1>
      <MessageInput
        message={message}
        setMessage={setMessage}
        onClassify={classifyMessage}
      />
      <ResultsDisplay result={result} confidence={confidence} spamWords={spamWords} />
      <CsvUpload onCsvUpload={handleCsvUpload} />
      <ExtensionDownload />
    </div>
  );
}

export default App;
