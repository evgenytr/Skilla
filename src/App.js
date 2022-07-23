import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Filters from './Filters';
import TimeSelect from './TimeSelect';
import CallsGrid from './CallsGrid';

const _allDays = ["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"];
const _allMonths = ["янв","фев","мар","апр","мая","июн","июл","авг","сен","окт","ноя","дек"];

function App() {
    
  const todayDate = new Date();
  const apiUrl = "https://api.skilla.ru/mango/"
    
  const [callsData, setCallsData] = useState([]);
  const [calls, setCalls] = useState();
  const [filters, setFilters] = useState({
      "in_out":"all",
      "employees":"all",
      "calls":"all",
      "sources":"all",
      "grades":"all",
      "errors":"all"
  });
  const [sorts, setSorts] = useState({order:"DESC",param:"date"});
  const [timeRange,setTimeRange] = useState(0);
  const [startDate,setStartDate] = useState(todayDate);
  const [endDate,setEndDate] = useState(todayDate);

  
  const filterOptions = {
      "in_out": new Map([
          ["all","Все типы"],
          ["1","Входящие"],
          ["0","Исходящие"]
      ]),
      "employees":new Map([
          ["all","Все сотрудники"]
      ]),
      "calls":new Map([
          ["all","Все звонки"]
      ]),
      "sources":new Map([
          ["all","Все источники"]
      ]),
      "grades":new Map([
          ["all","Все оценки"]
      ]),
      "errors":new Map([
          ["all","Все ошибки"]
      ])
  };
  
  const allFilters = [
      "in_out",
      "employees",
      "calls",
      "sources",
      "grades",
      "errors"
  ];
  const timeRangeOptions = [
      ["3 дня"],
      ["Неделя"],
      ["Месяц"],
      ["Год"]
  ];
  

  
  async function fetchCallRecord(recordId,partnershipId) {

    const url = `${apiUrl}getRecord?partnership_id=${partnershipId}&record=${recordId}`;

    return fetch(url, {
      method: 'POST', 
      headers: {
        'Authorization': 'Bearer testtoken'
      },
      redirect: 'follow'
    }).then(res => {
      if (!res.ok)
      {
        console.log(res.status,res.statusText);
        return;
      }
      
      var reader = res.body.getReader();

      return reader
        .read()
        .then((result) => {
          return result;
        });
    });
  }

  useEffect(() => {
      async function fetchCallsData() {
    
        const url = `${apiUrl}getList?date_start=${formatDate(startDate)}&date_end=${formatDate(endDate)}&limit=200&sort_by=${sorts.param}&order=${sorts.order}`;
        console.log(url);
        const response = await fetch(url, {
          method: 'POST', 
          headers: {
            'Authorization': 'Bearer testtoken'
          },
          redirect: 'follow'
        });
        return await response.json();
      }
      
      console.log("start date changed",startDate); 
      if(!startDate) return;
      fetchCallsData()
      .then((data) => {   
          console.log("update calls data");  
         
          setCallsData(data.results);
          
      });
  }, [startDate]);
  
  useEffect(() => {
      console.log("calls data loaded or filters changed",callsData.length); 
    
      function filterData(rawData)
      {
        if(filters.in_out==="all") 
            return rawData; 
        
        return rawData.filter(obj=>obj.in_out==filters.in_out);
      }   
      
      function groupByDay(myData)
      {
          console.log('groupByDay');
          console.log(myData.length);
          
          if(!myData.length) return {};
          let result = {};
          let currDate = myData[0].date_notime;
          let currResult = [];
          for(let i=0;i<myData.length;i++)
          {
              if(currDate!==myData[i].date_notime)
              {
                  result[currDate]=currResult;
                  currResult=[];
                  currDate=myData[i].date_notime;
              }
              currResult.push(myData[i]);
          }
          if(currResult.length)
              result[currDate]=currResult;
          
          return result;
      }
      
      const filteredData = filterData(callsData);
      console.log(filteredData);
      const groupedByDayData = groupByDay(filteredData);
      
      setCalls(groupedByDayData);
  }, [callsData,filters]);
  
  useEffect(() => {
      console.log("sorts changed"); 

      let rawData = callsData.slice(0);
      
      sorts.order==="ASC" ? rawData.sort((a,b)=>{return a[sorts.param]>b[sorts.param]}) : rawData.sort((a,b)=>{return a[sorts.param]<b[sorts.param]});
      
      setCallsData(rawData);
  }, [sorts]);

  
 function updateFilter(filterName,filterValue)
  {
      console.log(filterName,filterValue);
      let currFilters =  {...filters};
      currFilters[filterName]=filterValue;
      setFilters(currFilters);
  }
  
  function updateSorts(sortName)
  {
      console.log("update sorts");
      let currSorts =  {...sorts};
      //switch direction if it's current sort param
      if(sorts.param===sortName) 
      sorts.order==="DESC" ? currSorts.order = "ASC" : currSorts.order = "DESC";
      else
      {
          currSorts.order = "DESC";
          currSorts.param = sortName;
      }
      console.log(currSorts);
      setSorts(currSorts);
  }
  
 function updateTimeRange(value)
  {
      setTimeRange(value);
  }
  
  function increaseTimeRange()
  {
      setTimeRange(Math.min(timeRange+1,timeRangeOptions.length-1));
  }
  
  function decreaseTimeRange()
  {
      setTimeRange(Math.max(timeRange-1,0));
  }
  
  function playRecord(recordId,partnershipId)
  {
      if(!recordId || !partnershipId) return;
     fetchCallRecord(recordId,partnershipId)
      .then((response) => {
          // response.value for fetch streams is a Uint8Array
          let blob = new Blob([response.value], { type: 'audio/mp3' });
          let url = URL.createObjectURL(blob);
          let audio = new Audio();
          audio.src = url;
          audio.play();
        })
        .catch((error) => {
            console.log(error);
        });
  }
  
  useEffect(() => {
      console.log("time range changed"); 
      
  
       let tempDate = new Date(endDate);
       
      switch(timeRange)
      {
      case 0: //3 days
          tempDate.setDate(endDate.getDate()-3);
          break;
      case 1: //week
          tempDate.setDate(endDate.getDate()-7);
          break; 
      case 2: //month
          tempDate.setMonth(endDate.getMonth()-1);
          if(endDate.getMonth() === 0) tempDate.setYear(endDate.getFullYear()-1);
          break;  
      case 3: //year
          tempDate.setYear(endDate.getFullYear()-1);
          break;
      default:    
          tempDate.setDate(endDate.getDate()-3);
          break;      
      }
      setStartDate(tempDate);
      
  }, [timeRange]);
    
  return (
    <div className="App">
      <Sidebar/>
      <div className="main">
          <div className="Header">
          <div className="header-content">
              <div className="today-date-header">{getDateLine(todayDate)}</div>
              <div className="analytics-stub"/>
              <div className="profile-stub"/>
          </div>
          </div>
          <div className="content">
              <div className="Subheader">
                 <div className="balance-stub"/>
                 <TimeSelect options={timeRangeOptions} value={timeRange} update={updateTimeRange} increase={increaseTimeRange} decrease={decreaseTimeRange}/>
              </div>
              <div className="search-filters">
                  <div className="search-stub"/>
                  <Filters filters={allFilters} filterValues={filters} filterOptions={filterOptions} updateFilter={updateFilter}/>
              </div>
              <CallsGrid calls={calls} playRecord={playRecord} updateSorts={updateSorts} sorts={sorts}/>
          </div>
      </div>
    </div>
  );
}


function formatDate(theDate)
{
    return [theDate.getFullYear(),theDate.getMonth()+1,theDate.getDate()].join("-");
}

function getDateLine(theDate)
{
    return `${_allDays[theDate.getDay()]},\u00A0${theDate.getDate()}\u00A0${_allMonths[theDate.getMonth()]}`;
}

export default App;
