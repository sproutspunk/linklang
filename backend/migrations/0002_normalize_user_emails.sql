-- Normalize legacy mixed-case emails so lookups against normalized (lowercased) input match.
-- Rows whose lowercased email would collide with an existing row are left untouched.
UPDATE `users`
SET `email` = lower(`email`)
WHERE `email` <> lower(`email`)
  AND NOT EXISTS (
    SELECT 1 FROM `users` AS `u2` WHERE `u2`.`email` = lower(`users`.`email`)
  );
