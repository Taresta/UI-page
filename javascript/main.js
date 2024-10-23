class Product {
    constructor(image, name, category, quantity, price) {
        this._image = image;
        this._name = name;
        this._category = category;
        this._quantity = quantity;
        this._price = price;
        
        // Initialize handler properties
        this.handleAddToCart = null;
        this.handleIncrement = null;
        this.handleDecrement = null;
    }
    get image() { return this._image; }
    get name() { return this._name; }
    get category() { return this._category; }
    get quantity() { return this._quantity; }
    get price() { return this._price; }
    
    set quantity(quantity) { this._quantity = quantity; }
    set price(price) { this._price = price; }
    
    total() { return this._quantity * this._price; }
}

const productArray = [];
let cart = []; // Changed to 'let' to allow reassignment

function renderProduct(product, index) {
    const currentWidth = window.innerWidth;

    const productHTML = `<div class="dessert ${product.category.toLowerCase()}" data-index="${index}">
                        <div class="image-button">
                            <picture>
                                <source srcset="${product.image.mobile}" media="(max-width: 375px)">
                                <source srcset="${product.image.tablet}" media="(min-width: 376px)and (max-width:768px)">
                                <source srcset="${product.image.desktop}" media="(min-width: 769px)">
                                <img src="${product.image.desktop}" alt="Product Image" class="product-image">
                            </picture>

                            <div class="add-to-cart">
                                <img src="./assets/images/icon-add-to-cart.svg" alt="Add to cart icon" class="add-icon">
                                <span class="add-text">Add to Cart</span>
                                <div class="quantity-control">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="quantity-modifier decrement" width="20px" height="20px" viewBox="0 0 10 1.25">
                                        <path class="cls-1" d="M0,0h10v1.25H0V0Z"/>
                                    </svg>
                                    <span class="quantity">0</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="quantity-modifier increment" width="20px" height="21px" viewBox="0 0 172.19 172.19">
                                        <defs>
                                            <style>
                                                .cls-1 { fill: #fff; }
                                            </style>
                                        </defs>
                                        <path class="cls-1" d="M172.19,75.33h-75.33V0h-21.52v75.33H0v21.52h75.33v75.33h21.52v-75.33h75.33v-21.52Z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <span class="dessert-category">${product.category.toLowerCase()}</span>
                        <span class="dessert-full-name">${product.name}</span>
                        <span class="dessert-price">$${product.price.toFixed(2)}</span>
                    </div>`;
    document.querySelector('.products-container').insertAdjacentHTML('beforeend', productHTML);

   
}

fetch('https://raw.githubusercontent.com/Taresta/UI-page/main/data.json')
    .then(response => response.json())
    .then(data => {
        data.forEach((item, index) => {
            let product = new Product(item.image, item.name, item.category, 0, item.price);
            productArray.push(product);
            renderProduct(product, index);
            attachAddToCartListener(product, index);
        });
        console.log('Product Array:', JSON.stringify(productArray, null, 2));
    })
    .catch(error => console.error('Error loading JSON:', error));


function attachAddToCartListener(product, index) {
    console.trace("attachAddToCartListener function called");
    const addToCartButton = document.querySelector(`.dessert[data-index="${index}"] .add-to-cart`);
    
    // Define and assign the handler
    product.handleAddToCart = () => addProductToCartListener(product, index);
    
    if (!addToCartButton.hasAttribute('data-listener')) {
        addToCartButton.addEventListener('click', product.handleAddToCart);
        addToCartButton.setAttribute('data-listener', 'true');
    }
}

function detachProductToCartListener(product, index) {
    console.log("detachProductToCartListener function called from: ");
    console.trace();

    const addToCartButton = document.querySelector(`.dessert[data-index="${index}"] .add-to-cart`);
    
    if (addToCartButton.hasAttribute('data-listener') && product.handleAddToCart) {
        addToCartButton.removeEventListener('click', product.handleAddToCart);
        addToCartButton.removeAttribute('data-listener');
        product.handleAddToCart = null; // Clear the handler reference
    } else {
        console.log("No listener found on add to cart button");
    }
}

