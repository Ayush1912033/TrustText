import { useState } from 'react';
import MessageInput from './components/MessageInput';
import ResultsDisplay from './components/ResultsDisplay';
import ExtensionDownload from './components/ExtensionDownload';
import logo from './assets/logo.png';
import backgroundMain from './assets/background.png'; // Add your main background image
import bandImage from './assets/band.png'; // Add your band style image

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

  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#000', color: 'white' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', backgroundColor: '#111' }}>
        <img src={logo} alt="Logo" style={{ height: '50px' }} />
        <nav>
          <button onClick={() => scrollToSection('classification')} style={navButtonStyle}>Try Spam Test</button>
          <button onClick={() => scrollToSection('extension')} style={navButtonStyle}>Download Extension</button>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={{ backgroundImage: `url(${backgroundMain})`, backgroundSize: 'cover', textAlign: 'center', padding: '100px 20px' }}>
        <h1 style={{ fontSize: '3em', color: 'white' }}>Own Your Daily Routine</h1>
        <h2 style={{ fontSize: '2.5em', color: '#FFD700' }}>trust test</h2>
        <p style={{ fontSize: '1.5em', color: 'white' }}>A health tracker that motivates you every step of the way</p>
        <div style={{ marginTop: '20px' }}>
          <button onClick={() => scrollToSection('classification')} style={primaryButtonStyle}>Try</button>
          <button onClick={() => scrollToSection('extension')} style={primaryButtonStyle}>Download Extension</button>
        </div>
      </section>

      {/* Classification Section */}
      <section id="classification" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5em' }}>Notification System</h2>
        <p style={{ fontSize: '1.2em', maxWidth: '600px', margin: '0 auto' }}>
          Here the code to passing text for spam classification
        </p>
        <MessageInput message={message} setMessage={setMessage} onClassify={classifyMessage} />
        <ResultsDisplay result={result} confidence={confidence} spamWords={spamWords} />
      </section>

      {/* Style Matching Section */}
      <section style={{ backgroundColor: '#222', padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5em' }}>Match Your Band to Your Style</h2>
        <p style={{ fontSize: '1.2em', maxWidth: '600px', margin: '0 auto' }}>
          I'm a paragraph. Click here to add your own text and edit me. It's easy. Just click "Edit Text".
        </p>
        <img src={bandImage} alt="Band Styles" style={{ maxWidth: '100%', marginTop: '30px' }} />
        <div style={{ marginTop: '30px' }}>
          <button style={primaryButtonStyle}>Download</button>
        </div>
      </section>

      {/* Extension Download Section */}
      <section id="extension" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5em' }}>Download Our Chrome Extension</h2>
        <ExtensionDownload />
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#111', textAlign: 'center', padding: '40px', color: 'white' }}>
        <p>© 2025 Trust Text. All rights reserved.</p>
      </footer>
    </div>
  );
}

const navButtonStyle = {
  padding: '10px 20px',
  margin: '0 10px',
  backgroundColor: '#333',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const primaryButtonStyle = {
  padding: '15px 30px',
  margin: '10px',
  backgroundColor: '#8A2BE2',
  color: 'white',
  border: 'none',
  borderRadius: '25px',
  fontSize: '1em',
  cursor: 'pointer',
};

export default App;
