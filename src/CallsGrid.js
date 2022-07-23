import React from 'react';
import CallsGridHeader from './CallsGridHeader';
import CallRow from './CallRow';
import CallSubheadRow from './CallSubheadRow';

function CallsGrid(props) {


    const todayDate = new Date();
    let yesterdayDate = new Date();
    yesterdayDate.setDate(todayDate.getDate()-1);
    
    let totalDaysCounter = 0;
    
    let callRows=[];
    for(let day in props.calls)
    {
        const currCalls = props.calls[day];
        let dayName = day;
        
        if(getFormattedDate(todayDate)==day) dayName="сегодня";
        else
          if(getFormattedDate(yesterdayDate)==day) dayName="вчера";
        
          //show today subhead only if sorted by date ASC & length>1
        if(props.sorts.param=="date" && (dayName!="сегодня" || (props.sorts.order=="ASC" && totalDaysCounter>0)))
        callRows.push(<CallSubheadRow total={currCalls.length} date={dayName} key={day}/>);
        
        callRows = callRows.concat(currCalls.map((obj)=><CallRow callData={obj} key={obj.id} play={props.playRecord}/>));
        
        totalDaysCounter++;
    }

  
  return (
    <div className="CallsGrid">
    <table>
      <thead>
      <CallsGridHeader sorts={props.sorts} updateSorts={props.updateSorts}/>
      </thead>
      <tbody>
      {callRows}
      </tbody>
    </table>
    </div>
  );
}

function getFormattedDate(theDate)
{
    return [theDate.getFullYear(),("0"+(theDate.getMonth()+1)).substr(-2),theDate.getDate()].join("-");
}

export default CallsGrid;