// Main JavaScript functionality for Wishlist Application

// Initialize wishlist from localStorage
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Countdown Timer Function
function updateCountdownTimers() {
    const timers = document.querySelectorAll('.countdown-timer');
    
    timers.forEach(timer => {
        const endTime = new Date(timer.getAttribute('data-end-time')).getTime();
        const now = new Date().getTime();
        const distance = endTime - now;
        
        if (distance > 0) {
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            timer.textContent = 
                String(hours).padStart(2, '0') + ':' + 
                String(minutes).padStart(2, '0') + ':' + 
                String(seconds).padStart(2, '0');
        } else {
            timer.textContent = 'EXPIRED';
            timer.closest('.deal-card').style.opacity = '0.5';
        }
    });
}

// Start countdown timers if on deals page
if (document.querySelectorAll('.countdown-timer').length > 0) {
    updateCountdownTimers();
    setInterval(updateCountdownTimers, 1000);
}

// Filter Tab Functionality
const filterTabs = document.querySelectorAll('.filter-tab');
filterTabs.forEach(tab => {
    tab.addEventListener('click', function() {
        filterTabs.forEach(t => {
            t.classList.remove('active', 'bg-yellow-400', 'text-gray-900');
            t.classList.add('text-gray-600');
        });
        
        this.classList.add('active', 'bg-yellow-400', 'text-gray-900');
        this.classList.remove('text-gray-600');
        
        // Here you would filter deals based on the selected tab
        // For now, this is just UI feedback
    });
});

// Category Filter Buttons
const categoryFilters = document.querySelectorAll('.category-filter');
categoryFilters.forEach(button => {
    button.addEventListener('click', function() {
        const category = this.getAttribute('data-category');
        
        // Toggle active state
        categoryFilters.forEach(btn => {
            btn.classList.remove('ring-4', 'ring-yellow-300');
        });
        this.classList.add('ring-4', 'ring-yellow-300');
        
        // Filter deals by category
        filterDealsByCategory(category);
    });
});

