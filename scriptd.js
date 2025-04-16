document.addEventListener('DOMContentLoaded', () => {
    const featuredProductsGrid = document.querySelector('.featured-products .product-grid');

    function displayFeaturedProducts() {
        const adminProductsJSON = localStorage.getItem('adminProducts');
        const products = adminProductsJSON ? JSON.parse(adminProductsJSON) : [];

        // Clear any existing product cards
        featuredProductsGrid.innerHTML = '';

        if (products.length === 0) {
            featuredProductsGrid.innerHTML = '<p>No featured products yet.</p>';
            return;
        }

        // For simplicity, let's display all admin-added products as "featured"
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            const productImage = product.image ? `<img src="${product.image}" alt="${product.name}" class="product-image">` : '<div class="no-image">No Image</div>'; // Handle cases with no image

            const productLabel = product.label ? `<span class="product-label ${product.label}">${product.label.charAt(0).toUpperCase() + product.label.slice(1)}</span>` : '';

            productCard.innerHTML = `
                ${productImage}
                ${productLabel}
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <div class="product-rating">
                        <span class="star">&#9733;</span><span class="star">&#9733;</span><span class="star">&#9733;</span><span class="star">&#9733;</span><span class="star">&#9734;</span>
                    </div>
                    <button class="product-button add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price.toFixed(2)}" data-image="${product.image || ''}">Add to Cart</button>
                </div>
            `;
            featuredProductsGrid.appendChild(productCard);
        });

        // Add event listeners for the "Add to Cart" buttons (you might already have this)
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.dataset.id;
                const productName = event.target.dataset.name;
                const productPrice = parseFloat(event.target.dataset.price);
                const productImage = event.target.dataset.image;
                // Implement your add to cart logic here
                console.log(`Added to cart: ${productName} (ID: ${productId}), Price: $${productPrice}`);
                // You'll likely want to update a cart array in localStorage or elsewhere
                updateCartCount(); // If you have a function to update the cart count in the UI
            });
        });
    }

    function updateCartCount() {
        // Implement logic to update the cart count in the header
        const cartCountSpan = document.querySelector('.cart-count');
        if (cartCountSpan) {
            // Example: Get cart items from localStorage and update the count
            const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
            cartCountSpan.textContent = `(${cartItems.length})`;
        }
    }

    // Call the function to display featured products when the page loads
    displayFeaturedProducts();
    updateCartCount(); // Ensure cart count is also updated on load
});