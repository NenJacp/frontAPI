const API_URL = 'https://your-api-url.onrender.com/api';

// Function to fetch and display orders
async function fetchOrders() {
    try {
        const response = await fetch(`${API_URL}/orders`);
        const orders = await response.json();
        const orderList = document.getElementById('orders');
        orderList.innerHTML = '';
        orders.forEach(order => {
            const li = document.createElement('li');
            li.textContent = `Order #${order.OrderID}: ${order.Client} - Total: $${order.total}`;
            orderList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
}

// Function to add a new order
async function addOrder(event) {
    event.preventDefault();
    const form = event.target;
    const client = form.client.value;
    const product = form.product.value;
    const quantity = parseInt(form.quantity.value);
    const unitPrice = parseFloat(form['unit-price'].value);

    const newOrder = {
        Client: client,
        Products: [
            {
                product_name: product,
                quantity: quantity,
                unit_price: unitPrice
            }
        ],
        total: quantity * unitPrice,
        status: "Pendiente",
        delivery_time: "12:00 PM",
        order_date: new Date().toLocaleDateString()
    };

    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newOrder),
        });

        if (response.ok) {
            form.reset();
            fetchOrders();
        } else {
            console.error('Error adding order:', await response.text());
        }
    } catch (error) {
        console.error('Error adding order:', error);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', fetchOrders);
document.getElementById('new-order-form').addEventListener('submit', addOrder);