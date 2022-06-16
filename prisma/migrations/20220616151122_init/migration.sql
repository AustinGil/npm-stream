-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Upload" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "type" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "imageId" TEXT,
    CONSTRAINT "Person_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Upload" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "birthday" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "imageId" TEXT,
    CONSTRAINT "Pet_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Upload" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_PersonToPet" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_PersonToPet_A_fkey" FOREIGN KEY ("A") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PersonToPet_B_fkey" FOREIGN KEY ("B") REFERENCES "Pet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Person_imageId_key" ON "Person"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "Pet_imageId_key" ON "Pet"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "_PersonToPet_AB_unique" ON "_PersonToPet"("A", "B");

-- CreateIndex
CREATE INDEX "_PersonToPet_B_index" ON "_PersonToPet"("B");
