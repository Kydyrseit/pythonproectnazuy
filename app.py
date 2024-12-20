from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///orders.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Модель для заказов
class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

# Создание базы данных
with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/')
def main():
    return render_template('main.html')

@app.route('/')
def register():
    return render_template('register.html')


@app.route('/orders', methods=['GET', 'POST'])
def manage_orders():
    if request.method == 'POST':
        data = request.get_json()
        if not data or 'name' not in data or not data['name'].strip():
            return jsonify({'error': 'Название заказа обязательно'}), 400
        new_order = Order(name=data['name'].strip())
        db.session.add(new_order)
        db.session.commit()
        return jsonify({'message': 'Заказ добавлен'}), 201
    else:
        orders = Order.query.all()
        return jsonify([{'id': order.id, 'name': order.name} for order in orders])

@app.route('/orders/clear', methods=['DELETE'])
def clear_orders():
    try:
        db.session.query(Order).delete()  # Удаляем все записи из таблицы Order
        db.session.commit()
        return jsonify({'message': 'Список заказов очищен'}), 200
    except Exception as e:
        db.session.rollback()
        print(e)  # Логируем ошибку для отладки
        return jsonify({'error': 'Ошибка при очистке заказов'}), 500


if __name__ == '__main__':
    app.run(debug=True)
