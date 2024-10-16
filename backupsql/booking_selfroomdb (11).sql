-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 16, 2024 at 09:34 AM
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
(27, 'เทเวศร์01', 'คอม20 โปรเจค 2', 'ศูนย์เทเวศร์', '1727410741419.jpg'),
(28, 'พนิช01', 'คอม 18 โปรเจค 1', 'ศูนย์พณิชยการพระนคร', '1727410879993.jpg'),
(29, 'พระนครเหนือ01', 'คอม20 โปรเจค 2', 'ศูนย์พระนครเหนือ', '1727411018865.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `orderbooking`
--

CREATE TABLE `orderbooking` (
  `OrderBooking` int(11) NOT NULL,
  `RoomID` int(11) NOT NULL,
  `StartDate` date NOT NULL,
  `EndDate` date DEFAULT NULL,
  `Start` time NOT NULL,
  `End` time NOT NULL,
  `Status` enum('wait','booking','reject') NOT NULL DEFAULT 'wait',
  `Name` varchar(255) NOT NULL,
  `Phone` varchar(20) NOT NULL,
  `Reason` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orderbooking`
--

INSERT INTO `orderbooking` (`OrderBooking`, `RoomID`, `StartDate`, `EndDate`, `Start`, `End`, `Status`, `Name`, `Phone`, `Reason`) VALUES
(73, 28, '2024-10-19', '2024-10-20', '11:07:00', '12:07:00', 'booking', 'กก', '0854558634', 'dd'),
(76, 27, '2024-10-23', '2024-10-24', '12:01:00', '13:01:00', 'booking', 'กก', '0854558634', 'ก'),
(77, 27, '2024-10-23', '2024-10-24', '14:02:00', '15:02:00', 'booking', 'กก', 'ก', 'ก'),
(78, 27, '2024-10-20', '2024-10-21', '12:14:00', '13:14:00', 'booking', 'กก', '0854558634', 'd'),
(79, 29, '2024-11-01', '2024-11-16', '14:19:00', '16:19:00', 'booking', 'กก', 'd', 'd');

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
('056450201116-1', 73),
('056450201116-1', 76),
('056450201116-1', 77),
('056450201116-1', 78),
('056450201116-1', 79);

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
  MODIFY `RoomID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `orderbooking`
--
ALTER TABLE `orderbooking`
  MODIFY `OrderBooking` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;

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
