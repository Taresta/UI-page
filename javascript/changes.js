class Product {
    constructor(image, name, category, quantity, price) {
        this._image = image;
        this._name = name;
        this._category = category;
        this._quantity = quantity;
        this._price = price;
    }
    get image() {
        return this._image;
    }
    get name() {
        return this._name;
    }
    get category() {
        return this._category;
    }
    get quantity() {
        return this._quantity;
    }
    get price() {
        return this._price;
    }
    
    set quantity(quantity) {
        this._quantity = quantity;
    }
    set price(price) {
        this._price = price;
    }
    total() {
        return this._quantity * this._price;
    }
}

const productArray = [];
fetch('../data.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(item => {
            let product = new Product(item.image, item.name, item.category, 0, item.price);
            productArray.push(product);
        });
        console.log('Product Array:', productArray);
    })
    .catch(error => console.error('Error loading JSON:', error));

    const cart=[];
    
   const handleChangeButtonSate =  function() {
    changeButtonState(this);
}
//This function add the product to cart one time
function addProductToCart() {
    console.trace("addProductToCart called"); 
    const button = this;
    console.log(button);
    const productContainer = button.closest('.dessert');
    const productName = productContainer.querySelector('.dessert-full-name').innerText;
    //Find if the product exists in the cart and what is its index number
    const productIndex = cart.findIndex(product => product.name === productName);
    if (productIndex === -1) {
        //Add the product to the cart using json data
        //Find the product in the productArray
        let product = productArray.find(product => product.name === productName);
        //Before pushing change its quantity to 1
        product.quantity = 1;
        cart.push(product);
        updateCartUI();
        button.removeEventListener('click', addProductToCart);//remove the event listener once the product has been added. See the log entry for 23rd Sept for further clarification.
    }
}

const addToCart = document.querySelectorAll('.add-to-cart');
if (addToCart.length > 0) {
     addToCart.forEach(button => {
         button.addEventListener('click', addProductToCart);
         button.addEventListener('click', handleChangeButtonSate);
    });
}
//Function to remove event listener when needed\
function removeAddToCartEventListener(button) {
    button.removeEventListener('click', addProductToCart);
    button.removeEventListener('click', handleChangeButtonSate);
}

//This fuction will update the UI of the cart
function updateCartUI() {
    console.trace("updateCartUI called"); 
    
    const cartSection = document.getElementById('cart-section');
    const cartQuantity = document.getElementById('cart-quantity');
    const emptyCartContainer = document.getElementById('empty-cart-container');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const orderSummary = document.getElementById('order-summary');
    const orderTotal = document.getElementById('order-total');

    console.log("Before Clearing:", cartItemsContainer.innerHTML);
    cartItemsContainer.innerHTML = ''; //Clear the cart items container
    console.log("After Clearing:", cartItemsContainer.innerHTML);

    
    emptyCartContainer.innerHTML = '';//Clear the img and p when the user clicks add to cart button
    cartQuantity.innerHTML = '';
    console.log("Cart length:", cart.length);
    cartQuantity.innerHTML = cart.length;
    if (cart.length > 0) { //Populate the cart with products if the cart is not empty
       //Generate row for each product in the cart
       cart.forEach(product => {   
            if (product.quantity  > 0) {
                console.log("Repopulating cart with:", product.name);

                let cartItem = document.createElement('div'); //Each item in the cart will have its own row and it will be a div
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `<p class="cart-product-name">${product.name}</p>
                                    <span class="cart-product-quantity">${product.quantity}X</span>
                                    <span class="cart-product-price">@${product.price}</span>
                                    <span class="cart-product-total">$${product.total().toFixed(2)}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon-remove-item" width="10px" height="10px"viewBox="0 0 8.75 8.75">
                                        <defs>
                                            <style>
                                            .cls-1 {
                                                fill: #caafa7;
                                            }
                                            </style>
                                        </defs>
                                        <path class="cls-1" d="M7.75,8.75l-3.38-3.38-3.38,3.38-1-1,3.38-3.38L0,1,1,0l3.38,3.38L7.75,0l1,1-3.38,3.38,3.38,3.38-1,1Z"/>
                                    </svg>`;

                cartItemsContainer.appendChild(cartItem);
                cartItem.addEventListener('click', function(event) {//Add event listener for removeIconItem
                    if(event.target.classList.contains('icon-remove-item')) {
                        let productToBeRemoved = product;
                        removeItemFromCart(productToBeRemoved);
                    }
                });
                
                orderSummary.innerHTML = ''; //Remove everything from order Summary;
                let totalPrice = cart.reduce((sum, product) => sum + product.total() , 0);
                orderSummary.innerHTML = `<p id="order-total">Order Total:  $${totalPrice.toFixed(2)}</p>`; //Id is added in case we need it for styling
                let carbonNeutral = document.createElement('p');
                carbonNeutral.className = 'carbon-neutral'; //Class Name is added if needed for styling
                carbonNeutral.innerHTML = `<img src="../assets/images/icon-carbon-neutral.svg" alt="Carbon-neutral icon"/> This is a carbon-neutral delivery`;
                orderSummary.appendChild(carbonNeutral);
    }    
                
        });
        if (!cartSection.querySelector('.confirm-order')) {
            const confirmOrderButton = document.createElement('div');
            confirmOrderButton.className = 'confirm-order';
            confirmOrderButton.innerHTML = '<p>Confirm Order</p>'
            cartSection.appendChild(confirmOrderButton);
            //Add event listener for confirmOrderButton
            confirmOrderButton.addEventListener('click', orderConfirmationModelPopUp);
        }
        
        
    } else {//Bring the empty cart state back
        orderSummary.innerHTML = ''; //Since cart is empty, there should be no order summary
        emptyCartContainer.innerHTML = `<img src="./assets/images/illustration-empty-cart.svg" alt="Empty cart" />
                                        <p>Your added items will appear here</p>`;
        
    }
           

    //Need to add order-confirm button below
}

