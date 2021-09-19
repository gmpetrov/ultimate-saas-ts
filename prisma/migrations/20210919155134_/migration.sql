-- CreateTable
CREATE TABLE "Account2" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_user_id" TEXT NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,

    CONSTRAINT "Account2_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Account2" ADD CONSTRAINT "Account2_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
