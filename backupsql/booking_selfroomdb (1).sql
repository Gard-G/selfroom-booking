-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 20, 2024 at 10:56 AM
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
-- Table structure for table `listroom`
--

CREATE TABLE `listroom` (
  `RoomID` int(11) NOT NULL,
  `RoomName` varchar(255) NOT NULL,
  `RoomCenter` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `listroom`
--

INSERT INTO `listroom` (`RoomID`, `RoomName`, `RoomCenter`) VALUES
(1, 'เทเวศร์01', 'ศูนย์เทเวศร์'),
(2, 'พณิชยการ01', 'ศูนย์พณิชยการพระนคร'),
(3, 'พระนครเหนือ01', 'ศูนย์พระนครเหนือ'),
(4, 'โชติเวช01', 'ศูนย์โชติเวช'),
(5, 'TW02', 'ศูนย์เทเวศร์');

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
(5, 2, '2024-08-02', '2024-08-02 14:30:00', '2024-08-02 15:45:00', 'wait', 'dd', '084851561', 'work');

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
(2, 'user1', '$2b$10$wdo5iSz2QmdroL4RO9cQnedxbbh2DHXL/ePGALmY8N1ySU3BpQs6C', 'user'),
(3, 'user2', '$2b$10$pHC1yDdJ2o.GY/Vlf0K.ceAV1EBt5ac8Jsfl4kUmxO/fIrFWTkAIG', 'user');

-- --------------------------------------------------------

--
-- Table structure for table `userlistorder`
--

CREATE TABLE `userlistorder` (
  `UserID` int(11) NOT NULL,
  `OrderBooking` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `userlistorder`
--

INSERT INTO `userlistorder` (`UserID`, `OrderBooking`) VALUES
(1, 1),
(1, 3),
(1, 5),
(2, 2),
(2, 4);

--
-- Indexes for dumped tables
--

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
  MODIFY `RoomID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `orderbooking`
--
ALTER TABLE `orderbooking`
  MODIFY `OrderBooking` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
  ADD CONSTRAINT `userlistorder_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`),
  ADD CONSTRAINT `userlistorder_ibfk_2` FOREIGN KEY (`OrderBooking`) REFERENCES `orderbooking` (`OrderBooking`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
