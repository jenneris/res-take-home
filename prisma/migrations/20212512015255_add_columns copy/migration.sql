-- AddColumns
ALTER TABLE "Notification" ADD COLUMN IF NOT EXISTS impact_location VARCHAR;

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS impact_location VARCHAR;

ALTER TABLE "Notification" DROP COLUMN IF EXISTS location;
ALTER TABLE "User" DROP COLUMN IF EXISTS location;

