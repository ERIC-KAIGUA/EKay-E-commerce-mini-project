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