import React from 'react';
import Filter from './Filter';

function Filters(props) {

  const filters=props.filters.map((obj)=><Filter key={obj} filterName={obj} options={props.filterOptions[obj]} value={props.filterValues[obj]} update={props.updateFilter}/>)
    
  return (
    <div className="Filters">
      {filters}
    </div>
  );
}

export default Filters;