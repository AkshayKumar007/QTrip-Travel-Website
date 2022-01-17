import config from "../conf/index.js";

async function fetchReservations() {
  let response = await fetch(config.backendEndpoint + '/reservations/');
  try {
    let data = await response.json();
    return data;
  }
  catch (error) {
    console.log(error);
  }
  return null;
}

function addTableData(tr, content) {
  let td = document.createElement('td');
  td.innerHTML = content;
  tr.appendChild(td);
}

function addReservationToTable(reservations) {
  if(reservations.length === 0) {
    document.getElementById('reservation-table-parent').style.display = "none";
    document.getElementById('no-reservation-banner').style.display = "block";
  }
  else {
    document.getElementById('reservation-table-parent').style.display = "block";
    document.getElementById('no-reservation-banner').style.display = "none";
    let body = document.getElementById('reservation-table');
    reservations.forEach((element)=>{
      let tr = document.createElement('tr');
      addTableData(tr, element.id);
      addTableData(tr, element.name);
      addTableData(tr, element.adventureName);
      addTableData(tr, element.person);

      let d = new Date(element.date);
      addTableData(tr, d.toLocaleDateString("en-IN"));

      addTableData(tr, element.price);

      d = new Date(element.time);
      let date = d.toLocaleString("en-IN", {"dateStyle" : "long"});
      let time = d.toLocaleString("en-IN", {"timeStyle" : "medium"});

      addTableData(tr, date + ", " + time);

      let page_link = document.createElement('a');
      page_link.href = `../detail/?adventure=${element.adventure}`;
      let linkText = document.createTextNode("Visit Adventure");
      page_link.appendChild(linkText);
      
      page_link.innerHTML = "Visit Adventure";
      let button_div  = document.createElement('div');
      button_div.setAttribute('class', 'reservation-visit-button');
      button_div.setAttribute('id', element.id);
      button_div.append(page_link);

      let td = document.createElement('td');
      td.append(button_div);
      tr.appendChild(td);

      body.appendChild(tr);
    });
  }
}

export { fetchReservations, addReservationToTable };