// Filter deals by category
function filterDealsByCategory(category) {
    const dealCards = document.querySelectorAll('.deal-card');
    
    dealCards.forEach(card => {
        const dealTitle = card.querySelector('h3').textContent.toLowerCase();
        
        if (category === 'all' || dealTitle.includes(category.toLowerCase())) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Price Range Slider
const priceRange = document.getElementById('priceRange');
if (priceRange) {
    priceRange.addEventListener('input', function() {
        const value = this.value;
        // Update price filter display
        // In a real app, this would filter deals by price
        console.log('Price range:', value);
    });
}

// Toggle switches (Nearby, Top-Rated)
const nearbyToggle = document.getElementById('nearbyToggle');
const topRatedToggle = document.getElementById('topRatedToggle');

if (nearbyToggle) {
    nearbyToggle.addEventListener('change', function() {
        if (this.checked) {
            console.log('Showing nearby deals');
            // Filter to show nearby deals
        } else {
            console.log('Showing all locations');
        }
    });
}

if (topRatedToggle) {
    topRatedToggle.addEventListener('change', function() {
        if (this.checked) {
            console.log('Showing top-rated deals');
            // Filter to show top-rated deals
        } else {
            console.log('Showing all ratings');
        }
    });
}

// Add to Wishlist Function
function addToWishlist(dealId, dealTitle, dealIcon) {
    const deal = {
        id: dealId,
        title: dealTitle,
        icon: dealIcon,
        addedAt: new Date().toISOString()
    };
    
    // Check if already in wishlist
    const exists = wishlist.find(item => item.id === dealId);
    if (!exists) {
        wishlist.push(deal);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        showNotification('Added to wishlist!');
    } else {
        showNotification('Already in wishlist!');
    }
}

// Remove from Wishlist Function
function removeFromWishlist(dealId) {
    wishlist = wishlist.filter(item => item.id !== dealId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    showNotification('Removed from wishlist');
}

// Show Notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Handle Claim Deal Buttons
const claimButtons = document.querySelectorAll('.deal-card button');
claimButtons.forEach((button, index) => {
    if (button.textContent.includes('Claim')) {
        button.addEventListener('click', function() {
            const card = this.closest('.deal-card');
            const title = card.querySelector('h3').textContent.trim();
            
            // Add to wishlist
            addToWishlist('deal-' + index, title, 'restaurant');
            
            // Visual feedback
            this.textContent = 'CLAIMED!';
            this.classList.add('bg-green-500');
            this.classList.remove('bg-yellow-400', 'hover:bg-yellow-500');
            
            setTimeout(() => {
                this.textContent = 'CLAIM DEAL';
                this.classList.remove('bg-green-500');
                this.classList.add('bg-yellow-400', 'hover:bg-yellow-500');
            }, 2000);
        });
    }
});

// Search Functionality
const searchInputs = document.querySelectorAll('input[type="text"][placeholder="search here..."]');
searchInputs.forEach(input => {
    input.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        // Search in deals
        const dealCards = document.querySelectorAll('.deal-card');
        dealCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            if (title.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Search in wishlist
        const wishlistItems = document.querySelectorAll('.wishlist-item');
        wishlistItems.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            if (title.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Navigation Menu (Mobile)
const menuButton = document.getElementById('menu-button');
if (menuButton) {
    menuButton.addEventListener('click', function() {
        // Create mobile menu
        const menu = document.createElement('div');
        menu.className = 'fixed inset-0 bg-gray-900 bg-opacity-95 z-50 flex flex-col items-center justify-center';
        menu.innerHTML = `
            <button class="absolute top-4 right-4 text-white text-4xl">&times;</button>
            <nav class="space-y-6 text-center">
                <a href="index.html" class="block text-white text-2xl font-bold hover:text-yellow-400 transition-colors">Home</a>
                <a href="deals.html" class="block text-white text-2xl font-bold hover:text-yellow-400 transition-colors">Deals</a>
                <a href="wishlist.html" class="block text-white text-2xl font-bold hover:text-yellow-400 transition-colors">Wishlist</a>
                <a href="login.html" class="block text-white text-2xl font-bold hover:text-yellow-400 transition-colors">Login</a>
            </nav>
        `;

        document.body.appendChild(menu);

        // Close menu
        menu.querySelector('button').addEventListener('click', function() {
            menu.remove();
        });
    });
}

// Profile Button - Check Login Status
const profileButtons = document.querySelectorAll('header button:has(svg)');
profileButtons.forEach(button => {
    if (button.querySelector('path[d*="M16 7a4"]')) {
        button.addEventListener('click', function() {
            const isLoggedIn = localStorage.getItem('userLoggedIn');
            
            if (isLoggedIn === 'true') {
                // Show profile menu
                const menu = document.createElement('div');
                menu.className = 'absolute top-16 right-4 bg-white shadow-xl rounded-lg p-4 w-48 z-50 border border-gray-200';
                menu.innerHTML = `
                    <div class="text-sm text-gray-600 mb-2">${localStorage.getItem('userEmail')}</div>
                    <hr class="my-2">
                    <button onclick="logout()" class="w-full text-left text-red-600 font-semibold hover:bg-red-50 px-2 py-1 rounded">Logout</button>
                `;
                
                document.body.appendChild(menu);
                
                // Close menu when clicking outside
                setTimeout(() => {
                    document.addEventListener('click', function closeMenu(e) {
                        if (!menu.contains(e.target) && e.target !== button) {
                            menu.remove();
                            document.removeEventListener('click', closeMenu);
                        }
                    });
                }, 10);
            } else {
                window.location.href = 'login.html';
            }
        });
    }
});

// Logout Function
function logout() {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userEmail');
    window.location.href = 'login.html';
}

// Make logout available globally
window.logout = logout;

// Dark Mode Toggle (from index.html)
const darkToggle = document.getElementById('darkToggle');
function setDarkMode(isDark) {
    if (isDark) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
    }

    if (darkToggle) {
        const slider = darkToggle.querySelector('span');
        const sun = darkToggle.querySelector('.sun');
        const moon = darkToggle.querySelector('.moon');

        if (isDark) {
            darkToggle.classList.add('bg-yellow-400');
            darkToggle.classList.remove('bg-gray-300');
            slider.classList.remove('translate-x-1');
            slider.classList.add('translate-x-6');
            if (sun) sun.classList.add('hidden');
            if (moon) moon.classList.remove('hidden');
        } else {
            darkToggle.classList.remove('bg-yellow-400');
            darkToggle.classList.add('bg-gray-300');
            slider.classList.remove('translate-x-6');
            slider.classList.add('translate-x-1');
            if (sun) sun.classList.remove('hidden');
            if (moon) moon.classList.add('hidden');
        }
    }

    localStorage.setItem('darkMode', isDark);
}

if (darkToggle) {
    darkToggle.addEventListener('click', () => {
        const nowDark = !document.documentElement.classList.contains('dark');
        setDarkMode(nowDark);
    });
}

// Load dark mode preference on startup
setDarkMode(localStorage.getItem('darkMode') === 'true');

// Notification Bell
const notificationButtons = document.querySelectorAll('button:has(path[d*="M15 17h5"])');
notificationButtons.forEach(button => {
    button.addEventListener('click', function() {
        showNotification('No new notifications');
    });
});

// Get URL Parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Filter deals by category from URL parameter
const categoryParam = getUrlParameter('category');
if (categoryParam) {
    console.log('Filtering by category:', categoryParam);
    // This would filter the deals based on the URL parameter
    // For now, just log it
}

// Smooth scroll to top on page navigation
window.addEventListener('load', function() {
    window.scrollTo(0, 0);
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.deal-card, .category-card, .wishlist-item').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

console.log('Wishlist App Loaded Successfully! 🎉');
