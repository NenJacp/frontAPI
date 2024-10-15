
const API_URL = 'https://backapi-29lg.onrender.com/api';
let token = '';

function register() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.id) {
            alert('Usuario registrado con éxito. Por favor, inicie sesión.');
        } else {
            alert('Error en el registro: ' + data.error);
        }
    })
    .catch(error => console.error('Error:', error));
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    console.log('Attempting login for user:', username);

    fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            token = data.token;
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('registerForm').style.display = 'none';
            document.getElementById('orderManagement').style.display = 'block';
            alert('Inicio de sesión exitoso');
        } else {
            alert('Error en el inicio de sesión: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Login fetch error:', error);
        alert('Error en la conexión: ' + error.message);
    });
}

function getOrders() {
    console.log('Fetching orders...');
    fetch(`${API_URL}/orders`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const orderList = document.getElementById('orderList');
        orderList.innerHTML = '';
        data.forEach(order => {
            const orderDiv = document.createElement('div');
            orderDiv.className = 'order';
            orderDiv.innerHTML = `
                <p>ID: ${order.OrderID}</p>
                <p>Cliente: ${order.Client}</p>
                <p>Total: ${order.total}</p>
                <p>Estado: ${order.status}</p>
                <button onclick="deleteOrder(${order.OrderID})">Eliminar</button>
            `;
            orderList.appendChild(orderDiv);
        });
    })
    .catch(error => console.error('Error:', error));
}

function deleteOrder(id) {
    fetch(`${API_URL}/orders/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        getOrders();
    })
    .catch(error => console.error('Error:', error));
}

document.getElementById('addOrderForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const order = {
        Client: document.getElementById('client').value,
        Products: document.getElementById('products').value.split(','),
        total: parseFloat(document.getElementById('total').value),
        status: document.getElementById('status').value,
        delivery_time: document.getElementById('deliveryTime').value,
        order_date: document.getElementById('orderDate').value
    };

    fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(order)
    })
    .then(response => response.json())
    .then(data => {
        alert('Orden agregada con éxito');
        getOrders();
        this.reset();
    })
    .catch(error => console.error('Error:', error));
});

function getOrderById() {
    const orderId = document.getElementById('orderId').value;

    if (!orderId) {
        alert('Por favor, ingrese un ID válido.');
        return;
    }

    fetch(`${API_URL}/orders/${orderId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(order => {
        const orderList = document.getElementById('orderList');
        orderList.innerHTML = ''; // Limpiar resultados anteriores

        if (order.error) {
            alert('Orden no encontrada: ' + order.error);
        } else {
            const orderDiv = document.createElement('div');
            orderDiv.className = 'order';
            orderDiv.innerHTML = `
                <p>ID: ${order.OrderID}</p>
                <p>Cliente: ${order.Client}</p>
                <p>Productos: ${order.Products.join(', ')}</p>
                <p>Total: ${order.total}</p>
                <p>Estado: ${order.status}</p>
                <p>Hora de Entrega: ${order.delivery_time}</p>
                <p>Fecha de Orden: ${order.order_date}</p>
                <button onclick="deleteOrder(${order.OrderID})">Eliminar</button>
            `;
            orderList.appendChild(orderDiv);
        }
    })
    .catch(error => console.error('Error:', error));
}
