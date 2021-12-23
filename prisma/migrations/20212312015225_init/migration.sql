-- CreateTable
CREATE TABLE IF NOT EXISTS "User" (
    "email" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "name" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Notification" (
    "creator_id" INTEGER,
    "content" TEXT,
    "id" SERIAL NOT NULL,
    "has_read" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Notification" ADD FOREIGN KEY ("creator_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
