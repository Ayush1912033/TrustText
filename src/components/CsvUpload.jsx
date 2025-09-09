export default function CsvUpload({ onCsvUpload }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      onCsvUpload(event.target.result);
    };
    reader.readAsText(file);
  };

  return <input type="file" accept=".csv" onChange={handleFileChange} />;
}
