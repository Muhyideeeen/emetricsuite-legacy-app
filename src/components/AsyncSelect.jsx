import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { AsyncPaginate } from "react-select-async-paginate";

import axios from "../services/api"

const SelectAsyncPaginate = (props) => {

  const loadOptions = async (searchQuery, loadedOptions, { page }) => {

    // console.log(props.url)
    // console.log(page,'this is page numbers')
          //page is a number 
          //the page should be where the url requires it
          const response = await axios.get(`${props.url}&page=${page}`)
        
          //  console.log(response.data.data,"Normal Data Stiff")
          return {
          //this should be a list of the data u want return dont worry about it structure(Just list of anything(number,obj,or ur head))
          options: response.data.data,
          //boolean that checks if there is still new page..(Write Your Logic)
          hasMore: response.data.next!==null,
          additional: {
          //increment page by one
          page:  page + 1

          }
          };
  };

  const onChange = (option) => {
    if (typeof props.onChange === "function") {
      
      props.onChange(option);
    }
  };
 
  return (
    <AsyncPaginate
      key={props.key?props.key:JSON.stringify( Symbol('newstuff'))}
      value={props.value || ""}
      loadOptions={loadOptions}
      // from the list that was givin in loadOptions func this will help u get the Value 
      getOptionValue={props.SelectValue}
      // from the list that was givin in loadOptions func this will help u get the Label that is Showed 
      
      getOptionLabel={props.SelectLabel}
      onChange={onChange}
      isSearchable={false}
      placeholder={props.placeholder}
      additional={{
        page: 1
      }}
    />
  );
};

SelectAsyncPaginate.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func,
  url:PropTypes.string,
  SelectLabel:PropTypes.func,
  SelectValue:PropTypes.func,
  placeholder:PropTypes.string,
  // key?:PropTypes.string,
};

export default SelectAsyncPaginate;