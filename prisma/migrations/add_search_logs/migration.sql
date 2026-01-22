-- CreateTable "search_logs"
CREATE TABLE "search_logs" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT,
    "search_query" TEXT,
    "destination" TEXT,
    "hotel_name" TEXT,
    "city" TEXT,
    "date_from" DATE,
    "date_to" DATE,
    "adults" INTEGER DEFAULT 2,
    "children" INTEGER DEFAULT 0,
    "results_count" INTEGER NOT NULL DEFAULT 0,
    "found_hotels" INTEGER,
    "found_rooms" INTEGER,
    "duration_ms" INTEGER,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "error_message" TEXT,
    "user_id" TEXT,
    "session_id" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "source" TEXT,
    "channel" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "search_logs_hotel_id_idx" ON "search_logs"("hotel_id");

-- CreateIndex
CREATE INDEX "search_logs_created_at_idx" ON "search_logs"("created_at");

-- CreateIndex
CREATE INDEX "search_logs_success_idx" ON "search_logs"("success");

-- CreateIndex
CREATE INDEX "search_logs_user_id_idx" ON "search_logs"("user_id");
