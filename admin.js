// admin.js
document.addEventListener('DOMContentLoaded', () => {
    const addProductForm = document.getElementById('add-product-form');
    const addProductMessage = document.getElementById('add-product-message');
    const productListContainer = document.getElementById('product-list');
    const logoutButton = document.getElementById('logout-btn');

    // Load products from localStorage
    let products = JSON.parse(localStorage.getItem('products')) || [];

    function displayProducts() {
        productListContainer.innerHTML = '';
        if (products.length === 0) {
            productListContainer.innerHTML = '<p class="no-products">No products added yet.</p>';
            return;
        }

        // Create a container for each category
        const categories = ['electronics', 'fashion', 'home and kitchen', 'beauty'];
        
        categories.forEach(category => {
            const categoryProducts = products.filter(p => p.category.toLowerCase() === category);
            if (categoryProducts.length > 0) {
                const categorySection = document.createElement('div');
                categorySection.className = 'category-section';
                categorySection.innerHTML = `<h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3>`;
                
                const productGrid = document.createElement('div');
                productGrid.className = 'admin-product-grid';
                
                categoryProducts.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.className = 'admin-product-card';
                    
                    let labelHtml = '';
                    if (product.label) {
                        labelHtml = `<span class="product-label ${product.label}">${product.label}</span>`;
                    }
                    
                    productCard.innerHTML = `
                        <img src="${product.image}" alt="${product.name}" class="admin-product-image">
                        ${labelHtml}
                        <div class="admin-product-details">
                            <h4>${product.name}</h4>
                            <p>$${product.price.toFixed(2)}</p>
                            <div class="admin-product-actions">
                                <button class="edit-btn" data-id="${product.id}">Edit</button>
                                <button class="delete-btn" data-id="${product.id}">Delete</button>
                            </div>
                        </div>
                    `;
                    productGrid.appendChild(productCard);
                });
                
                categorySection.appendChild(productGrid);
                productListContainer.appendChild(categorySection);
            }
        });

        // Add event listeners
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.dataset.id;
                deleteProduct(productId);
            });
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.dataset.id;
                editProduct(productId);
            });
        });
    }

    function addProduct(event) {
        event.preventDefault();
        
        const name = document.getElementById('product-name').value.trim();
        const price = parseFloat(document.getElementById('product-price').value);
        const category = document.getElementById('product-category').value;
        const label = document.getElementById('product-label').value;
        const description = document.getElementById('product-description').value.trim();
        const imageFile = document.getElementById('product-image').files[0];

        if (!name || isNaN(price) || !imageFile) {
            showMessage('Please fill all required fields', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const newProduct = {
                id: Date.now().toString(),
                name,
                price,
                category,
                label: label || '',
                description,
                image: e.target.result,
                rating: 5 // Default rating
            };

            products.push(newProduct);
            localStorage.setItem('products', JSON.stringify(products));
            
            displayProducts();
            addProductForm.reset();
            showMessage('Product added successfully!', 'success');
        };
        reader.readAsDataURL(imageFile);
    }

    function deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            products = products.filter(p => p.id !== productId);
            localStorage.setItem('products', JSON.stringify(products));
            displayProducts();
            showMessage('Product deleted successfully', 'success');
        }
    }

    function editProduct(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        // Populate form
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-label').value = product.label;
        document.getElementById('product-description').value = product.description;

        // Remove the product being edited
        products = products.filter(p => p.id !== productId);
        localStorage.setItem('products', JSON.stringify(products));

        showMessage('Editing product. Make changes and click "Add Product"', 'info');
    }

    function showMessage(text, type) {
        addProductMessage.textContent = text;
        addProductMessage.className = `message ${type}`;
        setTimeout(() => {
            addProductMessage.textContent = '';
            addProductMessage.className = 'message';
        }, 3000);
    }

    // Event listeners
    addProductForm.addEventListener('submit', addProduct);
    logoutButton?.addEventListener('click', () => {
        localStorage.removeItem('adminLoggedIn');
        window.location.href = 'login.html';
    });

    // Initial display
    displayProducts();
});