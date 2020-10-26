import { useState, SyntheticEvent } from 'react';

export interface UsePaginationPropsTypes<TData> {
  data: TData[];
  startFrom: number;
  itemsPerPage?: number;
}

export interface PaginationTypes {
  id: number;
  current: boolean;
  ellipsis: boolean;
}

interface UsePaginationReturnTypes<TData> {
  slicedData: TData[];
  pagination: PaginationTypes[];
  changePage: <T, E>(page: number, e: SyntheticEvent<T, E>) => void;
  prevPage: <T, E>(e: SyntheticEvent<T, E>) => void;
  nextPage: <T, E>(e: SyntheticEvent<T, E>) => void;
}

const usePagination = <TData>({
  data,
  startFrom,
  itemsPerPage,
}: UsePaginationPropsTypes<TData>): UsePaginationReturnTypes<TData> => {
  const perPage = itemsPerPage || 10;
  const pages = Math.ceil(data.length / perPage);
  const pagination: PaginationTypes[] = [];
  const [currentPage, setCurrentPage] = useState(
    startFrom <= pages ? startFrom : 1,
  );
  const [slicedData, setSlicedData] = useState(
    [...data].slice((currentPage - 1) * perPage, currentPage * perPage),
  );

  const paginationPush = (
    id: number,
    current: boolean,
    ellipsis: boolean,
  ): number => pagination.push({ id, current, ellipsis });

  let ellipsisLeft = false;
  let ellipsisRight = false;

  Array.from({ length: pages }, (v: unknown, k: number) => k + 1).forEach(
    (page: number) => {
      const isCurrent = page === currentPage;
      const isHideEllipsis =
        page < 2 ||
        page > pages - 1 ||
        page === currentPage - 1 ||
        page === currentPage + 1;
      const showEllipsisLeft = page > 1 && page < currentPage && !ellipsisLeft;
      const showEllipsisRight =
        page < pages && page > currentPage && !ellipsisRight;

      if (isCurrent) {
        return paginationPush(page, true, false);
      }
      if (isHideEllipsis) {
        return paginationPush(page, false, false);
      }
      if (showEllipsisLeft) {
        ellipsisLeft = true;
        return paginationPush(page, false, true);
      }
      if (showEllipsisRight) {
        ellipsisRight = true;
        return paginationPush(page, false, true);
      }
    },
  );

  const changePage = <T, E>(page: number, e: SyntheticEvent<T, E>): void => {
    e.preventDefault();
    if (page !== currentPage) {
      setCurrentPage(page);
      setSlicedData([...data].slice((page - 1) * perPage, page * perPage));
    }
  };

  const goToPrevPage = <T, E>(e: SyntheticEvent<T, E>): void => {
    e.preventDefault();
    setCurrentPage((prevVal: number): number =>
      prevVal - 1 === 0 ? 1 : prevVal - 1,
    );
    if (currentPage !== 1) {
      setSlicedData(
        [...data].slice(
          (currentPage - 2) * perPage,
          (currentPage - 1) * perPage,
        ),
      );
    }
  };
  const goToNextPage = <T, E>(e: SyntheticEvent<T, E>): void => {
    e.preventDefault();
    setCurrentPage((prevVal: number): number =>
      prevVal === pages ? prevVal : prevVal + 1,
    );
    if (currentPage !== pages) {
      setSlicedData(
        [...data].slice(currentPage * perPage, (currentPage + 1) * perPage),
      );
    }
  };

  return {
    slicedData,
    pagination,
    changePage,
    prevPage: goToPrevPage,
    nextPage: goToNextPage,
  };
};

export default usePagination;
