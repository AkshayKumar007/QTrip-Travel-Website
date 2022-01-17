import config from "../conf/index.js";

function getAdventureIdFromURL(search) {
  var params = new URLSearchParams(search);
  let adv = params.get('adventure');
  return adv;
}
async function fetchAdventureDetails(adventureId) {
  let response = await fetch(config.backendEndpoint + `/adventures/detail?adventure=${adventureId}`);
  try {
    let data = await response.json();
    return data;
  }
  catch(e) {
    console.log(e);
  }

  return null;
}

function addAdventureDetailsToDOM(adventure) {
  let heading = document.getElementById('adventure-name');
  heading.innerHTML = adventure.name;

  let sub_heading = document.getElementById('adventure-subtitle');
  sub_heading.innerHTML = adventure.subtitle;

  let image_box = document.getElementById('photo-gallery');
  (adventure.images).forEach((image) => {
    let img = document.createElement('img');
    img.src = image;
    img.setAttribute('class', 'activity-card-image');
    image_box.appendChild(img);
  });

  let content = document.getElementById('adventure-content');
  content.innerText = adventure.content;
}

function addBootstrapPhotoGallery(images) {
  let n = images.length;
  let image_box = document.getElementById('photo-gallery');

  image_box.textContent = "";

  image_box.setAttribute('class', 'carousel slide');
  image_box.setAttribute('data-ride', 'carousel');
  image_box.setAttribute('id', 'carouselExampleIndicators');

  let slide_count = document.createElement('ol');
  slide_count.setAttribute('class', 'carousel-indicators');

  for(let i = 0; i < n; i++) {
    let ele = document.createElement('li');
    ele.setAttribute('data-target', '#carouselExampleIndicators');
    ele.setAttribute('data-slide-to', i);
    if(i === 0) {
      ele.setAttribute('class', 'active');
    }
    slide_count.appendChild(ele);
  }
  
  image_box.appendChild(slide_count);

  let image_div = document.createElement('div');
  image_div.setAttribute('class', 'carousel-inner');

  for(let i = 0; i < n; i++) {
    let image_item = document.createElement('div');
    if(i === 0) {
      image_item.setAttribute('class', 'active carousel-item');
    }
    else {
      image_item.setAttribute('class', 'carousel-item');
    }

    let img = document.createElement('img');
    img.src = images[i];
    img.setAttribute('class', 'activity-card-image d-block w-100');
    image_item.appendChild(img);
    image_div.appendChild(image_item);
  }
  
  image_box.appendChild(image_div);

  let prev_button = document.createElement('a');
  prev_button.setAttribute('class', 'carousel-control-prev');
  prev_button.href = "#carouselExampleIndicators";
  prev_button.setAttribute('role', 'button');
  prev_button.setAttribute('data-slide', 'prev');

  let prev_span1 = document.createElement('span');
  prev_span1.setAttribute('class', 'carousel-control-prev-icon');
  prev_span1.setAttribute('aria-hidden', 'true');

  let prev_span2 = document.createElement('span');
  prev_span2.setAttribute('class', 'sr-only');
  prev_span2.innerText = "Previous";


  prev_button.appendChild(prev_span1);
  prev_button.appendChild(prev_span2);
  //

  let next_button = document.createElement('a');
  next_button.setAttribute('class', 'carousel-control-next');
  next_button.href = "#carouselExampleIndicators";
  next_button.setAttribute('role', 'button');
  next_button.setAttribute('data-slide', 'next');

  let next_span1 = document.createElement('span');
  next_span1.setAttribute('class', 'carousel-control-next-icon');
  next_span1.setAttribute('aria-hidden', 'true');

  let next_span2 = document.createElement('span');
  next_span2.setAttribute('class', 'sr-only');
  next_span2.innerText = "Next";

  next_button.appendChild(next_span1);
  next_button.appendChild(next_span2);

  image_box.appendChild(prev_button);
  image_box.appendChild(next_button);
}

function conditionalRenderingOfReservationPanel(adventure) {
  if(adventure.available === true) {
    document.getElementById('reservation-panel-sold-out').style.display = "none";
    document.getElementById('reservation-panel-available').style.display = "block";
    document.getElementById('reservation-person-cost').innerHTML = adventure.costPerHead;
  }
  else {
    document.getElementById('reservation-person-cost').innerHTML = adventure.costPerHead;
    document.getElementById('reservation-panel-sold-out').style.display = "block";
    document.getElementById('reservation-panel-available').style.display = "none";
  }
  return;
}

function calculateReservationCostAndUpdateDOM(adventure, persons) {
  let num_of_persons = parseInt(persons);
  if(persons !== "" || !isNaN(num_of_persons)) {
    let total = num_of_persons * adventure.costPerHead;
    document.getElementById('reservation-cost').innerHTML = total;
  }
  else {
    document.getElementById('reservation-cost').innerHTML = 0;
  }
}

function captureFormSubmitUsingJQuery(adventure) {
  $("#myForm").submit(function(e) {
    debugger;
    $.ajax({
      url: config.backendEndpoint + '/reservations/new',
      type: 'post',
      data: $("#myForm").serialize() + "&adventure=" + adventure.id,
      success: function(data) {
        alert('Success!');
        location.reload(true);
      },
      error: function(xhr, text, error) {
        alert('Failed!');
      }
    });
  });
}

function showBannerIfAlreadyReserved(adventure) {
  if(adventure.reserved === true) {
    document.getElementById('reserved-banner').style.display = "block";
  }
  else {
    document.getElementById('reserved-banner').style.display = "none";
  }
}

export {
  getAdventureIdFromURL,
  fetchAdventureDetails,
  addAdventureDetailsToDOM,
  addBootstrapPhotoGallery,
  conditionalRenderingOfReservationPanel,
  captureFormSubmitUsingJQuery,
  calculateReservationCostAndUpdateDOM,
  showBannerIfAlreadyReserved,
};
