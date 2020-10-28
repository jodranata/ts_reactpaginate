import React, { useState } from 'react';
import usePagination, {
  UsePaginationPropsTypes,
  PaginationTypes,
} from '../hooks/usePagination';

import { CountriesTypes, IndexArray } from '../types/types';

interface OptionsTypes {
  label: string;
  value: string;
}

type CountriesPropTypes<TSearch, TPagination> = TPagination & {
  searchByOptions?: TSearch[];
};

const Countries = ({
  data,
  startFrom,
  itemsPerPage,
  searchByOptions,
}: CountriesPropTypes<
  OptionsTypes,
  UsePaginationPropsTypes<CountriesTypes>
>) => {
  const {
    slicedData,
    changePage,
    prevPage,
    nextPage,
    pagination,
    filteredData,
    setSearching,
    setFilteredData,
  } = usePagination({
    data,
    startFrom,
    itemsPerPage,
  });

  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState(
    searchByOptions && searchByOptions.length > 0
      ? searchByOptions[0].value
      : '',
  );
  const [searchFor, setSearchFor] = useState('');
  const [sortByKey, setSortByKey] = useState('name');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const columns = [
    { label: 'Country', sortKey: 'name' },
    { label: 'Capital', sortKey: 'capital' },
    { label: 'Country Code', sortKey: 'iso2' },
    { label: 'Currency', sortKey: 'currency' },
    { label: 'Phone Code', sortKey: 'phone_code' },
  ];

  const sortData = <TSort extends IndexArray>(
    dataArr: TSort[],
    sortBy: string,
    orderBy: 'asc' | 'desc',
  ) => {
    const sorted = dataArr.sort((a: TSort, b: TSort): number => {
      const aSort = a[sortBy] || '';
      const bSort = b[sortBy] || '';
      if (orderBy === 'asc') {
        if (aSort < bSort) {
          return -1;
        }
        if (aSort > bSort) {
          return 1;
        }
        return 0;
      }
      if (aSort < bSort) {
        return 1;
      }
      if (aSort > bSort) {
        return -1;
      }
      return 0;
    });
    return sorted;
  };

  const handleSubmit = (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    setSearching(true);
    const searchedData = [...data].filter((country: CountriesTypes) => {
      const searchKey = searchBy || 'name';
      return `${country[searchKey] || ''}`
        .toLowerCase()
        .includes(search.trim().toLowerCase());
    });
    const sortedData = sortData([...searchedData], sortByKey, order);
    setFilteredData(sortedData);
    setSearchFor(search);
    setSearching(false);
  };

  const handleSort = (sortBy: string, orderBy: 'asc' | 'desc') => {
    if (sortByKey !== sortBy) {
      setSortByKey(sortBy);
    }
    if (order !== orderBy) {
      setOrder(orderBy);
    }
    const sortedData = sortData([...filteredData], sortBy, orderBy);
    setFilteredData(sortedData);
  };

  return (
    <div className="wrapper">
      {searchByOptions && searchByOptions.length > 0 && (
        <form className="my-3 is-flex is-justify-content-center">
          <div className="select is-info mr-2">
            <select
              name="search options"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSearchBy(e.target.value)
              }
            >
              {searchByOptions.map((options: OptionsTypes) => (
                <option key={options.value} value={options.value}>
                  {options.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field mr-2">
            <div className="control">
              <input
                type="text"
                className="input"
                placeholder="Search..."
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearch(e.target.value)
                }
              />
            </div>
          </div>
          <button type="submit" onClick={handleSubmit} className="button">
            Search
          </button>
        </form>
      )}
      {setSearchFor && (
        <h2 className="mb-6 has-text-centered is-size-2">{`Search Results for: ${searchFor}`}</h2>
      )}
      {slicedData.length > 0 ? (
        <>
          <table className="table is-fullwidth is-striped">
            <thead>
              <tr>
                {columns.map((col: { label: string; sortKey: string }) => (
                  <th
                    key={col.sortKey}
                    onClick={() =>
                      handleSort(
                        col.sortKey,
                        sortByKey === col.sortKey
                          ? order === 'asc'
                            ? 'desc'
                            : 'asc'
                          : 'asc',
                      )
                    }
                  >
                    {col.label}
                    {sortByKey === col.sortKey && (
                      <span className="icon">
                        {order === 'asc' ? (
                          <i className="fas fa-sort-up" />
                        ) : (
                          <i className="fas fa-sort-down" />
                        )}
                      </span>
                    )}
                  </th>
                ))}
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
            <button
              type="button"
              className="pagination-next"
              onClick={nextPage}
            >
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
      ) : (
        <div className="message is-link">
          <div className="message-body has-text-centered">No Results</div>
        </div>
      )}
    </div>
  );
};

Countries.defaultProps = {
  searchByOptions: [],
};

export default Countries;
