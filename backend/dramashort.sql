-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jul 08, 2025 at 04:53 AM
-- Server version: 5.7.40
-- PHP Version: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dramashort_new`
--

-- --------------------------------------------------------

--
-- Table structure for table `about_us`
--

DROP TABLE IF EXISTS `about_us`;
CREATE TABLE IF NOT EXISTS `about_us` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `highlight` text,
  `mobile_number` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `official_website` varchar(255) DEFAULT NULL,
  `follow_us_on_instagram` varchar(255) DEFAULT NULL,
  `follow_us_in_facebook` varchar(255) DEFAULT NULL,
  `follow_us_in_youtube` varchar(255) DEFAULT NULL,
  `follow_us_in_whatsapp_channel` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `about_us`
--

INSERT INTO `about_us` (`id`, `highlight`, `mobile_number`, `email`, `official_website`, `follow_us_on_instagram`, `follow_us_in_facebook`, `follow_us_in_youtube`, `follow_us_in_whatsapp_channel`, `created_at`, `updated_at`) VALUES
(1, 'Movies, Reels, Originals, Trailers, Episodes, Shorts, Cast, Stories, Behind-the-Scenes, Genres, Reviews, Trending, Watchlist, Entertainment', '+12 (345) 567 890', 'info@dramashort.com', 'https://www.google.com/', 'https://www.google.com/', 'https://www.google.com/', 'https://www.google.com/', 'https://www.whatsapp.com/', '2025-03-21 11:12:32', '2025-07-04 09:50:28');

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
CREATE TABLE IF NOT EXISTS `admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `profile_image` text NOT NULL,
  `terms_and_conditions` longtext,
  `privacy_and_policy` longtext,
  `about_us` longtext,
  `login_type` enum('Admin','Guest') NOT NULL DEFAULT 'Guest',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updted_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `name`, `email`, `password`, `phone`, `profile_image`, `terms_and_conditions`, `privacy_and_policy`, `about_us`, `login_type`, `created_at`, `updted_at`) VALUES
(2, 'Admin', 'admin@gmail.com', '$2a$10$XJ.FCBoNxvCGxZYaLCDCQONcpn3gxCH2LufKG9rXHLVYsatWzY2uy', '9904428319', 'https://api-dramashort.ukosoft.store/uploads/profile/1746686620747-661287491.jpg', NULL, NULL, NULL, 'Admin', '2025-01-02 11:41:30', '2025-07-08 10:11:35');

-- --------------------------------------------------------

--
-- Table structure for table `advertisement`
--

DROP TABLE IF EXISTS `advertisement`;
CREATE TABLE IF NOT EXISTS `advertisement` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ad_platform_name` varchar(50) DEFAULT NULL,
  `ad_platform_image` varchar(255) DEFAULT NULL,
  `ad_publisher_id` varchar(255) DEFAULT NULL,
  `ad_banner_status` int(11) NOT NULL DEFAULT '0',
  `ad_banner_id` longtext,
  `ad_banner_remarks` text,
  `ad_interstitial_status` int(11) NOT NULL DEFAULT '0',
  `ad_interstitial_id` longtext,
  `ad_interstitial_clicks` int(11) NOT NULL DEFAULT '0',
  `ad_interstitial_remarks` text,
  `ad_native_status` int(11) NOT NULL DEFAULT '0',
  `ad_native_id` longtext,
  `ad_native_remarks` text,
  `ad_reward_status` int(11) NOT NULL DEFAULT '0',
  `ad_reward_id` longtext,
  `ad_reward_remarks` text,
  `status` int(11) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `advertisement`
--

INSERT INTO `advertisement` (`id`, `ad_platform_name`, `ad_platform_image`, `ad_publisher_id`, `ad_banner_status`, `ad_banner_id`, `ad_banner_remarks`, `ad_interstitial_status`, `ad_interstitial_id`, `ad_interstitial_clicks`, `ad_interstitial_remarks`, `ad_native_status`, `ad_native_id`, `ad_native_remarks`, `ad_reward_status`, `ad_reward_id`, `ad_reward_remarks`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Admob', 'https://api-dramashort.ukosoft.store/uploads/advertisement/1.png', 'pub-3940256099942544', 0, 'ca-app-pub-3940256099942544/6300978111|ca-app-pub-3940256099942544/6300978111|ca-app-pub-3940256099942544/6300978111', 'Testing', 0, 'ca-app-pub-3940256099942544/1033173712|ca-app-pub-3940256099942544/1033173712|ca-app-pub-3940256099942544/1033173712', 0, 'Testing', 0, NULL, 'Testing', 1, '/6499/example/rewarded', 'Testing', 1, '2025-05-23 11:14:56', '2025-06-25 18:22:22'),
(3, 'AppLovins', 'https://api-dramashort.ukosoft.store/uploads/advertisement/4.png', NULL, 0, NULL, NULL, 0, NULL, 0, NULL, 0, NULL, NULL, 1, '0ec4a62545a5ae26', 'Testing', 0, '2025-05-23 11:14:56', '2025-07-01 16:27:54');

-- --------------------------------------------------------

--
-- Table structure for table `app_data`
--

DROP TABLE IF EXISTS `app_data`;
CREATE TABLE IF NOT EXISTS `app_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `daily_watch_maximum_ads` int(11) DEFAULT NULL,
  `daily_watch_ads_for_minimum_coin` int(11) DEFAULT NULL,
  `daily_watch_ads_for_maximum_coin` int(11) DEFAULT NULL,
  `extra_daily` int(11) DEFAULT NULL,
  `watch_ads_for_episode` int(11) DEFAULT NULL,
  `how_many_episode_watch_after_ads` int(11) NOT NULL DEFAULT '3',
  `time_after_watch_ads` time DEFAULT NULL,
  `time_after_watch_daily_ads` time DEFAULT NULL,
  `time_between_daily_ads` time DEFAULT NULL,
  `per_episode_coin` int(11) DEFAULT NULL,
  `day_1_coin` int(11) DEFAULT NULL,
  `day_2_coin` int(11) DEFAULT NULL,
  `day_3_coin` int(11) DEFAULT NULL,
  `day_4_coin` int(11) DEFAULT NULL,
  `day_5_coin` int(11) DEFAULT NULL,
  `day_6_coin` int(11) DEFAULT NULL,
  `day_7_coin` int(11) DEFAULT NULL,
  `login_reward_coin` int(11) NOT NULL,
  `turn_on_notification_coin` int(11) NOT NULL,
  `bind_email_coin` int(11) DEFAULT NULL,
  `link_whatsapp_coin` int(11) DEFAULT NULL,
  `follow_us_on_facebook_coin` int(11) DEFAULT NULL,
  `follow_us_on_youtube_coin` int(11) DEFAULT NULL,
  `follow_us_on_instagram_coin` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `app_data`