function addProductToCartListener(product, index) {
    if(product.quantity === 0) {
        product.quantity = 1;
        console.log(`Adding ${product.name} to cart.`);
        console.log("Product before adding:", JSON.stringify(product, null, 2));
        
        updateCart(product, index); // Add the product to the cart
        updateProductUI(product, index); // Reflect changes in the UI
        attachQuantityListeners(product, index); // Attach increment/decrement listeners
    }
    
    console.log("Product after adding:", JSON.stringify(product, null, 2));
    console.log("Cart after adding:", JSON.stringify(cart, null, 2));
}

function attachQuantityListeners(product, index) {
    console.log("attachQuantityListeners called from:");
    console.trace();
    
    const incrementButton = document.querySelector(`.dessert[data-index="${index}"] .increment`);
    const decrementButton = document.querySelector(`.dessert[data-index="${index}"] .decrement`);
    
    // Define and assign handlers
    product.handleIncrement = () => incrementFunction(product, index);
    product.handleDecrement = () => decrementFunction(product, index);
    
    // Attach increment listener if not already attached
    if (!incrementButton.hasAttribute('data-listener')) {
        incrementButton.addEventListener('click', product.handleIncrement);
        incrementButton.setAttribute('data-listener', 'true');
    }
    
    // Attach decrement listener if not already attached
    if (!decrementButton.hasAttribute('data-listener')) {
        decrementButton.addEventListener('click', product.handleDecrement);
        decrementButton.setAttribute('data-listener', 'true');
    }    
}

function detachQuantityListeners(product, index) {
    const incrementButton = document.querySelector(`.dessert[data-index="${index}"] .increment`);
    const decrementButton = document.querySelector(`.dessert[data-index="${index}"] .decrement`);
    
    if (incrementButton.hasAttribute('data-listener') && product.handleIncrement) {
        incrementButton.removeEventListener('click', product.handleIncrement);
        incrementButton.removeAttribute('data-listener');
        product.handleIncrement = null; // Clear the handler reference
    } else {
        console.log("No listener found on increment button");
    }
    
    if (decrementButton.hasAttribute('data-listener') && product.handleDecrement) {
        decrementButton.removeEventListener('click', product.handleDecrement);
        decrementButton.removeAttribute('data-listener');
        product.handleDecrement = null; // Clear the handler reference
    } else {
        console.log("No listener found on decrement button");
    }
}

function removeProductFromCart(product, index) {
    console.trace("removeProductFromCart function is called");
    
    // Detach quantity listeners before removing the product
    detachQuantityListeners(product, index);
    
    // Detach add-to-cart listener
    detachProductToCartListener(product, index);
    
    product.quantity = 0; // set the quantity to zero
    console.log(product, `Product quantity is ${product.quantity} ${product._quantity}`);
    updateCart(product, index); // remove the product from the cart
    updateProductUI(product, index); // update the UI
    
}

function updateCart(product, index) {
    console.trace("updateCart function called.");
    const cartIndex = cart.findIndex(item => item.name === product.name);
    
    if (product.quantity > 0) { // Call is from either attachAddToCartListener or attachQuantityListeners function
        if (cartIndex === -1) {
            cart.push(product); // Add the product if it does not exist by pressing add-to-cart button
            console.log(`Added ${product.name} to cart.`);
        }
        else {
            cart[cartIndex].quantity = product.quantity; // If the product exists, update its quantity
            console.log(`Updated ${product.name} quantity in cart to ${product.quantity}.`);
        }
    } else if (cartIndex !== -1) { // The product quantity is 0 but it exists. Call from removeProductFromCart function
        cart.splice(cartIndex, 1); // Remove product from the cart if quantity is zero
        console.log("Cart is spliced");
    }
    
    console.log("Updated Cart:", JSON.stringify(cart, null, 2));
    updateCartUI(product, index);
}

function updateProductUI(product, index) {
    console.log("updateProductUI function called");
    console.log("Index is: ", index);
    const addToCartButton = document.querySelector(`.dessert[data-index="${index}"] .add-to-cart`);
    const quantityDisplay = addToCartButton.querySelector('.quantity');
    
    // Update the quantity display
    quantityDisplay.textContent = product.quantity;

    // Toggle the active class based on quantity
    if (product.quantity > 0) {
        detachProductToCartListener(product, index);
        addToCartButton.classList.add('active'); // Show increment and decrement buttons
        document.querySelector(`.dessert[data-index = "${index}"] .product-image`).classList.add('show-border');
    } else {
        addToCartButton.classList.remove('active');
        document.querySelector(`.dessert[data-index = "${index}"] .product-image`).classList.remove('show-border');
        // Revert to 'Add to Cart' state
        setTimeout(() => {
           
            attachAddToCartListener(product, index);
        }, 100);
        addToCartButton.classList.remove('active');
    }
}

