import React from 'react';
import usePagination, {
  UsePaginationPropsTypes,
  PaginationTypes,
} from '../hooks/usePagination';

import { CountriesTypes } from '../types/types';

const Countries = ({
  data,
  startFrom,
  itemsPerPage,
}: UsePaginationPropsTypes<CountriesTypes>) => {
  const {
    slicedData,
    changePage,
    prevPage,
    nextPage,
    pagination,
  } = usePagination({
    data,
    startFrom,
    itemsPerPage,
  });

  return (
    <>
      <table className="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th>Country</th>
            <th>Capital</th>
            <th>Code</th>
            <th>Currency</th>
            <th>Phone Code</th>
          </tr>
        </thead>
        <tbody>
          {slicedData.map((country: CountriesTypes) => (
            <tr key={country.id}>
              <td>{country.name}</td>
              <td>{country.capital}</td>
              <td>{country.iso2}</td>
              <td>{country.currency}</td>
              <td>{country.phone_code}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <nav className="pagination is-rounded">
        <button
          type="button"
          className="pagination-previous"
          onClick={prevPage}
        >
          Prev
        </button>
        <button type="button" className="pagination-next" onClick={nextPage}>
          Next
        </button>
        <ul className="pagination-list">
          {pagination.length >= 1 &&
            pagination.map((page: PaginationTypes) => {
              if (!page.ellipsis) {
                return (
                  <li key={page.id}>
                    <button
                      type="button"
                      className={`pagination-link ${
                        page.current ? 'is-current' : ''
                      }`}
                      onClick={(
                        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                      ) => changePage(page.id, e)}
                    >
                      {page.id}
                    </button>
                  </li>
                );
              }
              return (
                <li key={page.id}>
                  <span className="pagination-ellipsis">&hellip;</span>
                </li>
              );
            })}
        </ul>
      </nav>
    </>
  );
};

export default Countries;
