const express = require('express')
const app = express()
const mysql = require('mysql')
const bodyParser = require('body-parser')
const cors = require('cors')
var pdf = require('pdf-creator-node')
var fs = require('fs-extra')
const { all } = require('express/lib/application')
var detailedHtml = fs.readFileSync('./html/detailed.html', 'utf-8')
var summaryHtml = fs.readFileSync('./html/summary.html', 'utf-8')
const mysqldump=require('mysqldump')
const moment = require('moment')

var http = require('http')
const { Console } = require('console')
const { report } = require('process')

const runningPort = 3001
const dbHost = 'localhost'
const dbUser = 'root'
const dbPasswrord = 'Michael200!'
const dbPort = 3306

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))


var options = {
  format: 'A4',
  orientation: 'landscape',
  border: '10mm',
  header: {
    height: '20mm',
    contents:
      '<div style="text-align: center;">Cactus Hotel</div>',
  },
  footer: {
    height: '20mm',
    contents: {
      default:
        '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
    },
  },
}

function float2int(value) {
  return value | 0
}

// db credentials
const db = mysql.createPool({
  host: dbHost ,
  user: dbUser,
  password: dbPasswrord,
  database: 'hourcheck',
  port: dbPort,
  multipleStatements: true,
})

// const db=mysql.createPool({
//     host:'192.168.15.114',
//     user:"root",
//     password:"Michael200!",
//     database:'hourcheck',
//     port:3306,
//     multipleStatements: true
// })

//get roles
app.get('/api/getroles', (req, res) => {
  const getRoles = 'SELECT role from roles'
  db.query(getRoles, (err, result) => {
    if (err) {
      res.send({ checkMessage: 'ERROR!' })
      console.log(err)
    } else {
      res.send({ result, checkMessage: 'Got all users sucessfully' })
      console.log('Got all users sucessfully')
    }
  })
})

//adding new user
app.post('/api/newUser', (req, res) => {
  const firstname = req.body.firstname.trim()
  const username = req.body.username.trim()
  const password = req.body.password.trim()
  const role = req.body.role
  const supervisorPass = req.body.supervisorPass.trim()
  var allUsers
  const getUsers =
    "SELECT username FROM Users;SELECT password FROM roles WHERE role='supervisor'"
  db.query(getUsers, (err, result) => {
    if (err) {
      res.send({ checkMessage: 'Server Error!' })
      console.log(err)
    } else {
      allUsers = result[0].map((user) => {
        return user.username
      })
      if (
        username.length === 0 ||
        password.length === 0 ||
        firstname.length === 0
      ) {
        res.send({ checkMessage: 'Please fill all fields!' })
      } else if (username.length > 10) {
        res.send({ checkMessage: 'Maximum username length: 10 characters' })
      } else if (isNaN(password) || password.length > 10) {
        res.send({
          checkMessage:
            'Password should be a number with a maximum length of: 10 numbers',
        })
      } else if (firstname.length > 30) {
        res.send({ checkMessage: 'Maximum firstname length: 30 charcters' })
      } else if (allUsers.includes(username)) {
        res.send({ checkMessage: 'Username Already Exists!' })
      } else if (!role) {
        res.send({ checkMessage: 'Please select role!' })
      } else {
        if (role === 'supervisor') {
          if (supervisorPass == result[1][0].password) {
            const newUser =
              'INSERT INTO Users(firstname,username,password,role) VALUES (?,?,?,?)'
            db.query(
              newUser,
              [firstname, username, password, role],
              (err, result) => {
                if (err) {
                  console.log(err)
                  res.send({ checkMessage: 'Server Error!' })
                } else {
                  res.send({ result, checkMessage: 'User added sucessfully' })
                  console.log('User added sucessfully')
                }
              },
            )
          } else if (supervisorPass == '') {
            res.send({ checkMessage: 'Please enter Supervisor Password' })
          } else if (supervisorPass !== result[1][0].password) {
            res.send({ checkMessage: 'Wrong Supervisor Password!' })
          } else {
            res.send({
              checkMessage: 'Something went wrong with supervisor password!',
            })
          }
        } else {
          const newUser =
            'INSERT INTO Users(firstname,username,password,role) VALUES (?,?,?,?)'
          db.query(
            newUser,
            [firstname, username, password, role],
            (err, result) => {
              if (err) {
                console.log(err)
                res.send({ checkMessage: 'Server Error!' })
              } else {
                res.send({ result, checkMessage: 'User added sucessfully' })
                console.log('User added sucessfully')
              }
            },
          )
        }
      }
    }
  })
})

