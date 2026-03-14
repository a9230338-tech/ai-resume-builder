function generateResume(data){

return `
${data.name}

Professional Summary
Motivated candidate applying for the role of ${data.job}. Skilled in ${data.skills}. Dedicated to delivering high-quality results and continuous improvement.

Skills
• ${data.skills}

Education
${data.education}

Experience
${data.experience}

Key Strengths
• Problem solving
• Team collaboration
• Communication
• Adaptability
`

}

module.exports = generateResume