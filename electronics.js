// electronics.js
document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('electronics-products');
    const cartCountElement = document.querySelector('.cart-count');
    
    // Load products from localStorage
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Filter only electronics products
    const electronicsProducts = products.filter(product => 
        product.category.toLowerCase() === 'electronics');
    
    // Display products
    if (electronicsProducts.length === 0) {
        productGrid.innerHTML = '<p class="no-products">No electronics products available yet. Check back later!</p>';
    } else {
        productGrid.innerHTML = ''; // Clear any existing content
        
        electronicsProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            // Create label if exists
            let labelHtml = '';
            if (product.label) {
                labelHtml = `<span class="product-label ${product.label}">${product.label}</span>`;
            }
            
            // Create star rating
            const fullStars = Math.floor(product.rating || 5); // Default to 5 if no rating
            const emptyStars = 5 - fullStars;
            const starsHtml = `${'<span class="star">&#9733;</span>'.repeat(fullStars)}${'<span class="star">&#9734;</span>'.repeat(emptyStars)}`;
            
            productCard.innerHTML = `
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    ${labelHtml}
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <div class="product-rating">
                        ${starsHtml}
                    </div>
                    <button class="product-button add-to-cart" 
                            data-id="${product.id}" 
                            data-name="${product.name}" 
                            data-price="${product.price}" 
                            data-image="${product.image}">
                        Add to Cart
                    </button>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
    }
    
    // Add to cart functionality
    productGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const button = e.target;
            const productId = button.dataset.id;
            const productName = button.dataset.name;
            const productPrice = parseFloat(button.dataset.price);
            const productImage = button.dataset.image;
            
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            
            // Visual feedback
            button.textContent = 'Added!';
            button.style.backgroundColor = '#4CAF50';
            setTimeout(() => {
                button.textContent = 'Add to Cart';
                button.style.backgroundColor = '#4a90e2';
            }, 1500);
        }
    });
    
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountElement) {
            cartCountElement.textContent = `(${totalQuantity})`;
        }
    }
    
    // Initial cart count update
    updateCartCount();
});