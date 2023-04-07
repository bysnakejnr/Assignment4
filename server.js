/*********************************************************************************
* WEB700 – Assignment 06
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Baris Berber Student ID: 133731224 Date: 06 April 2023
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
        if(data.length>0){
        res.render('students',{
          students: data
        });
      }
      else{
        res.render('students',{ message: "no results" });
      }
      });
    } else {
      db.getAllStudents().then((data) => {
        if(data.length>0){
        res.render('students',{
          students: data
        });
      }
      else{
        res.render('students',{ message: "no results" });
      }
      });
    }
  });



app.get("/students/add", (req,res)=>{
  db.getAllCourses().then(data=>{
    res.render('addStudent', {courses:data});
  })
  
  })

    
app.post("/students/add",(req,res)=>{

  db.addStudent(req.body).then(()=>{
    {
      res.redirect("/students");
    }
    });

});

app.get("/courses/add", (req,res)=>{
  res.render('addCourse');
  })

    
app.post("/courses/add",(req,res)=>{

  db.addCourse(req.body).then(()=>{
    {
      res.redirect("/courses");
    }
    });

});



app.get("/courses", (req,res)=>{
        db.getAllCourses().then(data=>{
          if(data.length>0){
            res.render('courses', {
              courses : data

            })
          }
          else{
            res.render('courses',{
              message: "No results returned."
            });
            
          }
        });
    });


app.get("/student/:num", (req,res)=>{
    let num = req.params.num;
    let viewData = {};
        db.getStudentsByNum(num).then(data=>{
          if (data) {
            viewData.student = data; //store student data in the "viewData" object as "student"
            console.log(viewData.student);
          }
          else {
            viewData.student = null; // set student to null if none were returned
            }
          }).catch(() => {
            viewData.student = null; // set student to null if there was an error
            }).then(db.getAllCourses)
            .then((data) => {
            viewData.courses = data; // store course data in the "viewData" object as "courses"
            // loop through viewData.courses and once we have found the courseId that matches
            // the student's "course" value, add a "selected" property to the matching
            // viewData.courses object
            // loop through viewData.courses and once we have found the courseId that matches
 // the student's "course" value, add a "selected" property to the matching
 // viewData.courses object
 for (let i = 0; i < viewData.courses.length; i++) {
  if (viewData.courses[i].courseId == viewData.student.course) {
  viewData.courses[i].selected = true;
  }
  }
  }).catch(() => {
  viewData.courses = []; // set courses to empty if there was an error
  }).then(() => {
  if (viewData.student == null) { // if no student - return an error
  res.status(404).send("Student Not Found");
  } else {
  res.render("student", { viewData: viewData }); // render the "student" view
  }
  });
 });

app.get("/courses/:num", (req,res)=>{
  let num = req.params.num;
      db.getStudentsByCourse(num).then(data=>{
          if(data.length==0){
              res.send(`There is no student with the course number ${num}`);
          }
          else
          res.render(('students'),{
            students : data
          });
      });
  });

  app.get("/course/delete/:id", (req,res)=>{
    let id = req.params.id;
        db.deleteCourse(id).then(()=>{
          res.redirect('/courses')
        })
        
      });

  app.get("/students/delete/:id", (req,res)=>{
        let id = req.params.id;
            db.deleteStudent(id).then(()=>{
              res.redirect('/students')
            })
            
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

app.post("/course/update", (req, res) => {
      db.updateCourse(req.body).then(()=>{
        res.redirect("/courses");
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