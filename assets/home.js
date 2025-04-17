document.addEventListener("DOMContentLoaded", () => {
  // Function to Load Sale Products
function loadSaleProducts() {
    fetch("http://localhost:5000/api/products/sale-products") // Correct endpoint for sale products
        .then(response => response.json())
        .then(products => {
            // Sale Products Section
            const saleProductsContainer = document.getElementById("sale-list");
            saleProductsContainer.innerHTML = ""; // Clear any previous content

            products.forEach(product => {
                const productCard = `
                    <div class="product-card">
                        <img src="${product.image}" alt="${product.name}" />
                        <h3>${product.name}</h3>
                        <p>
                            <span class="mrp">₹${product.mrp}</span>
                            <span class="price">₹${product.price}</span>
                        </p>
                        <button class="buy-now-btn" data-id="${product._id}">Buy Now</button>
                  
                     <button class="cart-btn" data-id="${product._id}">
                                <i class="fas fa-shopping-cart"></i> <!-- Font Awesome Cart Icon -->
                            </button>
                              </div>
                `;
                saleProductsContainer.innerHTML += productCard; // Add product card to container
            });
             // Bind "Buy Now" button click event
            document.querySelectorAll(".buy-now-btn").forEach(button => {
                button.addEventListener("click", function () {
                    const productId = this.dataset.id;
                    addToCart(productId, true); // Add product to cart and redirect
                });
            });

            // Bind cart logo button click event
            document.querySelectorAll(".cart-btn").forEach(button => {
                button.addEventListener("click", function () {
                    const productId = this.dataset.id;
                    addToCart(productId); // Add product to cart without redirect
                });
            });
        })
        .catch(error => console.error("❌ Error loading sale products:", error));
}
// 🛒 Function to add item to Cart (Guest & Logged-in Users)
async function addToCart(productId, redirectToCheckout = false) {
    const token = localStorage.getItem("authToken");

    if (!token) {
        // Guest user - store in localStorage
        let cart = JSON.parse(localStorage.getItem("guestCart")) || [];
        const itemIndex = cart.findIndex(item => item.productId === productId);

        if (itemIndex > -1) {
            cart[itemIndex].quantity += 1;
        } else {
            cart.push({ productId, quantity: 1 });
        }

        localStorage.setItem("guestCart", JSON.stringify(cart));
        updateCartCount();
        alert("Added to cart! 🛒");

        if (redirectToCheckout) {
            window.location.href = "../store/checkout.html"; // Redirect guest user to checkout
        }
        return;
    }

    // Logged-in user - store in backend
    try {
        const response = await fetch( "http://localhost:5000/api/users/cart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ productId, quantity: 1 })
        });

        const data = await response.json();
        if (response.ok) {
            updateCartCount();
            alert("Added to Cart! 🛒");

            if (redirectToCheckout) {
                window.location.href = "../store/checkout.html"; // Redirect logged-in user to checkout
            }
        } else {
            alert(data.message || "Error adding to cart");
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
    }
}


// Load Sale Products on Page Load
window.addEventListener("DOMContentLoaded", loadSaleProducts);

    
    // Countdown target date
    const countdownDate = new Date("April 30, 2025 23:59:59").getTime();

    function updateCountdown() {
        const now = new Date().getTime(); // Current timestamp
        const distance = countdownDate - now; // Time difference

        // Check if the countdown has ended
        if (distance < 0) {
            clearInterval(timerInterval); // Stop updates
            document.getElementById("countdown-timer").innerHTML = "Sale Ended!"; // Message display
            return;
        }

        // Time calculations
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update elements by ID
        document.getElementById("days").textContent = days;
        document.getElementById("hours").textContent = hours;
        document.getElementById("minutes").textContent = minutes;
        document.getElementById("seconds").textContent = seconds;
    }

    // Interval to update countdown every second
    const timerInterval = setInterval(updateCountdown, 1000);

    // Initialize countdown immediately after DOM is loaded
    updateCountdown();
});
    document.addEventListener("DOMContentLoaded", updateCartCount);   
    
    document.addEventListener("DOMContentLoaded", () => {
        const carouselWrapper = document.querySelector(".hero-carousel");
        const dotsContainer = document.querySelector(".carousel-dots");
        const prevArrow = document.querySelector(".carousel-control.prev");
        const nextArrow = document.querySelector(".carousel-control.next");
        const slides = Array.from(document.querySelectorAll(".carousel-slide")); // Get all slides
        const dots = Array.from(document.querySelectorAll(".dot")); // Get all dots
    
        let currentIndex = 0;
        let autoSlideInterval;
    
        // Function to update slide position
        function updateSlidePosition() {
            const offset = -currentIndex * 100; // Calculate the offset for the current slide
            carouselWrapper.style.transform = `translateX(${offset}%)`; // Apply horizontal translation
            carouselWrapper.style.transition = "transform 0.5s ease"; // Smooth sliding effect
    
            dots.forEach((dot, i) => {
                dot.classList.toggle("active", i === currentIndex); // Highlight the active dot
            });
        }
    
        // Auto-Slide Function
        function startAutoSlide() {
            stopAutoSlide(); // Stop any existing interval before starting a new one
            autoSlideInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % slides.length; // Move to the next slide
                updateSlidePosition();
            }, 10000); // 10-second interval
        }
    
        function stopAutoSlide() {
            clearInterval(autoSlideInterval); // Clear the auto-slide interval
        }
    
        // Event listeners for arrows
        prevArrow.addEventListener("click", () => {
            stopAutoSlide(); // Stop auto-slide on manual interaction
            currentIndex = (currentIndex - 1 + slides.length) % slides.length; // Loop backward
            updateSlidePosition();
            startAutoSlide(); // Restart auto-slide after manual interaction
        });
    
        nextArrow.addEventListener("click", () => {
            stopAutoSlide(); // Stop auto-slide on manual interaction
            currentIndex = (currentIndex + 1) % slides.length; // Loop forward
            updateSlidePosition();
            startAutoSlide(); // Restart auto-slide after manual interaction
        });
    
        // Dot navigation
        dots.forEach((dot, i) => {
            dot.addEventListener("click", () => {
                stopAutoSlide(); // Stop auto-slide on manual interaction
                currentIndex = i; // Set the current index to the clicked dot's index
                updateSlidePosition();
                startAutoSlide(); // Restart auto-slide after manual interaction
            });
        });
    
        // Initialize the carousel
        updateSlidePosition();
        startAutoSlide();
    });
    

    // 🚀 Dashboard Icon Click Logic (Login Persistence)
    const dashboardIcon = document.querySelector(".dashboard-container a");

    if (dashboardIcon) {
        dashboardIcon.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default navigation

            const loggedInUser = localStorage.getItem("loggedInUser");

if (localStorage.getItem("isLoggedIn") === "true" && loggedInUser) {
    window.location.href = "dashboard.html"; 
} else {
    window.location.href = "guest-dashboard.html"; 
}
        });
    }// Store login state in localStorage after successful login
