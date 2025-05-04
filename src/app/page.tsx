"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { DrawingList } from "@/components/DrawingList";
import { trpc } from "../lib/trpc/client";

export default function HomePage() {
  try {
    const { data } = trpc.drawings.getAll.useQuery();
    const drawings = Array.isArray(data) ? data : [];

    return (
      <div className="container mx-auto p-4 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold ">
            My Documents
          </h1>
          {drawings.length > 0 && (
            <Link href="/editor/new">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Document
              </Button>
            </Link>
          )}
        </div>

        <DrawingList drawings={drawings} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching drawings:", error);
    return (
      <div className="container mx-auto py-10">
        <p>Error loading documents. Please try again later.</p>
      </div>
    );
  }
}
