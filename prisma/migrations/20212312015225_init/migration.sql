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
IF (select 1
into l_count
from pg_indexes
    where schemaname = 'public' AND tablename='User' AND
    indexname='email_unique';) != 1 THEN
CREATE UNIQUE INDEX IF NOT EXISTS "User.email_unique" ON "User"("email");
END IF;

-- AddForeignKey
ALTER TABLE "Notifications" ADD FOREIGN KEY IF NOT EXISTS ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
