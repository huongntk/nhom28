"use client";
import React from 'react';

// Component để tạo các nút điều hướng phân trang
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // Hàm tạo danh sách các số trang hiển thị
  const getPageNumbers = () => {
    const pages = [];
    // Hiển thị tối đa 5 nút trang (trang đầu, trang trước, trang hiện tại, trang sau, trang cuối)
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    // Thêm dấu '...' nếu cần
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push("...");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Class cơ bản cho các nút
  const baseClass = "px-4 py-2 border rounded-lg mx-1 transition-colors duration-200";
  // Class cho nút chuyển hướng (Previous/Next)
  const navClass = "bg-gray-200 hover:bg-gray-300 text-gray-800";
  // Class cho nút trang
  const pageClass = "hover:bg-blue-100 text-blue-600 border-blue-600";
  // Class cho nút trang hiện tại
  const activeClass = "bg-blue-600 text-white border-blue-600 font-bold";
  // Class cho nút bị vô hiệu hóa
  const disabledClass = "bg-gray-100 text-gray-400 cursor-not-allowed";

  return (
    <div className="flex justify-center items-center mt-10 space-x-2">
      {/* Nút Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${baseClass} ${navClass} ${currentPage === 1 ? disabledClass : ''}`}
      >
        Trang trước
      </button>

      {/* Các nút số trang */}
      {pageNumbers.map((page, index) => {
        if (page === "...") {
          return <span key={index} className="px-4 py-2 text-gray-500">...</span>;
        }

        const isCurrent = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`${baseClass} ${isCurrent ? activeClass : pageClass}`}
          >
            {page}
          </button>
        );
      })}

      {/* Nút Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${baseClass} ${navClass} ${currentPage === totalPages ? disabledClass : ''}`}
      >
        Trang sau
      </button>
    </div>
  );
}