--

INSERT INTO `app_data` (`id`, `daily_watch_maximum_ads`, `daily_watch_ads_for_minimum_coin`, `daily_watch_ads_for_maximum_coin`, `extra_daily`, `watch_ads_for_episode`, `how_many_episode_watch_after_ads`, `time_after_watch_ads`, `time_after_watch_daily_ads`, `time_between_daily_ads`, `per_episode_coin`, `day_1_coin`, `day_2_coin`, `day_3_coin`, `day_4_coin`, `day_5_coin`, `day_6_coin`, `day_7_coin`, `login_reward_coin`, `turn_on_notification_coin`, `bind_email_coin`, `link_whatsapp_coin`, `follow_us_on_facebook_coin`, `follow_us_on_youtube_coin`, `follow_us_on_instagram_coin`, `created_at`, `updated_at`) VALUES
(1, 6, 5, 20, 20, 3, 3, '00:01:00', '04:00:00', '00:00:30', 5, 10, 10, 20, 25, 30, 30, 50, 50, 30, 30, 30, 10, 10, 10, '2025-03-06 15:16:11', '2025-06-30 09:47:08');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `is_deleted` int(11) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 'ORIGINAL', 0, '2025-03-06 17:19:48', '2025-03-06 17:56:39'),
(2, 'ASIAN', 1, '2025-03-06 17:57:02', '2025-06-05 13:01:44'),
(3, 'MOVIES', 0, '2025-03-06 17:57:23', '2025-03-06 17:57:23'),
(4, 'TV SERIES', 0, '2025-03-06 17:57:42', '2025-03-06 17:57:42');

-- --------------------------------------------------------

--
-- Table structure for table `episode_unlocked`
--

DROP TABLE IF EXISTS `episode_unlocked`;
CREATE TABLE IF NOT EXISTS `episode_unlocked` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `series_id` int(11) NOT NULL,
  `episode_id` int(11) NOT NULL,
  `coin` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `faqs`
--

DROP TABLE IF EXISTS `faqs`;
CREATE TABLE IF NOT EXISTS `faqs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question` text,
  `answer` longtext,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `languages`
--

