import React from 'react';

function Filter(props) {
  
    const options=[];
    
    for (const [key, value] of props.options)
        options.push(<option value={key} key={key}>{value}</option>);

    return (
        <select className="select-css" value={props.value} onChange={(e)=>{props.update(props.filterName,e.target.value)}}>
        {options}
      </select>
    );
    
}

export default Filter;