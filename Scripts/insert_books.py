# INSERIR LIVROS NO BANCO DE DADOS
# CARREGAR CSV
# EXTRAIR DADOS DO CSV
# CONECTAR COM BANCO
# INSERIR LIVROS NO BANCO

import pandas as pd
import mysql.connector
from numpy import random
from datetime import datetime

config = {
    'user': 'root',
    'password': '',
    'host': '127.0.0.1',
    'database': 'biblioteca_api',
    'raise_on_warnings': True
}


def insert_books(books_nbr):
    cnx = mysql.connector.connect(**config)

    cursor = cnx.cursor()

    books = pd.read_csv('./dados/books.csv', sep=",")

    booksDf = pd.DataFrame(books)

    # REMOVER NULOS
    booksDf.dropna(inplace=True)


    count = 0
    countAdded = 0

    # ENQUANTO COUNT FOR MENOR QUE O NUMERO DE LIVROS A SEREM INSERIDOS
    while (count < books_nbr):
        # EXTRAI LINHA DO DATAFRAME
        lin = booksDf.iloc[count]

        add_book = ("INSERT INTO BOOKS (ISBN, NAME, AUTHOR, PUBLISHER, PUBLI_DATE, STOCK, IMG_URL, CREATEDAT, UPDATEDAT) VALUES (%s, %s, %s, %s, %s, %s, %s, now(), now())")

        # INSERIR NO BANCO AQUI 
        # print(book['TITULO'])
        title = lin.title
        isbn = lin.isbn
        author = lin.writer
        publisher = lin.editorial
        publi_date = lin.date_edition
        img_url = lin.image
        stock = random.randint(1, 9)
        data_book = (isbn, title, author, publisher, publi_date, stock, img_url)
        
        try:
            cursor.execute(add_book, data_book)
        except Exception as e:
            print(e)
            countAdded -= 1
            
        countAdded += 1        

        count +=1

    print(f"{countAdded} novos livros inseridos")

    cnx.commit()

    cursor.close()

    cnx.close()


insert_books(1200)
