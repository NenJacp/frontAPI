const API_URL = 'https://backapi-29lg.onrender.com';

let token = '';

// Function to fetch and display orders
async function fetchOrders() {
    try {
        const response = await fetch(`${API_URL}/api/orders`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
            const orders = await response.json();
            displayOrders(orders);
        } else {
            const error = await response.json();
            alert(error.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
}

function displayOrders(orders) {
    const ordersContainer = document.getElementById('orders');
    ordersContainer.innerHTML = '';
    if (orders.length > 0) {
        const table = document.createElement('table');
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = '<th>ID</th><th>Detalles</th><th>Acciones</th>';
        table.appendChild(headerRow);

        orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.details}</td>
                <td>
                    <button onclick="updateOrder(${order.id})">Actualizar</button>
                    <button onclick="deleteOrder(${order.id})">Eliminar</button>
                </td>`;
            table.appendChild(row);
        });

        ordersContainer.appendChild(table);
    } else {
        ordersContainer.innerHTML = '<p>No hay órdenes disponibles.</p>';
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
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginBtn').addEventListener('click', login);
    document.getElementById('createOrderBtn').addEventListener('click', createOrder);
    document.getElementById('getOrdersBtn').addEventListener('click', fetchOrders);
    document.getElementById('logoutBtn').addEventListener('click', logout);
});

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            token = data.token;
            document.getElementById('currentSession').innerText = `Bienvenido, ${username}`;
            document.getElementById('sessionInfo').style.display = 'block';
            alert('Login exitoso!');
        } else {
            const error = await response.json();
            alert(error.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
}

async function createOrder() {
    const orderDetails = document.getElementById('orderDetails').value;

    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ details: orderDetails }),
        });

        if (response.ok) {
            alert('Orden creada exitosamente');
            document.getElementById('orderDetails').value = '';
            fetchOrders();
        } else {
            const error = await response.json();
            alert(error.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
}

function logout() {
    token = '';
    document.getElementById('sessionInfo').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    alert('Sesión cerrada');
}

// Estas funciones necesitan ser implementadas
function updateOrder(id) {
    // Implementar la lógica para actualizar una orden
    console.log('Actualizar orden:', id);
}

function deleteOrder(id) {
    // Implementar la lógica para eliminar una orden
    console.log('Eliminar orden:', id);
}
