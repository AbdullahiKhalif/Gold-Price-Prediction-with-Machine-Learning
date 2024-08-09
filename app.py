import joblib
import numpy as np
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import mysql.connector
import re
from flask_cors import CORS
import logging

app = Flask(__name__)

# Load the saved model
model = joblib.load('model/decision_tree_regression_model.joblib')

app.secret_key = "your_secret_key"  # Change this to a random string

# MySQL configurations
mysql_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'gold_price_prediction'
}

mysql_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'gold_price_prediction'
}


def get_db_connection():
    connection = mysql.connector.connect(**mysql_config)
    return connection


@app.route('/')
def index():
    if 'username' not in session:
        return redirect(url_for('login'))
    return render_template('dashboard.html' if session.get('userRole') == 'Admin' else 'index.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user and (user['password'], password):
            session['username'] = user['name']
            session['id'] = user['id']
            session['userRole'] = user['userRole']
            return redirect(url_for('dashboard')) if user['userRole'] == 'Admin' else redirect(url_for('index'))
        else:
            return jsonify(error='Invalid email or password')

    return render_template('login.html')


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        gender = request.form['gender']
        password = request.form['password']
        userRole = 'User'  # Default role

        # Check if the name is valid
        if not is_valid_name(name):
            return render_template('signup.html', error='Invalid name. Please enter a valid name.')

        # Check if email already exists
        conn = mysql.connector.connect(**mysql_config)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        if user:
            cursor.close()
            conn.close()
            return render_template('signup.html', error='Email already exists')

        # Insert user into database
        cursor.execute("INSERT INTO users (name, gender, email, password, userRole) VALUES (%s, %s, %s, %s, %s)",
                       (name, gender, email, password, userRole))
        conn.commit()
        cursor.close()
        conn.close()

        return redirect(url_for('login'))
    return render_template('signup.html')


def is_valid_name(name):
    # Add your validation logic here, for example:
    # Name should contain only alphabets and spaces
    return bool(re.match("^[a-zA-Z ]+$", name))


@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))


@app.route('/predict', methods=['POST'])
def predict():
    if 'id' not in session:
        return jsonify({'error': 'You are not logged in'}), 401

    data = request.get_json()
    if not data or 'features' not in data:
        return jsonify({'error': 'Invalid data received'}), 400

    features = np.array([data['features']])
    prediction = model.predict(features)

    try:
        conn = mysql.connector.connect(**mysql_config)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO goldpredictions (openPrice, highPrice, lowPrice, volume, pricePredicted, userId) VALUES (%s, %s, %s, %s, %s, %s)",
            (float(data['features'][0]), float(data['features'][1]), float(data['features'][2]),
             int(data['features'][3]), float(prediction[0]), session['id'])
        )
        conn.commit()
    except mysql.connector.Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

    return jsonify({'prediction': float(prediction[0])})


@app.route('/dashboard')
def dashboard():
    if 'username' not in session:
        return redirect(url_for('dashboard'))
    return render_template('dashboard.html')


from datetime import datetime, timedelta


@app.route('/dashboard_data')
def dashboard_data():
    conn = mysql.connector.connect(**mysql_config)
    cursor = conn.cursor(dictionary=True)

    # Total users
    cursor.execute("SELECT COUNT(*) AS total_users FROM users")
    total_users = cursor.fetchone()['total_users']

    # Total admin
    cursor.execute("SELECT COUNT(*) AS total_admins FROM users WHERE userRole = 'Admin'")
    total_admins = cursor.fetchone()['total_admins']

    # Total predictions
    cursor.execute("SELECT COUNT(*) AS total_predictions FROM goldPredictions")
    total_predictions = cursor.fetchone()['total_predictions']

    # Today predictions
    cursor.execute("SELECT COUNT(*) AS today_predictions FROM goldPredictions WHERE DATE(date) = CURDATE()")
    today_predictions = cursor.fetchone()['today_predictions']

    # Weekly predictions
    cursor.execute("SELECT COUNT(*) AS week_predictions FROM goldPredictions WHERE date >= CURDATE() - INTERVAL 7 DAY")
    week_predictions = cursor.fetchone()['week_predictions']

    # Total predicted price today
    cursor.execute(
        "SELECT COALESCE(SUM(pricePredicted), 0) AS sum_today_predictions FROM goldPredictions WHERE DATE(date) = CURDATE()")
    sum_today_predictions = cursor.fetchone()['sum_today_predictions']

    # Gender distribution
    cursor.execute("SELECT gender, COUNT(*) AS count FROM users GROUP BY gender")
    gender_distribution = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify({
        'total_users': total_users,
        'total_admins': total_admins,
        'total_predictions': total_predictions,
        'today_predictions': today_predictions,
        'week_predictions': week_predictions,
        'sum_today_predictions': sum_today_predictions,
        'gender_distribution': gender_distribution
    })


@app.route('/users')
def users():
    if 'username' not in session:
        return redirect(url_for('login'))
    return render_template('users.html')


@app.route('/get_users', methods=['GET'])
def get_users():
    if 'username' not in session:
        return jsonify({'error': 'User not logged in'}), 403

    conn = mysql.connector.connect(**mysql_config)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(users)


