"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export const Pagination = ({ totalPages, currentPage }: PaginationProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-4 mt-8 pt-4 border-t">
      {/* Previous Btn */}
      <Button 
        variant="outline" 
        disabled={currentPage <= 1} 
        asChild={currentPage > 1}
      >
        {currentPage > 1 ? (
          <Link href={createPageURL(currentPage - 1)}>
            <ChevronLeft className="h-4 w-4 mr-2" /> Previous
          </Link>
        ) : (
          <span><ChevronLeft className="h-4 w-4 mr-2" /> Previous</span>
        )}
      </Button>

      {/* Page / total */}
      <span className="text-sm font-medium text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>

      {/* Next Btn */}
      <Button 
        variant="outline" 
        disabled={currentPage >= totalPages} 
        asChild={currentPage < totalPages}
      >
        {currentPage < totalPages ? (
          <Link href={createPageURL(currentPage + 1)}>
            Next <ChevronRight className="h-4 w-4 ml-2" />
          </Link>
        ) : (
          <span>Next <ChevronRight className="h-4 w-4 ml-2" /></span>
        )}
      </Button>
    </div>
  );
};