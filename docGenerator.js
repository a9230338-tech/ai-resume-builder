const fs = require("fs")
const path = require("path")
const { Document, Packer, Paragraph, TextRun, ImageRun } = require("docx")

function createDOCX(data, photoPath) {
  return new Promise((resolve, reject) => {
    try {
      const children = []

      // Add photo if exists
      if(photoPath && fs.existsSync(photoPath)){
        children.push(
          new Paragraph({
            children: [
              new ImageRun({
                data: fs.readFileSync(photoPath),
                transformation: { width: 120, height: 120 }
              })
            ]
          })
        )
      }

      // Name & Job
      children.push(new Paragraph({
        children: [new TextRun({ text: (data.name || "").toUpperCase(), bold: true, size: 48, color: "0F172A" })]
      }));
      children.push(new Paragraph({
        children: [new TextRun({ text: (data.job || "").toUpperCase(), bold: true, size: 28, color: "F59E0B" })],
        spacing: { after: 400 }
      }));
      
      const addSection = (title, content) => {
        if (!content) return;
        // Heading with Color
        children.push(new Paragraph({
          children: [new TextRun({ text: title.toUpperCase(), bold: true, size: 28, color: "0F172A" })], // dark navy blue
          spacing: { after: 120 }
        }));
        
        // Body Content
        const lines = content.split('\n');
        lines.forEach(line => {
          children.push(new Paragraph({
            children: [new TextRun({ text: line, size: 22, color: "333333" })],
            spacing: { after: 100 }
          }));
        });
        
        children.push(new Paragraph({ text: "", spacing: { after: 200 } }));
      }

      addSection("Professional Summary", data.summary);
      addSection("Skills & Expertise", data.skills);
      addSection("Education", data.education);
      addSection("Professional Experience", data.experience);

      const doc = new Document({
        sections: [{ children: children }]
      })

      Packer.toBuffer(doc).then(buffer => {
        const filePath = path.join(__dirname, "public", "resume.docx")
        fs.writeFile(filePath, buffer, (err) => {
          if (err) return reject(err);
          resolve(filePath);
        });
      }).catch(reject);
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = createDOCX