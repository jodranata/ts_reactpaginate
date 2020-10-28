import React, { useState, useEffect } from 'react';

import Countries from './components/Countries';
import Header from './components/Header';

import { CountriesTypes } from './types/types';

const url: string = process.env.COUNTRIES_URL || '';

const App = () => {
  const [data, setData] = useState<CountriesTypes[]>([]);
  const getData = async () => {
    try {
      const response = await fetch(url);
      const fetchedData: CountriesTypes[] = await response.json();
      setData(fetchedData);
    } catch (err) {
      return { error: true, message: 'Error Fetch Data' };
    }
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="App">
      <Header title="Typescript React Pagination" />
      <div className="container px-2">
        {data.length > 0 && (
          <Countries
            data={data}
            startFrom={1}
            searchByOptions={[
              { label: 'Country', value: 'name' },
              { label: 'Capital', value: 'capital' },
              { label: 'Country Code', value: 'iso2' },
              { label: 'Currency', value: 'currency' },
              { label: 'Phone Code', value: 'phone_code' },
            ]}
          />
        )}
        {data.length > 0 && (
          <Countries data={data} startFrom={3} itemsPerPage={15} />
        )}
      </div>
    </div>
  );
};

export default App;
