import config from "../conf/index.js";

async function init() {
  let cities = await fetchCities();

  cities.forEach((key) => {
    addCityToDOM(key.id, key.city, key.description, key.image);
  });
}

async function fetchCities() {
  const response = await fetch(config.backendEndpoint + "/cities/");
  try {
    let city_json = await response.json();
    return city_json;
    // return response;
  }
  catch(error) {
    console.log(error);
  }
  return null;
}

function addCityToDOM(id, city, description, image) {
  let row = document.getElementById('data');

  let col_div = document.createElement('div');
  col_div.setAttribute('class', 'col-xs-12 col-sm-6 col-md-6 col-lg-3 col-xl-3 py-3');

  let link = document.createElement('a');
  link.href = `pages/adventures/?city=${id}`;
  link.setAttribute('id', id);
  col_div.appendChild(link);

  let card_div = document.createElement('div');
  card_div.setAttribute('class', 'tile');

  let img_tag = document.createElement('img');
  img_tag.src = image;

  let tile_text = document.createElement('div');
  tile_text.setAttribute('class', 'tile-text');
  let h5 = document.createElement('H5');
  let t = document.createTextNode(city);
  h5.appendChild(t);
  let para = document.createElement("P");
  para.innerText = description;  

  tile_text.appendChild(h5);
  tile_text.appendChild(para);

  card_div.appendChild(img_tag);
  card_div.appendChild(tile_text);

  link.appendChild(card_div);

  row.appendChild(col_div);

}

export { init, fetchCities, addCityToDOM };