function updateCartUI() {
    console.log("updateCartUI function called");
    const cartQuantityDisplay = document.getElementById('cart-quantity');
    const emptyCartContainer = document.getElementById('empty-cart-container');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const orderSummary = document.getElementById('order-summary');

    // Update the totalQuantity and totalPrice in the cart header
    let totalQuantity = 0;
    let totalPrice  = 0;
    // Clear the cart items container before populating it again
    cartItemsContainer.innerHTML = ``;
    console.log("Cart is ", JSON.stringify(cart, null, 2));
    cart.forEach((product) => {
        totalQuantity += product.quantity;
        totalPrice += product.total();

        // Render each product in the cart
        const cartItemHTML = `
            <div class="cart-item">
                <div class="cart-item-details">
                    <p class="cart-item-name">${product.name}</p>
                    <span class="cart-item-quantity">${product.quantity}x</span>
                    <span class="cart-item-price">@$${product.price.toFixed(2)}</span>
                    <span class="cart-item-total">$${product.total().toFixed(2)}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon-remove-item" width="10px" height="10px" viewBox="0 0 8.75 8.75">
                        <defs>
                            <style>
                                .cls-1 { fill: #caafa7; }
                            </style>
                        </defs>                
                        <path class="cls-1" d="M7.75,8.75l-3.38-3.38-3.38,3.38-1-1,3.38-3.38L0,1,1,0l3.38,3.38L7.75,0l1,1-3.38,3.38,3.38,3.38-1,1Z"/>
                    </svg>
                </div>
            </div>`;
        
        cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);

        // Attach the event listener to the SVG icon for this cart item
        const removeIcon = cartItemsContainer.querySelector(`.cart-item:last-child .icon-remove-item`);
        
        const index = productArray.findIndex(item => item.name === product.name); // The index is found from thr product array because that is what every function is using. 
        console.log("Index being passed is: ", index);
        removeIcon.addEventListener('click', () => removeProductFromCart(product, index));
    });
    // Show or hide the empty cart message based on the cart contents
    if (totalQuantity > 0) {
        emptyCartContainer.style.display = 'none';
        cartItemsContainer.style.display = 'block';

        // Update the Order Summary
        orderSummary.innerHTML = `
            <p class="total-price">Order Total:<span class="order-total">$${totalPrice.toFixed(2)}</span></p>
            <div id="carbon-neutral-container">
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none" viewBox="0 0 21 20">
                    <path fill="#1EA575" d="M8 18.75H6.125V17.5H8V9.729L5.803 8.41l.644-1.072 2.196 1.318a1.256 1.256 0 0 1 .607 1.072V17.5A1.25 1.25 0 0 1 8 18.75Z"/>
                    <path fill="#1EA575" d="M14.25 18.75h-1.875a1.25 1.25 0 0 1-1.25-1.25v-6.875h3.75a2.498 2.498 0 0 0 2.488-2.747 2.594 2.594 0 0 0-2.622-2.253h-.99l-.11-.487C13.283 3.56 11.769 2.5 9.875 2.5a3.762 3.762 0 0 0-3.4 2.179l-.194.417-.54-.072A1.876 1.876 0 0 0 5.5 5a2.5 2.5 0 1 0 0 5v1.25a3.75 3.75 0 0 1 0-7.5h.05a5.019 5.019 0 0 1 4.325-2.5c2.3 0 4.182 1.236 4.845 3.125h.02a3.852 3.852 0 0 1 3.868 3.384 3.75 3.75 0 0 1-3.733 4.116h-2.5V17.5h1.875v1.25Z"/>
                </svg>
                <span>This is a <b>carbon-neutral</b> delivery</span>
            </div>
            <button class="checkout-btn">Checkout</button>
        `;
    } else {
        emptyCartContainer.style.display = 'block';
        cartItemsContainer.style.display = 'none';
        orderSummary.innerHTML = ''; // Clear the order summary when cart is empty
    }
    
    // Update the total quantity in the cart header
    cartQuantityDisplay.textContent = totalQuantity;

}

