const express = require('express');
const cors = require('cors');
const lowDb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const bodyParser = require('body-parser');
const { nanoid, customAlphabet } = require('nanoid');
var dayjs = require('dayjs');
const db = lowDb(new FileSync('db.json'));
const app = express();
const random_data = require('./random_data');
var utc = require('dayjs/plugin/utc');
var timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Kolkata');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 8082;

app.get('/cities', (req, res) => {
  const data = db.get('cities').value();
  return res.json(data);
});

app.get('/adventures', (req, res) => {
  const data = db.get('adventures').value();
  let response = (data.find((item) => item.id == req.query.city) || [])
    .adventures;
  if (response) return res.json(response);
  else
    return res.status(400).send({
      message: `Adventure not found for ${req.query.city}!`,
    });
});

app.get('/adventures/detail', (req, res) => {
  const data = db.get('detail').value();
  let response = data.find((item) => item.id == req.query.adventure);
  if (response) return res.json(response);
  else
    return res.status(400).send({
      message: `Adventure details not found for ${req.query.adventure}!`,
    });
});

app.post('/reservations/new', (req, res) => {
  const reservation = req.body;
  const instance = db.get('detail').value();
  const nanoid = customAlphabet('1234567890abcdef', 16);
  let reqDate = dayjs(req.body.date);
  let currentDate = dayjs(new Date());

  if (reqDate > currentDate) {
    db.get('detail')
      .find((item) => item.id == req.body.adventure)
      .assign({ reserved: true, available: false })
      .write();
    const costPerHead = instance.find(
      (item) => item.id == req.body.adventure
    ).costPerHead;

    const adventureName = instance.find(
      (item) => item.id == req.body.adventure
    ).name;

    reservation.name = reservation.name
      .trim()
      .toLowerCase()
      .split(' ')
      .map((i, j) => i.charAt(0).toUpperCase() + i.slice(1))
      .join(' ');
    db.get('reservations')
      .push({
        ...reservation,
        adventureName: adventureName,
        price: reservation.person * costPerHead,
        id: nanoid(),
        time: new Date().toString(),
      })
      .write();
    return res.json({ success: true });
  } else {
    return res.status(400).send({
      message: `Date of booking is incorrect!`,
    });
  }
});

app.get('/reservations', (req, res) => {
  const data = db.get('reservations').value();
  if (data) return res.json(data);
});

app.post('/adventures/new', (req, res) => {
  let categories = ['Beaches', 'Cycling', 'Hillside', 'Party'];
  let places = random_data.places;

  let images_collection = random_data.images;
  let images = [];
  for (var i = 0; i < 3; i++) {
    let index = randomInteger(0, 100);
    images.push(images_collection[index]);
  }

  const city = req.body.city;
  const nanoid = customAlphabet('1234567890', 10);
  const id = nanoid();
  const name = places[Math.floor(Math.random() * places.length)];
  const price = randomInteger(500, 5000);
  const adventureDetail = {
    id: id,
    name: name,
    subtitle: 'This is a mind-blowing randomly generated adventure!',
    images: images,
    content:
      "A random paragraph can also be an excellent way for a writer to tackle writers' block. Writing block can often happen due to being stuck with a current project that the writer is trying to complete. By inserting a completely random paragraph from which to begin, it can take down some of the issues that may have been causing the writers' block in the first place. A random paragraph can also be an excellent way for a writer to tackle writers' block. Writing block can often happen due to being stuck with a current project that the writer is trying to complete. By inserting a completely random paragraph from which to begin, it can take down some of the issues that may have been causing the writers' block in the first place. A random paragraph can also be an excellent way for a writer to tackle writers' block. Writing block can often happen due to being stuck with a current project that the writer is trying to complete. By inserting a completely random paragraph from which to begin, it can take down some of the issues that may have been causing the writers' block in the first place. A random paragraph can also be an excellent way for a writer to tackle writers' block. Writing block can often happen due to being stuck with a current project that the writer is trying to complete.",
    available: true,
    reserved: false,
    costPerHead: price,
  };
  const adventuresData = {
    id: id,
    name: name,
    costPerHead: price,
    currency: 'INR',
    image: images[Math.floor(Math.random() * images.length)],
    duration: randomInteger(1, 20),
    category: categories[Math.floor(Math.random() * categories.length)],
  };

  let detail = db.get('detail');
  detail.push(adventureDetail).write();

  let adventures = db
    .get('adventures')
    .find((item) => item.id == city)
    .get('adventures')
    .value();

  adventures.push(adventuresData);
  db.get('adventures')
    .find((item) => item.id == city)
    .assign({ adventures })
    .write();

  res.json({ success: true, ...adventuresData });
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Backend is running on port ${process.env.PORT || PORT}`);
});

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
