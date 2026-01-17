import fetch from "node-fetch";

const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL = process.env.OLLAMA_MODEL || "mistral";

// Fixed system prompt (NO NOT accept user input here)
const SYSTEM_PROMPT = `
You are a risk explanation engine.
You ONLY explain risk metadata.
You NEVER reference documents, clauses or user inputs.
You return a single concise sentence.
No markdown. No lists. No extra text.
`;

export async function explainRisk({ risk_level, risk_category, risk_signal }){
    // Hard fallback (if Ollama fails)
    const fallback = `This change increases ${risk_category} risk and should be reviewed carefully.`;

    try{
        const prompt = `
        Risk Level: ${risk_category}
        Risk Signal: ${risk_signal}

        Explain the risk in one sentence.
        `;

        const response = await fetch(OLLAMA_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                model: MODEL,
                prompt: SYSTEM_PROMPT + prompt,
                stream: false
            })
        });

        if(!response.ok){
            throw new Error("Ollama request failed");
        }

        const data = await response.json();

        return data.response?.trim() || fallback;
    }catch(error){
        console.warn("LLM explanation failed, using fallback");
        return fallback;
    }
}