-- AlterTable
ALTER TABLE "Anime" ADD COLUMN     "behindTheScenes" TEXT[],
ADD COLUMN     "director" TEXT,
ADD COLUMN     "genre" TEXT[],
ADD COLUMN     "streamingUrls" TEXT[],
ADD COLUMN     "trailerUrl" TEXT,
ADD COLUMN     "trivia" TEXT[];

-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "Comparativa" ADD COLUMN     "animeSceneUrl" TEXT,
ADD COLUMN     "mangaSceneUrl" TEXT;

-- AlterTable
ALTER TABLE "Manga" ADD COLUMN     "behindTheScenes" TEXT[],
ADD COLUMN     "genre" TEXT[],
ADD COLUMN     "publisher" TEXT,
ADD COLUMN     "readingUrls" TEXT[],
ADD COLUMN     "trivia" TEXT[],
ADD COLUMN     "volumes" INTEGER;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "animeId" TEXT,
ADD COLUMN     "mangaId" TEXT,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'general',
ADD COLUMN     "verdictScore" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "level" TEXT NOT NULL DEFAULT 'Novato',
ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';

-- CreateTable
CREATE TABLE "Follow" (
    "id" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WikiSection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "animeId" TEXT,
    "mangaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WikiSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Follow_followerId_followingId_key" ON "Follow"("followerId", "followingId");

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WikiSection" ADD CONSTRAINT "WikiSection_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WikiSection" ADD CONSTRAINT "WikiSection_mangaId_fkey" FOREIGN KEY ("mangaId") REFERENCES "Manga"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
