const slides = document.querySelectorAll(".con1-left img");
let slideIndex = 0;
let intervalId = null;

document.addEventListener('DOMContentLoaded', async function(){
    const logoutButton = document.getElementById('logoutBtn');

   async function fetchUserData(){
    try{
       const response = await fetch('http://localhost:3000/api/protected',{
        method:'GET',
        credentials:'include'
       });

       const data = await response.json();

       if(response.ok){
        console.log({msg:"You are logged in"})
       }else{
        setTimeout(()=> {
            window.location.href = 'sign-in.html'
        },100000);
       }
    }catch(err){
       console.error( `Error:${err}`)
       setTimeout(()=>{
        window.location.href = 'sign-in.html'
       },100000);
    }
   }
   fetchUserData()

logoutButton.addEventListener('click', async () => {
        try {
            const response = await fetch('http://localhost:3000/api/logout', {
                method: 'POST',
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                // alert(data.message); 
                window.location.href = 'sign-in.html'; 
            } else {
                // alert(data.message || 'logout failed.');
                console.error('logout error:', data);
            }
        } catch (error) {
            // alert('Network error during logout.');
            console.error('Fetch error during logout:', error);
        }
    });
});


document.addEventListener("DOMContentLoaded", initializeSlider);
function initializeSlider(){
    if(slides.length > 0){ 
       slides[slideIndex].classList.add("displaySlide");
        intervalId = setInterval(nextSlide, 5000);
    }
}
function showSlide(index){

    if(index >= slides.length){
        slideIndex=0;
    }else if(index < 0){
         slideIndex = slides.length - 1;
    }
    slides.forEach(slide => {
        slide.classList.remove("displaySlide");
    });
    slides[slideIndex].classList.add("displaySlide");

}
function prevSlide(){
    slideIndex--;
    showSlide(slideIndex);
}
function nextSlide(){
    slideIndex++;
    showSlide(slideIndex);
}
document.addEventListener('DOMContentLoaded', function() {
  const cartIcon = document.getElementById('cart-icon');
  const cartTab = document.getElementById('cart-tab');
  const closeBtn = document.getElementById('close');

  cartIcon.addEventListener('click', function() {
    cartTab.classList.add('visible');
  });

  closeBtn.addEventListener('click', function() {
    cartTab.classList.remove('visible');
  });
});
document.addEventListener('DOMContentLoaded',function(){
    const button = document.getElementById('button')

    button.addEventListener('click',function(){
        window.location.href = 'bestseller.html'
    })
})
document.addEventListener('DOMContentLoaded',function(){
    const viewBtn = document.getElementById('view-all-button')

    viewBtn.addEventListener('click',function(){
        window.location.href = 'bestseller.html'
    })
})
document.addEventListener('DOMContentLoaded',function(){
    const incrementBtn = document.getElementById('plus-btn')
    const decrementBtn = document.getElementById('minus-btn')
    const number = document.getElementById('number')

   let quantity = 1;
   function updateNumberDisplay(){
      number.textContent=quantity;
   }
    incrementBtn.addEventListener('click',function(){
            quantity ++;
            updateNumberDisplay();
    })
    decrementBtn.addEventListener('click',function(){
        if (quantity > 1){
            quantity --;
            updateNumberDisplay();
         }
    })
    updateNumberDisplay();
})