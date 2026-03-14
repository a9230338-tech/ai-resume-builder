const express = require("express")
const cors = require("cors")
const path = require("path")
const createPDF = require("./pdfGenerator")
const createDOCX = require("./docGenerator")

const app = express()

app.use(cors())
app.use(express.json())

app.use(express.static(path.join(__dirname,"public")))

app.get("/", (req,res)=>{
res.sendFile(path.join(__dirname,"public","index.html"))
})

app.post("/generate-resume",(req,res)=>{

const data=req.body

const resume=`
${data.name}

Professional Summary
Motivated professional applying for ${data.job}. Skilled in ${data.skills}.

Skills
${data.skills}

Education
${data.education}

Experience
${data.experience}

`

createPDF(data)
createDOCX(resume)

res.json({
resume:resume
})

})

app.listen(3000,()=>{
console.log("Server running at http://localhost:3000")
})