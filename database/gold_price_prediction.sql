-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 09, 2024 at 11:09 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gold_price_prediction`
--

-- --------------------------------------------------------

--
-- Table structure for table `goldpredictions`
--

CREATE TABLE `goldpredictions` (
  `id` int(11) NOT NULL,
  `openPrice` float DEFAULT NULL,
  `highPrice` float DEFAULT NULL,
  `lowPrice` float DEFAULT NULL,
  `volume` int(11) DEFAULT NULL,
  `pricePredicted` float DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `goldpredictions`
--

INSERT INTO `goldpredictions` (`id`, `openPrice`, `highPrice`, `lowPrice`, `volume`, `pricePredicted`, `userId`, `date`) VALUES
(1, 289.7, 289.5, 280, 8763, 283.7, 1, '2024-08-08 05:45:45'),
(2, 60, 75, 45, 12, 257.9, 1, '2024-08-08 14:41:52'),
(3, 289.5, 289.5, 280, 12, 283.7, 1, '2024-08-08 14:44:55'),
(4, 60, 70, 55, 34, 257.9, 1, '2024-08-08 14:46:24'),
(5, 600, 70, 550, 34, 527.8, 1, '2024-08-08 14:47:16'),
(6, 109, 115, 110, 983, 257.9, 1, '2024-08-09 02:57:22'),
(7, 109, 115, 110, 983, 257.9, 1, '2024-08-09 05:20:45'),
(8, 208, 190, 180, 73, 257.9, 3, '2024-08-09 05:23:32');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(250) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `email` varchar(250) NOT NULL,
  `password` varchar(250) NOT NULL,
  `userRole` varchar(10) NOT NULL DEFAULT '''User''',
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `gender`, `email`, `password`, `userRole`, `date`) VALUES
(1, 'Shaciye', 'Male', 'shaciye@gmail.com', 'admin', 'User', '2024-08-08 01:46:13'),
(2, 'Asad Magan', 'Male', 'asad@gmail.com', 'admin', 'Admin', '2024-08-08 02:03:51'),
(3, 'Xaawo kiin', 'Female', 'xaawo@gmail.com', 'admin', 'User', '2024-08-09 09:05:22');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `goldpredictions`
--
ALTER TABLE `goldpredictions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `goldpredictions`
--
ALTER TABLE `goldpredictions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `goldpredictions`
--
ALTER TABLE `goldpredictions`
  ADD CONSTRAINT `goldpredictions_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
