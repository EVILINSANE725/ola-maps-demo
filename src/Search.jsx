import React, { useState, useCallback } from 'react';
import CustomAsyncSelect from './AsyncSelect';
import debounce from 'lodash/debounce';

const Search = ({ onPlaceSelect, onGetDirections }) => {
  const [input, setInput] = useState("");

  const debouncedFetchOptions = useCallback(
    debounce(async (inputValue, callback) => {
      if (!inputValue) return [];
      const response = await fetch(`https://api.olamaps.io/places/v1/autocomplete?input=${inputValue}&api_key=qJrMw1eStFJR3boYgQaP1ypBexjOb0bJ9T5KW9a4`);
      const data = await response.json();
      const formattedOptions = data.predictions.map((prediction) => ({
        label: prediction.description,
        value: prediction,
      }));
      callback(formattedOptions);
    }, 300), 
    []
  );

  const handleInputChange = async (inputValue) => {
    setInput(inputValue);
    return new Promise((resolve) => {
      debouncedFetchOptions(inputValue, resolve);
    });
  };

  const handleSeeLocation = (place) => {
    onPlaceSelect(place);
  };

  const handleGetDirections = (place) => {
    onGetDirections(place);
  };

  return (
    <CustomAsyncSelect
      value={input}
      loadOptions={handleInputChange}
      onSeeLocation={handleSeeLocation}
      onGetDirections={handleGetDirections}
      placeholder="Search for a place"
    />
  );
};

export default Search;
