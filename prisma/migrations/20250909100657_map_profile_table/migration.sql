/*
  Warnings:

  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Profile" DROP CONSTRAINT "Profile_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProfileInterest" DROP CONSTRAINT "ProfileInterest_profileId_fkey";

-- DropTable
DROP TABLE "public"."Profile";

-- CreateTable
CREATE TABLE "public"."profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "public"."Gender" NOT NULL,
    "bio" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "tribe" TEXT NOT NULL,
    "religion" "public"."Religion" NOT NULL,
    "avatar_url" TEXT,
    "location" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "min_age_interest" INTEGER,
    "max_age_interest" INTEGER,
    "online" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "public"."profiles"("user_id");

-- CreateIndex
CREATE INDEX "profiles_region_idx" ON "public"."profiles"("region");

-- CreateIndex
CREATE INDEX "profiles_tribe_idx" ON "public"."profiles"("tribe");

-- CreateIndex
CREATE INDEX "profiles_religion_idx" ON "public"."profiles"("religion");

-- CreateIndex
CREATE INDEX "profiles_age_idx" ON "public"."profiles"("age");

-- CreateIndex
CREATE INDEX "profiles_latitude_longitude_idx" ON "public"."profiles"("latitude", "longitude");

-- AddForeignKey
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProfileInterest" ADD CONSTRAINT "ProfileInterest_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