DROP TABLE IF EXISTS `languages`;
CREATE TABLE IF NOT EXISTS `languages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `is_deleted` int(11) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `name` (`name`),
  KEY `is_deleted` (`is_deleted`)
) ENGINE=MyISAM AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `languages`
--

INSERT INTO `languages` (`id`, `name`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 'English', 1, '2025-03-06 17:35:44', '2025-06-05 15:09:17'),
(2, 'Español', 0, '2025-03-06 18:04:23', '2025-03-06 18:05:12'),
(3, 'Português', 0, '2025-03-06 18:06:12', '2025-03-06 18:08:43'),
(4, 'ภาษาไทย', 0, '2025-03-06 18:08:51', '2025-03-06 18:08:51'),
(5, 'Bahasa Indonesia', 0, '2025-03-06 18:08:56', '2025-03-06 18:08:56'),
(6, 'Deutsch', 0, '2025-03-06 18:09:02', '2025-03-06 18:09:02'),
(7, 'Français', 0, '2025-03-06 18:09:09', '2025-03-06 18:09:09'),
(8, 'हिंदी', 0, '2025-03-06 18:09:16', '2025-03-06 18:09:16'),
(9, 'हिंदी', 1, '2025-03-06 18:09:17', '2025-05-22 19:07:39'),
(10, 'Filipino', 0, '2025-03-06 18:09:25', '2025-03-06 18:09:25'),
(11, 'Türkçe', 0, '2025-03-06 18:09:31', '2025-03-06 18:09:31'),
(12, '日本語', 0, '2025-03-06 18:09:42', '2025-03-06 18:09:42'),
(13, '한국어', 0, '2025-03-06 18:09:59', '2025-03-06 18:10:50'),
(14, 'Русский', 0, '2025-03-06 18:11:00', '2025-03-06 18:11:00'),
(15, '繁體中文', 0, '2025-03-06 18:11:06', '2025-03-06 18:11:06'),
(16, 'ccdscsfsfsvbdf', 1, '2025-04-29 09:53:25', '2025-04-29 09:53:43'),
(17, 'sdsad', 0, '2025-06-03 15:23:45', '2025-06-03 15:23:45'),
(18, 'jksdsjdt Test', 1, '2025-07-02 15:53:43', '2025-07-02 15:57:00');

-- --------------------------------------------------------

--
-- Table structure for table `licenses`
--

DROP TABLE IF EXISTS `licenses`;
CREATE TABLE IF NOT EXISTS `licenses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `purchase_code` varchar(100) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `item_id` varchar(50) DEFAULT NULL,
  `ip` varchar(100) DEFAULT NULL,
  `referer` text,
  `install_path` text,
  `domain` varchar(255) DEFAULT NULL,
  `type` enum('user','admin') NOT NULL DEFAULT 'user',
  `verified_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `payment_getways`
--

DROP TABLE IF EXISTS `payment_getways`;
CREATE TABLE IF NOT EXISTS `payment_getways` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `api_id` varchar(255) DEFAULT NULL,
  `api_key` varchar(255) DEFAULT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `is_deleted` int(11) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `payment_getways`
--

INSERT INTO `payment_getways` (`id`, `name`, `api_id`, `api_key`, `is_active`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 'Stripe', 'pk_test_51Q8eYqRp4kvhA033wvi0XMf7XACo01a4fwvuQ5dAKnIdK8KPgdWx8KolwWIctZms3kbH06KB75jykzchtCYmKD0500fctnNdJM', 'sk_test_51Q8eYqRp4kvhA033c6gZYvDzL1TfnJsfvmE2KF2AZwmcGWaQuv1SqzvaCd18eDRYeNHQTrLzr6IfXcnA7cXcGN9y007JQNtj0Q', 1, 0, '2025-03-07 11:54:50', '2025-06-14 12:43:50'),
(2, 'Stripe', '123456', '123456', 1, 1, '2025-04-28 15:44:09', '2025-06-06 19:21:40'),
(4, 'RazorPay', 'rzp_test_j6zePuLJX5Jida', 'QWLDcDBwUZ4CDliQ2G1UFwSM', 1, 0, '2025-04-28 16:40:50', '2025-06-14 12:44:10');

-- --------------------------------------------------------

--
-- Table structure for table `plans`
--

DROP TABLE IF EXISTS `plans`;
CREATE TABLE IF NOT EXISTS `plans` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `is_unlimited` int(11) NOT NULL DEFAULT '0',
  `is_weekly` int(11) NOT NULL DEFAULT '0',
  `is_yearly` int(11) NOT NULL DEFAULT '0',
  `coin` varchar(50) DEFAULT NULL,
  `extra_coin` varchar(50) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `discount_percentage` decimal(10,0) DEFAULT NULL,
  `is_limited_time` int(11) NOT NULL DEFAULT '0',
  `description` longtext,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `is_deleted` int(11) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `plans`
--

INSERT INTO `plans` (`id`, `name`, `is_unlimited`, `is_weekly`, `is_yearly`, `coin`, `extra_coin`, `amount`, `discount_percentage`, `is_limited_time`, `description`, `is_active`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 'Weekly VIP', 1, 1, 0, NULL, NULL, '100.00', NULL, 0, 'Unlock All Series for 7 Days', 1, 0, '2025-03-18 12:01:38', '2025-06-16 15:48:00'),
(2, 'Yearly VIP', 1, 0, 1, NULL, NULL, '1000.00', NULL, 0, 'Unlock All Series for 1 Year', 1, 0, '2025-03-18 12:04:07', '2025-06-14 18:46:41'),
(3, NULL, 0, 0, 0, '300', '300', '300.00', '100', 1, NULL, 1, 0, '2025-03-18 12:05:01', '2025-06-23 15:28:08'),
(4, NULL, 0, 0, 0, '500', '25', '500.00', '5', 0, NULL, 1, 0, '2025-03-18 12:35:29', '2025-06-09 16:38:06'),
(5, NULL, 0, 0, 0, '1000', '100', '1000.00', '10', 0, NULL, 1, 0, '2025-03-18 12:35:53', '2025-06-09 15:34:49'),
(6, NULL, 0, 0, 0, '1500', '300', '1500.00', '20', 0, NULL, 1, 0, '2025-03-18 12:43:15', '2025-06-05 15:05:19'),
(7, NULL, 0, 0, 0, '3000', '1500', '3000.00', '50', 0, NULL, 1, 0, '2025-03-18 12:43:51', '2025-03-18 12:43:51'),
(9, 'sdfsdf', 1, 1, 1, '500', '20', '1200.00', '400', 1, 'fsdf ', 1, 1, '2025-06-05 15:06:03', '2025-06-14 18:46:45');

-- --------------------------------------------------------

--
-- Table structure for table `report_reasons`
--

DROP TABLE IF EXISTS `report_reasons`;
CREATE TABLE IF NOT EXISTS `report_reasons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reason_title` varchar(255) NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `is_deleted` int(11) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `report_reasons`
--

INSERT INTO `report_reasons` (`id`, `reason_title`, `is_active`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 'Nudity or sexual activity', 1, 1, '2025-06-05 15:33:27', '2025-06-09 11:53:47'),
(2, 'Hate speech or symbols', 1, 1, '2025-06-05 15:33:36', '2025-06-09 12:03:50'),
(3, 'Violence or dangerous organization', 1, 1, '2025-06-05 15:33:43', '2025-06-09 11:40:39'),
(4, 'False information', 1, 1, '2025-06-05 15:33:50', '2025-06-09 11:40:01'),
(5, 'Bullying or harassm dsd s ', 1, 1, '2025-06-05 15:33:57', '2025-06-25 12:18:45'),
(6, 'Scam or fraud ', 1, 1, '2025-06-05 15:34:05', '2025-06-25 12:18:38'),
(7, 'Intellectual property violation', 1, 1, '2025-06-05 15:34:13', '2025-06-09 11:36:58'),
(8, 'Copyright Infringement', 1, 1, '2025-06-05 15:34:20', '2025-06-09 11:23:42'),
(9, 'It\'s Spam', 1, 1, '2025-06-05 15:34:29', '2025-06-09 11:37:40'),
(10, 'Violence or dangerous organization', 1, 0, '2025-06-05 15:34:36', '2025-06-25 12:19:25'),
(11, 'fsdffsdfsdfsdf   dd df f', 1, 1, '2025-06-09 12:05:26', '2025-06-25 12:18:34'),
(12, 'Nudity or sexual activity', 1, 0, '2025-06-09 15:01:09', '2025-06-25 12:19:17'),
(13, 'Hate speech or symbols', 1, 0, '2025-06-25 12:19:31', NULL),
(14, 'False information	', 1, 0, '2025-06-25 12:20:47', NULL),
(15, 'Bullying or harassment', 1, 0, '2025-06-25 12:20:53', '2025-06-25 12:21:00'),
(16, 'Scam or fraud', 1, 0, '2025-06-25 12:21:09', NULL),
(17, 'Intellectual property violation', 1, 0, '2025-06-25 12:21:17', NULL),
(18, 'Copyright Infringement', 1, 0, '2025-06-25 12:21:24', NULL),
(19, 'It\'s Spam', 1, 0, '2025-06-25 12:21:32', NULL),
(20, 'Violence or Graphic Content', 1, 0, '2025-06-25 12:21:45', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `reward_history`
--

DROP TABLE IF EXISTS `reward_history`;
CREATE TABLE IF NOT EXISTS `reward_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `title` varchar(50) DEFAULT NULL,
  `coin` int(11) DEFAULT NULL,
  `expired` date DEFAULT NULL,
  `is_expired` int(11) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `series`
