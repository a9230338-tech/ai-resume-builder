const fs = require("fs")
const path = require("path")
const { Document, Packer, Paragraph, ImageRun } = require("docx")

function createDOCX(text,photoPath){

const children=[]

// add photo
if(photoPath){
children.push(
new Paragraph({
children:[
new ImageRun({
data: fs.readFileSync(photoPath),
transformation:{
width:120,
height:120
}
})
]
})
)
}

// add text
children.push(new Paragraph(text))

const doc = new Document({
sections:[
{
children:children
}
]
})

Packer.toBuffer(doc).then(buffer=>{

const filePath=path.join(__dirname,"public","resume.docx")

fs.writeFileSync(filePath,buffer)

})

}

module.exports=createDOCX