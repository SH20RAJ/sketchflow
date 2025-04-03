'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function SharedProjectPagination({ pagination }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }
  
  const { page, totalPages } = pagination;
  
  const createPageURL = (pageNumber) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `/projects/shared?${params.toString()}`;
  };
  
  // Generate array of page numbers to show
  const getPageItems = () => {
    const items = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      // Show all pages if there are few
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      // Always show first page
      items.push(1);
      
      // Calculate middle pages
      let startPage = Math.max(2, page - 1);
      let endPage = Math.min(totalPages - 1, page + 1);
      
      // Adjust if at start or end
      if (page <= 2) {
        endPage = Math.min(4, totalPages - 1);
      } else if (page >= totalPages - 1) {
        startPage = Math.max(2, totalPages - 3);
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        items.push('ellipsis1');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        items.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        items.push('ellipsis2');
      }
      
      // Always show last page
      items.push(totalPages);
    }
    
    return items;
  };
  
  return (
    <Pagination className="my-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            href={page > 1 ? createPageURL(page - 1) : '#'} 
            aria-disabled={page <= 1}
            className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
        
        {getPageItems().map((item, index) => {
          if (item === 'ellipsis1' || item === 'ellipsis2') {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          
          return (
            <PaginationItem key={item}>
              <PaginationLink 
                href={createPageURL(item)}
                isActive={page === item}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        
        <PaginationItem>
          <PaginationNext 
            href={page < totalPages ? createPageURL(page + 1) : '#'} 
            aria-disabled={page >= totalPages}
            className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
