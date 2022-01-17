import config from "../conf/index.js";


function getCityFromURL(search) {
  var params = new URLSearchParams(search);
  let city = params.get('city');
  return city;
}

async function fetchAdventures(city) {
  let response = await fetch(config.backendEndpoint + `/adventures?city=${city}`);
  try {
    let adv_json = await response.json();
    return adv_json;
  }
  catch(error) {
    console.log(error);
  }
  return null;
}

function addTextInAdventure(left, right) {
  let text_1 = document.createElement('div');
  let left_name = document.createElement('H6');
  left_name.innerText = left;
  let right_name = document.createElement('H6');
  right_name.innerText = right;
  right_name.setAttribute('class', 'float-right');
  left_name.setAttribute('class', 'float-left');
  text_1.appendChild(left_name);
  text_1.appendChild(right_name);
  return text_1;
}


function addAdventureToDOM(adventures) {
  let row_div = document.getElementById('data');

  adventures.forEach((adventure) => {
    let col_div = document.createElement('div');
    col_div.setAttribute('class', 'col-xs-6 col-sm-6 col-md-6 col-lg-3 col-xl-3 py-3');

    let link = document.createElement('a');
    link.href = `detail/?adventure=${adventure.id}`;
    link.setAttribute('id', adventure.id);
    col_div.appendChild(link);

    let card_div = document.createElement('div');
    card_div.setAttribute('class', 'activity-card d-flex justify-content-between');

    let img_tag = document.createElement('img');
    img_tag.src = adventure.image;
    let text1 = addTextInAdventure(adventure.name, '₹' + adventure.costPerHead);
    let text2 = addTextInAdventure('Duration', adventure.duration + ' Hours');
    text1.setAttribute('class', 'p-2');
    text2.setAttribute('class', 'px-2');

    let category = document.createElement('div');
    category.setAttribute('class', 'category-banner');
    let category_name = document.createElement('P');
    category_name.innerText = adventure.category;
    category.appendChild(category_name);

    card_div.appendChild(img_tag);
    link.appendChild(category);
    card_div.appendChild(text1);
    card_div.appendChild(text2);

    link.appendChild(card_div);
    row_div.appendChild(col_div);
  });
}

function filterByDuration(list, low, high) {
  list = list.filter((element) => {
    return (element.duration >= low && element.duration <= high);
  });
  return list;
}

function filterByCategory(list, categoryList) {
  list = list.filter((element) => {
    return categoryList.includes(element.category);
  });
  return list;
}


function filterFunction(list, filters) {
  if(filters['category'].length !== 0) {
    list = filterByCategory(list, filters['category']);
  }
  if(filters['duration'] !== "") {
    debugger;
    let low, high;
    [low, high] = filters['duration'].split('-');
    list = filterByDuration(list, low, high);
  }

  return list;
}

function saveFiltersToLocalStorage(filters) {
  localStorage.setItem('filters', JSON.stringify(filters));
  return true;
}

function getFiltersFromLocalStorage() {
  if(localStorage.getItem('filters') !== null) {
    return JSON.parse(localStorage.getItem('filters'));
  }
  return null;
}

function generateFilterPillsAndUpdateDOM(filters) {
  if(filters['category'].length !== 0) {
    let category_list = document.getElementById('category-list');
    filters['category'].forEach((category) => {
      let cat_div = document.createElement('div');
      cat_div.setAttribute('class', 'category-filter');
      cat_div.innerText = category;
      category_list.appendChild(cat_div);
    });
  }
  if(filters['duration'] !== "") {
    let indx = 0;
    let liz = document.getElementById('duration-select').children;
    for(let i = 0; i < liz.length; i++) {
      if(liz[i].value == filters['duration']){
          indx = i;
          break;
      }
    }
    document.getElementById("duration-select").selectedIndex = indx;
  }
}
export {
  getCityFromURL,
  fetchAdventures,
  addAdventureToDOM,
  filterByDuration,
  filterByCategory,
  filterFunction,
  saveFiltersToLocalStorage,
  getFiltersFromLocalStorage,
  generateFilterPillsAndUpdateDOM,
};
