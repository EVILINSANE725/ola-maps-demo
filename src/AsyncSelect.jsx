import React from 'react';
import AsyncSelect from 'react-select/async';

const customStyles = {
  option: (provided) => ({
    ...provided,
    display: 'flex',
    flexDirection: 'column', 
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '10px',
    borderBottom: '1px solid #eee',
    cursor: 'pointer',
    minHeight: 'auto',
    position:"fixed",
    top:0
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  control: (provided) => ({
    ...provided,
    minHeight: '40px',
    border: '1px solid #ddd',
    boxShadow: 'none',
    '&:hover': {
      border: '1px solid #aaa',
    },
    // width:"99vw"
  }),
  container:(provided)=>({
    ...provided,
    padding:0,
    // width:"99vw"


  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#999',
  }),
};

const CustomOption = ({ data, innerRef, innerProps }) => (
  <div
    ref={innerRef}
    {...innerProps}
    style={{
      display: 'flex',
      flexDirection: 'column', 
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '10px',
      borderBottom: '1px solid #eee',
      cursor: 'pointer',
      position: 'relative', 
    }}
  >
    <div style={{ color: 'black', marginBottom: '8px' }} onClick={(e) => data.onSeeLocation(e, data.value)} >{data.label}</div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%' }}>
      <button
        onClick={(e) => data.onGetDirections(e, data.value)}
        style={buttonStyles}
      >
        Get Directions
      </button>
    </div>
  </div>
);

const buttonStyles = {
  padding: '8px 12px',
  border: 'none',
  borderRadius: '4px',
  backgroundColor: '#007bff',
  color: 'white',
  fontSize: '14px',
  cursor: 'pointer',
  outline: 'none',
  transition: 'background-color 0.3s',
//   zIndex:"100000",
  width: '100%', 
};

const CustomAsyncSelect = ({ loadOptions, onSeeLocation, onGetDirections, placeholder, value }) => {
  const loadOptionsWithHandlers = async (inputValue) => {
    const options = await loadOptions(inputValue);
    return options.map((option) => ({
      ...option,
      onSeeLocation: (e) => {
        e.stopPropagation();
        onSeeLocation(option.value);
      },
      onGetDirections: (e) => {
        e.stopPropagation();
        onGetDirections(option.value);
      },
    }));
  };

  return (
    <AsyncSelect
      loadOptions={loadOptionsWithHandlers}
      components={{ Option: CustomOption }}
      styles={customStyles}
      placeholder={placeholder}
      value={value}
      isSearchable={true}
    />
  );
};

export default CustomAsyncSelect;
