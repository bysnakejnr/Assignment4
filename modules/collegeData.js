const Sequelize = require('sequelize');
var sequelize = new Sequelize('byyqkirj', 'byyqkirj', 'BAwdsuirsgPWQhCyn7mgIrXO7TEI6d6_', {
 host: 'suleiman.db.elephantsql.com',
 dialect: 'postgres',
 port: 5432,
 dialectOptions: {
 ssl: { rejectUnauthorized: false }
 },
 query:{ raw: true }
});

//defining the model
var Student = sequelize.define('Student', {
  studentNum: {
    type: Sequelize.INTEGER,
    primaryKey: true, // use "project_id" as a primary key
    autoIncrement: true // automatically increment the value
},
  firstName: Sequelize.Sequelize.STRING,
  lastName: Sequelize.Sequelize.STRING,
  email: Sequelize.Sequelize.STRING,
  addressStreet: Sequelize.Sequelize.STRING,
  addressCity: Sequelize.Sequelize.STRING,
  addressProvince: Sequelize.Sequelize.STRING,
  TA: Sequelize.BOOLEAN,
  status: Sequelize.STRING,
  course: Sequelize.INTEGER


});

//defining the model
var Course = sequelize.define('Course', {
  courseId: {
    type: Sequelize.INTEGER,
    primaryKey: true, // use "project_id" as a primary key
    autoIncrement: true // automatically increment the value
},
courseCode: Sequelize.Sequelize.STRING,
courseDescription: Sequelize.Sequelize.STRING


});

Course.hasMany(Student, {foreignKey: 'course'});

module.exports.initialize = function () {
  return new Promise(function (resolve, reject) {
      if(sequelize.sync()){
        

        resolve("Operation was a success!");
      }
      else{
        reject("unable to sync the database");
      }
    

  });
};



module.exports.getAllStudents = function () {
  return new Promise(function (resolve, reject) {
    let allStudents = Student.findAll();
    if(allStudents!=-1){
      resolve(Student.findAll());
    }
    else{
      reject("No results returned.");
    }

  });
};

module.exports.getStudentsByCourse = function(num){
  return new Promise(function (resolve, reject) {
  Student.findAll({
    attributes: ['studentNum','firstName', 'lastName','email','addressStreet','addressCity','addressProvince','status','course'],
  where: {course:num}
  }).then((data)=>{
    resolve(data)
  }).catch(err=>{
    reject(err)
  })
})
};


module.exports.getStudentsByNum = function(num){
  return new Promise(function (resolve, reject) {
    Student.findAll({
      attributes: ['studentNum','firstName', 'lastName','email','addressStreet','addressCity','addressProvince','status','course'],
    where: {studentNum:num}
    }).then((data)=>{
      resolve(data[0]);
    }).catch(err=>{
      reject(err);
    })
  });
};


module.exports.getAllCourses = function () {
  return new Promise(function (resolve, reject) {
    Course.findAll({
      attributes: ['courseId','courseCode', 'courseDescription']
    }).then((data)=>{
      resolve(data)
    }).catch(err=>{
      reject(err)
    })
  });
};



module.exports.getCourseById = function(id) {
  return new Promise(function (resolve, reject) {
    Course.findAll({
      attributes: ['courseId','courseCode', 'courseDescription'],
      where: {courseId:id}
    }).then((data)=>{
      resolve(data[0])
    }).catch(err=>{
      reject(err)
    })
  });
};


module.exports.updateStudent = function(formData) {
  return new Promise(function (resolve, reject) {
    formData.TA = (formData.TA) ? true : false;
    for(const property in formData){
      if(property==""){
        property==null;
      }
    }
    Student.update(formData,{
      where:{
        studentNum:formData.studentNum
      }
  }).then(function(){ 
    console.log("Entry was successfully updated")
    resolve();
}).catch(err=>{
      reject(err);
  });
  });
};

module.exports.addStudent = function(formData) {
  return new Promise(function (resolve, reject) {
    formData.TA = (formData.TA) ? true : false;
    for(const property in formData){
      if(property==""){
        property==null;
      }
    }
    Student.create({
      firstName: formData.firstName,
      lastName: formData.lastName,  
      email: formData.email,
      addressStreet: formData.addressStreet,
      addressCity: formData.addressCity,
      addressProvince: formData.addressProvince,
      TA: formData.TA,
      status: formData.status,
      course: formData.course
  }).then(function(){ 
    console.log("Entry was successfully created")
    resolve();
}).catch(err=>{
      reject(err);
  });
  });
};

module.exports.deleteStudent = function(num){
  return new Promise((resolve,reject)=>{
    Student.destroy({
      where: {
        studentNum: num
      }
    }).then(()=>{
      resolve();
    }).catch(err=>{
      reject("There was an error deleting the entry" + err);
    });
  });
}


module.exports.addCourse = function(formData) {
  return new Promise(function (resolve, reject) {
    for(const property in formData){
      if(property==""){
        property==null;
      }
    }
    Course.create({
    courseCode: formData.courseCode,
    courseDescription: formData.courseDescription
    
  }).then(()=>{ 
    console.log("Entry was successfully created")
    resolve();
}).catch(err=>{
      reject("Unable to create the course" + err);
  });
  });
};


module.exports.updateCourse = function(formData) {
  return new Promise(function (resolve, reject) {
    for(const property in formData){
      if(property==""){
        property==null;
      }
    }
    Course.update(formData,{
      where:{
        courseId:formData.courseId
      }
  }).then(function(){ 
    console.log("Entry was successfully updated")
    resolve();
}).catch(err=>{
      reject("There was a problem updating the entry." + err);
  });
  });
};

module.exports.deleteCourse = function(id){
  return new Promise((resolve,reject)=>{
    Course.destroy({
      where: {
        courseId: id
      }
    }).then(()=>{
      resolve();
    }).catch(err=>{
      reject("There was an error deleting the entry" + err);
    });
  });
}