function incrementFunction(product, index) {
    product.quantity++;
    console.log(`Incremented quantity for ${product.name} to ${product.quantity}`);
    updateCart(product, index);
    updateProductUI(product, index);
}

function decrementFunction(product, index) {
    if (product.quantity > 1) {
        product.quantity--;
        console.log(`Decremented quantity for ${product.name} to ${product.quantity}`);
        updateCart(product, index);
        updateProductUI(product, index);
    } else {
        console.log(`Removing ${product.name} from cart`);
        removeProductFromCart(product, index); // Remove product from cart if quantity has reached 1 and is decremented
    }
}

function detachProductToCartListener(product, index) {
    console.log("detachProductToCartListener function called from: ");
    console.trace();

    const addToCartButton = document.querySelector(`.dessert[data-index="${index}"] .add-to-cart`);
    
    if (addToCartButton.hasAttribute('data-listener') && product.handleAddToCart) {
        addToCartButton.removeEventListener('click', product.handleAddToCart);
        addToCartButton.removeAttribute('data-listener');
        product.handleAddToCart = null; // Clear the handler reference
    } else {
        console.log("No listener found on add to cart button");
    }
}

function detachQuantityListeners(product, index) {
    const incrementButton = document.querySelector(`.dessert[data-index="${index}"] .increment`);
    const decrementButton = document.querySelector(`.dessert[data-index="${index}"] .decrement`);
    
    if (incrementButton.hasAttribute('data-listener') && product.handleIncrement) {
        incrementButton.removeEventListener('click', product.handleIncrement);
        incrementButton.removeAttribute('data-listener');
        product.handleIncrement = null; // Clear the handler reference
    } else {
        console.log("No listener found on increment button");
    }
    
    if (decrementButton.hasAttribute('data-listener') && product.handleDecrement) {
        decrementButton.removeEventListener('click', product.handleDecrement);
        decrementButton.removeAttribute('data-listener');
        product.handleDecrement = null; // Clear the handler reference
    } else {
        console.log("No listener found on decrement button");
    }
}

// Attach the event listener to the order summary
const orderSummary = document.getElementById('order-summary');
orderSummary.addEventListener('click', (event) => {
    // Check if the clicked element has the class 'checkout-btn'
    if (event.target.matches('.checkout-btn')) {
        // Call the function to display the modal
        displayCheckoutModal();
    }
});

function displayCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.classList.add('show') // Add "show" class to trigger fade-in;
        displayOrderDetails();
        document.body.classList.add('modal-open');
    } else {
        console.error('Checkout modal element not found');
    }
}

function displayOrderDetails() {
    const orderDetails = document.getElementById('order-details');
    let total = 0;

    if (orderDetails) {
        orderDetails.innerHTML = '';
        cart.forEach(product => {
            total += product.total();
            const orderDetailsHTML = `
                <div class="order-item">
                    <img src="${product.image.thumbnail || 'path/to/fallback/image.jpg'}" alt="${product.name}" class="modal-thumbail-image">
                    <p class="modal-product-name">${product.name}</p>
                    <span class="modal-product-quantity">${product.quantity}x</span>
                    <span class="modal-product-price">@ $${product.price.toFixed(2)}</span>
                    <span class="modal-product-total">$${product.total().toFixed(2)}</span>
                </div>`;
            orderDetails.insertAdjacentHTML('beforeend', orderDetailsHTML);
        });
        orderDetails.insertAdjacentHTML('beforeend', `<p class="total-price">Order Total:<span class="order-total">$${total.toFixed(2)}</span></p>`)
    } else {
        console.error('Order details element not found');
    }

}

const startNewButton = document.getElementById('start-new-order');
startNewButton.addEventListener('click', () => {
    resetOrder();
});

function resetOrder() {
    cart = [];
    // Update the UI to reflect an empty cart
    updateCartUI();
    // Hide the modal
    productArray.forEach((product, index) => {
        product.quantity = 0;
        updateProductUI(product, index);
    })
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.classList.remove('modal-open');
    }
    console.log('Order has been reset');
}
