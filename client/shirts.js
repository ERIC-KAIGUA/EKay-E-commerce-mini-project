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
 let cart = {};

        
        function addToCart(id, name, price, imageUrl) {
            if (cart[id]) {
                cart[id].quantity += 1;
            } else {
                cart[id] = {
                    id: id,
                    name: name,
                    price: price,
                    image: imageUrl,
                    quantity: 1
                };
            }
            updateCartDisplay();
        }

     
        function updateQuantity(id, change) {
            if (cart[id]) {
                cart[id].quantity += change;
                if (cart[id].quantity <= 0) {
                    delete cart[id];
                }
                updateCartDisplay();
            }
        }

        
        function updateCartDisplay() {
            const cartItemsContainer = document.getElementById('cartItems');
            
            if (Object.keys(cart).length === 0) {
                cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
                return;
            }

            let cartHTML = '';
            for (let id in cart) {
                const item = cart[id];
                cartHTML += `
                    <div class="cart-item">
                        <div class="cart-item-image">
                             <img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                            <div class="cart-item-placeholder">${item.name.split('-')[0]}</div>
                        </div>
                        <div class="cart-item-details">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">${item.price}</div>
                        </div>
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="updateQuantity('${id}', -1)">‹</button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity('${id}', 1)">›</button>
                        </div>
                    </div>
                `;
            }
            
            cartItemsContainer.innerHTML = cartHTML;
        }

       
        function clearCart() {
            cart = {};
            updateCartDisplay();
        }

        
        function checkout() {
            if (Object.keys(cart).length === 0) {
                alert('Your cart is empty!');
                return;
            }
            
            let total = 0;
            let itemList = [];
            
            for (let id in cart) {
                const item = cart[id];
                const price = parseInt(item.price.replace('Ksh.', ''));
                total += price * item.quantity;
                itemList.push(`${item.name} (x${item.quantity})`);
            }
            
            alert(`Checkout Summary:\n${itemList.join('\n')}\n\nTotal: Ksh.${total}`);
            
            
            clearCart();
        }

       
        updateCartDisplay();

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