const PDFDocument = require("pdfkit")
const fs = require("fs")
const path = require("path")

function createPDF(data){

const filePath = path.join(__dirname,"public","resume.pdf")

const doc = new PDFDocument({ margin: 50 })

const stream = fs.createWriteStream(filePath)

doc.pipe(stream)

// Name
doc
.fontSize(24)
.text(data.name, {align:"center"})
.moveDown()

// Job Title
doc
.fontSize(14)
.text(data.job,{align:"center"})
.moveDown(2)

// Skills
doc
.fontSize(16)
.text("Skills",{underline:true})
.moveDown(0.5)

doc
.fontSize(12)
.text(data.skills)
.moveDown()

// Education
doc
.fontSize(16)
.text("Education",{underline:true})
.moveDown(0.5)

doc
.fontSize(12)
.text(data.education)
.moveDown()

// Experience
doc
.fontSize(16)
.text("Experience",{underline:true})
.moveDown(0.5)

doc
.fontSize(12)
.text(data.experience)

doc.end()

}

module.exports = createPDF