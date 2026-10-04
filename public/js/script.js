// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

let priceToggle = document.getElementById("switchCheckDefault");
let textInfo = document.querySelectorAll("#textInfo")
if(priceToggle){
  priceToggle.addEventListener("click",()=>{
      for(info of textInfo){
          if(info.style.display === "inline"){
              info.style.display = "none";
          }else{
              info.style.display = "inline";
          }
      }
  })
}