document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    const cartNotification = document.getElementById('cart-notification'); // الحصول على مرجع لعنصر الإشعار

    function displayCart() {
        let cart = localStorage.getItem('cart');
        cart = cart ? JSON.parse(cart) : [];

        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
        } else {
            emptyCartMessage.style.display = 'none';
            cart.forEach(item => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');

                const img = document.createElement('img');
                img.src = item.image;
                img.alt = item.name;

                const detailsDiv = document.createElement('div');
                detailsDiv.classList.add('cart-item-details');

                const nameHeading = document.createElement('h4');
                nameHeading.textContent = item.name;

                const quantityDiv = document.createElement('div');
                quantityDiv.classList.add('cart-item-quantity');

                const decreaseButton = document.createElement('button');
                decreaseButton.textContent = '-';
                decreaseButton.addEventListener('click', () => {
                    updateQuantity(item.name, -1);
                    showMessage('تم تحديث الكمية'); // عرض رسالة عند إنقاص الكمية
                });

                const quantitySpan = document.createElement('span');
                quantitySpan.textContent = item.quantity;

                const increaseButton = document.createElement('button');
                increaseButton.textContent = '+';
                increaseButton.addEventListener('click', () => {
                    updateQuantity(item.name, 1);
                    showMessage('تم تحديث الكمية'); // عرض رسالة عند زيادة الكمية
                });

                quantityDiv.appendChild(decreaseButton);
                quantityDiv.appendChild(quantitySpan);
                quantityDiv.appendChild(increaseButton);

                detailsDiv.appendChild(nameHeading);
                detailsDiv.appendChild(quantityDiv);

                const priceSpan = document.createElement('span');
                priceSpan.classList.add('cart-item-price');
                priceSpan.textContent = `${(item.price * item.quantity).toFixed(2)} USD`;

                const actionsDiv = document.createElement('div');
                actionsDiv.classList.add('cart-item-actions');

                const deleteButton = document.createElement('button');
                deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>Remove'; // تغيير النص ليعكس التأكيد
                deleteButton.addEventListener('click', () => {
                    // إضافة تأكيد قبل الحذف
                    if (confirm(` Are you sure you want to delete ${item.name}From shopping cart? `)) {
                        removeItem(item.name);
                        showMessage(`تمت إزالة ${item.name} من سلة التسوق`); // تعديل رسالة الإزالة
                    }
                });

                actionsDiv.appendChild(priceSpan);
                actionsDiv.appendChild(deleteButton);

                cartItemDiv.appendChild(img);
                cartItemDiv.appendChild(detailsDiv);
                cartItemDiv.appendChild(actionsDiv);

                cartItemsContainer.appendChild(cartItemDiv);
                total += item.price * item.quantity;
            });
        }

        cartTotalSpan.textContent = total.toFixed(2);
    }

    function updateQuantity(productName, change) {
        let cart = localStorage.getItem('cart');
        cart = cart ? JSON.parse(cart) : [];

        const product = cart.find(item => item.name === productName);

        if (product) {
            product.quantity += change;
            if (product.quantity < 1) {
                cart = cart.filter(item => item.name !== productName);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCart();
            updateCartIconInHeader();
        }
    }

    function removeItem(productName) {
        let cart = localStorage.getItem('cart');
        cart = cart ? JSON.parse(cart) : [];

        cart = cart.filter(item => item.name !== productName);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        updateCartIconInHeader();
        // لم تعد هناك حاجة لاستدعاء showMessage هنا بشكل مباشر، تم استدعاؤها بعد التأكيد
    }

    function updateCartIconInHeader() {
        const cart = localStorage.getItem('cart');
        const cartCountSpan = document.querySelector('header #cart-count');
        if (cart && cartCountSpan) {
            const cartItems = JSON.parse(cart);
            const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
            cartCountSpan.textContent = `Cart (${totalQuantity})`;
        }
    }
    function showMessage(message) {
        cartNotification.textContent = message;
        cartNotification.classList.remove('hide'); // إزالة كلاس الإخفاء إذا كان موجودًا
        cartNotification.classList.add('show');
        cartNotification.style.display = 'block';

        setTimeout(() => {
            cartNotification.classList.remove('show');
            cartNotification.classList.add('hide'); // إضافة كلاس الإخفاء لبدء تأثير الاختفاء
            setTimeout(() => {
                cartNotification.style.display = 'none';
            }, 300); // مدة تلاشي الرسالة (يجب أن تتطابق مع مدة الانتقال في CSS)
        }, 1500); // مدة ظهور الرسالة
    }

    displayCart();
    updateCartIconInHeader();
});