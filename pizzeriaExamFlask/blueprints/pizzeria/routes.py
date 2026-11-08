from flask import Blueprint, jsonify, request
from database import mysql

pizzeria_bp = Blueprint(
    'pizzeria',
    __name__,
    url_prefix='/api/pizzeria'
)

# 1. Registrar pedido completo con su detalle
@pizzeria_bp.route('/pedidos', methods=['POST'])
def registrar_pedido():
    datos = request.get_json(silent=True)
    if not datos or 'detalles' not in datos or not datos['detalles']:
        return jsonify({'mensaje': 'Faltan datos del pedido o detalle de pizzas', 'exito': False}), 400

    cursor = None
    try:
        cursor = mysql.connection.cursor()
        
        # Insertar encabezado del pedido
        sql_pedido = """
            INSERT INTO pedidos (nombre, direccion, telefono, fecha, total)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(sql_pedido, (
            datos['nombre'].strip(),
            datos['direccion'].strip(),
            datos['telefono'].strip(),
            datos['fecha'],
            datos['total']
        ))
        
        idpedido = cursor.lastrowid

        # Insertar desglose de pizzas (Tabla: detalle_pedidos, Columna: pedido_id)
        sql_detalle = """
            INSERT INTO detalle_pedidos (pedido_id, tamano, ingredientes, num_pizzas, subtotal)
            VALUES (%s, %s, %s, %s, %s)
        """
        for item in datos['detalles']:
            cursor.execute(sql_detalle, (
                idpedido,
                item['tamano'],
                item['ingredientes'],
                item['num_pizzas'],
                item['subtotal']
            ))

        mysql.connection.commit()
        return jsonify({
            'mensaje': f'Pedido #{idpedido} guardado correctamente',
            'idpedido': idpedido,
            'exito': True
        }), 201

    except Exception as ex:
        if mysql.connection:
            mysql.connection.rollback()
        return jsonify({'mensaje': f'Error al registrar pedido: {str(ex)}', 'exito': False}), 500
    finally:
        if cursor is not None:
            cursor.close()

# 2. Consultar ventas acumuladas por día (Devolviendo 'id')
@pizzeria_bp.route('/ventas/dia/<string:param_dia>', methods=['GET'])
def ventas_por_dia(param_dia):
    cursor = None
    try:
        cursor = mysql.connection.cursor()
        
        dias_map = {
            'domingo': 1, 'lunes': 2, 'martes': 3, 'miercoles': 4,
            'miércoles': 4, 'jueves': 5, 'viernes': 6, 'sabado': 7, 'sábado': 7
        }
        
        param_lower = param_dia.lower().strip()
        
        if param_lower in dias_map:
            num_dia = dias_map[param_lower]
            sql = "SELECT id, nombre, total, fecha FROM pedidos WHERE DAYOFWEEK(fecha) = %s"
            cursor.execute(sql, (num_dia,))
        else:
            sql = "SELECT id, nombre, total, fecha FROM pedidos WHERE fecha = %s"
            cursor.execute(sql, (param_dia,))

        datos = cursor.fetchall()
        ventas = []
        total_acumulado = 0.0

        for fila in datos:
            monto = float(fila[2])
            ventas.append({
                'id': fila[0],          # <-- Estandarizado a 'id'
                'nombre': fila[1],
                'total': monto,
                'fecha': str(fila[3])
            })
            total_acumulado += monto

        return jsonify({
            'ventas': ventas,
            'total_acumulado': total_acumulado,
            'exito': True
        }), 200

    except Exception as ex:
        return jsonify({'mensaje': f'Error al consultar ventas: {str(ex)}', 'exito': False}), 500
    finally:
        if cursor is not None:
            cursor.close()

# 3. Consultar ventas acumuladas por mes (Devolviendo 'id')
@pizzeria_bp.route('/ventas/mes/<string:param_mes>', methods=['GET'])
def ventas_por_mes(param_mes):
    cursor = None
    try:
        cursor = mysql.connection.cursor()
        
        meses_map = {
            'enero': 1, 'febrero': 2, 'marzo': 3, 'abril': 4,
            'mayo': 5, 'junio': 6, 'julio': 7, 'agosto': 8,
            'septiembre': 9, 'octubre': 10, 'noviembre': 11, 'diciembre': 12
        }
        
        param_lower = param_mes.lower().strip()
        num_mes = meses_map.get(param_lower, int(param_mes) if param_mes.isdigit() else 0)

        if num_mes < 1 or num_mes > 12:
            return jsonify({'mensaje': 'Mes no válido', 'exito': False}), 400

        sql = "SELECT id, nombre, total, fecha FROM pedidos WHERE MONTH(fecha) = %s"
        cursor.execute(sql, (num_mes,))
        datos = cursor.fetchall()

        ventas = []
        total_acumulado = 0.0

        for fila in datos:
            monto = float(fila[2])
            ventas.append({
                'id': fila[0],          # <-- Estandarizado a 'id'
                'nombre': fila[1],
                'total': monto,
                'fecha': str(fila[3])
            })
            total_acumulado += monto

        return jsonify({
            'ventas': ventas,
            'total_acumulado': total_acumulado,
            'exito': True
        }), 200

    except Exception as ex:
        return jsonify({'mensaje': f'Error al consultar ventas por mes: {str(ex)}', 'exito': False}), 500
    finally:
        if cursor is not None:
            cursor.close()

# 4. Obtener detalle de pizzas por id
@pizzeria_bp.route('/pedidos/<int:idpedido>', methods=['GET'])
def obtener_detalle_pedido(idpedido):
    cursor = None
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT tamano, ingredientes, num_pizzas, subtotal FROM detalle_pedidos WHERE pedido_id = %s", (idpedido,))
        filas = cursor.fetchall()

        detalles = []
        for fila in filas:
            detalles.append({
                'tamano': fila[0],
                'ingredientes': fila[1],
                'num_pizzas': fila[2],
                'subtotal': float(fila[3])
            })

        return jsonify({'detalles': detalles, 'exito': True}), 200
    except Exception as ex:
        return jsonify({'mensaje': str(ex), 'exito': False}), 500
    finally:
        if cursor is not None:
            cursor.close()