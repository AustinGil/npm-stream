/*
  Warnings:

  - You are about to drop the `person` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "person";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "pet";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "pet_id" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "person_id" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "birthday" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new__PersonToPet" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_PersonToPet_A_fkey" FOREIGN KEY ("A") REFERENCES "pet_id" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PersonToPet_B_fkey" FOREIGN KEY ("B") REFERENCES "person_id" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__PersonToPet" ("A", "B") SELECT "A", "B" FROM "_PersonToPet";
DROP TABLE "_PersonToPet";
ALTER TABLE "new__PersonToPet" RENAME TO "_PersonToPet";
CREATE UNIQUE INDEX "_PersonToPet_AB_unique" ON "_PersonToPet"("A", "B");
CREATE INDEX "_PersonToPet_B_index" ON "_PersonToPet"("B");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
