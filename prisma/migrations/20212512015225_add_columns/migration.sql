-- AddColumns
ALTER TABLE "Notification" ADD COLUMN IF NOT EXISTS impact_area VARCHAR;
ALTER TABLE "Notification" ADD COLUMN IF NOT EXISTS location VARCHAR;

