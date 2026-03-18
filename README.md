# AI Resume Builder

A premium, VIP-themed AI Resume Builder that leverages simulated artificial intelligence to generate high-converting, professional resumes with gorgeous dark-mode glassmorphism aesthetics. Features fully structured DOCX and PDF export capabilities with distinct coloring for sections.

## Features
- **Premium Design**: Dark mode UI with gold accents, glowing CSS orbs, and glassmorphism panels.
- **AI Text Generation**: Re-structures and perfects user inputs into highly professional bullet-points.
- **Format Export**: Creates properly formatted `.pdf` and `.docx` layout files natively via backend streams.
- **Built-in Paywall Check**: Allows 1 free resume generation and tests an elegant Mock Payment UI flow.

## Local Setup

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Start the backend:
\`\`\`bash
npm start
\`\`\`

3. Visit your SaaS dashboard at `http://localhost:3000`

## How to Deploy to GitHub

In your terminal, inside this exact folder (\`c:\\Users\\hp\\OneDrive\\Documents\\ai-resume-builder\`), run these exact commands one-by-one:

1. **Initialize Git and Stage Files**
\`\`\`bash
git init
echo "node_modules/" > .gitignore
git add .
git commit -m "Initial commit featuring premium VIP resume builder UI and AI backend"
\`\`\`

2. **Create a Repository on GitHub**
Go to [github.com/new](https://github.com/new) in your browser and create a new repository called `ai-resume-builder`. Don't initialize it with a README or license because you just created those locally.

3. **Link and Push**
Copy the URL from the repository you just created (it will look like `https://github.com/your-username/ai-resume-builder.git`). Back in your terminal, run:
\`\`\`bash
git remote add origin YOUR_COPIED_URL_HERE
git branch -M main
git push -u origin main
\`\`\`
