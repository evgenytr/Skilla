import React from 'react';

function CallRow(props) {

    const callClasses = [
        props.callData.in_out===0 ? "out-call" : "in-call",
        props.callData.status!=="Дозвонился" ? "failed-call" : ""
    ].join(" ");
    
    let callIcon = props.callData.in_out===0 ? "out-call" : "in-call";
    if(props.callData.status!=="Дозвонился")
        callIcon=callIcon+"-failed";
    
  return (
    <tr className="CallRow">
      <td className={callClasses}><img src={"assets/"+callIcon+".svg"}/></td>
      <td>{dateToTime(props.callData.date)}</td>
      <td><img src={props.callData.person_avatar} width="32" height="32"/></td>
      <td>{formatPhone(props.callData.partner_data.phone)}<br/><span className="partner-name">{props.callData.partner_data.name}</span></td>
      <td>{props.callData.source}</td>
      <td></td>
      <td className="align-right">{props.callData.time!=="" ? <span className="pointer" onClickCapture={(e)=>{props.play(props.callData.record,props.callData.partnership_id)}}>{secondsToTimestring(props.callData.time)}</span> : null}</td>  
    </tr>
  );
}

function secondsToTimestring(seconds)
{
    if(!seconds) return "";
        var hours   = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds % 3600) / 60);
        seconds = seconds % 60;
        
        var result = [];
        if(hours>0) {
            result.push(hours); 
            minutes=("0"+minutes).substr(-2);
        }
        
        result.push(minutes);
        result.push(("0"+seconds).substr(-2));
        return result.join(":");
}

function formatPhone(s)
{
    //74951205096
    return `+${s[0]} (${s.substr(1,3)}) ${s.substr(4,3)}-${s.substr(7,2)}-${s.substr(9,2)}`;
}

function dateToTime(s)
{
    //2022-07-22 11:00:19
    return s.substr(11,5);
}

export default CallRow;
/*
let a = {
    "id": 5169889,
    "partnership_id": "578",
    "partner_data": {
        "id": "578",
        "name": "ООО \"ГРУЗЧИКОВ-СЕРВИС СПБ\"",
        "phone": "74951205096"
    },
    "date": "2022-07-19 16:12:24",
    "date_notime": "2022-07-19",
    "time": 53,
    "from_number": "sip**se**",
    "from_extension": "701",
    "to_number": "734**87**",
    "to_extension": "",
    "is_skilla": 0,
    "status": "Дозвонился",
    "record": "MToxMDA2NzYxNToxNDMwMDM3NzExNzow",
    "line_number": "sip**se**",
    "in_out": 0,
    "from_site": 0,
    "source": "",
    "errors": [],
    "disconnect_reason": "",
    "results": [],
    "stages": [],
    "abuse": [],
    "contact_name": "",
    "contact_company": "",
    "person_id": 4859,
    "person_name": "**",
    "person_surname": "**",
    "person_avatar": "https://lk.skilla.ru/img/noavatar.jpg"
};
*/