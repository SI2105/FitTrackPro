/*
  Warnings:

  - You are about to drop the column `muscleGroup` on the `Exercise` table. All the data in the column will be lost.
  - Changed the type of `category` on the `Exercise` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ExerciseCategory" AS ENUM ('strength', 'aerobic', 'flexibility');

-- CreateEnum
CREATE TYPE "MuscleGroup" AS ENUM ('chest', 'back', 'legs', 'arms', 'shoulders', 'core', 'glutes');

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "muscleGroup",
ADD COLUMN     "muscleGroups" "MuscleGroup"[],
DROP COLUMN "category",
ADD COLUMN     "category" "ExerciseCategory" NOT NULL;

-- AlterTable
ALTER TABLE "WorkoutExercise" ALTER COLUMN "sets" DROP NOT NULL,
ALTER COLUMN "reps" DROP NOT NULL,
ALTER COLUMN "weight" DROP NOT NULL;
