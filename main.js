```javascript
/* =========================================================
   ShopEasy - Main JavaScript
   File: js/main.js
   ========================================================= */


/* =========================================================
   CART FUNCTIONS
   ========================================================= */

function getCart() {
    try {
        return JSON.parse(localStorage.getItem("cart")) || [];
    } catch (error) {
        return [];
    }
}


function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}


function updateCartCount() {

    const cart = getCart();

    const count = cart.reduce(
        (total, item) => {
            return total + Number(item.quantity || 1);
        },
        0
    );

    const counters = document.querySelectorAll(
        "#cartCount, .cart-count"
    );

    counters.forEach(counter => {
        counter.textContent = count;
    });
}


/* =========================================================
   ADD TO CART
   ========================================================= */

function addToCart(product) {

    let cart = getCart();

    const existingProduct = cart.find(
        item => item.id === product.id
    );


    if (existingProduct) {

        existingProduct.quantity =
            Number(existingProduct.quantity || 1) + 1;

    } else {

        cart.push({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image || "",
            quantity: 1
        });
    }


    saveCart(cart);

    showNotification(
        `${product.name} added to cart 🛒`
    );
}


/*
   This version is useful when product pages
   call addToCart(productId)
*/

function addProductToCart(
    productId,
    productName,
    productPrice,
    productImage = ""
) {

    const product = {
        id: productId,
        name: productName,
        price: Number(productPrice),
        image: productImage
    };

    addToCart(product);
}


/* =========================================================
   REMOVE FROM CART
   ========================================================= */

function removeFromCart(productId) {

    let cart = getCart();

    cart = cart.filter(
        item => item.id !== productId
    );

    saveCart(cart);

    showNotification(
        "Product removed from cart"
    );
}


/* =========================================================
   QUANTITY
   ========================================================= */

function increaseQuantity(productId) {

    const cart = getCart();

    const item = cart.find(
        product => product.id === productId
    );


    if (item) {
        item.quantity =
            Number(item.quantity || 1) + 1;
    }


    saveCart(cart);
}


function decreaseQuantity(productId) {

    let cart = getCart();

    const item = cart.find(
        product => product.id === productId
    );


    if (!item) return;


    if (Number(item.quantity || 1) > 1) {

        item.quantity -= 1;

    } else {

        cart = cart.filter(
            product => product.id !== productId
        );
    }


    saveCart(cart);
}


/* =========================================================
   WISHLIST
   ========================================================= */

function getWishlist() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "shopEasyWishlist"
            )
        ) || [];

    } catch (error) {

        return [];
    }
}


function toggleWishlist(productId) {

    let wishlist = getWishlist();


    if (wishlist.includes(productId)) {

        wishlist = wishlist.filter(
            id => id !== productId
        );

        showNotification(
            "Removed from wishlist ❤️"
        );

    } else {

        wishlist.push(productId);

        showNotification(
            "Added to wishlist ❤️"
        );
    }


    localStorage.setItem(
        "shopEasyWishlist",
        JSON.stringify(wishlist)
    );


    updateWishlistButtons();
}


function isInWishlist(productId) {

    return getWishlist().includes(productId);
}


function updateWishlistButtons() {

    const wishlist = getWishlist();


    document.querySelectorAll(
        "[data-wishlist-id]"
    ).forEach(button => {

        const id =
            button.dataset.wishlistId;


        if (wishlist.includes(id)) {

            button.classList.add("active");

            if (button.innerHTML.includes("♡")) {
                button.innerHTML =
                    button.innerHTML.replace("♡", "♥");
            }

        } else {

            button.classList.remove("active");

            if (button.innerHTML.includes("♥")) {
                button.innerHTML =
                    button.innerHTML.replace("♥", "♡");
            }
        }
    });
}


/* =========================================================
   PRICE
   ========================================================= */

function formatPrice(price) {

    return "₹" +
        Number(price || 0)
            .toLocaleString("en-IN");
}


/* =========================================================
   CART TOTAL
   ========================================================= */

function calculateSubtotal() {

    const cart = getCart();

    return cart.reduce(
        (total, item) => {

            return total +
                Number(item.price || 0) *
                Number(item.quantity || 1);

        },
        0
    );
}


function calculateDelivery(subtotal) {

    if (subtotal <= 0) {
        return 0;
    }

    return subtotal >= 999 ? 0 : 49;
}


function calculateTotal() {

    const subtotal =
        calculateSubtotal();

    const delivery =
        calculateDelivery(subtotal);

    return subtotal + delivery;
}


/* =========================================================
   CHECKOUT → PAYMENT
   ========================================================= */

function goToCheckout() {

    const cart = getCart();


    if (cart.length === 0) {

        alert(
            "Your cart is empty. Please add products first."
        );

        return;
    }


    /*
       Save cart before moving to payment.
    */

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    /*
       Calculate order summary.
    */

    const subtotal =
        calculateSubtotal();

    const delivery =
        calculateDelivery(subtotal);

    const total =
        subtotal + delivery;


    localStorage.setItem(
        "shopEasyOrderSummary",
        JSON.stringify({
            subtotal: subtotal,
            delivery: delivery,
            total: total,
            items: cart.length
        })
    );


    /*
       DIRECT PAYMENT
    */

    window.location.href =
        "payment.html";
}


/* =========================================================
   PROCEED TO PAYMENT
   ========================================================= */

function proceedToPayment() {

    const cart = getCart();


    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;
    }


    const subtotal =
        calculateSubtotal();

    const delivery =
        calculateDelivery(subtotal);

    const total =
        subtotal + delivery;


    localStorage.setItem(
        "shopEasyOrderSummary",
        JSON.stringify({
            subtotal: subtotal,
            delivery: delivery,
            total: total
        })
    );


    window.location.href =
        "payment.html";
}


/* =========================================================
   CHECKOUT DETAILS
   ========================================================= */

function saveShippingDetails(details) {

    localStorage.setItem(
        "shopEasyShipping",
        JSON.stringify(details)
    );
}


function getShippingDetails() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "shopEasyShipping"
            )
        ) || null;

    } catch (error) {

        return null;
    }
}


/* =========================================================
   LOGIN
   ========================================================= */

function getLoggedInUser() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "shopEasyLoggedIn"
            )
        ) || null;

    } catch (error) {

        return null;
    }
}


function isLoggedIn() {

    return !!getLoggedInUser();
}


function logout() {

    localStorage.removeItem(
        "shopEasyLoggedIn"
    );

    localStorage.removeItem(
        "shopEasyRemember"
    );

    showNotification(
        "Logged out successfully"
    );


    setTimeout(() => {

        window.location.href =
            "index.html";

    }, 700);
}


/* =========================================================
   ACCOUNT UI
   ========================================================= */

function updateAccountUI() {

    const user =
        getLoggedInUser();


    document.querySelectorAll(
        "[data-account-link]"
    ).forEach(link => {

        if (user) {

            link.textContent =
                `Hi, ${user.name}`;

            link.href = "#";


            link.onclick = function(event) {

                event.preventDefault();


                const logoutUser =
                    confirm(
                        `Hello ${user.name}!\n\nDo you want to logout?`
                    );


                if (logoutUser) {
                    logout();
                }
            };

        } else {

            link.textContent =
                "Account";

            link.href =
                "login.html";
        }
    });
}


/* =========================================================
   SEARCH
   ========================================================= */

function setupSearch() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    if (!searchInput) return;


    searchInput.addEventListener(
        "keypress",
        function(event) {

            if (event.key === "Enter") {

                const search =
                    searchInput.value.trim();


                if (!search) return;


                window.location.href =
                    "products.html?search=" +
                    encodeURIComponent(search);
            }
        }
    );
}


/* =========================================================
   NEWSLETTER
   ========================================================= */

function subscribeNewsletter(email) {

    if (
        !email ||
        !email.includes("@")
    ) {

        alert(
            "Please enter a valid email address."
        );

        return false;
    }


    localStorage.setItem(
        "shopEasyNewsletter",
        email
    );


    showNotification(
        "Successfully subscribed! 🎉"
    );


    return true;
}


/* =========================================================
   ORDERS
   ========================================================= */

function getOrders() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "shopEasyOrders"
            )
        ) || [];

    } catch (error) {

        return [];
    }
}


function saveOrder(order) {

    const orders =
        getOrders();

    orders.push(order);


    localStorage.setItem(
        "shopEasyOrders",
        JSON.stringify(orders)
    );
}


/* =========================================================
   CLEAR CART
   ========================================================= */

function clearCart() {

    localStorage.removeItem("cart");

    localStorage.removeItem(
        "shopEasyOrderSummary"
    );

    updateCartCount();
}


/* =========================================================
   NOTIFICATION
   ========================================================= */

function showNotification(message) {

    let notification =
        document.getElementById(
            "shopEasyNotification"
        );


    /*
       Create notification automatically
       if the page doesn't have one.
    */

    if (!notification) {

        notification =
            document.createElement("div");

        notification.id =
            "shopEasyNotification";


        notification.style.position =
            "fixed";

        notification.style.right =
            "25px";

        notification.style.bottom =
            "25px";

        notification.style.background =
            "#111827";

        notification.style.color =
            "#ffffff";

        notification.style.padding =
            "14px 20px";

        notification.style.borderRadius =
            "10px";

        notification.style.fontSize =
            "14px";

        notification.style.fontWeight =
            "600";

        notification.style.zIndex =
            "99999";

        notification.style.boxShadow =
            "0 10px 30px rgba(0,0,0,0.2)";

        notification.style.opacity =
            "0";

        notification.style.transform =
            "translateY(10px)";

        notification.style.transition =
            "all 0.3s ease";


        document.body.appendChild(
            notification
        );
    }


    notification.textContent =
        message;


    notification.style.opacity =
        "1";

    notification.style.transform =
        "translateY(0)";


    clearTimeout(
        window.shopEasyNotificationTimer
    );


    window.shopEasyNotificationTimer =
        setTimeout(() => {

            notification.style.opacity =
                "0";

            notification.style.transform =
                "translateY(10px)";

        }, 2200);
}


/* =========================================================
   PAGE INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateCartCount();

        updateWishlistButtons();

        updateAccountUI();

        setupSearch();

    }
);
```