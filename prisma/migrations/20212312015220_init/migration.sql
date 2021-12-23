-- CreateTable
CREATE TABLE "User" (
    "email" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "name" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notifications" (
    "creatorId" INTEGER,
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
ALTER TABLE "Notifications" ADD FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;