localStorage.setItem("isLoggedIn", "true");
console.log("User logged in, isLoggedIn set to:", localStorage.getItem("isLoggedIn"));


    // ✅ Ensure Login State Persists
    if (localStorage.getItem("isLoggedIn") !== "true") {
        console.log("User is not logged in.");
    } else {
        console.log("User is logged in.");
    }

document.addEventListener("DOMContentLoaded", async function () {
    await checkLoginStatus();
});

// 🔹 Fetch Login Status from Backend
async function checkLoginStatus() {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            console.log("User is not logged in.");
            return;
        }

        const response = await fetch("http://localhost:5000/api/users/me", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            console.log("User session expired or invalid token.");
            localStorage.removeItem("authToken");
            return;
        }

        const userData = await response.json();
        console.log("User is logged in:", userData);

        // ✅ Update Dashboard Link Based on Login Status
        const dashboardIcon = document.querySelector(".dashboard-container a");
        if (dashboardIcon) {
            dashboardIcon.href = "dashboard.html";
        }
    } catch (error) {
        console.error("Error checking login status:", error);
    }
}
document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("http://localhost:5000/api/products/featured");
        const featuredProducts = await response.json();

        if (featuredProducts.length > 0) {
            displayFeaturedProducts(featuredProducts);
        } else {
            console.warn("No featured products available.");
        }
    } catch (error) {
        console.error("Error fetching featured products:", error);
    }
});

function displayFeaturedProducts(products) {
    const featuredList = document.getElementById("featured-list");
    featuredList.innerHTML = ""; // Clear existing content

    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.innerHTML = `
         <img src="${product.image}" alt="${product.name}">

            <h3>${product.name}</h3>
            
             <p>
                            <span class="mrp">₹${product.mrp}</span>
                            <span class="price">₹${product.price}</span>
                        </p>
            <button class="buy-now-btn" data-id="${product._id}">Buy Now</button>
             <button class="cart-btn" data-id="${product._id}">
                                <i class="fas fa-shopping-cart"></i> <!-- Font Awesome Cart Icon -->
                            </button>
        `;
        featuredList.appendChild(productCard);
    });
}document.addEventListener("DOMContentLoaded", () => {
    const images = document.querySelectorAll('.image-scrollbar'); // Target images in the scroller

    const handleScroll = () => {
        images.forEach(image => {
            const rect = image.getBoundingClientRect();
            const scrollThreshold = window.innerHeight * 0.6; // Adjust sensitivity dynamically (80% of the viewport height)

            // Check if the image enters or leaves the sensitive area
            if (rect.top < scrollThreshold && rect.bottom > 0) {
                image.style.transform = 'translateX(0)'; // Slide in
                image.style.opacity = '1'; // Fade in
            } else {
                image.style.transform = 'translateX(-100%)'; // Slide out
                image.style.opacity = '0'; // Fade out
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger on page load
});


document.addEventListener("DOMContentLoaded", () => {
    const testimonials = document.querySelectorAll('.testimonial');

    const handleScroll = () => {
        testimonials.forEach(testimonial => {
            const rect = testimonial.getBoundingClientRect();
            const scrollThreshold = window.innerHeight * 0.6;
            if (rect.top < window.innerHeight && rect.bottom >= 0) {
                testimonial.style.transform = 'translateX(0)';
                testimonial.style.opacity = '1';
            } else {
                testimonial.style.transform = 'translateX(-100%)';
                testimonial.style.opacity = '0';
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger effect on page load
});



