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

  const classifyMessage = (msg) => {
    setMessage(msg);
    // Example mock classification logic
    const spamTriggers = ['buy', 'offer', 'click'];
    const detectedWords = spamTriggers.filter(word => msg.includes(word));
    const isSpam = detectedWords.length > 0;

    setResult(isSpam ? 'Spam' : 'Not Spam');
    setConfidence(isSpam ? 95 : 99);
    setSpamWords(detectedWords);
  };

  const handleCsvUpload = (csvData) => {
    console.log('CSV Uploaded:', csvData);
    // You can parse CSV and run classification for each line here
  };

  return (
    <div className="container">
      <h1>Spam Classification Website</h1>
      <MessageInput onClassify={classifyMessage} />
      <ResultsDisplay result={result} confidence={confidence} spamWords={spamWords} />
      
      <CsvUpload onCsvUpload={handleCsvUpload} />
      <ExtensionDownload />
    </div>
  );
}

export default App;
