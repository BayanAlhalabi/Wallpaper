document.addEventListener('DOMContentLoaded', function() {
    // ========== QUANTITY CONTROLS ==========
    const increaseButtons = document.querySelectorAll('.increase-quantity');
    const decreaseButtons = document.querySelectorAll('.decrease-quantity');

    increaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const quantityDisplay = button.parentNode.querySelector('.quantity');
            let currentQuantity = parseInt(quantityDisplay.textContent);
            currentQuantity++;
            quantityDisplay.textContent = currentQuantity;
        });
    });

    decreaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const quantityDisplay = button.parentNode.querySelector('.quantity');
            let currentQuantity = parseInt(quantityDisplay.textContent);
            if (currentQuantity > 0) {
                currentQuantity--;
                quantityDisplay.textContent = currentQuantity;
            }
        });
    });

    // ========== ENHANCED ZOOM FUNCTIONALITY ==========
    const zoomInButtons = document.querySelectorAll('.zoom-in');
    const zoomOutButtons = document.querySelectorAll('.zoom-out');
    const zoomables = document.querySelectorAll('.zoomable');

    // Initialize zoomable images
    zoomables.forEach(img => {
        img.dataset.originalWidth = img.naturalWidth;
        img.dataset.originalHeight = img.naturalHeight;
        img.dataset.currentScale = 1;
        img.style.transformOrigin = 'center center';
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        img.onload = () => {
            img.style.opacity = '1';
        };
    });

    // Zoom functions
    function zoomImage(img, direction) {
        const currentScale = parseFloat(img.dataset.currentScale);
        const maxScale = 3;
        const minScale = 1;
        const zoomStep = 0.2;
        
        let newScale = currentScale;
        
        if (direction === 'in') {
            newScale = Math.min(currentScale + zoomStep, maxScale);
        } else if (direction === 'out') {
            newScale = Math.max(currentScale - zoomStep, minScale);
        }
        
        img.style.transition = 'transform 0.3s ease';
        img.style.transform = `scale(${newScale})`;
        img.dataset.currentScale = newScale;
        
        setTimeout(() => {
            img.style.transition = '';
        }, 300);
    }

    // Button event listeners
    zoomInButtons.forEach(button => {
        button.addEventListener('click', () => {
            const img = button.closest('.wallpaper-item').querySelector('.zoomable');
            zoomImage(img, 'in');
        });
    });

    zoomOutButtons.forEach(button => {
        button.addEventListener('click', () => {
            const img = button.closest('.wallpaper-item').querySelector('.zoomable');
            zoomImage(img, 'out');
        });
    });

    // ========== LIGHTBOX FUNCTIONALITY ==========
    zoomables.forEach(img => {
        img.addEventListener('click', () => {
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <img src="${img.src}" alt="${img.alt}" data-current-scale="1">
                    <button class="close-lightbox">&times;</button>
                </div>
            `;
            
            document.body.appendChild(lightbox);
            
            // Close lightbox
            lightbox.querySelector('.close-lightbox').addEventListener('click', () => {
                lightbox.remove();
            });
            
            // Click outside to close
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    lightbox.remove();
                }
            });
        });
    });

    // Keyboard controls for lightbox
    document.addEventListener('keydown', (e) => {
        const lightbox = document.querySelector('.lightbox');
        if (!lightbox) return;
        
        const img = lightbox.querySelector('img');
        if (!img) return;
        
        const currentScale = parseFloat(img.dataset.currentScale || 1);
        
        if (e.key === '+' || e.key === '=') {
            e.preventDefault();
            const newScale = Math.min(currentScale + 0.2, 3);
            img.style.transform = `scale(${newScale})`;
            img.dataset.currentScale = newScale;
        } else if (e.key === '-' || e.key === '_') {
            e.preventDefault();
            const newScale = Math.max(currentScale - 0.2, 1);
            img.style.transform = `scale(${newScale})`;
            img.dataset.currentScale = newScale;
        } else if (e.key === 'Escape') {
            lightbox.remove();
        }
    });

    // ========== CART FUNCTIONALITY ==========
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartCountSpan = document.getElementById('cart-count');

    function updateCartIcon() {
        const cart = localStorage.getItem('cart');
        if (cart && cartCountSpan) {
            const cartItems = JSON.parse(cart);
            const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
            cartCountSpan.textContent = totalQuantity;
        }
    }

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productDiv = this.closest('.col-4');
            if (productDiv) {
                const productName = productDiv.querySelector('h4').textContent;
                const productImage = productDiv.querySelector('.zoomable').src;
                const priceText = productDiv.querySelector('.image-details p:last-child').textContent;
                const productPrice = parseFloat(priceText.replace(/[^0-9.]/g, ''));
                const quantity = parseInt(productDiv.querySelector('.quantity').textContent);

                if (quantity === 0) return;

                let cart = localStorage.getItem('cart');
                cart = cart ? JSON.parse(cart) : [];

                const existingProduct = cart.find(item => item.name === productName);

                if (existingProduct) {
                    existingProduct.quantity += quantity;
                } else {
                    cart.push({ 
                        name: productName, 
                        image: productImage, 
                        price: productPrice, 
                        quantity: quantity 
                    });
                }

                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartIcon();
                
                // Show notification
                const notification = document.getElementById('cart-notification');
                if (notification) {
                    notification.textContent = `${productName} (${quantity}) added to cart!`;
                    notification.style.display = 'block';
                    setTimeout(() => {
                        notification.style.display = 'none';
                    }, 2000);
                }
            }
        });
    });

    updateCartIcon();

    // ========== THEME TOGGLE ==========
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    document.querySelector('header').appendChild(themeToggle);

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
        
        if (document.body.classList.contains('dark-mode')) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });

    // Check for saved theme preference
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // ========== SCROLL EFFECTS ==========
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    // Smooth scroll for navigation
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animation on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.col-4');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Set initial state
    document.querySelectorAll('.col-4').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    // Add event listener
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    // ========== PRELOAD IMAGES ==========
    function preloadImages() {
        const images = document.querySelectorAll('.zoomable');
        images.forEach(img => {
            const imgObj = new Image();
            imgObj.src = img.src;
        });
    }
    window.addEventListener('load', preloadImages);
});