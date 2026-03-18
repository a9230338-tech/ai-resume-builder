function showModal() {
  document.getElementById("paywallModal").classList.add("active");
}

function closeModal() {
  document.getElementById("paywallModal").classList.remove("active");
}

async function processPayment() {
  const btn = document.getElementById("payButton");
  btn.innerHTML = "Processing Secure Payment...";
  btn.disabled = true;

  const token = localStorage.getItem("token");

  try {
    const res = await fetch("/upgrade", {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (res.ok) {
      btn.innerHTML = "Payment Successful! 🎉";
      btn.style.background = "#2ecc71";
      
      setTimeout(() => {
        closeModal();
        btn.disabled = false;
        btn.innerHTML = "Unlock Unlimited Resumes";
        btn.style.background = "var(--accent-gold)";
        // Generate without check
        generateResume();
      }, 1500);
    } else {
      btn.innerHTML = "Payment Failed";
      btn.style.background = "#ef4444";
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = "Unlock Unlimited Resumes";
        btn.style.background = "var(--accent-gold)";
      }, 2000);
    }
  } catch (err) {
    btn.innerHTML = "Network Error";
    btn.style.background = "#ef4444";
  }
}


async function generateResume(){

  const formData = new FormData()

  if(document.getElementById("name")) formData.append("name",document.getElementById("name").value)
  if(document.getElementById("job")) formData.append("job",document.getElementById("job").value)
  if(document.getElementById("skills")) formData.append("skills",document.getElementById("skills").value)
  if(document.getElementById("education")) formData.append("education",document.getElementById("education").value)
  if(document.getElementById("experience")) formData.append("experience",document.getElementById("experience").value)

  const photoInput = document.getElementById("photo");
  if(photoInput && photoInput.files[0]){
    formData.append("photo",photoInput.files[0])
    document.getElementById("profileImage").src=URL.createObjectURL(photoInput.files[0])
    document.getElementById("profileImage").style.display = "block"
  }

  const token = localStorage.getItem("token");

  try {
    const res = await fetch("/generate-resume",{
      method:"POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body:formData
    })

    if (res.status === 403 || res.status === 401) {
      const errorData = await res.json();
      if (errorData.error === "Paywall") {
        showModal();
      } else {
        alert(errorData.error);
        if (res.status === 401) {
          window.location.href = "auth.html";
        }
      }
      return;
    }

    const data = await res.json()

    // Populate UI with the backend refined AI text safely
    if(document.getElementById("pname")) document.getElementById("pname").innerText=data.name || ""
    if(document.getElementById("pjob")) document.getElementById("pjob").innerText=data.job || ""
    if (document.getElementById("pskills")) document.getElementById("pskills").innerText=data.skills || ""
    if (document.getElementById("peducation")) document.getElementById("peducation").innerText=data.education || ""
    if (document.getElementById("pexperience")) document.getElementById("pexperience").innerText=data.experience || ""

    if(document.getElementById("resumePreview") && !document.getElementById("pskills")) {
      let outStr = `${data.name}\n${data.job}\n\nSUMMARY\n${data.summary}\n\nSKILLS\n${data.skills}\n\nEDUCATION\n${data.education}\n\nEXPERIENCE\n${data.experience}`;
      document.getElementById("resumePreview").innerText = outStr;
    }

  } catch (err) {
    console.error(err)
  }
}

// download pdf
function downloadPDF(){
  window.open("/resume.pdf")
}

// 3D dynamic bulge-out (tilt) effect for the panels
document.addEventListener('DOMContentLoaded', () => {
  const interactivePanels = document.querySelectorAll('.form-panel, .preview-section-inner, .modal-content');

  interactivePanels.forEach(panel => {
    panel.addEventListener('mousemove', (e) => {
      const rect = panel.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate physical tilt based on cursor position
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      
      panel.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
      // Liquid "river flowing" ultra-smooth transition
      panel.style.transition = 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
      // Add a dynamic shadow for the popup effect
      panel.style.boxShadow = `
        ${-rotateY * 3}px ${rotateX * 3 + 15}px 40px rgba(0, 0, 0, 0.5),
        0 0 30px rgba(245, 158, 11, 0.2)
      `;
    });

    panel.addEventListener('mouseleave', () => {
      panel.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      panel.style.transition = 'transform 1.8s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 1.8s cubic-bezier(0.16, 1, 0.3, 1)';
      panel.style.boxShadow = 'none';
    });
  });
});