document.addEventListener('DOMContentLoaded', function() {
    // **التعامل مع زيادة ونقصان الكمية**
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

    // **التعامل مع تكبير وتصغير الصور (مُعدل)**
    const zoomables = document.querySelectorAll('.zoomable');
    const zoomInButtons = document.querySelectorAll('.zoom-in');
    const zoomOutButtons = document.querySelectorAll('.zoom-out');

    const zoomFactor = 1.6; // عامل التكبير (يمكنك تعديله)

    zoomables.forEach(img => {
        // تخزين الحجم الأصلي لكل صورة
        img.dataset.originalWidth = img.clientWidth;
        img.dataset.originalHeight = img.clientHeight;
        img.dataset.currentWidth = img.clientWidth;
        img.dataset.currentHeight = img.clientHeight;
    });

    zoomInButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productDiv = button.closest('.col-4');
            const img = productDiv.querySelector('.zoomable');
            if (img) {
                const currentWidth = parseFloat(img.dataset.currentWidth);
                const currentHeight = parseFloat(img.dataset.currentHeight);

                const newWidth = currentWidth * zoomFactor;
                const newHeight = currentHeight * zoomFactor;

                img.style.width = newWidth + 'px';
                img.style.height = newHeight + 'px';

                img.dataset.currentWidth = newWidth;
                img.dataset.currentHeight = newHeight;
            }
        });
    });

    zoomOutButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productDiv = button.closest('.col-4');
            const img = productDiv.querySelector('.zoomable');
            if (img) {
                const currentWidth = parseFloat(img.dataset.currentWidth);
                const currentHeight = parseFloat(img.dataset.currentHeight);
                const originalWidth = parseFloat(img.dataset.originalWidth);
                const originalHeight = parseFloat(img.dataset.originalHeight);

                // منع التصغير لأقل من الحجم الأصلي
                if (currentWidth > originalWidth) {
                    const newWidth = currentWidth / zoomFactor;
                    const newHeight = currentHeight / zoomFactor;

                    img.style.width = newWidth + 'px';
                    img.style.height = newHeight + 'px';

                    img.dataset.currentWidth = newWidth;
                    img.dataset.currentHeight = newHeight;
                } else {
                    img.style.width = originalWidth + 'px';
                    img.style.height = originalHeight + 'px';
                    img.dataset.currentWidth = originalWidth;
                    img.dataset.currentHeight = originalHeight;
                }
            }
        });
    });

    // **التعامل مع إضافة إلى السلة وتحديث أيقونة السلة (مُعدل)**
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartCountSpan = document.getElementById('cart-count'); // نقل التعريف إلى هنا

    function updateCartIcon() {
        const cart = localStorage.getItem('cart');
        if (cart && cartCountSpan) {
            const cartItems = JSON.parse(cart);
            const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
            cartCountSpan.textContent = `Cart (${totalQuantity})`;
        }
    }

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productDiv = this.closest('.col-4');
            if (productDiv) {
                const productName = productDiv.querySelector('h4').textContent;
                const productImage = productDiv.querySelector('.zoomable').src;
                const productPrice = 25;

                // عرض رسالة التأكيد والتحقق من النتيجة
                if (confirm(`${productName} added to cart! Do you want to go to the cart?`)) {
                    let cart = localStorage.getItem('cart');
                    cart = cart ? JSON.parse(cart) : [];

                    const existingProduct = cart.find(item => item.name === productName);

                    if (existingProduct) {
                        existingProduct.quantity++;
                    } else {
                        cart.push({ name: productName, image: productImage, price: productPrice, quantity: 1 });
                    }

                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartIcon(); // تحديث أيقونة السلة فقط عند الإضافة
                    // الانتقال إلى صفحة السلة تم بالفعل داخل شرط if
                }
            }
        });
    });

    updateCartIcon(); // استدعاء الدالة مرة واحدة هنا

    // **تغيير ترويسة الصفحة عند التمرير**
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    // **التعامل مع النقر على رابط "Home" للتمرير إلى الأعلى**
    const homeLink = document.querySelector('header nav a[href="#Home"]');

    if (homeLink) {
        homeLink.addEventListener('click', function(event) {
            event.preventDefault();
            if (window.scrollY > 0) {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }
});