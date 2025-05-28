import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import ReactPaginate from 'react-paginate';
import './Pagination.css'

type Prop = {
  pageCount:number;
  onPageClick:(pageNumberClick:number)=>void;
}
const PaginatedItems = ({ pageCount=1,onPageClick}:Prop):React.ReactElement=>{



  // Invoke when user click to request another page.
  const handlePageClick = (event:any) => onPageClick(event.selected+1)//i added it plus one cus it starting from 0

  return (
    <>
      {
        pageCount!==0?
          <ReactPaginate
            breakLabel="..."
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="< previous"
            containerClassName='pagination'
            pageLinkClassName='page-num'
            previousLinkClassName='page-num'
            nextLinkClassName='page-num'
            activeLinkClassName='active'
            // renderOnZeroPageCount={null}
          />:''
      }
      
    </>
  );
}


export default PaginatedItems