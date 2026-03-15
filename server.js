const express = require("express")
const cors = require("cors")
const path = require("path")
const multer = require("multer")

const createPDF = require("./pdfGenerator")
const createDOCX = require("./docGenerator")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(express.static(path.join(__dirname,"public")))

// upload config
const storage = multer.diskStorage({
destination:(req,file,cb)=>{
cb(null,"public/uploads")
},
filename:(req,file,cb)=>{
cb(null,Date.now()+"-"+file.originalname)
}
})

const upload = multer({storage})

// homepage
app.get("/", (req,res)=>{
res.sendFile(path.join(__dirname,"public","index.html"))
})

// generate resume
app.post("/generate-resume", upload.single("photo"), (req,res)=>{

const data=req.body
const photoPath=req.file ? req.file.path : null

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

createPDF({
...data,
photo:photoPath
})

createDOCX(resume, photoPath)

res.json({
resume:resume
})

})

app.listen(3000,()=>{
console.log("Server running at http://localhost:3000")
})