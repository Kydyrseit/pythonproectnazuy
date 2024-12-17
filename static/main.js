document.addEventListener('DOMContentLoaded', function() {
    const orderList = document.getElementById('order-list');
    const orderForm = document.getElementById('order-form');
    const orderName = document.getElementById('order-name');
    const registrationSection = document.getElementById('registration-section');
    const orderSection = document.getElementById('order-section');
    const errorMessage = document.getElementById('error-message');
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');

    // Проверяем, есть ли пользователь в localStorage
    if (!localStorage.getItem('user')) {
        showRegistrationSection();  // Если нет, показываем экран регистрации
    } else {
        showOrderSection();  // Если да, показываем экран добавления заказов
    }

    // Форма регистрации
    document.getElementById('registration-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const username = usernameField.value;
        const password = passwordField.value;

        if (username && password) {
            // Сохраняем данные пользователя в localStorage
            localStorage.setItem('user', JSON.stringify({ username, password }));

            // Переключаем на экран добавления заказов
            showOrderSection();
        } else {
            errorMessage.style.display = 'block';
        }
    });

    function showRegistrationSection() {
        registrationSection.style.display = 'block';
        orderSection.style.display = 'none';
    }

    function showOrderSection() {
        registrationSection.style.display = 'none';
        orderSection.style.display = 'block';
        loadOrders();  // Загружаем заказы
    }

    // Загрузка существующих заказов
    function loadOrders() {
        fetch('/orders')
            .then(response => response.json())
            .then(data => {
                orderList.innerHTML = '';  // Очищаем список перед добавлением
                data.forEach(order => {
                    const li = document.createElement('li');
                    li.textContent = order.name;
                    orderList.appendChild(li);
                });
            })
            .catch(error => console.error('Ошибка при загрузке заказов:', error));
    }

    // Добавление нового заказа
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newOrder = { name: orderName.value };

        fetch('/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newOrder)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    alert(error.error || 'Ошибка при добавлении заказа');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                const li = document.createElement('li');
                li.textContent = newOrder.name;
                orderList.appendChild(li);
                orderName.value = '';
            }
        })
        .catch(error => console.error('Ошибка при добавлении заказа:', error));
    });

    // Очистка списка заказов
    document.getElementById('clear-orders').addEventListener('click', function() {
        if (confirm('Вы уверены, что хотите очистить список заказов?')) {
            fetch('/orders/clear', { method: 'DELETE' })
                .then(response => response.json())
                .then(data => {
                    if (data.message) {
                        alert(data.message);
                        orderList.innerHTML = ''; // Очищаем список на странице
                    } else {
                        alert(data.error || 'Ошибка при очистке заказов');
                    }
                })
                .catch(error => console.error('Ошибка:', error));
        }
    });
});
