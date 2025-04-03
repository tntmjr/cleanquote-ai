export default async function handler(req, res) {
  const { jobType, squareFootage, location, notes } = req.body;

  const prompt = `You are a quoting assistant for a professional cleaning company.
Client request:
- Job type: ${jobType}
- Square footage: ${squareFootage}
- Location: ${location}
- Notes: ${notes || 'None'}

Respond with:
1. Estimated cleaning time (in hours)
2. Price estimate in USD
3. A professional but friendly message to send to the client`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: \`Bearer \${process.env.OPENAI_API_KEY}\`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  });

  const result = await response.json();
  const reply = result.choices[0].message.content;
  const [hoursLine, priceLine, ...messageLines] = reply.split('\n');
  const hours = hoursLine.match(/\d+(\.\d+)?/)[0];
  const price = priceLine.match(/\$?\d+(\.\d+)?/)[0].replace('$', '');
  const message = messageLines.join('\n').trim();

  res.status(200).json({ hours, price, message });
}
