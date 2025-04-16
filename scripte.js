// script.js
document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.querySelector('.product-grid');
    const cartCountSpan = document.querySelector('.cart-count');
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

    function updateCartCount() {
        if (cartCountSpan) {
            cartCountSpan.textContent = `(${cart.length})`;
        }
    }

    function displayProducts(category = null) {
        const allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];
        let productsToDisplay = allProducts;

        if (category) {
            productsToDisplay = allProducts.filter(product => product.category === category);
        }

        if (productGrid) {
            productGrid.innerHTML = ''; // Clear existing products
            if (productsToDisplay.length === 0) {
                productGrid.innerHTML = '<p>No products available in this category.</p>';
                return;
            }

            productsToDisplay.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card');
                productCard.innerHTML = `
                    <img src="${product.image || 'placeholder-image.jpg'}" alt="${product.name}" class="product-image">
                    ${product.label ? `<span class="product-label ${product.label}">${product.label}</span>` : ''}
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p class="product-price">$${product.price.toFixed(2)}</p>
                        <div class="product-rating">
                            ${generateStars(4)} </div>
                        <button class="product-button add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image || 'placeholder-image.jpg'}">Add to Cart</button>
                    </div>
                `;
                productGrid.appendChild(productCard);
            });

            // Add event listeners to the newly added "Add to Cart" buttons
            const addToCartButtons = productGrid.querySelectorAll('.add-to-cart');
            addToCartButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const productId = this.dataset.id;
                    const productName = this.dataset.name;
                    const productPrice = parseFloat(this.dataset.price);
                    const productImage = this.dataset.image;
                    addToCart(productId, productName, productPrice, productImage);
                });
            });
        }
    }

    function generateStars(rating) {
        let stars = '';
        for (let i = 0; i < 5; i++) {
            stars += `<span class="star">${i < rating ? '&#9733;' : '&#9734;'}</span>`;
        }
        return stars;
    }

    function addToCart(id, name, price, image) {
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id, name, price, image, quantity: 1 });
        }
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        updateCartCount();
        alert(`${name} added to cart!`);
    }

    // --- Determine which page is loading and display products accordingly ---
    const path = window.location.pathname;

    if (path.includes('electronics.html')) {
        displayProducts('electronics'); // Display only electronics products
    } else if (path.includes('com.html') || path === '/') {
        displayProducts(); // Display all products on the homepage (you might want to filter or show featured)
    }

    // Initial cart count update
    updateCartCount();
});