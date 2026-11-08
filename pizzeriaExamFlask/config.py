class DevelopmentConfig:
    DEBUG = True
    MYSQL_HOST = 'localhost'
    MYSQL_USER = 'root'
    MYSQL_PASSWORD = ''  # Pon tu contraseña de MySQL si usas una
    MYSQL_DB = 'pizzeria'

config = {
    'development': DevelopmentConfig
}