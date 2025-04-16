// deals.js
document.addEventListener('DOMContentLoaded', function() {
    // Countdown Timer (3 days from now)
    const countdownDate = new Date();
    countdownDate.setDate(countdownDate.getDate() + 3);
    
    function updateCountdown() {
        const now = new Date();
        const diff = countdownDate - now;
        
        if (diff <= 0) {
            document.querySelector('.countdown').innerHTML = '<div class="countdown-ended">Deal has ended!</div>';
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    setInterval(updateCountdown, 1000);
    updateCountdown();
    
    // Load deals
    const dealsContainer = document.getElementById('deals-container');
    const dealTabs = document.querySelectorAll('.deal-tab');
    let allDeals = [];
    
    function loadDeals() {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        // Create deals by adding discounts to some products
        allDeals = products.map(product => {
            // Only apply discount to products with labels
            if (product.label) {
                const discount = product.label === 'sale' ? 0.3 : 
                               product.label === 'deal' ? 0.2 : 
                               product.label === 'popular' ? 0.15 : 0.1;
                return {
                    ...product,
                    discount,
                    salePrice: product.price * (1 - discount)
                };
            }
            return null;
        }).filter(Boolean);
        
        renderDeals('all');
    }
    
    function renderDeals(category) {
        dealsContainer.innerHTML = '';
        
        const filteredDeals = category === 'all' 
            ? allDeals 
            : allDeals.filter(deal => deal.category.toLowerCase().includes(category));
        
        if (filteredDeals.length === 0) {
            dealsContainer.innerHTML = `
                <div class="no-products">
                    <p>No deals available in this category yet.</p>
                    <p>Check back later or browse our <a href="com.html">other products</a>.</p>
                </div>
            `;
            return;
        }
        
        filteredDeals.forEach(deal => {
            const discountPercent = Math.round(deal.discount * 100);
            const stars = '★'.repeat(Math.floor(deal.rating || 5)) + '☆'.repeat(5 - Math.floor(deal.rating || 5));
            
            const dealCard = document.createElement('div');
            dealCard.className = 'product-card';
            dealCard.innerHTML = `
                <div class="product-image-container">
                    <img src="${deal.image}" alt="${deal.name}" class="product-image">
                    <span class="discount-badge">${discountPercent}% OFF</span>
                    ${deal.label ? `<span class="product-label ${deal.label}">${deal.label}</span>` : ''}
                </div>
                <div class="product-info">
                    <h3>${deal.name}</h3>
                    <div>
                        <span class="original-price">$${deal.price.toFixed(2)}</span>
                        <span class="product-price">$${deal.salePrice.toFixed(2)}</span>
                    </div>
                    <div class="product-rating" title="${Math.floor(deal.rating || 5)} stars">
                        ${stars}
                    </div>
                    <button class="product-button add-to-cart"
                            data-id="${deal.id}"
                            data-name="${deal.name}"
                            data-price="${deal.salePrice}"
                            data-image="${deal.image}">
                        Add to Cart
                    </button>
                </div>
            `;
            dealsContainer.appendChild(dealCard);
        });
        
        // Add event listeners to new buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const product = {
                    id: this.dataset.id,
                    name: this.dataset.name,
                    price: parseFloat(this.dataset.price),
                    image: this.dataset.image,
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
                this.textContent = '✓ Added';
                this.style.backgroundColor = 'var(--success-color)';
                setTimeout(() => {
                    this.textContent = 'Add to Cart';
                    this.style.backgroundColor = 'var(--primary-color)';
                }, 2000);
            });
        });
    }
    
    // Tab switching
    dealTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            dealTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            renderDeals(this.dataset.category);
        });
    });
    
    // Cart count
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelector('.cart-count').textContent = `(${totalQuantity})`;
    }
    
    // Initialize
    loadDeals();
    updateCartCount();
});