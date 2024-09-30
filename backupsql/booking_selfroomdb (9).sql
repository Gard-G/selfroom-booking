-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 27, 2024 at 06:03 AM
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
(17, 'พระนครเหนือ01', 'คอม11 โปรเจค 2', 'ศูนย์พระนครเหนือ', '1726728978084.jpg'),
(18, 'พนิช01', 'คอม 9 โปรเจค 1', 'ศูนย์พณิชยการพระนคร', '1726729035219.jpg'),
(19, 'โชติเวช01', 'คอม 10 โปรเจค 1', 'ศูนย์โชติเวช', '1726729063090.jpg'),
(20, 'เทเวศร์01', 'คอม10 โปรเจค2', 'ศูนย์เทเวศร์', '1727408629143.jpg'),
(21, 'เทเวศร์02', 'คอม10 โปรเจค2', 'ศูนย์เทเวศร์', '1727408958249.jpg'),
(23, 'พนิช02', 'คอม 10 โปรเจค 1	\r\n', 'ศูนย์พณิชยการพระนคร', '1727409342673.jpg');

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
(35, 18, '2024-09-28', '2024-09-28 10:40:00', '2024-09-28 11:40:00', 'booking', 'กก', '0854558634', 'dd');

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
('056450201116-1', 35);

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
  MODIFY `RoomID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `orderbooking`
--
ALTER TABLE `orderbooking`
  MODIFY `OrderBooking` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orderbooking`
--
ALTER TABLE `orderbooking`
  ADD CONSTRAINT `orderbooking_ibfk_1` FOREIGN KEY (`RoomID`) REFERENCES `listroom` (`RoomID`) ON DELETE CASCADE;

--
-- Constraints for table `userlistorder`
--
ALTER TABLE `userlistorder`
  ADD CONSTRAINT `userlistorder_ibfk_2` FOREIGN KEY (`OrderBooking`) REFERENCES `orderbooking` (`OrderBooking`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
