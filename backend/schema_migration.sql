-- =====================================================
-- DEKHO UNCUT VIDEOS - Schema Migration
-- Run these queries on your existing database
-- =====================================================

-- 1. ALTER users table
ALTER TABLE `users`
    ADD COLUMN `mobile_number` VARCHAR(20) DEFAULT NULL AFTER `email`,
    ADD COLUMN `content_group` ENUM('normal','premium') NOT NULL DEFAULT 'normal' AFTER `mobile_number`,
    ADD COLUMN `referred_by_link` VARCHAR(255) DEFAULT NULL AFTER `content_group`,
    ADD COLUMN `promoter_id` INT(11) DEFAULT NULL AFTER `referred_by_link`;

ALTER TABLE `users`
    ADD INDEX `idx_mobile_number` (`mobile_number`),
    ADD INDEX `idx_content_group` (`content_group`),
    ADD INDEX `idx_promoter_id` (`promoter_id`);

-- 2. CREATE promoters table
CREATE TABLE IF NOT EXISTS `promoters` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `custom_slug` VARCHAR(100) NOT NULL UNIQUE,
    `allowed_content_type` ENUM('normal','premium') NOT NULL DEFAULT 'normal',
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_custom_slug` (`custom_slug`),
    KEY `idx_allowed_content_type` (`allowed_content_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample promoter data
INSERT INTO `promoters` (`name`, `custom_slug`, `allowed_content_type`) VALUES
('Riya Queen', 'RiyaQueen', 'premium'),
('Normal Promo', 'NormalPromo', 'normal');

-- 3. CREATE subscriptions_history table
CREATE TABLE IF NOT EXISTS `subscriptions_history` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `user_id` INT(11) NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `duration_months` INT(11) NOT NULL DEFAULT 1,
    `purchase_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `expiry_date` DATETIME NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_expiry_date` (`expiry_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. ADD content_group column to series table
ALTER TABLE `series`
    ADD COLUMN `content_group` ENUM('normal','premium') NOT NULL DEFAULT 'normal' AFTER `is_recommended`;

ALTER TABLE `series`
    ADD INDEX `idx_series_content_group` (`content_group`);
