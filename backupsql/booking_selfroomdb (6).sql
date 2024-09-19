-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 19, 2024 at 08:49 AM
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
-- Database: `booking_selfroomdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `adminlist`
--

CREATE TABLE `adminlist` (
  `Username` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `adminlist`
--

INSERT INTO `adminlist` (`Username`) VALUES
('056450201116-1');

-- --------------------------------------------------------

--
-- Table structure for table `listroom`
--

CREATE TABLE `listroom` (
  `RoomID` int(11) NOT NULL,
  `RoomName` varchar(255) NOT NULL,
  `DetailRoom` varchar(255) NOT NULL,
  `RoomCenter` varchar(255) NOT NULL,
  `Image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `listroom`
--

INSERT INTO `listroom` (`RoomID`, `RoomName`, `DetailRoom`, `RoomCenter`, `Image`) VALUES
(1, 'เทเวศร์01', 'คอม9เครื่อง,โปรเจคเตอร์2', 'ศูนย์เทเวศร์', NULL),
(2, 'พณิชยการ01', 'คอม11เครื่อง,โปรเจคเตอร์2', 'ศูนย์พณิชยการพระนคร', NULL),
(3, 'พระนครเหนือ01', 'คอม11เครื่อง,โปรเจคเตอร์2', 'ศูนย์พระนครเหนือ', NULL),
(4, 'โชติเวช01', 'คอม11เครื่อง,โปรเจคเตอร์2', 'ศูนย์โชติเวช', NULL),
(5, 'TW02', 'คอม9เครื่อง,โปรเจคเตอร์1', 'ศูนย์เทเวศร์', NULL),
(6, 'โชติเวช02', 'คอม11เครื่อง,โปรเจคเตอร์2', 'ศูนย์โชติเวช', NULL),
(7, 'พระนครเหนือ02', 'คอม12เครื่อง,โปรเจคเตอร์2\n', 'ศูนย์พระนครเหนือ', NULL),
(8, 'โชติเวช03', 'dd', 'ศูนย์โชติเวช', NULL),
(12, 'dd', 'dd', 'ศูนย์พณิชยการพระนคร', '1726213902182.jpg'),
(13, 'พระนครเหนือ03', 'กก', 'ศูนย์พระนครเหนือ', '1726215359949.png');

-- --------------------------------------------------------

--
-- Table structure for table `orderbooking`
--

