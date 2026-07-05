// Vercel Serverless Function
// Gemini API 키를 서버 환경변수에서만 읽어서 사용합니다.
// 클라이언트(index.html)는 이 엔드포인트(/api/gemini)로만 요청을 보내고,
// 실제 키는 브라우저/GitHub 코드에 절대 노출되지 않습니다.

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: '서버에 GEMINI_API_KEY 환경변수가 설정되어 있지 않습니다.' });
    return;
  }

  try {
    const { contents } = req.body || {};
    if (!contents) {
      res.status(400).json({ error: 'contents 필드가 필요합니다.' });
      return;
    }

    const geminiRes = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({ contents }),
      }
    );

    const data = await geminiRes.json();
    res.status(geminiRes.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
