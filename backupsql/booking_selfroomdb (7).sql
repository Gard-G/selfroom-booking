-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 19, 2024 at 09:00 AM
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
(14, 'เทเวศร์01', 'คอม 10 โปรเจค 2', 'ศูนย์เทเวศร์', '1726728825664.jpg'),
(17, 'พระนครเหนือ01', 'คอม11 โปรเจค 2', 'ศูนย์พระนครเหนือ', '1726728978084.jpg'),
(18, 'พนิช01', 'คอม 9 โปรเจค 1', 'ศูนย์พณิชยการพระนคร', '1726729035219.jpg'),
(19, 'โชติเวช01', 'คอม 10 โปรเจค 1', 'ศูนย์โชติเวช', '1726729063090.jpg');

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
(34, 14, '2024-09-25', '2024-09-25 14:00:00', '2024-09-25 15:00:00', 'booking', 'กก', '0854558634', 'ทำงาน');

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
('056450201116-1', 34);

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
  MODIFY `RoomID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `orderbooking`
--
ALTER TABLE `orderbooking`
  MODIFY `OrderBooking` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

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
