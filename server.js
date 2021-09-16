const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
// const Resumedb = require("./models/resume"); 

const Resume = require("./models/resume");

const config = require('./DB');
const userRoute = require('./routes/UserRoute');

const PORT = process.env.PORT || 5000;

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect(config.DB).then(
  () => { console.log('Database is connected') },
  err => { console.log('Can not connect to the database' + err) }
);

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


let corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200
}


app.use(cors(corsOptions))
app.use(express.static("dist/angularjwtauth"));
app.use('/api/users', userRoute);


// if(process.env.NODE_ENV =='production') {

// }

// app.get('/', function (req, res) {
//   res.send('hello world')
// })


app.post("/resume", async(req, res) => {
  let resumeData = {
      userid: req.userId,
      fullname: req.body.fullname,
      position: req.body.position,
      email: req.body.email,
      mobile: req.body.mobile,
      address: req.body.address,
      skills: req.body.skills,
      linkedin: req.body.linkedin,
      facebook: req.body.facebook,
      instagram: req.body.instagram,
      languages: req.body.languages,
      objective: req.body.objective,
      experience: req.body.experience,
      project: req.body.project,
      certification: req.body.certification,
      education: req.body.education,
  };

  const resumeExit = await Resume.findOne({ userid: req.userId });
  if (resumeExit) {
      Resume.findOneAndUpdate({ userid: req.userId }, resumeData, (err, user) => {
          if (err) {
              res.status(401).send(err);
          } else {
              res.status(200).send({ message: "sucess" });
          }
      });
      return;
  }

  let resume = new Resume(resumeData);
  resume.save((error, savedResume) => {
      if (error) {
          res.status(401).send(err);
      } else {
          res.status(200).send({ message: "success" });
      }
  });
});

app.get("/template",  (req, res) => {
  Resume.findOne({ userid: req.userId }, (err, template) => {
      if (err) {
          res.status(400).send(err);
      } else {
          res.status(200).send(template);
      }
  });
});

app.get("*", (req, res)=>{
  res.sendFile(__dirname + "/dist/angularjwtauth/index.html")
})


app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
