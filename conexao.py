import mysql.connector
from mysql.connector import Error

def criar_conexao():
    try:
        conexao = mysql.connector.connect(
            host='localhost',
            database='fav_mimos',
            user='root',      # Altere para o seu usuário do MySQL
            password=''       # Altere para a sua senha do MySQL
        )
        if conexao.is_connected():
            print("Conexão bem-sucedida ao banco de dados MySQL!")
            return conexao
    except Error as e:
        print(f"Erro ao conectar ao MySQL: {e}")
    return None

def inicializar_banco():
    conexao = criar_conexao()
    if conexao:
        cursor = conexao.cursor()
        
        # Criação da tabela de produtos
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS produtos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(150) NOT NULL,
                categoria VARCHAR(50) NOT NULL,
                preco DECIMAL(10, 2) NOT NULL,
                imagem TEXT
            )
        """)
        
        print("Tabela 'produtos' verificada/criada com sucesso.")
        cursor.close()
        conexao.close()

if __name__ == "__main__":
    inicializar_banco()