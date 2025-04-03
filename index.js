import { useState } from 'react';

export default function Home() {
  const [form, setForm] = useState({ jobType: '', squareFootage: '', location: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/generate-quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setQuote(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto bg-white shadow-2xl rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-4">CleanQuote AI</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="jobType" placeholder="Job Type (e.g., Deep Clean)" onChange={handleChange} className="w-full p-2 border rounded" required />
          <input name="squareFootage" placeholder="Square Footage (e.g., 1200)" onChange={handleChange} className="w-full p-2 border rounded" required />
          <input name="location" placeholder="Location (City or Zip)" onChange={handleChange} className="w-full p-2 border rounded" required />
          <textarea name="notes" placeholder="Special Instructions" onChange={handleChange} className="w-full p-2 border rounded" rows="3" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {loading ? 'Generating...' : 'Generate Quote'}
          </button>
        </form>
        {quote && (
          <div className="mt-6 bg-gray-50 p-4 rounded border">
            <h2 className="text-xl font-semibold mb-2">Estimated Quote:</h2>
            <p><strong>Time:</strong> {quote.hours} hours</p>
            <p><strong>Price:</strong> ${quote.price}</p>
            <h3 className="text-lg font-semibold mt-4">Client Message:</h3>
            <p className="whitespace-pre-wrap">{quote.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