function removeItemFromCart(product) {
    let productIndex = cart.indexOf(product);
    cart.splice(productIndex, 1);
    updateCartUI();
}

//This function change the button state to increment and decrement svgs
function changeButtonState(button) {
    console.trace("changeButtonSate called");
    if (!button) {
        console.error("Button reference is null or invalid.");
        return; // Exit if button is invalid
    }
    console.log('Button inside changeButtonState', button);
    const addIcon = button.querySelector('.add-icon');
    const addText = button.querySelector('.add-text');
    const quantityControl = button.querySelector('.quantity-control');
    // Only proceed if the button is not already active
    if (!button.classList.contains('active')) {
        button.classList.add('active');
        // Change the button state
        addIcon.style.display = 'none';
        addText.style.display = 'none';
        quantityControl.style.display = 'flex';
        button.style.backgroundColor = 'red';
        
        // Remove the event listener after activating the button
       button.removeEventListener('click', handleChangeButtonSate);
    }
    else{
        button.classList.remove('active');
        //Revert back to the original state
        addIcon.style.display = 'inline-block';
        addText.style.display = 'inline-block';
        quantityControl.style.display = 'none';
        button.style.backgroundColor = '';


        // button.addEventListener('click', handleChangeButtonSate);


        
    }

 } 
 
//Add event listeners for the increment and decrement svgs
//Find them first using query selectors
const quantityModifiers = document.querySelectorAll('.quantity-modifier');
quantityModifiers.forEach(modifier => {
    modifier.addEventListener('click', updateQuantitySvg);
    modifier.addEventListener('click', updateCartQuantity);
});

//This function will update the quantity span inside the button
function updateQuantitySvg() {
    console.trace("updateQuantitySvg called:");
    const modifier = this;
    const quantity = modifier.closest('.quantity-control').querySelector('.quantity');
    let currentQuantity = parseInt(quantity.innerText);
    if (modifier.classList.contains('increment')) {
        quantity.innerText = ++currentQuantity;
    }
    else if (modifier.classList.contains('decrement')) {
        if (currentQuantity > 0) {
                quantity.innerText = --currentQuantity;
        } 
        }
 }

 //This function will update the quantity inside the cart
function updateCartQuantity() {
    console.trace("updateCartQuantity called:")
    const modifier = this;
    const productName = modifier.closest('.dessert').querySelector('.dessert-full-name').innerText;
    let productIndex = cart.findIndex(product => product.name === productName);

    /*Check if the product exists in the cart and then change its quantity. If it does not it needs to be added
    Suppose a product has been removed from the cart after we have changed its quantity to 0, now it needs to be added again
    if we will increment its quantity, but modifiers are not attavhed with add-Product-Cart event listener. so we
    need to find a way to do that, if the quantity is changed from 0 tp 1, after that the product will already exist in the cart, so
    it need not be added again.

    */

    if (productIndex === -1) {
        let product = productArray.find(product => product.name === productName);
        cart.push(product);
        //This product become the last product in the cart
        productIndex = cart.length - 1;
    }

    // Log the current state of the cart
    console.log("Cart before modification:", JSON.stringify(cart, null, 2)); 

    if (modifier.classList.contains('increment')) {
        // Log before modifying the quantity
        console.log(`Before incrementing, ${productName} quantity is:`, cart[productIndex].quantity);
        
        // Increment the quantity
        cart[productIndex].quantity++;
        
        // Log after modifying the quantity
        console.log(`After incrementing, ${productName} quantity is:`, cart[productIndex].quantity);
        updateCartUI();
    } else if (modifier.classList.contains('decrement')) {
        if (cart[productIndex].quantity >= 1) {
            // Log before modifying the quantity
            console.log(`Before decrementing, ${productName} quantity is:`, cart[productIndex].quantity);
            
            // Decrement the quantity
            cart[productIndex].quantity--;
            
            // Log after modifying the quantity
            console.log(`After decrementing, ${productName} quantity is:`, cart[productIndex].quantity);
            
            // Check if quantity is zero, then remove from cart
            if (cart[productIndex].quantity === 0) {
                console.log(`Removing ${productName} at index ${productIndex}`); // Show removal action
                let spliced = cart.splice(productIndex, 1);
                console.log("Spliced:", spliced);  // Log the removed item
                
                console.log('addEventListener reference:', updateCartQuantity);//The function reference has been logged to see we are removing the correct event handler.
                modifier.removeEventListener('click', updateCartQuantity); //Once the quantity is zero, remove the event listener to prevent errors caused by zero quantity, since the product is already been removed from the cart, so its quantity can not be read
                
                
                // const button = modifier.closest('.add-to-cart');
                // console.log("Button passed to changeButtonState", button);
                // changeButtonState(button);




            }
            updateCartUI(); 
          
        }
    }

    // Log the final state of the cart after the operation
    console.log("Cart after modification:", JSON.stringify(cart, null, 2));
    
}

