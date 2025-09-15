import { useState } from 'react';
import MessageInput from './components/MessageInput';
import ResultsDisplay from './components/ResultsDisplay';
import ExtensionDownload from './components/ExtensionDownload';
import logo from './assets/logo.png';
import backgroundMain from './assets/background.png';
import bandImage from './assets/band.png';

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
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <img src={logo} alt="Logo" style={styles.logo} />
        <nav style={styles.nav}>
          <button onClick={() => scrollToSection('classification')} style={styles.navButton}>
            Spam Test
          </button>
          <button onClick={() => scrollToSection('extension')} style={styles.navButton}>
            Get Extension
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Protect Your Inbox</h1>
          <h2 style={styles.heroSubtitle}>Trust Text AI</h2>
          <p style={styles.heroText}>Advanced spam detection powered by machine learning</p>
          <div style={styles.buttonGroup}>
            <button onClick={() => scrollToSection('classification')} style={styles.primaryButton}>
              Try Now
            </button>
            <button onClick={() => scrollToSection('extension')} style={styles.secondaryButton}>
              Download Extension
            </button>
          </div>
        </div>
      </section>

      {/* Classification Section */}
      <section id="classification" style={styles.classificationSection}>
        <div style={styles.sectionContainer}>
          <h2 style={styles.sectionTitle}>Spam Detection</h2>
          <p style={styles.sectionText}>
            Enter your message below to check if it's spam
          </p>
          <div style={styles.classificationBox}>
            <MessageInput message={message} setMessage={setMessage} onClassify={classifyMessage} />
            <ResultsDisplay result={result} confidence={confidence} spamWords={spamWords} />
          </div>
        </div>
      </section>

      {/* Extension Section */}
      <section id="extension" style={styles.extensionSection}>
        <div style={styles.sectionContainer}>
          <h2 style={styles.sectionTitle}>Chrome Extension</h2>
          <ExtensionDownload />
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>© 2025 Trust Text. All rights reserved.</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: '#0a0a0a',
    color: '#ffffff',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 4rem',
    backgroundColor: 'rgba(17, 25, 40, 0.75)', // More translucent with a blue tint
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backdropFilter: 'blur(12px)',
    boxSizing: 'border-box',
    borderBottom: '1px solid rgba(100, 150, 255, 0.1)', // Subtle blue border
  },
  logo: {
    height: '40px',
  },
  nav: {
    display: 'flex',
    gap: '1.5rem',
  },
  navButton: {
    padding: '0.8rem 1.5rem',
    backgroundColor: 'rgba(50, 100, 255, 0.1)', // Light blue background
    color: '#fff',
    border: '1px solid rgba(100, 150, 255, 0.3)', // Blue border
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '0.9rem',
    fontWeight: '500',
    '&:hover': {
      backgroundColor: 'rgba(50, 100, 255, 0.2)', // Darker blue on hover
      border: '1px solid rgba(100, 150, 255, 0.5)',
    },
  },
  hero: {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${backgroundMain})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '0 2rem',
    marginTop: '80px', // Add this line to create space below navbar
  },
  heroContent: {
    maxWidth: '800px',
  },
  heroTitle: {
    fontSize: '4rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    background: 'linear-gradient(45deg, #fff, #8A2BE2)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: '2rem',
    color: '#8A2BE2',
    marginBottom: '1.5rem',
  },
  heroText: {
    fontSize: '1.2rem',
    color: '#cccccc',
    marginBottom: '2rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
  },
  primaryButton: {
    padding: '1rem 2rem',
    backgroundColor: '#8A2BE2',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  secondaryButton: {
    padding: '1rem 2rem',
    backgroundColor: 'transparent',
    color: 'white',
    border: '2px solid #8A2BE2',
    borderRadius: '30px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(138,43,226,0.1)',
    },
  },
  classificationSection: {
    padding: '8rem 2rem',
    background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
  },
  extensionSection: {
    padding: '8rem 2rem',
    background: '#0a0a0a',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  sectionContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sectionTitle: {
    fontSize: '2.5rem',
    marginBottom: '1.5rem',
    textAlign: 'center',
    color: '#ffffff',
  },
  sectionText: {
    fontSize: '1.1rem',
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: '3rem',
  },
  classificationBox: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '16px',
    padding: '2rem',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  footer: {
    backgroundColor: '#111111',
    padding: '2rem',
    textAlign: 'center',
  },
  footerText: {
    color: '#666666',
  },
};

export default App;