//getting user for login
app.post('/api/login', (req, res) => {
  const username = req.body.username
  const password = req.body.password
  getUserQuery =
    'SELECT username,password,firstname,lastCheckIn,role FROM Users WHERE username=? AND password=?'
  db.query(getUserQuery, [username, password], (error, result) => {
    if (error) {
      console.log(error)
      res.send(error)
    } else {
      if (result.length > 0) {
        res.send(result)
      } else {
        if (result.length == 0) {
          res.send({ checkMessage: 'Wrong Username or password!' })
        } else {
          console.log(error)
          res.send({ checkMessage: 'Server Error!' })
        }
      }
    }
  })
})

//post checkIn
app.post('/api/checkInPost', (req, res) => {
  const username = req.body.username
  const datetime = req.body.datetime
  const checkInCheckQuery = 'SELECT lastCheckIn FROM Users WHERE username=?'
  db.query(checkInCheckQuery, [username], (err, result) => {
    if (err) {
      console.log(err)
      res.send({ checkMessage: 'Server error!' })
    } else {
      if (result.lastCheckIn != null) {
        res.send({
          checkMessage:
            'Already checked in! Please refresh page and login again!',
        })
      } else {
        const checkInQuery = 'UPDATE Users SET lastCheckIn=? WHERE username=?'
        db.query(checkInQuery, [datetime, username], (err, result) => {
          if (err) {
            console.log(err)
            res.send({ checkMessage: 'Server error!' })
          } else {
            const query = 'SELECT lastCheckIn FROM Users WHERE username=?'
            db.query(query, [username], (err, result) => {
              if (err) {
                console.log(err)
                res.send({ checkMessage: 'Server error!' })
              } else {
                console.log('Checked In! ', result[0].lastCheckIn)
                res.send({
                  checkMessage: `Checked in at: ${result[0].lastCheckIn}`,
                  lastCheckIn: result[0].lastCheckIn,
                })
              }
            })
          }
        })
      }
    }
  })
})

//get last checkin time&date
app.get('/api/getCheckIn', (req, res) => {
  const username = req.query.username
  const getQuery = 'SELECT lastCheckIn from Users where username=?'
  db.query(getQuery, [username], (error, result) => {
    if (error) {
      res.send(error)
      console.log(error)
    } else {
      res.send(result)
      console.log('Got checkIn Sucesfuly!')
    }
  })
})

//checkOut
app.post('/api/checkOut', (req, res) => {
  const username = req.body.username
  const checkIn = req.body.checkIn
  const checkOut = req.body.checkOut
  const totalHours = req.body.totalHours
  const comments = req.body.comments
  const checkOutQuery =
    'INSERT INTO hours (username,checkIn,checkOut,totalHours,comments) VALUES (?,?,?,?,?);'
  const deleteCheckInQuery =
    'UPDATE Users SET lastCheckIn= NULL WHERE username=?'
  const finalQuery = checkOutQuery + deleteCheckInQuery
  if (comments.length > 250) {
    res.send({ checkMessage: 'Maximum comment character length: 250 chars' })
  } else {
    db.query(
      finalQuery,
      [username, checkIn, checkOut, totalHours, comments, username],
      (err, result) => {
        if (err) {
          console.log(err)
          res.send({ checkMessage: 'Server Error!' })
        } else {
          const query = 'SELECT lastCheckIn FROM Users WHERE username=?'
          db.query(query, [username], (err, result) => {
            if (err) {
              console.log(err)
              res.send({ checkMessage: 'Server Error!' })
            } else {
              if (result[0].lastCheckIn == null) {
                console.log('Check out successful')
                res.send({ checkMessage: 'Check out sucessfull!' })
              } else {
                console.log('Server Error!')
              }
            }
          })
        }
      },
    )
  }
})

//get all users except of supervisors
app.get('/api/getAllUsers', (req, res) => {
  const myQuery =
    "select * from Users where role not like 'supervisor';SELECT * from roles"
  db.query(myQuery, (err, result) => {
    if (err) {
      console.log(err)
      res.send({ checkMessage: 'Server Error!' })
    } else {
      console.log('Got users succesfully')
      res.send(result)
    }
  })
})

//Get all supervisors except from logged in one
app.post('/api/getAllSupervisors', (req, res) => {
  username = req.body.username
  const supervisorQuery =
    "SELECT * FROM Users WHERE role='supervisor' and username <> ? and username <>'superUser'"
  db.query(supervisorQuery, [username], (err, result) => {
    if (err) {
      console.log(err)
      res.send({ checkMessage: 'Server Error!' })
    } else {
      console.log('Got supervisors sucessfully')
      res.send({ result: result })
    }
  })
})

