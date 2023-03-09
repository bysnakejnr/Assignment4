const fs = require("fs");
const { data } = require("jquery");
class Data {
  students;
  courses;

  constructor(students, courses) {
    this.students = students;
    this.courses = courses;
  }
}
let dataCollection=null;

module.exports.initialize = function () {
  return new Promise(function (resolve, reject) {
    fs.readFile("./data/students.json", "utf8", (err, studentData) => {
      if (err) {
        console.log(err);
        reject("Unable to read students.json, check your files!");
      } else {
        let studentsData = JSON.parse(studentData);
        fs.readFile("./data/courses.json", "utf8", (err, courseData) => {
          if (err) {
            reject("Unable to read courses.json, check your files!");
          } else {
            let coursesData = JSON.parse(courseData);
            dataCollection = new Data(studentsData, coursesData);
            resolve();
          }
        });
      }
    });
  })
};



module.exports.getAllStudents = function () {

  
  return new Promise((resolve, reject) => {
    if(dataCollection.courses.length==0){
      reject("No results returned")
    }
    else{
    resolve(dataCollection.students);
    }
  });
}


module.exports.getAllCourses = function () {
  return new Promise((resolve, reject) => {
    if(dataCollection.courses.length==0){
      reject("No results returned")
    }
    else{
      resolve(dataCollection.courses);
    }
    
  });
}

module.exports.getTAs = function(){
  return new Promise((resolve,reject) => {
    if(dataCollection.students.length == 0){
      reject("No results returned.");

    }
    else{
      let filteredStudent = dataCollection.students.filter(student => student.TA ==true);
    resolve(filteredStudent);
  }
});
}

module.exports.getStudentsByCourse = function(num){
  return new Promise((resolve,reject)=>{
    let courseStudents = dataCollection.students.filter(student => student.course == num);
    resolve(courseStudents);
    if(courseStudents.length==0){
      reject("No results returned.")
    }


  });
}


module.exports.getStudentsByNum = function(num){
  return new Promise((resolve,reject)=>{
    let courseStudents = dataCollection.students.filter(student => student.studentNum == num);
    resolve(courseStudents);
    if(courseStudents.length==0){
      reject("No results returned.")
    }


  });
}

module.exports.addStudent = function(formData) {
  return new Promise((resolve,reject)=>{
    
    formData.studentNum = dataCollection.students.length + 1;
    formData.course = +formData.course;
    formData.TA = (formData.TA) ? true : false;
    dataCollection.students.push(formData);
    resolve();


  })

}
