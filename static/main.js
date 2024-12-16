document.addEventListener('DOMContentLoaded', function() {
    const orderList = document.getElementById('order-list');
    const orderForm = document.getElementById('order-form');
    const orderName = document.getElementById('order-name');

    // Загрузка существующих заказов
    fetch('/orders')
        .then(response => response.json())
        .then(data => {
            data.forEach(order => {
                const li = document.createElement('li');
                li.textContent = order.name;
                orderList.appendChild(li);
            });
        });

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
        });
    });
});

