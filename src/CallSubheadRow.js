import React from 'react';

function CallSubheadRow(props) {
  return (
    <tr>
      <td colSpan="7">{props.date} {props.total}</td>
    </tr>
  );
}

export default CallSubheadRow;