const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const User = require('./models/User');
const Truck = require('./models/Truck');
const TruckInfo = require('./models/TruckInfo');
const Intervention = require('./models/Intervention');
const Fournisseur = require('./models/Fournisseur');
const Reclamation = require('./models/Reclamation');
const Mission = require('./models/Mission');

const Contract = require('./models/Contract');
const Fuel = require('./models/Fuel');
const Cost = require('./models/Cost');

// Connect to Db

mongoose.connect(process.env.MONGO_URI_local, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Read JSON files
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);
const trucks = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/trucks.json`, 'utf-8')
);
const truckInfos = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/truckInfos.json`, 'utf-8')
);
const interventions = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/intervention.json`, 'utf-8')
);
const Fournisseurs = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/Fournisseur.json`, 'utf-8')
);

const reclamation = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reclamations.json`, 'utf-8')
);

const mission = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/Mission.json`, 'utf-8')
);

const contract = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/contract.json`, 'utf-8')
);

//Import into Db
const importData = async () => {
  try {
    //await Truck.create(trucks);
    // for (let user of users) {
    //   await new User(user).save();
    // }

    // await TruckInfo.create(truckInfos);
    await Intervention.create(interventions);
    await Fuel.create(interventions);
    await Cost.create(interventions);
    // await Fournisseur.create(Fournisseurs);
    // await Reclamation.create(reclamation);
    // await Mission.create(mission);
    // await Contract.create(contract);

    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

// Delete data
const deleteData = async () => {
  try {
    //await Truck.deleteMany();
    // await User.deleteMany();
    // await TruckInfo.deleteMany();
    await Intervention.deleteMany();
    await Fuel.deleteMany();
    await Cost.deleteMany();
    // await Fournisseur.deleteMany();
    // await Reclamation.deleteMany();
    // await Mission.deleteMany();
    // await Contract.deleteMany();

    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

// cmd: node seeder.js -i
if (process.argv[2] === '-i') {
  importData();
}
// cmd: node seeder.js -d
else if (process.argv[2] === '-d') {
  deleteData();
}
