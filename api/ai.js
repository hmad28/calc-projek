const SYSTEM_PROMPT = `Kamu adalah sales solution architect Solivate Studio. Analisis kebutuhan customer dan petakan hanya ke packageId dan moduleIds yang disediakan. Jangan menghitung harga sendiri karena harga dihitung deterministic rule engine. Utamakan scope yang cukup, jangan memaksakan add-on jika kebutuhan sudah lebih cocok menjadi paket sistem. Tandai risiko data sensitif, volume besar, banyak role, multi-branch, payment/provider fee, atau kebutuhan enterprise. Jawab JSON valid saja dengan struktur: {"summary":"string singkat","reasoning":"string 1-3 kalimat","packageId":"id","moduleIds":["id"],"alerts":["string"]}.`;

export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed" });
  if (!process.env.GEMINI_API_KEY) return response.status(503).json({ error: "GEMINI_API_KEY belum dikonfigurasi di Vercel Environment Variables." });
  try {
    const body = typeof request.body === "string" ? JSON.parse(request.body) : request.body;
    if (!body?.requirement || body.requirement.length > 6000) return response.status(400).json({ error: "Requirement kosong atau terlalu panjang." });
    const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
    const geminiResponse = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: JSON.stringify({ requirement: body.requirement, customerProfile: body.profile, allowedPackages: body.availablePackages, allowedModules: body.availableModuleIds }) }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.2, maxOutputTokens: 1000 }
      })
    });
    const data = await geminiResponse.json();
    if (!geminiResponse.ok) throw new Error(data?.error?.message || "Gemini API request failed");
    const text = data?.candidates?.[0]?.content?.parts?.map(part => part.text || "").join("");
    if (!text) throw new Error("Respons Gemini kosong");
    const result = JSON.parse(text.replace(/^```json\s*|\s*```$/g, ""));
    return response.status(200).json(result);
  } catch (error) {
    return response.status(500).json({ error: error.message || "AI analysis failed" });
  }
}
