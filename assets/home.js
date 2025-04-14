document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("DOMContentLoaded", updateCartCount);
    const countdownDate = new Date("April 30, 2025 23:59:59").getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = countdownDate - now;
    
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
        document.getElementById("days").textContent = days;
        document.getElementById("hours").textContent = hours;
        document.getElementById("minutes").textContent = minutes;
        document.getElementById("seconds").textContent = seconds;
    
        if (distance < 0) {
            clearInterval(timerInterval);
            document.getElementById("countdown-timer").innerHTML = "Sale Ended!";
        }
    }
    
    const timerInterval = setInterval(updateCountdown, 1000);
    updateCountdown();
    
    
    // Hero Background Sliding Effect
    const hero = document.querySelector(".hero");
    const images = ["assets/images/bg.jpg", "assets/images/IMG_0036.jpg", "assets/images/IMG_0019-2.jpg", "assets/images/IMG_0036.jpg", "assets/images/str.jpg",  "assets/images/IMG_0021-2.jpg",  "assets/images/IMG_0124.jpg" ];
    let index = 0;

    function slideImages() {
        hero.style.backgroundImage = `url(${images[index]})`;
        hero.style.transition = "background 1.5s ease-in-out"; // Smooth transition effect
        index = (index + 1) % images.length;
    }

    setInterval(slideImages, 4000); // Change background every 4 seconds
    slideImages(); // Ensure first image loads immediately

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
});
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
            <p>₹${product.price}</p>
            <button onclick="addToCart('${product._id}')">Add to Cart</button>
        `;
        featuredList.appendChild(productCard);
    });
}
document.addEventListener("DOMContentLoaded", () => {
    const imageScroller = document.querySelector(".image-scrollbar");

    window.addEventListener("scroll", () => {
        const scrollPosition = window.scrollY;
        const scrollerOffset = imageScroller.offsetTop;

        // Trigger the sliding effect when scroller enters the viewport
        if (scrollPosition + window.innerHeight > scrollerOffset + 100) {
            imageScroller.classList.add("slide-in");
        } else {
            imageScroller.classList.remove("slide-in"); // Reset when scrolled away
        }
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const testimonials = document.querySelectorAll('.testimonial');

    const handleScroll = () => {
        testimonials.forEach(testimonial => {
            const rect = testimonial.getBoundingClientRect();
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



