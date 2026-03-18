const PDFDocument = require("pdfkit")
const fs = require("fs")
const path = require("path")

function createPDF(data) {
  return new Promise((resolve, reject) => {
    try {
      const filePath = path.join(__dirname, "public", "resume.pdf")
      const doc = new PDFDocument({ margin: 50 })
      const stream = fs.createWriteStream(filePath)
      
      stream.on('finish', () => resolve(filePath));
      stream.on('error', (err) => reject(err));

      doc.pipe(stream)

      // Photo
      if(data.photo && fs.existsSync(data.photo)){
        doc.image(data.photo, 420, 50, { width: 100, height: 100 });
        doc.moveDown(3);
      } else {
        doc.moveDown(1);
      }

      // Name & Job
      doc.fontSize(24).fillColor('#0f172a').text((data.name || "Name").toUpperCase()).moveDown(0.2)
      doc.fontSize(14).fillColor('#f59e0b').text((data.job || "Job").toUpperCase()).moveDown(2)

      // Helper function for colored headings
      const addHeading = (title) => {
        doc.fontSize(14)
           .fillColor('#0f172a') // Dark Navy Blue separating content from headings
           .font('Helvetica-Bold')
           .text(title.toUpperCase(), { underline: false })
           .moveDown(0.3);
      }

      // Helper for body text
      const addContent = (content) => {
        doc.fontSize(10)
           .fillColor('#333333')
           .font('Helvetica')
           .text(content || "", {
             lineGap: 4
           })
           .moveDown(1.5);
      }

      if (data.summary) {
        addHeading("Professional Summary");
        addContent(data.summary);
      }

      if (data.skills) {
        addHeading("Skills & Expertise");
        addContent(data.skills);
      }

      if (data.education) {
        addHeading("Education");
        addContent(data.education);
      }

      if (data.experience) {
        addHeading("Professional Experience");
        addContent(data.experience);
      }

      doc.end()
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = createPDF