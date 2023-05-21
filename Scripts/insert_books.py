# INSERIR LIVROS NO BANCO DE DADOS
# CONECTAR COM BANCO
# CARREGAR CSV
# EXTRAIR DADOS DO CSV
# INSERIR LIVROS NO BANCO

import pandas as pd
import mysql.connector
from numpy import random
from datetime import datetime
import uuid

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
    countAddedBook = 0
    countAddedAuthor = 0

    # ENQUANTO COUNT FOR MENOR QUE O NUMERO DE LIVROS A SEREM INSERIDOS
    while (count < books_nbr):
        # EXTRAI LINHA DO DATAFRAME
        lin = booksDf.iloc[count]

        add_book = ("INSERT INTO BOOKS (ISBN, NAME, AUTHOR, PUBLISHER, PUBLI_DATE, STOCK, IMG_URL, CREATEDAT, UPDATEDAT) VALUES (%s, %s, %s, %s, %s, %s, %s, now(), now())")
        add_author = ("INSERT INTO AUTHORS(AUTHOR_ID, NAME, COUNTRY, CREATEDAT, UPDATEDAT) VALUES(%s, %s, %s, now(), now())")

        # INSERIR NO BANCO AQUI 
        # print(book['TITULO'])
        title = lin.title
        isbn = lin.isbn
        author = lin.writer
        publisher = lin.editorial
        publi_date = lin.date_edition
        img_url = lin.image
        #INSERT 2 TO 9 BOOKS
        stock = random.randint(2, 9)
        data_book = (isbn, title, author, publisher, publi_date, stock, img_url)
        data_author = (str(uuid.uuid4()), author, 'Brazil')

        
        try:
            cursor.execute(add_book, data_book)
        except Exception as e:
            print(e)
            countAddedBook -= 1
        finally:
            countAddedBook += 1 
        
        try:
            cursor.execute(add_author, data_author)
        except Exception as e:
            print(e)
            countAddedAuthor -= 1
        finally:
            countAddedAuthor += 1       


        count +=1

    print(f"{countAddedBook} novos livros inseridos")
    print(f"{countAddedAuthor} novos autores inseridos")


    cnx.commit()

    cursor.close()

    cnx.close()


insert_books(1200)
