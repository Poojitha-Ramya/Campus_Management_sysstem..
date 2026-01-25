/**
 * PRODUCT DATABASE
 * Ideally, this would be fetched from a server, but for the frontend,
 * it acts as our single source of truth for pricing.
 */
const PRODUCTS = {
    1: { name: "Wireless Headphones", price: 99.00 },
    2: { name: "Mechanical Keyboard", price: 150.00 },
    3: { name: "USB-C Hub", price: 45.00 }
};

/**
 * CART LOGIC
 * Handles data persistence and state management.
 */
const Cart = {
    getCart() {
        const cart = localStorage.getItem('techstore_cart');
        // Return stored cart or an empty array if nothing exists
        return cart ? JSON.parse(cart) : [];
    },

    saveCart(cart) {
        localStorage.setItem('techstore_cart', JSON.stringify(cart));
        this.updateCounter();
        renderCartUI(); // Trigger UI refresh
    },

    removeFromCart(productId) {
        let cart = this.getCart();
        cart = cart.filter(item => item.id !== productId);
        this.saveCart(cart);
        this.showNotification('Item removed from cart');
    },

    getTotalItems() {
        return this.getCart().reduce((total, item) => total + item.quantity, 0);
    },

    updateCounter() {
        const counter = document.getElementById('cartCounter');
        if (counter) {
            counter.textContent = this.getTotalItems();
        }
    },

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; 
            background: #2563eb; color: white; padding: 15px 25px; 
            border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); 
            z-index: 9999; animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
};

/**
 * UI RENDERING
 * Dynamically builds the "Order Summary" list.
 */
function renderCartUI() {
    const cartList = document.getElementById('cart-list');
    const totalEl = document.getElementById('cart-total');
    const subtotalEl = document.getElementById('subtotal');
    const items = Cart.getCart();
    
    if (!cartList) return;

    if (items.length === 0) {
        cartList.innerHTML = '<p style="text-align:center; padding: 20px; color: #64748b;">Your cart is empty.</p>';
        if (totalEl) totalEl.textContent = '$0.00';
        if (subtotalEl) subtotalEl.textContent = '$0.00';
        return;
    }

    cartList.innerHTML = '';
    let totalValue = 0;

    items.forEach(item => {
        const product = PRODUCTS[item.id];
        if (!product) return;
        
        const itemTotal = product.price * item.quantity;
        totalValue += itemTotal;
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'checkout-item';
        itemDiv.innerHTML = `
            <div class="item-info">
                <h4>${product.name}</h4>
                <p>Quantity: ${item.quantity}</p>
            </div>
            <div style="display: flex; align-items: center; gap: 15px;">
                <span class="item-price">$${itemTotal.toFixed(2)}</span>
                <button onclick="Cart.removeFromCart(${item.id})" 
                        style="color: #ef4444; border: none; background: none; cursor: pointer; font-weight: bold;" 
                        title="Remove Item">✕</button>
            </div>
        `;
        cartList.appendChild(itemDiv);
    });

    if (subtotalEl) subtotalEl.textContent = `$${totalValue.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${totalValue.toFixed(2)}`;
}

/**
 * GOOGLE MAPS & GEOLOCATION
 */
let map, marker, geocoder;

function initMap() {
    geocoder = new google.maps.Geocoder();
    
    const defaultLocation = { lat: 0, lng: 0 };
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 16,
        center: defaultLocation,
        disableDefaultUI: true,
        zoomControl: true,
        // Using a modern "Silver" map style via code or Map ID is optional here
    });

    marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        }
    });

    // Detect User Location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map.setCenter(pos);
                marker.setPosition(pos);
                fetchAddress(pos);
            },
            () => console.warn("Geolocation permission denied.")
        );
    }

    // Initial renders
    renderCartUI();
    Cart.updateCounter();
}

function fetchAddress(latlng) {
    geocoder.geocode({ location: latlng }, (results, status) => {
        const addressField = document.getElementById("address");
        if (status === "OK" && results[0]) {
            addressField.value = results[0].formatted_address;
        } else {
            addressField.value = "Coordinate found, but address lookup failed.";
        }
    });
}

// Global Form Submission
document.getElementById('shipping-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    alert(`Thank you, ${name}! Your order has been placed successfully.`);
    localStorage.removeItem('techstore_cart'); // Clear cart after order
    window.location.href = 'index.html'; // Redirect to home
});