CREATE TABLE `orderbooking` (
  `OrderBooking` int(11) NOT NULL,
  `RoomID` int(11) NOT NULL,
  `Date` date NOT NULL,
  `Start` datetime NOT NULL,
  `End` datetime NOT NULL,
  `Status` enum('wait','booking','reject') NOT NULL DEFAULT 'wait',
  `Name` varchar(255) NOT NULL,
  `Phone` varchar(20) NOT NULL,
  `Reason` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orderbooking`
--

INSERT INTO `orderbooking` (`OrderBooking`, `RoomID`, `Date`, `Start`, `End`, `Status`, `Name`, `Phone`, `Reason`) VALUES
(1, 1, '2024-08-15', '2024-08-14 09:00:00', '2024-08-14 10:00:00', 'booking', 'John Doe', '1234567890', 'Meeting'),
(2, 2, '2024-08-15', '2024-08-14 11:00:00', '2024-08-14 12:00:00', 'booking', 'Jane Smith', '0987654321', 'Workshop'),
(3, 2, '2024-08-16', '2024-08-16 09:45:00', '2024-08-16 11:00:00', 'wait', 'ddd', '09558484', 'work'),
(4, 1, '2024-08-16', '2024-08-16 23:00:00', '2024-08-16 00:00:00', 'wait', 'จี', '0486489898', 'work'),
(5, 2, '2024-08-02', '2024-08-02 14:30:00', '2024-08-02 15:45:00', 'wait', 'dd', '084851561', 'work'),
(6, 3, '2024-08-22', '2024-08-22 12:00:00', '2024-08-22 15:00:00', 'booking', 'g', '0854558634', 'work'),
(7, 1, '2024-08-23', '2024-08-23 13:00:00', '2024-08-23 15:00:00', 'booking', 'tt', '0998974', 'test'),
(8, 3, '2024-09-18', '2024-09-18 13:00:00', '2024-09-18 15:00:00', 'booking', 'g', '0854558634', 'test'),
(9, 2, '2024-08-24', '2024-08-24 16:29:00', '2024-08-24 17:29:00', 'wait', 'g', '0854558634', 'gg'),
(10, 6, '2024-08-27', '2024-08-27 11:44:00', '2024-08-27 12:44:00', 'booking', 'g', '0854558634', 'work'),
(14, 2, '2024-08-31', '2024-08-31 14:19:00', '2024-08-31 15:19:00', 'booking', 'กก', '0854558634', 'w'),
(16, 3, '2024-09-13', '2024-09-13 09:03:00', '2024-09-13 22:03:00', 'booking', 'กก', '0854558634', 'wrok'),
(17, 1, '2024-09-12', '2024-09-12 10:20:00', '2024-09-12 12:20:00', 'booking', 'กก', '0854558634', 'work'),
(18, 5, '2024-09-07', '2024-09-07 14:28:00', '2024-09-07 15:28:00', 'wait', 'กก', '0854558634', 'ww'),
(19, 2, '2024-09-14', '2024-09-14 15:27:00', '2024-09-14 16:27:00', 'booking', 'กก', '0854558634', 'กก'),
(20, 4, '2024-09-20', '2024-09-20 15:09:00', '2024-09-20 16:09:00', 'wait', 'g', '0854558634', 'ss'),
(21, 1, '2024-09-24', '2024-09-24 15:15:00', '2024-09-24 17:15:00', 'reject', 'กก', '0854558634', 'หห'),
(22, 1, '2024-09-11', '2024-09-11 15:40:00', '2024-09-11 16:40:00', 'wait', 'ddd', '0854558634', 'dd'),
(23, 5, '2024-09-18', '2024-09-18 10:27:00', '2024-09-18 11:28:00', 'reject', 'กก', '0854558634', 'd'),
(24, 5, '2024-09-12', '2024-09-12 10:42:00', '2024-09-12 11:42:00', 'wait', 'กก', '0854558634', 'dd'),
(25, 5, '2024-09-12', '2024-09-12 10:42:00', '2024-09-12 11:42:00', 'wait', 'กก', '0854558634', 'dd'),
(26, 5, '2024-09-13', '2024-09-13 15:51:00', '2024-09-13 16:51:00', 'wait', 'กก', '0854558634', 'ก'),
(27, 5, '2024-09-14', '2024-09-14 15:58:00', '2024-09-14 16:58:00', 'wait', 'กก', '0854558634', 'กก'),
(28, 5, '2024-09-14', '2024-09-14 15:58:00', '2024-09-14 16:58:00', 'wait', 'กก', '0854558634', 'กก'),
(29, 5, '2024-09-14', '2024-09-14 15:58:00', '2024-09-14 16:58:00', 'wait', 'กก', '0854558634', 'กก'),
(30, 5, '2024-09-14', '2024-09-14 16:59:00', '2024-09-14 17:59:00', 'wait', 'กก', '0854558634', 'กก'),
(31, 5, '2024-09-14', '2024-09-14 16:59:00', '2024-09-14 17:59:00', 'wait', 'กก', '0854558634', 'กก'),
(32, 5, '2024-09-14', '2024-09-14 18:59:00', '2024-09-14 19:59:00', 'wait', 'กก', '0854558634', 'กก'),
(33, 5, '2024-09-18', '2024-09-18 10:27:00', '2024-09-18 13:00:00', 'wait', 'กก', '0854558634', 'กก');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `UserID` int(11) NOT NULL,
  `Username` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `IDstatus` enum('admin','user') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`UserID`, `Username`, `Password`, `IDstatus`) VALUES
(1, 'admin', 'admin', 'admin'),
(2, 'user1', 'u1', 'user'),
(3, 'user2', 'u2', 'user'),
(5, 'user3', 'u3', 'user'),
(6, 'user4', 'u4', 'user'),
(7, 'admin2', 'admin', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `userlistorder`
--

CREATE TABLE `userlistorder` (
  `UserID` varchar(255) NOT NULL,
  `OrderBooking` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `userlistorder`
--

INSERT INTO `userlistorder` (`UserID`, `OrderBooking`) VALUES
('056450201116-1', 14),
('056450201116-1', 16),
('056450201116-1', 17),
('056450201116-1', 18),
('056450201116-1', 19),
('056450201116-1', 20),
('056450201116-1', 21),
('056450201116-1', 22),
('056450201116-1', 23),
('056450201116-1', 24),
('056450201116-1', 25),
('056450201116-1', 26),
('056450201116-1', 27),
('056450201116-1', 28),
('056450201116-1', 29),
('056450201116-1', 30),
('056450201116-1', 31),
('056450201116-1', 32),
('056450201116-1', 33),
('1', 1),
('1', 3),
('1', 5),
('1', 6),
('1', 7),
('1', 8),
('1', 9),
('2', 2),
('2', 4),
('2', 10);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `adminlist`
--
ALTER TABLE `adminlist`
  ADD PRIMARY KEY (`Username`);

--
-- Indexes for table `listroom`
--
ALTER TABLE `listroom`
  ADD PRIMARY KEY (`RoomID`);

--
-- Indexes for table `orderbooking`
--
ALTER TABLE `orderbooking`
  ADD PRIMARY KEY (`OrderBooking`),
  ADD KEY `RoomID` (`RoomID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `Username` (`Username`);

--
-- Indexes for table `userlistorder`
--
ALTER TABLE `userlistorder`
  ADD PRIMARY KEY (`UserID`,`OrderBooking`),
  ADD KEY `OrderBooking` (`OrderBooking`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `listroom`
--
ALTER TABLE `listroom`
  MODIFY `RoomID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `orderbooking`
--
ALTER TABLE `orderbooking`
  MODIFY `OrderBooking` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orderbooking`
--
ALTER TABLE `orderbooking`
  ADD CONSTRAINT `orderbooking_ibfk_1` FOREIGN KEY (`RoomID`) REFERENCES `listroom` (`RoomID`);

--
-- Constraints for table `userlistorder`
--
ALTER TABLE `userlistorder`
  ADD CONSTRAINT `userlistorder_ibfk_2` FOREIGN KEY (`OrderBooking`) REFERENCES `orderbooking` (`OrderBooking`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