//Update Users
app.post('/api/updateUser', (req, res) => {
  const firstname = req.body.firstname
  const newUsername = req.body.username
  const password = req.body.password
  const role = req.body.role
  const currentUsername = req.body.selectedUser
  const supervisorPass = req.body.supervisorPass
  if (
    newUsername === '' ||
    password === '' ||
    currentUsername === '' ||
    firstname === '' ||
    role === ''
  ) {
    res.send({ checkMessage: 'Please fill all fields' })
  } else if (newUsername.length > 10) {
    res.send({ checkMessage: 'Maximum username length: 10 charcters' })
  } else if (isNaN(password) || password.length > 10) {
    res.send({
      checkMessage:
        'Password should be a number with a maximum length of: 10 numbers',
    })
  } else if (firstname.length > 30) {
    res.send({ checkMessage: 'Maximum firstname length: 30 charcters' })
  } else {
    //query to check for usernames
    const checkUsernameQuery =
      "select * from Users where username=?;select password from roles where role='supervisor'"
    db.query(checkUsernameQuery, [newUsername], (err, result) => {
      if (err) {
        console.log(err)
        res.send({ checkMessage: 'Server Error!' })
      } else {
        //if the username is the same
        if (newUsername === currentUsername) {
          //if it is supervisor
          if (role === 'supervisor') {
            if (supervisorPass === '') {
              res.send({ checkMessage: 'Please enter supervisor password!' })
            } else if (supervisorPass !== result[1][0].password) {
              res.send({ checkMessage: 'Wrong Supervisor Password' })
            } else if (supervisorPass === result[1][0].password) {
              const superQuery =
                'UPDATE Users SET firstname=?,password=?,role=? WHERE username=?'
              db.query(
                superQuery,
                [firstname, password, role, newUsername],
                (err, result) => {
                  if (err) {
                    console.log(err)
                    res.send({ checkMessage: 'Server Error!' })
                    console.log(err)
                  } else {
                    res.send({ checkMessage: 'Sucessfull!' })
                    console.log('User Updated Sucessfully!')
                  }
                },
              )
            }
          }
          //if not supervisor
          else {
            const updateUserWithSameUsrename =
              'UPDATE Users SET firstname=?,password=?,role=? WHERE username=?'
            db.query(
              updateUserWithSameUsrename,
              [firstname, password, role, newUsername],
              (err, result) => {
                if (err) {
                  console.log(err)
                  res.send({ checkMessage: 'Server Error!' })
                  console.log(err)
                } else {
                  res.send({ checkMessage: 'Sucessfull!' })
                  console.log('User Updated Sucessfully!')
                }
              },
            )
          }
        }
        //if the username exists
        else if (currentUsername !== newUsername && result[0].length !== 0) {
          res.send({ checkMessage: 'Username Already Exists!' })
        }
        //if username changed and doesn't exist
        else if (currentUsername !== newUsername && result[0].length === 0) {
          //if it is supervisor
          if (role === 'supervisor') {
            if (supervisorPass === '') {
              res.send({ checkMessage: 'Please enter supervisor password!' })
            } else if (supervisorPass !== result[1][0].password) {
              res.send({ checkMessage: 'Wrong Supervisor Password' })
            }
            //if supervisor password is right
            else if (supervisorPass === result[1][0].password) {
              const superQuery =
                'UPDATE Users SET firstname=?,password=?,role=?,username=? WHERE username=?'
              db.query(
                superQuery,
                [firstname, password, role, newUsername, currentUsername],
                (err, result) => {
                  if (err) {
                    console.log(err)
                    res.send({ checkMessage: 'Server Error!' })
                  } else {
                    res.send({ checkMessage: 'Sucessfull!' })
                    console.log('User Updated Sucessfully!')
                  }
                },
              )
            }
          }
          //if role is not supervisor
          else {
            const updateUserWithSameUsrename =
              'UPDATE Users SET firstname=?,password=?,role=?,username=? WHERE username=?'
            db.query(
              updateUserWithSameUsrename,
              [firstname, password, role, newUsername, currentUsername],
              (err, result) => {
                if (err) {
                  console.log(err)
                  res.send({ checkMessage: 'Server Error!' })
                } else {
                  res.send({ checkMessage: 'Sucessfull!' })
                  console.log('User Updated Sucessfully!')
                }
              },
            )
          }
        } else {
          res.send({ checkMessage: 'Something went wrong!' })
        }
      }
    })
  }
})


