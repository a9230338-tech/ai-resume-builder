const PDFDocument = require("pdfkit")
const fs = require("fs")
const path = require("path")

function createPDF(data){

const filePath = path.join(__dirname,"public","resume.pdf")

const doc = new PDFDocument({ margin: 50 })

const stream = fs.createWriteStream(filePath)

doc.pipe(stream)

// PHOTO
if(data.photo){
doc.image(data.photo, 450, 50, {
width:100,
height:100
})
}

// NAME
doc
.fontSize(24)
.text(data.name,{align:"center"})
.moveDown()

// JOB
doc
.fontSize(14)
.text(data.job,{align:"center"})
.moveDown(2)

// SKILLS
doc.fontSize(16).text("Skills",{underline:true})
doc.moveDown(0.5)

doc.fontSize(12).text(data.skills)
doc.moveDown()

// EDUCATION
doc.fontSize(16).text("Education",{underline:true})
doc.moveDown(0.5)

doc.fontSize(12).text(data.education)
doc.moveDown()

// EXPERIENCE
doc.fontSize(16).text("Experience",{underline:true})
doc.moveDown(0.5)

doc.fontSize(12).text(data.experience)

doc.end()

}

module.exports=createPDF