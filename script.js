document.addEventListener('DOMContentLoaded', () => {
    // 1. Smooth Scrolling for Internal Navigation Links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    // Use smooth scroll on desktop, instant scroll on mobile for better performance
                    if (window.innerWidth > 768) {
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    } else {
                        window.scrollTo(0, targetPosition);
                    }
                }
            }
        });
    });

    // 2. Dynamic Product Filtering
    const productGrid = document.querySelector('.product-grid');
    if (productGrid) {
        const products = Array.from(productGrid.querySelectorAll('.product-card'));

        function filterProducts(category) {
            products.forEach(product => {
                const productCategory = product.querySelector('.product-info h3').textContent.toLowerCase();
                if (category === 'all' || productCategory.includes(category)) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        }

        const categoryButtons = document.querySelectorAll('[data-category]');
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;
                filterProducts(category);
                
                // Scroll to products section on mobile after filtering
                if (window.innerWidth <= 768) {
                    const productsSection = document.getElementById('products');
                    if (productsSection) {
                        window.scrollTo({
                            top: productsSection.offsetTop - document.querySelector('header').offsetHeight,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // 3. Image Lazy Loading for Performance with mobile optimization
    const lazyLoadImages = () => {
        const images = document.querySelectorAll('img[loading="lazy"]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: window.innerWidth > 768 ? '0px 0px 200px 0px' : '0px 0px 50px 0px'
        });

        images.forEach(img => {
            if (img.dataset.src) {
                observer.observe(img);
            }
        });
    };
    lazyLoadImages();

    // 4. Mobile-optimized Form Validation
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const emailValue = emailInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(emailValue)) {
                e.preventDefault();
                // Mobile-friendly alert alternative
                if (window.innerWidth <= 768) {
                    const errorElement = document.createElement('div');
                    errorElement.textContent = 'Please enter a valid email address.';
                    errorElement.style.color = 'red';
                    errorElement.style.marginTop = '10px';
                    if (!newsletterForm.querySelector('.error-message')) {
                        errorElement.classList.add('error-message');
                        newsletterForm.appendChild(errorElement);
                        setTimeout(() => {
                            errorElement.remove();
                        }, 3000);
                    }
                } else {
                    alert('Please enter a valid email address.');
                }
                emailInput.focus();
            }
        });
    }

    // 5. Touch-friendly Product Interactions
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        // Add visual feedback on touch
        card.addEventListener('touchstart', () => {
            card.style.transform = 'scale(0.98)';
        }, { passive: true });
        
        card.addEventListener('touchend', () => {
            card.style.transform = '';
        }, { passive: true });
        
        // Make entire card clickable on mobile
        if (window.innerWidth <= 768) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.product-button')) {
                    const button = card.querySelector('.product-button');
                    if (button) button.click();
                }
            });
        }
    });

    // 6. Dynamic Header with mobile optimizations
    const header = document.querySelector('header');
    if (header) {
        let lastScroll = 0;
        const headerHeight = header.offsetHeight;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            
            // Add shadow when scrolled
            if (currentScroll > 50) {
                header.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = 'none';
            }
            
            // Hide header on scroll down for mobile to save space
            if (window.innerWidth <= 768) {
                if (currentScroll > lastScroll && currentScroll > headerHeight) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
                lastScroll = currentScroll;
            }
        });
    }

    // 7. Enhanced Cart Functionality with mobile optimizations
    const addToCartButtons = document.querySelectorAll('.product-button.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
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
            
            // Mobile-friendly notification
            if (window.innerWidth <= 768) {
                const notification = document.createElement('div');
                notification.textContent = `✓ ${productName} added to cart`;
                notification.style.position = 'fixed';
                notification.style.bottom = '20px';
                notification.style.left = '50%';
                notification.style.transform = 'translateX(-50%)';
                notification.style.backgroundColor = '#4CAF50';
                notification.style.color = 'white';
                notification.style.padding = '10px 20px';
                notification.style.borderRadius = '5px';
                notification.style.zIndex = '1000';
                notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.style.opacity = '0';
                    notification.style.transition = 'opacity 0.5s';
                    setTimeout(() => notification.remove(), 500);
                }, 2000);
            } else {
                alert(`${productName} added to cart!`);
            }
        });
    });

    function updateCartCount() {
        const cartCountElement = document.querySelector('header .nav-links a[href="cart.html"] .cart-count');
        if (cartCountElement) {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountElement.textContent = `(${totalQuantity})`;
            
            // Visual feedback on mobile when cart updates
            if (window.innerWidth <= 768 && totalQuantity > 0) {
                cartCountElement.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    cartCountElement.style.transform = 'scale(1)';
                }, 300);
            }
        }
    }

    updateCartCount();

    // 8. Enhanced Mobile Menu Toggle
    const mobileMenuButton = document.createElement('button');
    mobileMenuButton.innerHTML = '☰';
    mobileMenuButton.classList.add('mobile-menu-button');
    mobileMenuButton.setAttribute('aria-label', 'Toggle navigation menu');
    mobileMenuButton.setAttribute('aria-expanded', 'false');

    const navContainer = document.querySelector('nav.container');
    if (navContainer) {
        navContainer.appendChild(mobileMenuButton);
    }

    const navLinksList = document.querySelector('.nav-links');
    if (mobileMenuButton && navLinksList) {
        mobileMenuButton.addEventListener('click', () => {
            const isExpanded = navLinksList.classList.toggle('active');
            mobileMenuButton.setAttribute('aria-expanded', isExpanded);
            mobileMenuButton.innerHTML = isExpanded ? '✕' : '☰';
            
            // Prevent background scrolling when menu is open
            document.body.style.overflow = isExpanded ? 'hidden' : '';
        });

        // Close menu when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && navLinksList.classList.contains('active') && 
                !e.target.closest('.nav-links') && !e.target.closest('.mobile-menu-button')) {
                navLinksList.classList.remove('active');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
                mobileMenuButton.innerHTML = '☰';
                document.body