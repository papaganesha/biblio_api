
# Biblio Api

Este trabalho consiste no 
desenvolvimento das APIs (APIs RESTful) com persistência da nossa 
aplicação Web. O objetivo deste trabalho é permitir os alunos aplicarem 
os conceitos e funcionalidades do REST e dos padrões vistos em aula. 
Nesse trabalho, a ideia é realizar o back-end do trabalho para 
futuramente unificar com o front-end.

*Tema escolhido: Biblioteca*
-

*Introdução*
-
Esse sistema consiste em ajudar os bibliotecários a terem um
controle das retiradas e devoluções dos livros de uma biblioteca.

*Problema*
-
Atualmente, a biblioteca alvo desse trabalho realiza os registros
de retirada e devolução através de papel, além do próprio controle
dos livros e de seus clientes. Esse controle manual dificulta a
busca por uma determinada informação e possui muitos
problemas de segurança: perder as informações do papel, algum
usuário ou cliente manipular o registro manualmente, etc.

*Objetivos*
-
O objetivo desse trabalho é realizar um sistema Web que
mantenha o controle dos livros de uma biblioteca, registrando
retiradas e devoluções de livros pelos seus clientes.

*Solução*
-
Funcionalidades realizadas pelo bibliotecário:
- Autenticação do usuário: usuário da biblioteca possui um
usuário e uma senha para realizar autenticação (já pré-definidos
no banco de dados).✅
- Cadastro de livros: anota-se para cada livro o ISBN, nome,
autor(es), editora e ano de publicação. Editora pode ser
relacionada como String. ✅
- Cadastro de autores: anota-se apenas o nome do autor e o país de
origem. ✅
- Cadastro de clientes: cliente contém como informação a
matrícula, o nome e telefone. ✅
- Retirada de livros: registra a retirada de livros de um cliente. Um
cliente pode retirar no máximo três livros e o livro deve estar
disponível na biblioteca. Essa funcionalidade calcula uma data
para entrega. ✅
- Devolução de livros: registra a devolução de livros de um cliente.
Durante a devolução, o livro torna-se disponível novamente na
biblioteca. Verifica se o livro está com atraso e calcula o número
de dias de atraso. ✅
- Buscas: buscar por livros disponíveis, livros de um autor, livros
por um determinado nome, etc ✅

*Tabela relação funcionalidades/método HTTP/URI/Descrição da funcionalidade*
-
| Operação | Método HTTP | URI | Descrição |
| --- | --- | --- | --- |
| Buscar livros disponíveis | GET | /api/v1/books | Buscar por todos os livros disponíveis.  |
| Buscar livros por parâmetros | GET | /api//v1/books | Buscar livros por parâmetros como nome do livro, nome do autor. |
| Buscar autores | GET | /api//v1/authors | Buscar todos os autores. |
| Inserir Estudantes | POST | /api//v1/students | Realiza a inserção de um Estudante. Anota-se matrícula, nome, senha e telefone como parâmetros. |
| Inserir Livros | POST | /api//v1/books | Realiza a inserção de um Livro. Anota-se para cada livro o ISBN, nome, autor(es), editora e ano de publicação. Editora pode ser relacionada como String |
| Inserir Autores | POST | /api//v1/authors | Realiza a inserção de um Autor. Anota-se apenas o nome do autor e o país de origem. |
| Autenticar Estudante | POST | /api//v1/auth | Realizar autenticação de Estudante com matricula e senha pré-definidos |
| Retirada de Livros | POST | /api//v1/withdraw | Registra a retirada de livros de um cliente. Um cliente pode retirar no máximo três livros e o livro deve estardisponível na biblioteca. Anota-se o nome do livro como parâmetro. |
| Retorno de Livros | POST | /api//v1/giveback | Registra a devolução de livros de um cliente. Anota-se nome do livro como parâmetro. |

