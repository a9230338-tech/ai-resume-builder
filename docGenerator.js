const fs = require("fs")
const path = require("path")
const { Document, Packer, Paragraph } = require("docx")

function createDOCX(text){

const doc = new Document({
sections:[{
children:[
new Paragraph(text)
]
}]
})

Packer.toBuffer(doc).then(buffer=>{

const filePath = path.join(__dirname,"public","resume.docx")

fs.writeFileSync(filePath,buffer)

})

}

module.exports = createDOCX