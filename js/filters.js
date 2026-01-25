// Filter Management
const Filters = {
    currentFilters: {
        search: '',
        maxPrice: 2000,
        category: 'all'
    },

    // Apply all filters
    applyFilters() {
        const filtered = products.filter(product => {
            // Search filter
            const matchesSearch = product.title
                .toLowerCase()
                .includes(this.currentFilters.search.toLowerCase());
            
            // Price filter
            const matchesPrice = product.price <= this.currentFilters.maxPrice;
            
            // Category filter
            const matchesCategory = this.currentFilters.category === 'all' || 
                                    product.category === this.currentFilters.category;
            
            return matchesSearch && matchesPrice && matchesCategory;
        });

        renderProducts(filtered);
    },

    // Initialize filter listeners
    init() {
        // Search filter
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            this.currentFilters.search = e.target.value;
            this.debounce(() => this.applyFilters(), 300);
        });

        // Price range filter
        const priceRange = document.getElementById('priceRange');
        const priceValue = document.getElementById('priceValue');
        priceRange.addEventListener('input', (e) => {
            this.currentFilters.maxPrice = parseInt(e.target.value);
            priceValue.textContent = e.target.value;
            this.applyFilters();
        });

        // Category filter
        const categoryFilter = document.getElementById('categoryFilter');
        categoryFilter.addEventListener('change', (e) => {
            this.currentFilters.category = e.target.value;
            this.applyFilters();
        });

        // Reset filters button
        const resetBtn = document.getElementById('resetFilters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetFilters());
        }
    },

    // Reset all filters
    resetFilters() {
        this.currentFilters = {
            search: '',
            maxPrice: 2000,
            category: 'all'
        };
        
        document.getElementById('searchInput').value = '';
        document.getElementById('priceRange').value = 2000;
        document.getElementById('priceValue').textContent = '2000';
        document.getElementById('categoryFilter').value = 'all';
        
        this.applyFilters();
    },

    // Debounce helper
    debounceTimer: null,
    debounce(func, delay) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(func, delay);
    }
};