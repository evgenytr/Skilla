import React from 'react';

function CallsGridHeader(props) {
  return (
    <tr>
      <th width="4%">Тип</th>
      <th width="6%"className="sortable" onClick={(e)=>{props.updateSorts("date")}}>Время</th>
      <th width="10%">Сотрудник</th>
      <th width="24%">Звонок</th>
      <th width="15%">Источник</th>
      <th width="15%">Оценка</th>
      <th className="align-right sortable" onClick={(e)=>{props.updateSorts("time")}}>Длительность</th>
    </tr>
  );
}

export default CallsGridHeader;