@app.route('/get_user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    if 'username' not in session:
        return jsonify({'error': 'User not logged in'}), 403

    conn = mysql.connector.connect(**mysql_config)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify(user)


def is_valid_username(username):
    # Allow letters, numbers, underscores, and hyphens
    return re.match("^[a-zA-Z-]+$", username)


@app.route('/add_user', methods=['POST'])
def add_user():
    if 'username' not in session:
        return jsonify({'error': 'User not logged in'}), 403

    try:
        data = request.form
        username = data['name']
        gender = data['gender']
        email = data['email']
        password = data['password']
        userRole = data['userRole']

        # Check if username is valid
        if not is_valid_name(username):
            return jsonify(
                {'error': 'Invalid username. Only letters, numbers, underscores, and hyphens are allowed.'}), 400

        conn = mysql.connector.connect(**mysql_config)
        cursor = conn.cursor(dictionary=True)

        # Check if email already exists
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({'error': 'Email already exists'}), 400

        # Insert new user into the database
        cursor.execute("INSERT INTO users (name, gender, userRole,email, password) VALUES (%s, %s, %s, %s, %s)",
                       (username, gender, userRole, email, password))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': 'User added successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/edit_user/<int:user_id>', methods=['POST'])
def edit_user(user_id):
    if 'username' not in session:
        return jsonify({'error': 'User not logged in'}), 403

    logging.debug(f"Received request to edit user with ID: {user_id}")

    try:
        data = request.form
        username = data['name']
        gender = data['gender']
        email = data['email']
        password = data['password']
        roll = data['userRole']

        # Check if username is valid
        if not is_valid_name(username):
            return jsonify(
                {'error': 'Invalid username. Only letters, numbers, underscores, and hyphens are allowed.'}), 400

        conn = mysql.connector.connect(**mysql_config)
        cursor = conn.cursor(dictionary=True)

        # Check if email already exists for other users
        cursor.execute("SELECT * FROM users WHERE email = %s AND id != %s", (email, user_id))
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({'error': 'Email already exists for another user'}), 400

        # Update user in the database
        cursor.execute("UPDATE users SET name = %s, gender = %s, userRole = %s, email = %s , password = %s WHERE id = "
                       "%s",
                       (username, gender, roll, email, password, user_id))
        conn.commit()
        cursor.close()
        conn.close()

        logging.debug(f"User with ID: {user_id} updated successfully")
        return jsonify({'message': 'User updated successfully'})
    except Exception as e:
        logging.error(f"Error updating user with ID: {user_id} - {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/delete_user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    if 'username' not in session:
        return jsonify({'error': 'User not logged in'}), 403

    conn = mysql.connector.connect(**mysql_config)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'message': 'User deleted successfully'})


@app.route('/reports')
def reports():
    if 'username' not in session:
        return redirect(url_for('login'))  # Redirect to login if user is not logged in
    return render_template('reports.html')


@app.route('/reports_data')
def reports_data():
    conn = mysql.connector.connect(**mysql_config)
    cursor = conn.cursor(dictionary=True)

    queries = {
        'all_predictions': """
            SELECT goldPredictions.date, users.name, goldPredictions.openPrice, goldPredictions.highPrice,
            goldPredictions.lowPrice, goldPredictions.volume, goldPredictions.pricePredicted
            FROM goldPredictions
            JOIN users ON goldPredictions.userId = users.id
            ORDER BY goldPredictions.date DESC
        """,
        'today_predictions': """
            SELECT goldPredictions.date, users.name, goldPredictions.openPrice, goldPredictions.highPrice,
            goldPredictions.lowPrice, goldPredictions.volume, goldPredictions.pricePredicted
            FROM goldPredictions
            JOIN users ON goldPredictions.userId = users.id
            WHERE DATE(goldPredictions.date) = CURDATE()
            ORDER BY goldPredictions.date DESC
        """,
        'weekly_predictions': """
            SELECT goldPredictions.date, users.name, goldPredictions.openPrice, goldPredictions.highPrice,
            goldPredictions.lowPrice, goldPredictions.volume, goldPredictions.pricePredicted
            FROM goldPredictions
            JOIN users ON goldPredictions.userId = users.id
            WHERE goldPredictions.date >= CURDATE() - INTERVAL 7 DAY
            ORDER BY goldPredictions.date DESC
        """,
        'monthly_predictions': """
            SELECT goldPredictions.date, users.name, goldPredictions.openPrice, goldPredictions.highPrice,
            goldPredictions.lowPrice, goldPredictions.volume, goldPredictions.pricePredicted
            FROM goldPredictions
            JOIN users ON goldPredictions.userId = users.id
            WHERE goldPredictions.date >= CURDATE() - INTERVAL 30 DAY
            ORDER BY goldPredictions.date DESC
        """
    }

    results = {}
    try:
        for key, query in queries.items():
            cursor.execute(query)
            results[key] = cursor.fetchall()
    finally:
        cursor.close()
        conn.close()

        # Ensure you are returning JSON if this is an AJAX call
    return jsonify(results)



if __name__ == '__main__':
    app.run(debug=True)
