// Main Application Logic

// Generate star rating HTML
function generateStars(rating) {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

// Render products to the grid
function renderProducts(productList) {
    const grid = document.getElementById('productsGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (productList.length === 0) {
        grid.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }
    
    grid.classList.remove('hidden');
    emptyState.classList.add('hidden');
    
    grid.innerHTML = productList.map(product => `
        <article class="product-card" data-id="${product.id}">
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            <img 
                src="${product.image}" 
                alt="${product.title}" 
                class="product-image"
                loading="lazy"
            >
            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3 class="product-title">${product.title}</h3>
                <div class="product-rating">${generateStars(product.rating)}</div>
                <div class="product-price">
                    <span class="current-price">$${product.price}</span>
                    ${product.originalPrice > product.price ? 
                        `<span class="original-price">$${product.originalPrice}</span>` : ''}
                </div>
                <button class="add-to-cart" data-id="${product.id}">
                    Add to Cart
                </button>
            </div>
        </article>
    `).join('');
}

// Event Delegation for Add to Cart buttons
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart')) {
        const productId = parseInt(e.target.dataset.id);
        Cart.addToCart(productId);
        
        // Button feedback
        const btn = e.target;
        btn.textContent = '✓ Added!';
        btn.style.background = '#22c55e';
        
        setTimeout(() => {
            btn.textContent = 'Add to Cart';
            btn.style.background = '';
        }, 1500);
    }
});

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    // Render all products initially
    renderProducts(products);
    
    // Initialize filters
    Filters.init();
    
    // Update cart counter on load
    Cart.updateCounter();
    
    console.log('TechStore initialized successfully!');
});