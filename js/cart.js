let orderBtn = document.querySelector("#orderBtn")
let orderSection = document.querySelector('.order')

orderBtn.addEventListener("click", function(){
    orderBtn.style.display = 'none'
    orderSection.style.display = 'block'
})