-- CreateTable
CREATE TABLE IF NOT EXISTS "User" (
    "email" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "name" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Notifications" (
    "creatorId" INTEGER,
    "content" TEXT,
    "id" SERIAL NOT NULL,
    "has_read" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateIndexIfNotExists
do
$$
declare
l_count integer;
begin 
select count( * )
into l_count
from pg_indexes
    where schemaname = 'public' AND tablename='User' AND
    indexname='email_unique';
if l_count = 0 then
    CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");
end
if;

end;
$$

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (SELECT * FROM pg_constraint WHERE conname = "Notifications_creatorId_fkey";) THEN
        ALTER TABLE "Notifications" ADD FOREIGN KEY IF NOT EXISTS ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END;
$$;
;
