const API_URL = 'https://backapi-29lg.onrender.com/api';

let token = '';

async function fetchOrders() {
    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
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
        headerRow.innerHTML = '<th>ID</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Acciones</th>';
        table.appendChild(headerRow);

        orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.OrderID}</td>
                <td>${order.Client}</td>
                <td>${order.total}</td>
                <td>${order.status}</td>
                <td>
                    <button onclick="updateOrder(${order.OrderID})">Actualizar</button>
                    <button onclick="deleteOrder(${order.OrderID})">Eliminar</button>
                </td>`;
            table.appendChild(row);
        });

        ordersContainer.appendChild(table);
    } else {
        ordersContainer.innerHTML = '<p>No hay órdenes disponibles.</p>';
    }
}

async function createOrder() {
    const orderDetails = document.getElementById('orderDetails').value;
    const [client, productName, quantity, unitPrice] = orderDetails.split(',');

    const newOrder = {
        Client: client.trim(),
        Products: [
            {
                product_name: productName.trim(),
                quantity: parseInt(quantity),
                unit_price: parseFloat(unitPrice)
            }
        ],
        total: parseInt(quantity) * parseFloat(unitPrice),
        status: "Pendiente",
        delivery_time: "12:00 PM",
        order_date: new Date().toLocaleDateString()
    };

    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newOrder),
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

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
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
            fetchOrders();
        } else {
            const error = await response.json();
            alert(error.error);
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
    document.getElementById('orders').innerHTML = '';
    alert('Sesión cerrada');
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginBtn').addEventListener('click', login);
    document.getElementById('createOrderBtn').addEventListener('click', createOrder);
    document.getElementById('getOrdersBtn').addEventListener('click', fetchOrders);
    document.getElementById('logoutBtn').addEventListener('click', logout);
});

// Estas funciones necesitan ser implementadas
function updateOrder(id) {
    // Implementar la lógica para actualizar una orden
    console.log('Actualizar orden:', id);
}

function deleteOrder(id) {
    // Implementar la lógica para eliminar una orden
    console.log('Eliminar orden:', id);
}