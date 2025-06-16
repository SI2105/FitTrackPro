/*
  Warnings:

  - You are about to drop the column `distance` on the `WorkoutExercise` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `WorkoutExercise` table. All the data in the column will be lost.
  - You are about to drop the column `reps` on the `WorkoutExercise` table. All the data in the column will be lost.
  - You are about to drop the column `sets` on the `WorkoutExercise` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `WorkoutExercise` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WorkoutExercise" DROP COLUMN "distance",
DROP COLUMN "duration",
DROP COLUMN "reps",
DROP COLUMN "sets",
DROP COLUMN "weight";

-- CreateTable
CREATE TABLE "StrengthWorkoutExercise" (
    "id" INTEGER NOT NULL,
    "sets" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "StrengthWorkoutExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlexibilityWorkoutExercise" (
    "id" INTEGER NOT NULL,
    "sets" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,

    CONSTRAINT "FlexibilityWorkoutExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AerobicWorkoutExercise" (
    "id" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "AerobicWorkoutExercise_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StrengthWorkoutExercise" ADD CONSTRAINT "StrengthWorkoutExercise_id_fkey" FOREIGN KEY ("id") REFERENCES "WorkoutExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlexibilityWorkoutExercise" ADD CONSTRAINT "FlexibilityWorkoutExercise_id_fkey" FOREIGN KEY ("id") REFERENCES "WorkoutExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AerobicWorkoutExercise" ADD CONSTRAINT "AerobicWorkoutExercise_id_fkey" FOREIGN KEY ("id") REFERENCES "WorkoutExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
