export default function ResultsDisplay({ result, confidence, spamWords }) {
  return (
    <div>
      <h3>Classification Result: {result}</h3>
      <p>Confidence: {confidence}%</p>
      <p>Spam-triggering words: {spamWords.join(', ')}</p>
    </div>
  );
}
