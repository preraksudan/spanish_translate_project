/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Post`;

-- CreateTable
CREATE TABLE `admin_users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `password` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `username`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pos_definitions` (
    `pos` VARCHAR(64) NOT NULL,
    `description` VARCHAR(128) NOT NULL,
    `created` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`pos`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `spanish_audio` (
    `id` INTEGER UNSIGNED NOT NULL,
    `audio_file` VARCHAR(255) NOT NULL,
    `created` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_audio`(`id`),
    PRIMARY KEY (`id`, `audio_file`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `spanish_pos` (
    `id` INTEGER UNSIGNED NOT NULL,
    `pos` VARCHAR(64) NOT NULL,
    `created` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_pos`(`id`),
    INDEX `pos`(`pos`),
    PRIMARY KEY (`id`, `pos`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `spanish_to_english` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `spanish` VARCHAR(255) NOT NULL,
    `english` VARCHAR(255) NOT NULL,
    `flag` BOOLEAN NULL,
    `created` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_english`(`english`),
    INDEX `idx_spanish`(`spanish`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `title` TEXT NOT NULL,
    `body` MEDIUMTEXT NOT NULL,
    `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `spanish_audio` ADD CONSTRAINT `spanish_audio_ibfk_1` FOREIGN KEY (`id`) REFERENCES `spanish_to_english`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `spanish_pos` ADD CONSTRAINT `spanish_pos_ibfk_1` FOREIGN KEY (`id`) REFERENCES `spanish_to_english`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `spanish_pos` ADD CONSTRAINT `spanish_pos_ibfk_2` FOREIGN KEY (`pos`) REFERENCES `pos_definitions`(`pos`) ON DELETE CASCADE ON UPDATE CASCADE;
