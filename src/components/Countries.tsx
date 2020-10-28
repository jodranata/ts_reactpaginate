import React, { useState } from 'react';
import usePagination, {
  UsePaginationPropsTypes,
  PaginationTypes,
} from '../hooks/usePagination';

import { CountriesTypes } from '../types/types';

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

  const handleSubmit = (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    setSearching(true);
    const filteredData = [...data].filter((country: CountriesTypes) => {
      const searchKey = searchBy || 'name';
      return `${country[searchKey] || ''}`
        .toLowerCase()
        .includes(search.trim().toLowerCase());
    });
    setFilteredData(filteredData);
    setSearchFor(search);
    setSearching(false);
  };

  return (
    <>
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
    </>
  );
};

Countries.defaultProps = {
  searchByOptions: [],
};

export default Countries;
