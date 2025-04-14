document.getElementById('trackBtn').addEventListener('click', async () => {
    const email = document.getElementById('trackEmail').value.trim();
    const phone = document.getElementById('trackPhone').value.trim();
    const orderId = document.getElementById('trackOrderId').value.trim();
    const resultBox = document.querySelector('.result-box');
    const errorBox = document.getElementById('errorMessage');
    
    resultBox.innerHTML = '';
    errorBox.textContent = '';

    if (!email || !phone) {
        errorBox.textContent = 'Email and Phone are required.';
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/orders/track-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, phone, orderId })
        });

        const data = await response.json();

        if (!response.ok) {
            errorBox.textContent = data.message || 'Something went wrong.';
            return;
        }

        if (!data.orders || data.orders.length === 0) {
            errorBox.textContent = 'No orders found.';
            return;
        }
        
        // Inject latest order status into .order-status section
        const latestOrder = data.orders[0];
        document.getElementById('order-status-text').innerHTML = `
            <strong>Status:</strong> ${latestOrder.orderStatus} <br>
            <strong>Payment:</strong> ${latestOrder.paymentStatus} <br>
            <strong>Method:</strong> ${latestOrder.paymentMethod} <br>
            <strong>Total:</strong> ₹${latestOrder.totalPrice}
        `;
        
        // Show all orders in resultBox
        data.orders.forEach(order => {
            const items = order.orderItems.map(prod => `
                <li>
                    <strong>${prod.name}</strong> — Qty: ${prod.quantity}
                </li>
            `).join('');
        
            const orderHtml = `
                <div class="order-block">
                   <strong>Order ID:</strong> ${latestOrder.orderId || latestOrder._id} <br> <!-- Show user-friendly Order ID -->
                    <p><strong>Tracking ID:</strong> ${order.trackingId || "N/A"}</p> <!-- Show Tracking ID -->
                    <p><strong>Courier Partner:</strong> ${order.courierPartner || "N/A"}</p> <!-- Show Courier Partner -->
                    <p><strong>Name:</strong> ${order.name}</p>
                    <p><strong>Email:</strong> ${order.email}</p>
                    <p><strong>Phone:</strong> ${order.phone}</p>
                    <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
                    <p><strong>Shipping Address:</strong> 
                        ${order.shippingAddress.street}, 
                        ${order.shippingAddress.city}, 
                        ${order.shippingAddress.state}, 
                        ${order.shippingAddress.zipcode}, 
                        ${order.shippingAddress.country}
                    </p>
                    <p><strong>Items:</strong></p>
                    <ul>${items}</ul>
                </div>
            `;
        
            resultBox.innerHTML += orderHtml;
        });
        

    } catch (err) {
        console.error('Track Order Error:', err);
        errorBox.textContent = 'Failed to connect to server.';
    }
});