//getting all the users for reports
app.get('/api/getAllUsersForReports', (req, res) => {
  const getAllUsersQuery =
    "SELECT username,firstname,role FROM Users WHERE username <> 'superUser'"
  db.query(getAllUsersQuery, (err, result) => {
    if (err) {
      res.send({ checkMessage: 'Server Error!' })
      console.log(err)
    } else {
      res.send(result)
    }
  })
})

//create backup
app.get('/api/backup', (req, res) => {
  const now=moment()
  const timeanddate=now.format('hh:mm:ss DD-MM-yyyy')
  
  try{
    mysqldump({
      connection: {
          host: dbHost,
          user: dbUser,
          password: dbPasswrord,
          database: 'hourcheck',
      },
      dumpToFile: `./sqlBackups/${timeanddate}.sql`,
  });  
    res.send({checkMessage:"Backup Created! Please Check Backup Folder!"})
  }
  catch(err){
    console.log(err)
    res.send({checkMessage:"Server Error!"})
  }
})

//give report parameters and create pdf
app.post('/api/giveReportParams', (req, res) => {
  console.log("Requested!")
  const startDate = req.body.startDate
  let endDate = req.body.endDate
  let reportType = req.body.reportType
  const selectedUsers = req.body.selectedUsers
  let usersForQuery

  usersForQuery = selectedUsers.map((id) => "'" + id + "'").join()
    const query = `SELECT * FROM hours WHERE username IN (${usersForQuery}) AND  STR_TO_DATE(checkIn,"%Y-%m-%d") >= STR_TO_DATE(?,"%Y-%m-%d") <= STR_TO_DATE(?,"%Y-%m-%d") ORDER BY username ASC`
    db.query(query, [startDate, endDate], (err, result) => {
      if (err) {
        console.log(err)
        res.send({ checkMessage: 'Server Error!' })
      } else {
      if(endDate===null||startDate===null||reportType===undefined||selectedUsers===undefined){
        res.send({checkMessage:"Please fill all fields!"})
      }
      else{
        //array with all users
        result=result.map((u)=>{
            //make time the right thing
            let time=u.totalHours
            time=Number(time)
            const hours=Math.trunc(time)
            const minutes=Number(((time-hours)*100).toFixed(2))
            const stringForRep=` ${hours}h:${minutes}m`
            return{
                id:u.id,
                username:u.username,
                checkIn:u.checkIn,
                checkOut:u.checkOut,
                totalHours:hours,
                totalMinutes:minutes,
                comments:u.comments,
                hourStringForReport:stringForRep
              }})
        let allUsers=[]
        result.map((user)=>{
            if(!(allUsers.includes(user.username))){
                allUsers.push(user.username)
            }})
            //create structure with all the usernames
            let sortedData=allUsers.map((user)=>{
                return {
                    username:user,
                    data:[],
                    totalHours:null,
                }
            })
            //add the right data to the right object
            result.map((value)=>{
                sortedData.find((obj,index)=>{
                    if(obj.username===value.username){
                        sortedData[index].data.push(value)
                    }
                })
            })
            //calculate totalHours

            sortedData.map((object,index)=>{
                let totHours=0;
                let totMinutes=0;
                object.data.map((data)=>{
                    totHours+=data.totalHours
                    totMinutes+=data.totalMinutes
                })
                let hoursLeft=Math.floor(totMinutes/60)
                let minutesLeft=totMinutes%60
                totHours+=hoursLeft;
                totMinutes=parseInt(minutesLeft)
                const hourString=` ${totHours}h:${totMinutes}m`
                object.totalHours=hourString})

                //time and date for pdf
                const now=moment()
                const timeanddate=now.format('hh:mm:ss DD-MM-yyyy')

                if(reportType.value==="Detailed"){
                var document = {
                    html: detailedHtml,
                    data: {
                        dates: [{startDate:startDate,
                                endDate:endDate}],
                        users: sortedData
                    },
                    path: `./pdfs/Detailed_${timeanddate}.pdf`,
                };
                pdf.create(document, options)
                .then((result) => {
                  res.status(200).setHeader('Access-Control-Allow-Origin','*').send({checkMessage:"OK!"})
                  console.log("pdf crreated! result: ",result)
                })
                .catch((error) => {
                  res.status(200).send({checkMessage:"Server pdf creating error!"})
                  console.log("Detailed error!: ",error)
                });
            }
            else if(reportType.value==="Summary"){
                const summaryData=sortedData.map((d)=>{
                    return{
                        username:d.username,
                        totalHours:d.totalHours
                    }
                })
                var document = {
                    html: summaryHtml,
                    data: {
                        dates: [{startDate:startDate,
                                endDate:endDate}],
                        users:summaryData
                    },
                    path: `./pdfs/Summary_${timeanddate}.pdf`,
                };
                pdf.create(document, options)
                .then((result) => {
                    console.log(result);
                    res.send({checkMessage:"Pdf Createrd!"})
                  })
                .catch((error) => {
                  res.status(200).send({checkMessage:"Server pdf creating error!"})
                  console.log(error)
                });
            }
      }
    }
  })
})