//Add event listener for remove item icon
const removeItemIcons = document.querySelectorAll('.icon-remove-item');
removeItemIcons.forEach(icon => {
    icon.addEventListener('click', function() {
        let proudctName = icon.parentElement.querySelector('.cart-product-name').innerText;
        console.log(proudctName);
    });
});

//Add event listener for confirm order button here
function orderConfirmationModelPopUp() {
    //Create model elements
    const confirmationModelContainer = document.createElement('div');
    confirmationModelContainer.className = 'model';

    const confirmationModel = document.createElement('div');
    confirmationModel.className = 'confirmation-model';

    //Add confirmation message
    
    confirmationModel.innerHTML = `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 32.121L13.5 24.6195L15.6195 22.5L21 27.879L32.3775 16.5L34.5 18.6225L21 32.121Z" fill="#1EA575"/>
                                    <path d="M24 3C19.8466 3 15.7865 4.23163 12.333 6.53914C8.8796 8.84665 6.18798 12.1264 4.59854 15.9636C3.0091 19.8009 2.59323 24.0233 3.40352 28.0969C4.21381 32.1705 6.21386 35.9123 9.15077 38.8492C12.0877 41.7861 15.8295 43.7862 19.9031 44.5965C23.9767 45.4068 28.1991 44.9909 32.0364 43.4015C35.8736 41.812 39.1534 39.1204 41.4609 35.667C43.7684 32.2135 45 28.1534 45 24C45 18.4305 42.7875 13.089 38.8493 9.15076C34.911 5.21249 29.5696 3 24 3ZM24 42C20.4399 42 16.9598 40.9443 13.9997 38.9665C11.0397 36.9886 8.73256 34.1774 7.37018 30.8883C6.0078 27.5992 5.65134 23.98 6.34587 20.4884C7.04041 16.9967 8.75474 13.7894 11.2721 11.2721C13.7894 8.75473 16.9967 7.0404 20.4884 6.34587C23.98 5.65133 27.5992 6.00779 30.8883 7.37017C34.1774 8.73255 36.9886 11.0397 38.9665 13.9997C40.9443 16.9598 42 20.4399 42 24C42 28.7739 40.1036 33.3523 36.7279 36.7279C33.3523 40.1036 28.7739 42 24 42Z" fill="#1EA575"/>
                                    </svg>
                                    <h2>Order Confirmed</h2>
                                    <p>We hope you enjoy your food</p>`;
    
    //Append cart items summary
    cart.forEach(product => {
        const modelItemRow = document.createElement('div');
        modelItemRow.className = 'model-item-row';
        modelItemRow.innerHTML = `<span class="model-image-thumbnail"><img src="${product.image.thumbnail}"/></span>
                                    <p class="model-product-name">${product.name}</p>
                                    <span class="model-product-quantity">${product.quantity}X</span>
                                    <span class="model-prouct-price">@$${product.price}</span>
                                    <span class=""model-product-total>$${product.total().toFixed(2)}</span>`;
        confirmationModel.appendChild(modelItemRow);
    });

    //Add a button for new order
    const startNewOrderButton = document.createElement('div');
    startNewOrderButton.className = 'start-new-order';
    startNewOrderButton.innerHTML= `<p>Start New Order</p>`;
    //Add the event listener to refresh the page
    startNewOrderButton.addEventListener('click', function() {
        location.reload();
    })

    confirmationModel.appendChild(startNewOrderButton);
    
    //Append the confirmation model to its container
    confirmationModelContainer.appendChild(confirmationModel);

    //Add model to the body
    document.body.appendChild(confirmationModelContainer);
    document.body.style.overflow = 'hidden'; //Lock scroll of the body when the model is opened

    //Close model after clicking outside
    confirmationModelContainer.addEventListener('click', function() {
        document.body.removeChild(confirmationModelContainer);
        document.body.style.overflow = ''; //Unlock scroll on model close
    });

}

 //Creating a scroll for the cart.

/**/
