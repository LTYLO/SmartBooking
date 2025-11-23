# SmartBooking
SmartBooking es implementada como una aplicación web accesible desde navegadores modernos. Usa una base de datos relacional para guardar información acerca de los usuarios, las reservaciones y los espacios. La arquitectura del sistema es modular y escalable, asegurando eficiencia, confiabilidad y fácil mantenimiento.


¿Que debo hacer?
instalar con estos comandos
pip install -r requirements.txt
npm install


npm i --legacy-peer-deps



# 1. Detén el servidor si está corriendo (Ctrl+C)

# 2. Elimina la base de datos
del db.sqlite3

# 4. Crea las migraciones desde cero
python manage.py makemigrations

# 5. Aplica las migraciones
python manage.py migrate

# 6. Inicia el servidor
python manage.py runserver


http://127.0.0.1:8000/admin/