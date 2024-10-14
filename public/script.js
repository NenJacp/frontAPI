let token = '';

document.getElementById('loginBtn').addEventListener('click', login);
document.getElementById('createOrderBtn').addEventListener('click', createOrder);
document.getElementById('getOrdersBtn').addEventListener('click', getOrders);
document.getElementById('logoutBtn').addEventListener('click', logout);

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
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
        const response = await fetch('http://localhost:3000/api/orders', {
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
        } else {
            const error = await response.json();
            alert(error.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
}

async function getOrders() {
    try {
        const response = await fetch('http://localhost:3000/api/orders', {
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

async function updateOrder(orderId) {
    const newDetails = prompt("Ingrese nuevos detalles para la orden:");
    if (newDetails) {
        try {
            const response = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ details: newDetails }),
            });

            if (response.ok) {
                alert('Orden actualizada exitosamente');
                getOrders();
            } else {
                const error = await response.json();
                alert(error.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión');
        }
    }
}

async function deleteOrder(orderId) {
    if (confirm("¿Estás seguro de que quieres eliminar esta orden?")) {
        try {
            const response = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.ok) {
                alert('Orden eliminada exitosamente');
                getOrders();
            } else {
                const error = await response.json();
                alert(error.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión');
        }
    }
}

function logout() {
    token = '';
    document.getElementById('sessionInfo').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    alert('Sesión cerrada');
}

window.updateOrder = updateOrder;
window.deleteOrder = deleteOrder;

