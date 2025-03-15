-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 15, 2025 at 05:45 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `minute-lotto`
--

-- --------------------------------------------------------

--
-- Table structure for table `bets`
--

CREATE TABLE `bets` (
  `bet_id` int(11) NOT NULL,
  `draw_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `numbers` varchar(50) NOT NULL,
  `bet_amount` decimal(10,2) NOT NULL,
  `draw_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` enum('pending','won','lost') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lotto_draws`
--

CREATE TABLE `lotto_draws` (
  `draw_id` int(11) NOT NULL,
  `draw_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `winning_numbers` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lotto_draws`
--

INSERT INTO `lotto_draws` (`draw_id`, `draw_time`, `winning_numbers`, `created_at`) VALUES
(1, '2025-03-14 20:45:32', '1, 6, 8, 12, 20, 33', '2025-03-15 04:45:32');

-- --------------------------------------------------------

--
-- Table structure for table `lotto_pot_money`
--

CREATE TABLE `lotto_pot_money` (
  `draw_id` int(11) NOT NULL,
  `talpak_money` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lotto_pot_money`
--

INSERT INTO `lotto_pot_money` (`draw_id`, `talpak_money`) VALUES
(51, 100),
(52, 200),
(55, 300),
(57, 100),
(59, 100),
(60, 100),
(61, 100),
(62, 200),
(64, 400),
(65, 600),
(82, 700),
(87, 800),
(103, 1100);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `balance` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `token` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `balance`, `created_at`, `token`) VALUES
(49, 'testuser', 'faborada@gmail.com', '0c2ea6d826dcb095efcb0cefa42b19186f9a50d745b934930ef929677313fede', 0.00, '2025-02-23 04:39:36', NULL),
(50, 'Nathaniel', 'faboradanathaniel@gmail.com', 'a8b391c2af2a0745fea87f3c79cec6e5ee8cb7cf4136e67c4adacce738e20a98', 12000.00, '2025-02-23 04:40:30', NULL),
(51, 'vip1', 'nathaniel@gmail.com', 'a8b391c2af2a0745fea87f3c79cec6e5ee8cb7cf4136e67c4adacce738e20a98', 10014500.00, '2025-02-23 06:08:16', NULL),
(52, 'naks', 'n@gmail.com', '8cd15782a994b4af12193a296beb9b766cd4257a59d0c0625f04ba316f9a4ac9', 8733.00, '2025-03-12 13:14:58', NULL),
(53, 'naku', 'nat@gmail.com', '069f2bd2754bb40e5c9c7375bfa22585da675f23f80f02cf63f8a43c33d7df63', 0.00, '2025-03-14 16:09:36', NULL),
(54, 'NIGS', 'LO@GMAIL.COM', 'b782e5a79e173446626a67f2826fce6da50cca3b4d4be36ccddd760f15cb3c92', 0.00, '2025-03-14 16:10:50', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bets`
--
ALTER TABLE `bets`
  ADD PRIMARY KEY (`bet_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `draw_id` (`draw_id`);

--
-- Indexes for table `lotto_draws`
--
ALTER TABLE `lotto_draws`
  ADD PRIMARY KEY (`draw_id`),
  ADD UNIQUE KEY `draw_time` (`draw_time`);

--
-- Indexes for table `lotto_pot_money`
--
ALTER TABLE `lotto_pot_money`
  ADD PRIMARY KEY (`draw_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bets`
--
ALTER TABLE `bets`
  MODIFY `bet_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lotto_draws`
--
ALTER TABLE `lotto_draws`
  MODIFY `draw_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bets`
--
ALTER TABLE `bets`
  ADD CONSTRAINT `bets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `draw_id` FOREIGN KEY (`draw_id`) REFERENCES `lotto_draws` (`draw_id`) ON DELETE CASCADE;

--
-- Constraints for table `lotto_pot_money`
--
ALTER TABLE `lotto_pot_money`
  ADD CONSTRAINT `fk_lotto_draws` FOREIGN KEY (`draw_id`) REFERENCES `lotto_draws` (`draw_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
