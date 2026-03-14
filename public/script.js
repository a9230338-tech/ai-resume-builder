async function generateResume(){

const name=document.getElementById("name").value
const job=document.getElementById("job").value
const skills=document.getElementById("skills").value
const education=document.getElementById("education").value
const experience=document.getElementById("experience").value

document.getElementById("pname").innerText=name
document.getElementById("pjob").innerText=job
document.getElementById("pskills").innerText=skills
document.getElementById("peducation").innerText=education
document.getElementById("pexperience").innerText=experience

const template=document.getElementById("template").value

const preview=document.getElementById("resumePreview")

preview.className=template

// profile photo

const file=document.getElementById("photo").files[0]

if(file){

const reader=new FileReader()

reader.onload=function(e){

document.getElementById("profileImage").src=e.target.result

}

reader.readAsDataURL(file)

}

const data={
name:name,
job:job,
skills:skills,
education:education,
experience:experience
}

await fetch("/generate-resume",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(data)

})

}

function downloadPDF(){

window.open("/resume.pdf","_blank")

}