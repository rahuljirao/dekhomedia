-- ============================================================
-- PREMIUM VIDEOS TABLE — Dekho Uncut Videos
-- Run this on your existing database
-- ============================================================

CREATE TABLE IF NOT EXISTS `premium_videos` (
    `id`               INT(11)       NOT NULL AUTO_INCREMENT,
    `title`            VARCHAR(255)  NOT NULL,
    `description`      LONGTEXT      DEFAULT NULL,
    `category`         VARCHAR(100)  DEFAULT NULL,
    `tags`             VARCHAR(500)  DEFAULT NULL,          -- comma-separated
    `is_recommended`   TINYINT(1)    NOT NULL DEFAULT 0,    -- 1=Yes powers 'For You'
    `content_type`     ENUM('normal','premium') NOT NULL DEFAULT 'normal',
    `thumbnail_url`    TEXT          DEFAULT NULL,           -- small grid card
    `poster_image_url` TEXT          DEFAULT NULL,           -- detail page bg
    `cover_video_url`  TEXT          DEFAULT NULL,           -- autoplay preview
    `external_link`    TEXT          DEFAULT NULL,           -- hidden redirect URL
    `is_ad_enabled`    TINYINT(1)    NOT NULL DEFAULT 1,
    `is_active`        TINYINT(1)    NOT NULL DEFAULT 1,
    `is_deleted`       TINYINT(1)    NOT NULL DEFAULT 0,
    `created_at`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`       DATETIME      DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_content_type`   (`content_type`),
    KEY `idx_is_recommended` (`is_recommended`),
    KEY `idx_is_deleted`     (`is_deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
