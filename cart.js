document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.querySelector('.cart-items');
    const subtotalElement = document.querySelector('.subtotal');
    const totalPriceElement = document.querySelector('.total-price');
    const checkoutButton = document.querySelector('.checkout-button');

    function displayCartItems() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartItemsContainer.innerHTML = ''; // Clear existing items

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is currently empty.</p>';
            checkoutButton.disabled = true;
        } else {
            checkoutButton.disabled = false;
            cart.forEach(item => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p>Price: $${item.price.toFixed(2)}</p>
                    </div>
                    <div class="cart-actions">
                        <div class="quantity-control">
                            <button class="decrease-quantity" data-id="${item.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="increase-quantity" data-id="${item.id}">+</button>
                        </div>
                        <button class="remove-button" data-id="${item.id}">Remove</button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
            });
        }

        updateCartSummary();
        updateCartCount(); // Update the cart count in the header on the cart page too
    }

    function updateCartSummary() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        totalPriceElement.textContent = `$${subtotal.toFixed(2)}`; // Assuming no shipping costs for now
    }

    function updateQuantity(productId, change) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity < 1) {
                item.quantity = 1; // Ensure quantity doesn't go below 1
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCartItems();
        }
    }

    function removeItem(productId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
    }

    function updateCartCount() {
        const cartCountElement = document.querySelector('header .nav-links a[href="cart.html"] .cart-count');
        if (cartCountElement) {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountElement.textContent = `(${totalQuantity})`;
        }
    }

    // Event listeners for quantity changes and removal
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('increase-quantity')) {
            const productId = e.target.dataset.id;
            updateQuantity(productId, 1);
        } else if (e.target.classList.contains('decrease-quantity')) {
            const productId = e.target.dataset.id;
            updateQuantity(productId, -1);
        } else if (e.target.classList.contains('remove-button')) {
            const productId = e.target.dataset.id;
            removeItem(productId);
        }
    });

    // Initial display of cart items
    displayCartItems();
});