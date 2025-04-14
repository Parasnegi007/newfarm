function updateCartCount() {
    const cartCountElement = document.getElementById("cart-count");
    if (!cartCountElement) return;

    const token = localStorage.getItem("authToken");

    if (token) {
        fetch("http://localhost:5000/api/users/cart", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => response.json())
        .then(cart => {
            const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountElement.textContent = totalQuantity || "";
        })
        .catch(error => console.error("❌ Error fetching cart count:", error));
    } else {
        const cart = JSON.parse(localStorage.getItem("guestCart")) || [];
        const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalQuantity || "";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const sideMenu = document.getElementById("side-menu");

    // Toggle the side menu on button click
    if (menuToggle && sideMenu) {
        menuToggle.addEventListener("click", (event) => {
            sideMenu.classList.toggle("active");
            event.stopPropagation(); // Prevent click propagation to the document
        });

        // Close the menu when clicking anywhere outside the menu
        document.addEventListener("click", (event) => {
            if (!sideMenu.contains(event.target) && !menuToggle.contains(event.target)) {
                sideMenu.classList.remove("active");
            }
        });
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const dashboardContainer = document.querySelector(".dashboard-container");

    // Function to check screen size and toggle visibility
    const toggleDashboardVisibility = () => {
        if (window.innerWidth <= 1024) {
            // Hide dashboard-container in mobile mode
            dashboardContainer.style.display = "none";
        } else {
            // Show dashboard-container in desktop mode
            dashboardContainer.style.display = "flex";
        }
    };

    // Run the function on page load
    toggleDashboardVisibility();

    // Run the function when resizing the browser window
    window.addEventListener("resize", toggleDashboardVisibility);
});
document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".nav-links nav ul li a");
    const header = document.querySelector("header"); // Replace with your header's selector

    // Apply scroll-based color change
    window.addEventListener("scroll", () => {
        const scrollPosition = window.scrollY;
        const headerHeight = header.offsetHeight;

        navLinks.forEach(link => {
            if (scrollPosition > headerHeight) {
                link.style.color = "#333"; // Dark text for better readability on white background
                link.addEventListener("mouseenter", () => {
                    link.style.color = "#b10707"; // Hover effect: gold color
                });
                link.addEventListener("mouseleave", () => {
                    link.style.color = "#333"; // Revert to dark color
                });
            } else {
                link.style.color = "#FFFFFF"; // White text for frosted glass background
                link.addEventListener("mouseenter", () => {
                    link.style.color = "#b10707"; // Hover effect: gold color
                });
                link.addEventListener("mouseleave", () => {
                    link.style.color = "#FFFFFF"; // Revert to white color
                });
            }
        });
    });
});
// ✅ Call on page load
document.addEventListener("DOMContentLoaded", updateCartCount);
