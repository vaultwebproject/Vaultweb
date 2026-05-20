-- =============================================================
--  VaultWeb — Full Database Schema
--  Database : audit-trail
--  Run once : mysql -u root -p < backend/schema.sql
-- =============================================================

CREATE DATABASE IF NOT EXISTS `audit-trail`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `audit-trail`;

-- -------------------------------------------------------------
-- 1. organisations
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS organisations (
  organisation_id BIGINT        NOT NULL AUTO_INCREMENT,
  name            VARCHAR(255)  NOT NULL,
  admin_email     VARCHAR(255)  NOT NULL,
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (organisation_id),
  UNIQUE KEY uq_org_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 2. users
--    password_hash : SHA-256 hex string (64 chars) sent by the frontend
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  user_id         BIGINT        NOT NULL AUTO_INCREMENT,
  name            VARCHAR(255)  DEFAULT NULL,
  email           VARCHAR(255)  NOT NULL,
  password_hash   VARCHAR(255)  NOT NULL,
  role            VARCHAR(50)   NOT NULL DEFAULT 'Member',
  organisation_id BIGINT        DEFAULT NULL,
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  UNIQUE KEY uq_user_email (email),
  CONSTRAINT fk_user_org
    FOREIGN KEY (organisation_id)
    REFERENCES organisations (organisation_id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 3. secrets
--    submission_data : AES-GCM cipherText serialised as JSON array
--    iv              : AES-GCM 12-byte IV serialised as JSON array
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS secrets (
  secret_id       BIGINT        NOT NULL AUTO_INCREMENT,
  user_id         BIGINT        NOT NULL,
  vault_id        BIGINT        DEFAULT NULL,
  name            VARCHAR(255)  NOT NULL,
  submission_data LONGTEXT      NOT NULL,
  iv              TEXT          NOT NULL,
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (secret_id),
  INDEX idx_secret_user   (user_id),
  INDEX idx_secret_vault  (vault_id),
  CONSTRAINT fk_secret_user
    FOREIGN KEY (user_id)
    REFERENCES users (user_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 4. audit_logs
--    hash chain : hash_prev → hash_current  (SHA-256 hex, 64 chars)
--    details_json stores { id, severity, userName, details }
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
  audit_id        BIGINT        NOT NULL AUTO_INCREMENT,
  organisation_id BIGINT        NOT NULL DEFAULT 0,
  user_id         BIGINT        NOT NULL DEFAULT 0,
  user_role       VARCHAR(50)   NOT NULL DEFAULT 'Member',
  action_type     VARCHAR(100)  NOT NULL,
  target_type     VARCHAR(50)   DEFAULT NULL,
  target_id       BIGINT        DEFAULT NULL,
  target_name     VARCHAR(255)  DEFAULT NULL,
  action_status   VARCHAR(20)   NOT NULL DEFAULT 'SUCCESS',
  failure_reason  TEXT          DEFAULT NULL,
  ip_address      VARCHAR(45)   DEFAULT NULL,
  user_agent      TEXT          DEFAULT NULL,
  session_id      VARCHAR(255)  DEFAULT NULL,
  details_json    JSON          DEFAULT NULL,
  hash_prev       CHAR(64)      DEFAULT NULL,
  hash_current    CHAR(64)      DEFAULT NULL,
  event_timestamp DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (audit_id),
  INDEX idx_log_org       (organisation_id),
  INDEX idx_log_user      (user_id),
  INDEX idx_log_action    (action_type),
  INDEX idx_log_timestamp (event_timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
--  Done. Tables created:
--    organisations  →  users  →  secrets  →  audit_logs
-- =============================================================
