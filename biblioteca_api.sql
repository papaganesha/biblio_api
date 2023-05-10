-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Tempo de geração: 04/05/2023 às 20:39
-- Versão do servidor: 8.0.31
-- Versão do PHP: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `biblioteca_api`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `authors`
--

DROP TABLE IF EXISTS `authors`;
CREATE TABLE IF NOT EXISTS `authors` (
  `name` varchar(200) NOT NULL,
  `country` text NOT NULL,
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `authors`
--

INSERT INTO `authors` (`name`, `country`) VALUES
('Joao Pedro', 'Brasil');

--
-- Acionadores `authors`
--
DROP TRIGGER IF EXISTS `Tgr_after_update_log`;
DELIMITER $$
CREATE TRIGGER `Tgr_after_update_log` AFTER UPDATE ON `authors` FOR EACH ROW BEGIN

INSERT into log_updates(table_name, field_name, old_value, new_value) values('TESTE','TESTE','TESTE','TESTE');

END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `books`
--

DROP TABLE IF EXISTS `books`;
CREATE TABLE IF NOT EXISTS `books` (
  `isbn` bigint NOT NULL,
  `name` text NOT NULL,
  `author` text NOT NULL,
  `publisher` date NOT NULL,
  `publi_date` date NOT NULL,
  `last_update` date DEFAULT NULL,
  PRIMARY KEY (`isbn`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `clients`
--

DROP TABLE IF EXISTS `clients`;
CREATE TABLE IF NOT EXISTS `clients` (
  `registration` varchar(200) NOT NULL,
  `name` text NOT NULL,
  `phone` text NOT NULL,
  PRIMARY KEY (`registration`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `log_updates`
--

DROP TABLE IF EXISTS `log_updates`;
CREATE TABLE IF NOT EXISTS `log_updates` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `table_name` text NOT NULL,
  `field_name` text NOT NULL,
  `old_value` text NOT NULL,
  `new_value` text NOT NULL,
  PRIMARY KEY (`log_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `log_updates`
--

INSERT INTO `log_updates` (`log_id`, `table_name`, `field_name`, `old_value`, `new_value`) VALUES
(1, 'TESTE', 'TESTE', 'TESTE', 'TESTE');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