--

DROP TABLE IF EXISTS `series`;
CREATE TABLE IF NOT EXISTS `series` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `description` longtext,
  `thumbnail` varchar(255) DEFAULT NULL,
  `poster` varchar(255) DEFAULT NULL,
  `cover_video` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `type_id` int(11) DEFAULT NULL,
  `tag_id` varchar(255) DEFAULT NULL,
  `total_episode` int(11) DEFAULT NULL,
  `free_episodes` int(11) DEFAULT NULL,
  `is_free` tinyint(1) DEFAULT '0',
  `views` int(11) DEFAULT '0',
  `likes` int(11) NOT NULL DEFAULT '0',
  `favourites` int(11) NOT NULL DEFAULT '0',
  `is_recommended` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_deleted` int(11) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `tag_id` (`tag_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `series_episodes`
--

DROP TABLE IF EXISTS `series_episodes`;
CREATE TABLE IF NOT EXISTS `series_episodes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `series_id` int(11) DEFAULT NULL,
  `episode_number` int(11) DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `title` text,
  `description` longtext,
  `tags` varchar(255) DEFAULT NULL,
  `coin` int(11) DEFAULT NULL,
  `is_deleted` int(11) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `series_id` (`series_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `site_settings`
--

DROP TABLE IF EXISTS `site_settings`;
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `logo` text NOT NULL,
  `favicon` text NOT NULL,
  `firebase_json` longtext,
  `copyright_text` text,
  `is_admin_maintenance` int(11) NOT NULL DEFAULT '0',
  `is_website_maintenance` int(11) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `site_settings`
--

