async function generateResume(){

const formData = new FormData()

formData.append("name",document.getElementById("name").value)
formData.append("job",document.getElementById("job").value)
formData.append("skills",document.getElementById("skills").value)
formData.append("education",document.getElementById("education").value)
formData.append("experience",document.getElementById("experience").value)

const photoFile=document.getElementById("photo").files[0]

if(photoFile){
formData.append("photo",photoFile)
document.getElementById("profileImage").src=URL.createObjectURL(photoFile)
}

const res = await fetch("/generate-resume",{
method:"POST",
body:formData
})

const data = await res.json()

document.getElementById("pname").innerText=document.getElementById("name").value
document.getElementById("pjob").innerText=document.getElementById("job").value
document.getElementById("pskills").innerText=document.getElementById("skills").value
document.getElementById("peducation").innerText=document.getElementById("education").value
document.getElementById("pexperience").innerText=document.getElementById("experience").value

}

// download pdf
function downloadPDF(){
window.open("/resume.pdf")
}