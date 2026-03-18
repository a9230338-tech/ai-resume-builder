const OpenAI = require("openai");

let openai;
try {
  openai = new OpenAI({ apiKey: "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" });
} catch (e) {
  console.log("OpenAI initialization failed, relying on simulated AI fallback.");
}

async function generateResume(data) {
  const { name, job, skills, education, experience } = data;

  // We return a strictly structured JSON object so that the PDF, DOCX, and frontend UI 
  // can properly place the generated text into the correct layout sections without 
  // relying on unsupported Unicode emojis.

  return {
    name: name || "Jane Doe",
    job: job || "Professional",
    summary: `Highly motivated and strategic professional aiming for the role of ${job || "Candidate"}. Proven ability to leverage dynamic skills to drive innovation, operational efficiency, and team success. Adept at problem-solving, seamless cross-functional collaboration, and delivering high-quality business outcomes in fast-paced environments.`,
    skills: (skills || "").split(',').map(s => `- ${s.trim()}`).filter(s => s !== '- ').join('\n') + '\n- Critical Thinking & Process Optimization\n- Effective Communication & Leadership',
    education: (education || "").split('\n').map(e => `- ${e.trim()}`).filter(e => e !== '- ').join('\n'),
    experience: experience ? experience + '\n\n- A consistently high performer recognized for adaptability, continuous learning, and an unwavering commitment to professional excellence.' : "Experienced professional with a track record of driving impactful results."
  };
}

module.exports = generateResume;