INSERT INTO `site_settings` (`id`, `title`, `logo`, `favicon`, `firebase_json`, `copyright_text`, `is_admin_maintenance`, `is_website_maintenance`, `created_at`, `updated_at`) VALUES
(1, 'DramaShort', 'https://api-dramashort.ukosoft.store/uploads/site/logo/1751287084046-259946505.png', 'https://api-dramashort.ukosoft.store/uploads/site/favicon/1751287084046-526230275.png', '{\"type\":\"service_account\",\"project_id\":\"storybox-abc06\",\"private_key_id\":\"e991ea8313823ce9ec2e12ea4feb1687a6f53707\",\"private_key\":\"-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCtZlYPZUZcckCe\\n3Jo29rIqCQSdD6sJ8VnAD8EMTZVFYpl3KeyFwqmIJ0XslSQAVDf0yoYKagOinY9R\\neX9rzv4+Hezi/5Ef+TeYohRVL676kBC7mu7DyKmKIn4AmSqtAaW3izNXKw+DeuWF\\nyNQAMITFtsjS9Wza2lCBaWK1JteEjzOGtiFaJTorMJlZdqCZG3qx4vqTf9L2L9IK\\nCa99bntyTXfOb8RBd5wHrqkXNv/MUOyRf4evSedHBLlGgWpfTPdwdJEWrQaynP+r\\nD3mRNVphfsQowY3S3k+uYWqcgbF/MO3KwTp/bYK7ZyLMJ8gLyDBOlScaPxE3xb7c\\n+7YSgTGDAgMBAAECggEAIz1kChbz+L/DgEWnFbqHNOHGTUEs6oVhTxYkjqKJzqMe\\nO0iK6BhKqgAJRu58dZCoGpi6Kw2mlXrd8Jn3mmpj4y3jwbJcxRm6AcwWw8VAE24J\\n6IaxNZrnUcp2vxphwO1Px4CDu5hlu7vTP6Az7aHuqdve7niwWb36lIJdbCFrtWWr\\nN3u93vzGviluW3Ev7TgSu3m71JZJKEDVp9xN5gHwKvUleI2CBDd+f1j98+pBw6oy\\nxvJs6ZNut/biRB2DwOn9gNf1NHhNOMe5EtvzRq/fdcETwmlN6urJfUarGEYaQQIN\\nygX2wNO9lXmZ+O4Uru4STzsbN3uQPE4vKS670tqr4QKBgQDeoaL0a5edIxofBZ6B\\nQ2Ohe+LLdqFQmd3HhIlJ1gHfOY6ejadxGzJe38HFtCKat27u209Xz9eOWFIUhQl4\\nAq0cFXq8dohGiTYHTueR5PIlJ/aG4LVQpEoo8XRYND7r/c22zVeBSpHBH/pcppwm\\nZTZ3i7gblrVrp34dxycC/t04UwKBgQDHY66lBxrQRmrFCmksdGnfBjWNzorxVJMf\\nvzjS78sOpO69ASSwOKK25xWrMAaK/HknL+O623/zMJgJqgry6TWT6lV+M4SSUaHT\\nnjxuFwfLRLVSOPpC58tw/HdvL7+PpaG+Vx7c/9ad0Gmm03P1gpyxLrPdn25b2tkQ\\nIp1YCU88EQKBgQC/z2MmUsx9hhCrSZwWoojkSGhOBBdX6jk5/OaLxuY1/NDzqffp\\naxUqyH2aaGioBAJ/qFPjxB5jdZTCORy/WQ7sc1UbqsQegXkbMtAw0qANgzDTZCbT\\nI7kBLYaft+O+Tx09sg0CR8zsJzD9Qk6mhe03chldK6uC5PuzjDIAUrUmIQKBgChP\\nBaKFMi2C3tjgxuxeyHx24+K8K6ioIWocnV8/bPyT6VO6ZHFfsb1qMB5AgkIc0l1S\\nuCYxc8d1PndNshLzhIpXqFrwDVALQrzmU28qJsA4LrPloupds+ouj/KhY4elw3IY\\naLvi2L9kv8cjHmE2u3iyaVhXf9cAAjvZ05dVongRAoGAMVBWD5neVXqi1QzcEBvl\\nnw5WbKnwDZJ1BVBrSs/NapTr9dgataPdrzGwymKR4Hage9r2R/1G/CABffmMdg+v\\nqXx6+YZUfoA+GWWcJKj+2tQPE+d2MBK6vXtmoLZWIlp9FvBBdVHJwcR24HlQ3Ze3\\nl2kIvcMLjq+Sre8DERrQVv4=\\n-----END PRIVATE KEY-----\\n\",\"client_email\":\"firebase-adminsdk-pyfdy@storybox-abc06.iam.gserviceaccount.com\",\"client_id\":\"110161512179759964335\",\"auth_uri\":\"https://accounts.google.com/o/oauth2/auth\",\"token_uri\":\"https://oauth2.googleapis.com/token\",\"auth_provider_x509_cert_url\":\"https://www.googleapis.com/oauth2/v1/certs\",\"client_x509_cert_url\":\"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-pyfdy%40storybox-abc06.iam.gserviceaccount.com\",\"universe_domain\":\"googleapis.com\"}', '© Copyright 2025, All Rights Reserved by UKOsoft', 0, 0, '2025-04-18 15:42:20', '2025-06-30 18:08:04');

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
CREATE TABLE IF NOT EXISTS `tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `is_deleted` int(11) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=216 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`id`, `name`, `is_deleted`, `created_at`) VALUES
(1, 'Campus Romance', 1, '2025-03-06 17:54:06'),
(2, 'Feel-Good', 0, '2025-03-06 17:58:22'),
(3, 'Contract Lovers', 0, '2025-03-06 17:58:36'),
(4, 'Taboo', 0, '2025-03-06 17:58:58'),
(5, 'Hidden Identity', 0, '2025-03-06 17:59:08'),
(6, 'Fated Lovers', 0, '2025-03-06 17:59:31'),
(7, 'All-Too-Late', 0, '2025-03-06 17:59:48'),
(8, 'Super Warrier', 0, '2025-03-06 18:00:06'),
(9, 'Rom-Com', 0, '2025-03-06 18:00:23'),
(10, 'Love After Marriage', 0, '2025-03-06 18:00:53'),
(11, 'Revenge', 0, '2025-03-06 18:01:06'),
(12, 'Tear-Jerker', 0, '2025-03-06 18:01:27'),
(13, 'Testing', 1, '2025-04-28 18:02:14'),
(14, 'Flash Marriage', 0, '2025-05-07 12:18:25'),
(15, 'Sweet Romance', 0, '2025-05-09 18:51:53'),
(16, 'Modern', 0, '2025-05-09 18:52:27'),
(17, 'Billionaire ', 0, '2025-05-09 18:52:45'),
(18, 'Suspense', 0, '2025-05-10 10:22:37'),
(19, 'Thriller', 0, '2025-05-10 10:22:50'),
(20, 'Affair', 0, '2025-05-10 10:22:59'),
(21, 'Young Adult', 0, '2025-05-10 10:23:10'),
(22, 'Forbidden', 0, '2025-05-10 10:23:21'),
(23, 'Surgeon', 0, '2025-05-10 10:23:29'),
(24, 'Soldier', 0, '2025-05-10 10:23:37'),
(25, 'Dark Romance', 0, '2025-05-10 10:23:47'),
(26, 'Server', 0, '2025-05-10 10:23:58'),
(27, 'Hidden Feelings', 0, '2025-05-10 10:24:08'),
(28, 'Modern', 1, '2025-05-10 10:24:17'),
(29, 'Business Owner', 0, '2025-05-10 10:24:26'),
(30, 'Dancer', 0, '2025-05-10 10:24:35'),
(31, 'Aaron Oberst', 0, '2025-05-10 10:24:46'),
(32, 'Jessica Jacoby', 0, '2025-05-10 10:24:57'),
(33, 'Original Japanese', 0, '2025-05-10 10:25:03'),
(34, 'Original Spanish', 0, '2025-05-10 10:25:10'),
(35, 'Podcast', 0, '2025-05-10 10:25:18'),
(36, 'Doctor', 0, '2025-05-10 10:28:07'),
(37, 'Evan Wick', 0, '2025-05-10 10:28:16'),
(38, 'Cowboy', 0, '2025-05-10 10:28:23'),
(39, 'Student', 0, '2025-05-10 10:28:29'),
(40, 'Playboy', 0, '2025-05-10 10:28:35'),
(41, 'First Love', 0, '2025-05-10 10:28:42'),
(42, 'Love at First Sight', 0, '2025-05-10 10:29:05'),
(43, 'Intense Sexual Tension', 0, '2025-05-10 10:29:14'),
(44, 'Single Mom', 0, '2025-05-10 10:29:26'),
(45, 'Single Dad', 0, '2025-05-10 10:29:39'),
(46, 'Love-Hate', 0, '2025-05-10 10:29:56'),
(47, 'Erotica', 0, '2025-05-10 10:30:06'),
(48, 'Reunion', 0, '2025-05-10 10:30:22'),
(49, 'Playing Dumb', 0, '2025-05-10 10:30:30'),
(50, 'Time Travel', 0, '2025-05-10 10:30:38'),
(51, 'Redemption', 0, '2025-05-10 10:30:47'),
(52, 'Prison', 0, '2025-05-10 10:31:03'),
(53, 'Harem', 0, '2025-05-10 10:31:11'),
(54, 'Immortal', 0, '2025-05-10 10:31:19'),
(55, 'Marshal/General', 0, '2025-05-10 10:31:32'),
(56, 'Female', 0, '2025-05-10 10:31:41'),
(57, 'Toxic', 0, '2025-05-10 10:31:48'),
(58, 'Ryan Watson Henderson', 0, '2025-05-10 10:32:00'),
(59, 'Brittany Marsicek', 0, '2025-05-10 10:32:08'),
(60, 'Alexandria Watts', 0, '2025-05-10 10:32:17'),
(61, 'BDSM', 0, '2025-05-10 10:32:27'),
(62, 'Innocent Damsel', 0, '2025-05-10 10:32:35'),
(63, 'Lauren Pence', 0, '2025-05-10 10:32:44'),
(64, 'Molly Jass', 0, '2025-05-10 10:32:55'),
(65, 'Jake Golden', 0, '2025-05-10 10:33:11'),
(66, 'Samantha Drews', 0, '2025-05-10 10:33:21'),
(67, 'Vampire', 0, '2025-05-10 10:33:37'),
(68, 'One Night Stand', 0, '2025-05-10 10:33:48'),
(69, 'Pregnancy', 0, '2025-05-10 10:33:58'),
(70, 'Childhood Sweetheart', 0, '2025-05-10 10:34:14'),
(71, 'Campus Romance', 0, '2025-05-10 10:34:20'),
(72, 'Second Chance', 0, '2025-05-10 10:34:29'),
(73, 'Reverse Harem', 0, '2025-05-10 10:34:39'),
(74, 'Julia Lynn Clarke', 0, '2025-05-10 10:34:49'),
(75, 'Period Drama', 0, '2025-05-10 10:35:00'),
(76, 'Britney Rae Carrera', 0, '2025-05-10 10:35:11'),
(77, 'Noah Fearnley', 0, '2025-05-10 10:35:22'),
(78, 'Seth Edeen', 0, '2025-05-10 10:35:30'),
(79, 'Dakota Kruz', 0, '2025-05-10 10:35:36'),
(80, 'Marc Herrmann', 0, '2025-05-10 10:35:44'),
(81, 'Jarred Harper', 0, '2025-05-10 10:35:51'),
(82, 'Payton Morelli', 0, '2025-05-10 10:35:59'),
(83, 'Maryana Dvorska', 0, '2025-05-10 10:36:05'),
(84, 'Alexandra Shydlovska', 1, '2025-05-10 10:36:13'),
(85, 'Amnesia', 0, '2025-05-10 10:36:24'),
(86, 'Heiress', 0, '2025-05-10 10:36:42'),
(87, 'Housewife', 0, '2025-05-10 10:36:50'),
(88, 'Samantha Binkerd', 0, '2025-05-10 10:36:58'),
(89, 'Ella Frazee', 0, '2025-05-10 10:37:04'),
(90, 'Male', 0, '2025-05-10 10:37:15'),
(91, 'Lorenzo Brunetti', 0, '2025-05-10 10:37:27'),
(92, 'Ethan Kirschbaum', 0, '2025-05-10 10:37:32'),
(93, 'Jordan Beltz', 0, '2025-05-10 10:37:40'),
(94, 'Addison Bowman', 0, '2025-05-10 10:37:48'),
(95, 'Avery Lynch', 0, '2025-05-10 10:37:55'),
(96, 'Independent Woman', 0, '2025-05-10 10:38:03'),
(97, 'Age Gap', 0, '2025-05-10 10:38:09'),
(98, 'Richard Sharrah', 0, '2025-05-10 10:38:17'),
(99, 'Douglas Jung', 0, '2025-05-10 10:38:24'),
(100, 'Rugged CEO', 0, '2025-05-10 10:38:31'),
(101, 'Heiress/Socialite', 0, '2025-05-10 10:38:42'),
(102, 'Ethan Vaughan', 0, '2025-05-10 10:38:51'),
(103, 'Strong Heroine', 0, '2025-05-10 10:38:58'),
(104, 'Kasey Esser', 0, '2025-05-10 10:39:04'),
(105, 'Grady Eldridge', 0, '2025-05-10 10:39:12'),
(106, 'Courtney Carl', 0, '2025-05-10 10:39:20'),
(107, 'Grace Swanson', 0, '2025-05-10 10:39:27'),
(108, 'Rose Marie Guess', 0, '2025-05-10 10:39:33'),
(109, 'Werewolf', 0, '2025-05-10 10:39:39'),
(110, 'Super Power', 0, '2025-05-10 10:39:47'),
(111, 'Romance', 0, '2025-05-10 10:40:00'),
(112, 'Rags to Riches', 0, '2025-05-10 10:40:08'),
(113, 'Jey Reynolds', 0, '2025-05-10 10:40:16'),
(114, 'Maria Barseghian', 0, '2025-05-10 10:40:22'),
(115, 'Mafia', 0, '2025-05-10 10:40:32'),
(116, 'Tear-Jerker', 1, '2025-05-10 10:40:39'),
(117, 'Rebirth', 0, '2025-05-10 10:40:50'),
(118, 'Love Triangle', 0, '2025-05-10 10:40:59'),
(119, 'Tara Kaye Burgh', 0, '2025-05-10 10:41:08'),
(120, 'Alexander Trumble', 0, '2025-05-10 10:41:21'),
(121, 'John William DiCaro', 0, '2025-05-10 10:41:28'),
(122, 'Nicholas Garabedian', 0, '2025-05-10 10:41:35'),
(123, 'John Palmer', 0, '2025-05-10 10:41:43'),
(124, 'Nova Gaver', 0, '2025-05-10 10:41:51'),
(125, 'Nick Ritacco', 0, '2025-05-10 10:42:01'),
(126, 'Son-in-Law', 0, '2025-05-10 10:42:08'),
(127, 'Nicholas Rodriguez', 0, '2025-05-10 10:42:16'),
(128, 'Noam Sigler', 0, '2025-05-10 10:42:22'),
(129, 'Reincarnation', 0, '2025-05-10 10:42:31'),
(130, 'Mystery', 0, '2025-05-10 10:42:38'),
(131, 'Multiple Identities', 0, '2025-05-10 10:42:48'),
(132, 'Contemporary', 0, '2025-05-10 10:42:54'),
(133, 'Dragon', 0, '2025-05-10 10:43:13'),
(134, 'Lauren Farmer', 0, '2025-05-10 10:43:24'),
(135, 'Happy-Go-Lucky', 0, '2025-05-10 10:43:36'),
(136, 'Kyle Leatherberry', 0, '2025-05-10 10:43:43'),
(137, 'Sarah Evans', 0, '2025-05-10 10:43:52'),
(138, 'Alena Savostikova', 0, '2025-05-10 10:43:59'),
(139, 'Jenna Malatskey', 0, '2025-05-10 10:44:06'),
(140, 'Hot Daddy/DILF', 0, '2025-05-10 10:44:15'),
(141, 'Genius Babies', 0, '2025-05-10 10:44:24'),
(142, 'Robin Åkerstrand', 0, '2025-05-10 10:44:33'),
(143, 'Mark McClafferty', 0, '2025-05-10 10:44:41'),
(144, 'Daniela Couso', 0, '2025-05-10 10:44:47'),
(145, 'Autumn Noel', 0, '2025-05-10 10:44:57'),
(146, 'Candace Mizga', 0, '2025-05-10 10:45:06'),
(147, 'Kirsten Schaffer', 0, '2025-05-10 10:45:15'),
(148, 'Protective Husband', 0, '2025-05-10 10:45:30'),
(149, 'Crime Lord', 0, '2025-05-10 10:45:39'),
(150, 'TJ Wilk', 0, '2025-05-10 10:45:48'),
(151, 'Mario Silva', 0, '2025-05-10 10:45:54'),
(152, 'Steamy', 0, '2025-05-10 10:46:01'),
(153, 'Gold Digger', 0, '2025-05-10 10:46:12'),
(154, 'John Machesky', 0, '2025-05-10 10:46:21'),
(155, 'Analisa Wall', 0, '2025-05-10 10:46:27'),
(156, 'Roman Chsherbakov', 0, '2025-05-10 10:46:35'),
(157, 'Cameron Saffle', 0, '2025-05-10 10:46:42'),
(158, 'Brooke Moltrum', 0, '2025-05-10 10:46:50'),
(159, 'Isabella De Souza Moore', 0, '2025-05-10 10:46:57'),
(160, 'Fantasy', 0, '2025-05-10 10:47:06'),
(161, 'Sweet', 0, '2025-05-10 10:47:21'),
(162, 'Josh Welles', 0, '2025-05-10 10:47:28'),
(163, 'Travis Long', 0, '2025-05-10 10:47:36'),
(164, 'Ashley Michelle Grant', 0, '2025-05-10 10:47:44'),
(165, 'Office Romance', 0, '2025-05-10 10:47:53'),
(166, 'Freddy Piazza', 0, '2025-05-10 10:48:07'),
(167, 'Rob Touhey', 0, '2025-05-10 10:48:13'),
(168, 'Levi Peterson', 0, '2025-05-10 10:48:23'),
(169, 'Kourtney George', 0, '2025-05-10 10:48:29'),
(170, 'Enemies to Lovers', 0, '2025-05-10 10:48:44'),
(171, 'Friends to Lovers', 0, '2025-05-10 10:48:54'),
(172, 'Love After Divorce', 0, '2025-05-10 10:49:03'),
(173, 'Brandon Runkel', 0, '2025-05-10 10:49:13'),
(174, 'Luke Charles Stafford', 0, '2025-05-10 10:49:20'),
(175, 'Nicolas Sellar', 0, '2025-05-10 10:49:29'),
(176, 'Medical Drama', 0, '2025-05-10 10:49:40'),
(177, 'Multiple Identity', 0, '2025-05-10 10:49:49'),
(178, 'Wallflower', 0, '2025-05-10 10:50:08'),
(179, 'Fake Relationship', 0, '2025-05-10 10:50:16'),
(180, 'Mongoloid', 0, '2025-05-10 10:50:24'),
(181, 'Presidential Politics & Royal', 0, '2025-05-10 10:50:39'),
(182, 'Thrill Calls', 0, '2025-05-10 10:50:47'),
(183, 'Jock', 0, '2025-05-10 10:50:54'),
(184, 'Family Drama', 0, '2025-05-10 10:51:00'),
(185, 'Mistaken Identity', 0, '2025-05-10 10:51:12'),
(186, 'Business', 0, '2025-05-10 10:51:20'),
(187, 'Sci-Fi', 0, '2025-05-10 10:51:31'),
(188, 'Comedy', 0, '2025-05-10 10:51:47'),
(189, 'Survival', 0, '2025-05-10 10:51:55'),
(190, 'Neighbors', 0, '2025-05-10 10:52:02'),
(191, 'Athlete', 0, '2025-05-10 10:52:08'),
(192, 'Friendship', 0, '2025-05-10 10:52:15'),
(193, 'Coming-of-Age', 0, '2025-05-10 10:52:23'),
(194, 'Lost Child', 0, '2025-05-10 10:52:31'),
(195, 'Feel-Good', 1, '2025-05-10 10:52:39'),
(196, 'Group Favorite', 0, '2025-05-10 10:53:01'),
(197, 'Body Swap', 0, '2025-05-10 10:53:08'),
(198, 'Christmas', 0, '2025-05-10 10:53:23'),
(199, 'Royalty/Nobility', 0, '2025-05-10 10:53:32'),
(200, 'Horror', 0, '2025-05-10 10:53:43'),
(201, 'Step Siblings', 0, '2025-05-10 10:53:51'),
(202, 'Strong-Willed', 0, '2025-05-10 10:53:59'),
(203, 'Comeback Story', 0, '2025-05-10 10:54:07'),
(204, 'Saintly Parent', 0, '2025-05-10 10:54:27'),
(205, 'Family', 0, '2025-05-10 10:54:38'),
(206, 'Celebrity', 0, '2025-05-10 10:54:46'),
(207, 'Back in Time', 0, '2025-05-10 10:54:55'),
(208, 'Campus', 0, '2025-05-10 10:55:11'),
(209, 'Heartfelt', 0, '2025-05-10 10:55:19'),
(210, 'Drama', 0, '2025-05-10 10:55:27'),
(211, 'Toxic Love', 0, '2025-05-10 10:55:34'),
(212, 'LGBT', 0, '2025-05-10 10:55:44'),
(213, 'Alec Badalov', 0, '2025-05-10 10:55:53'),
(214, 'Super Warrior', 1, '2025-05-10 10:56:01');

-- --------------------------------------------------------

--
-- Table structure for table `types`
--

DROP TABLE IF EXISTS `types`;
CREATE TABLE IF NOT EXISTS `types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type_image` varchar(255) DEFAULT NULL,
  `type_name` varchar(255) DEFAULT NULL,
  `is_deleted` int(11) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `types`
--

INSERT INTO `types` (`id`, `type_image`, `type_name`, `is_deleted`, `created_at`) VALUES
(1, 'https://api-dramashort.ukosoft.store/uploads/types/1747920813070-446534148.png', 'Exclusive', 0, '2025-03-07 10:58:48'),
(2, 'https://api-dramashort.ukosoft.store/uploads/types/1747920821180-27028725.jpg', 'Interactive', 0, '2025-03-07 10:59:11');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(255) DEFAULT NULL,
  `login_type` enum('guest','facebook','google') DEFAULT NULL,
  `login_type_id` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `profile_picture` text,
  `subscribed_email` varchar(255) DEFAULT NULL,
  `wallet_balance` int(11) DEFAULT '0',
  `coin_balance` int(11) NOT NULL DEFAULT '0',
  `language_id` int(11) DEFAULT NULL,
  `invited_id` int(11) DEFAULT NULL,
  `is_weekly_vip` tinyint(1) DEFAULT '0',
  `weekly_vip_ended` datetime DEFAULT NULL,
  `is_yearly_vip` tinyint(1) DEFAULT '0',
  `yearly_vip_ended` datetime DEFAULT NULL,
  `extra_daily` int(11) NOT NULL DEFAULT '0',
  `daily_watched_ads` int(11) DEFAULT '0',
  `checked_in_day_1` date DEFAULT NULL,
  `checked_in_day_2` date DEFAULT NULL,
  `checked_in_day_3` date DEFAULT NULL,
  `checked_in_day_4` date DEFAULT NULL,
  `checked_in_day_5` date DEFAULT NULL,
  `checked_in_day_6` date DEFAULT NULL,
  `checked_in_day_7` date DEFAULT NULL,
  `login_reward` int(11) NOT NULL DEFAULT '0',
  `bind_email` tinyint(1) DEFAULT '0',
  `link_whatsapp` tinyint(1) DEFAULT '0',
  `follow_us_on_facebook` tinyint(1) DEFAULT '0',
  `follow_us_on_instagram` tinyint(1) DEFAULT '0',
  `follow_us_on_youtube` tinyint(1) DEFAULT '0',
  `turn_on_notification` int(11) DEFAULT '0',
  `is_deleted` tinyint(1) DEFAULT '0',
  `is_blocked` int(11) NOT NULL DEFAULT '0',
  `is_picture_and_picture` tinyint(1) DEFAULT '0',
  `device_token` varchar(255) DEFAULT NULL,
  `device_id` longtext,
  `notification_allowed` int(11) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `language_id` (`language_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users_favourite_episode`
--

DROP TABLE IF EXISTS `users_favourite_episode`;
CREATE TABLE IF NOT EXISTS `users_favourite_episode` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `series_id` int(11) DEFAULT NULL,
  `episode_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `series_id` (`series_id`),
  KEY `episode_id` (`episode_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users_liked_episode`
--

DROP TABLE IF EXISTS `users_liked_episode`;
CREATE TABLE IF NOT EXISTS `users_liked_episode` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `series_id` int(11) DEFAULT NULL,
  `episode_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `series_id` (`series_id`),
  KEY `episode_id` (`episode_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users_payments`
--

DROP TABLE IF EXISTS `users_payments`;
CREATE TABLE IF NOT EXISTS `users_payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `plan_id` int(11) NOT NULL,
  `payment_getway_id` int(11) DEFAULT NULL,
  `transaction_key` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `status` int(11) DEFAULT '0' COMMENT '0: Pending, 1: In Process, 2: Completed, 3: Cancelled',
  `expire_date` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transaction_id` (`transaction_id`),
  KEY `payment_getway_id` (`payment_getway_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users_watched_series`
--

DROP TABLE IF EXISTS `users_watched_series`;
CREATE TABLE IF NOT EXISTS `users_watched_series` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `series_id` int(11) DEFAULT NULL,
  `last_viewed_episode` int(11) DEFAULT NULL,
  `last_unlocked_episode` int(11) DEFAULT NULL,
  `watched_ads_for_episode` int(11) DEFAULT '0',
  `last_watched_ads_date` datetime DEFAULT NULL,
  `is_added_list` tinyint(1) DEFAULT '0',
  `is_auto_unlocked` int(11) NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `series_id` (`series_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `user_reported`
--

DROP TABLE IF EXISTS `user_reported`;
CREATE TABLE IF NOT EXISTS `user_reported` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ticket_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `reason` text NOT NULL,
  `description` longtext,
  `status` enum('Pending','In Progress','Completed','Invalid') NOT NULL DEFAULT 'Pending',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
