import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  itemsPerPage, 
  totalItems,
  startIndex 
}) => {
  // ✅ Generate smart page numbers (max 7 buttons)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7;
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show: 1 ... 4 5 [6] 7 8 ... 100
      if (currentPage <= 3) {
        // Near start: 1 2 3 4 5 ... 100
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near end: 1 ... 96 97 98 99 100
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        // Middle: 1 ... 4 5 [6] 7 8 ... 100
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between space-x-2 mt-8">
      <p className="text-sm text-slate-600">
        Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} results
      </p>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="flex items-center space-x-1 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center space-x-1">
          {pageNumbers.map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-2 text-slate-500">
                <MoreHorizontal className="h-4 w-4" />
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`min-w-[2.5rem] h-10 px-3 rounded-lg font-medium transition-colors ${
                  currentPage === page
                    ? "bg-teal-600 text-white hover:bg-teal-700"
                    : "border border-slate-300 hover:bg-slate-50 text-slate-700"
                }`}
              >
                {page}
              </button>
            )
          ))}
        </div>

        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="flex items-center space-x-1 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default Pagination