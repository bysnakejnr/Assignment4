/*********************************************************************************
* WEB700 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Baris Berber Student ID: 133731224 Date: 09 March 2023
*
* Online (Cyclic) Link: https://shy-jade-millipede-tam.cyclic.app/
*
********************************************************************************/ 

const express = require("express");
const app = express();
const path = require("path");
const db = require("./modules/collegeData");
const exphbs = require('express-handlebars');
app.engine('.hbs', exphbs.engine({ extname: '.hbs',
helpers:{
  navLink: function(url, options){
    return '<li' +
    ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
    '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
   },
   equal: function (lvalue, rvalue, options) {
    if (arguments.length < 3)
    throw new Error("Handlebars Helper equal needs 2 parameters");
    if (lvalue != rvalue) {
    return options.inverse(this);
    } else {
    return options.fn(this);
    }
   },
   checker: function(lval, rval, options){
    if(lval != rval){
      return options.fn(this);
    }
    else{
      return "selected" + options.fn(this);
    }
   }
       
} }));
app.set('view engine', '.hbs');



const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(function(req,res,next){
  let route = req.path.substring(1);
  app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
  next();
 });
 

app.get(['/','/home'], (req,res)=>{
res.render('home');
});




app.get("/students", (req, res) => {

    if (req.query.course) {
      let courseNo = req.query.course;
      db.getStudentsByCourse(courseNo).then((data) => {
        res.render('students',{
          students: data
        });
      });
    } else {
      db.getAllStudents().then((data) => {
        res.render('students',{
          students: data
        });
      });
    }
  });



app.get("/students/add", (req,res)=>{
  res.render('addStudent');
  })

    
app.post("/students/add",(req,res)=>{

  db.addStudent(req.body).then(()=>{
    {
      res.redirect("/students");
    }
    });

});



app.get("/courses", (req,res)=>{
        db.getAllCourses().then(data=>{
            res.render('courses', {
              courses : data

            })
        });
    });


app.get("/student/:num", (req,res)=>{
    let num = req.params.num;
        db.getStudentsByNum(num).then(data=>{
            if(data.length==0){
                res.send(`There is no student with the number ${num}`)
            }
            else
            res.render("student", { student: data });
        });
    });

app.get("/courses/:num", (req,res)=>{
  let num = req.params.num;
      db.getStudentsByCourse(num).then(data=>{
          if(data.length==0){
              res.send(`There is no student with the course number ${num}`);
          }
          else
          res.json(data);
      });
  });


app.get("/course/:num", (req,res)=>{
  let num = req.params.num;
  db.getCourseById(num).then(data=>{
    if(data.length==0){
      res.send(`There is no course with the number ${num}`);
    }
    else{
    res.render(('course'),{
      course : data
    });
  }
  });
});


app.get("/about", (req,res)=>{
    res.render('about', {
      layout: false
    });
    });

app.get("/htmlDemo", (req,res)=>{
    res.render('htmlDemo');
    });


app.post("/student/update", (req, res) => {
      db.updateStudent(req.body).then(()=>{
        res.redirect("/students");
      })
  
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