process.on('uncaughtException', function(err) {
  // Handle the error safely
  console.log(err)
})

app.get('/api/pdf', (req, res) => {
  res.contentType('application/pdf')
  res.sendFile(`${__dirname}/pdfs/report.pdf`,function(err){
    if(err){
      console.log(err)
    }
    else{
      console.log("Sent!")
    }
  })
})


app.listen(runningPort, () => {
  console.log(`running on port ${runningPort}`)
})

process.on('uncaughtException', function (exception) {
  console.log(exception);
});

//to run: runningPort=3001 dbHost='127.0.0.1' dbUser='root' dbPassword='Michael200!' dbPort=3306 nodemon index.js

//runningPort=3001 dbHost='127.0.0.1' dbUser='root' dbPassword='Michael200!' dbPort=3306 pm2 start index.js --name "hourServer" --watch --log
//pm2 stop hourServer

//META TO ELSE
//array with all users
// result=result.map((u)=>{
//     //make time the right thing
//     let time=u.totalHours
//     time=Number(time)
//     const hours=Math.trunc(time)
//     const minutes=Number(((time-hours)*100).toFixed(2))
//     const stringForRep=` ${hours}h:${minutes}m`
//     return{
//         id:u.id,
//         username:u.username,
//         checkIn:u.checkIn,
//         checkOut:u.checkOut,
//         totalHours:hours,
//         totalMinutes:minutes,
//         comments:u.comments,
//         hourStringForReport:stringForRep
//     }
// })
// let allUsers=[]
// result.map((user)=>{
//     if(!(allUsers.includes(user.username))){
//         allUsers.push(user.username)
//     }
// })
// //create structure with all the usernames
// let sortedData=allUsers.map((user)=>{
//     return {
//         username:user,
//         data:[],
//         totalHours:null,
//     }
// })
// //add the right data to the right object
// result.map((value)=>{
//     sortedData.find((obj,index)=>{
//         if(obj.username===value.username){
//             sortedData[index].data.push(value)
//         }
//     })
// })

// //calculate totalHours

// sortedData.map((object,index)=>{
//     let totHours=0;
//     let totMinutes=0;
//     object.data.map((data)=>{
//         totHours+=data.totalHours
//         totMinutes+=data.totalMinutes
//     })
//     let hoursLeft=Math.floor(totMinutes/60)
//     let minutesLeft=totMinutes%60
//     totHours+=hoursLeft;
//     totMinutes=parseInt(minutesLeft)
//     const hourString=` ${totHours}h:${totMinutes}m`
//     object.totalHours=hourString
// })

// if(reportType==="Detailed"){

//     var document = {
//         html: detailedHtml,
//         data: {
//             dates: [{startDate:startDate,
//                     endDate:endDate}],
//             users: sortedData
//         },
//         path: "./pdfs/report.pdf",
//     };
//     pdf.create(document, options)
//     .then((result) => {
//         res.status(200).send({checkMessage:"Pdf Created"});
//     })
//     .catch((error) => {
//         res.send({checkMessage:"Server pdf creating error!"})
//         console.log(error)

//     });
// }
// else if(reportType==="Summary"){
//     const summaryData=sortedData.map((d)=>{
//         return{
//             username:d.username,
//             totalHours:d.totalHours
//         }
//     })
//     var document = {
//         html: summaryHtml,
//         data: {
//             dates: [{startDate:startDate,
//                     endDate:endDate}],
//             users:summaryData
//         },
//         path: "./pdfs/report.pdf",
//     };
//     pdf.create(document, options)
//     .then((result) => {
//         console.log(result);
//         res.status(200).send({checkMessage:"Pdf Created"});

//     })
//     .catch((error) => {
//         res.send({checkMessage:"Serve pdf creating error!"})
//         console.log(error)
//     });
// }


