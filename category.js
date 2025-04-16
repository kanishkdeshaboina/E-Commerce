// category.js
document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('category-products');
    const cartCountElement = document.querySelector('.cart-count');
    
    // Get current category from URL
    const category = window.location.pathname.split('/').pop().split('.')[0];
    const categoryName = {
        'electronics': 'Electronics',
        'fashion': 'Fashion',
        'beauty': 'Beauty',
        'homek': 'Home & Kitchen'
    }[category] || 'Products';
    
    // Update page title and heading
    document.title = `${categoryName} - MyShopify`;
    document.querySelector('.product-header h2').textContent = `${categoryName} Products`;
    
    // Load products
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const categoryProducts = products.filter(product => {
        const productCategory = product.category.toLowerCase();
        return (category === 'electronics' && productCategory === 'electronics') ||
               (category === 'fashion' && productCategory === 'fashion') ||
               (category === 'beauty' && productCategory === 'beauty') ||
               (category === 'homek' && (productCategory === 'home and kitchen' || productCategory === 'home & kitchen'));
    });
    
    // Display products
    if (categoryProducts.length === 0) {
        productGrid.innerHTML = `
            <div class="no-products">
                <p>No ${categoryName.toLowerCase()} products available yet.</p>
                <a href="com.html" class="back-button">Browse other categories</a>
            </div>
        `;
    } else {
        productGrid.innerHTML = '';
        categoryProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            let labelHtml = '';
            if (product.label) {
                labelHtml = `<span class="product-label ${product.label}">${product.label}</span>`;
            }
            
            const stars = Math.min(5, Math.max(1, Math.floor(product.rating || 5)));
            const starsHtml = '★'.repeat(stars) + '☆'.repeat(5 - stars);
            
            productCard.innerHTML = `
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    ${labelHtml}
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <div class="product-rating" title="${stars} out of 5 stars">
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
    
    // Cart functionality
    productGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const button = e.target;
            const product = {
                id: button.dataset.id,
                name: button.dataset.name,
                price: parseFloat(button.dataset.price),
                image: button.dataset.image,
                quantity: 1
            };
            
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingItem = cart.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push(product);
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            
            // Visual feedback
            button.textContent = '✓ Added';
            button.style.backgroundColor = '#4CAF50';
            setTimeout(() => {
                button.textContent = 'Add to Cart';
                button.style.backgroundColor = '#4a90e2';
            }, 2000);
        }
    });
    
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountElement) {
            cartCountElement.textContent = `(${totalQuantity})`;
        }
    }
    
    updateCartCount();
});