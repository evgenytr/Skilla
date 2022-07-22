import React from 'react';

function TimeSelect(props) {
  
    const options=props.options.map((obj,index)=><option value={index} key={index}>{obj}</option>);

    return (<div className="TimeSelect">
        <button className="decrease" disabled={props.value==0} onClick={props.decrease}></button>
        <select className="select-css" value={props.value} onChange={(e)=>{props.update(e.target.value)}}>
        {options}
      </select>
        <button className="increase" disabled={props.value==props.options.length-1} onClick={props.increase}></button>
    </div>);
    
}

export default TimeSelect;