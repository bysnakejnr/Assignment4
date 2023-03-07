/*********************************************************************************
* WEB700 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Baris Berber Student ID: 133731224 Date: 17 February 2023
*
********************************************************************************/ 

const express = require("express");
const app = express();
const path = require("path");
const db = require("./modules/collegeData");



const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get(['/','/home'], (req,res)=>{
res.sendFile(path.join(__dirname, "/views/home.html"));
});




app.get("/students", (req, res) => {

    if (req.query.course) {
      let courseNo = req.query.course;
      db.getStudentsByCourse(courseNo).then((data) => {
        res.json(data);
      });
    } else {
      db.getAllStudents().then((data) => {
        res.json(data);
      });
    }
  });



app.get("/students/add", (req,res)=>{
  res.sendFile(path.join(__dirname, "/views/addStudent.html"))
  })

    
app.post("/students/add",(req,res)=>{
req.body.course = +req.body.course;
req.body.TA = (req.body.TA) ? true : false
db.getAllStudents().then((data)=>{
  req.body.studentNum = data.length + 1;
})
  db.addStudent(req.body).then(()=>{
    {
      res.redirect("/students");
    }
    });

});


app.get("/tas",(req,res)=>{
        db.getTAs().then(data=>{
            res.json(data);
        });
    });



app.get("/courses", (req,res)=>{
        db.getAllCourses().then(data=>{
            res.json(data);
        });
    });


app.get("/students/:num", (req,res)=>{
    let num = req.params.num;
        db.getStudentsByNum(num).then(data=>{
            if(data.length==0){
                res.send(`There is no student with the number ${num}`)
            }
            else
            res.json(data)
        });
    });

app.get("/courses/:num", (req,res)=>{
  let num = req.params.num;
      db.getStudentsByCourse(num).then(data=>{
          if(data.length==0){
              res.send(`There is no course with the number ${num}`)
          }
          else
          res.json(data)
      });
  });


app.get("/about", (req,res)=>{
    res.sendFile(path.join(__dirname, "/views/about.html"));
    });

app.get("/htmlDemo", (req,res)=>{
    res.sendFile(path.join(__dirname, "/views/htmlDemo.html"));
    });


app.use((req,res,next)=>{ // custom 404 
    res.status(404).sendFile(path.join(__dirname,"/views/err.html"))
     });


if (
  db.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("server listening on: " + HTTP_PORT);
    })
  }).catch((err)=>{
    console.log('There was a problem starting initializer. Error : ' + err);
  
  })
);