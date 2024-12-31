var express = require("express");
var fileuploader = require("express-fileupload");
var mysql = require("mysql2");

var app = express();

app.listen(2003, function () {
   console.log("server started");
})

app.use(express.static("public"));
app.use(fileuploader());

app.get("/", function (req, resp) {
   resp.sendFile(process.cwd() + "/public/index.html");
})

app.get("/dash-donor", function (req, resp) {
   resp.sendFile(process.cwd() + "/public/dash-donor.html");
})

app.get("/profile-donor", function (req, resp) {
   resp.sendFile(process.cwd() + "/public/profile-donor.html");
})

app.get("/avail-med", function (req, resp) {
   resp.sendFile(process.cwd() + "/public/avail-med.html");
})

app.get("/dash-needy", function (req, resp) {
   resp.sendFile(process.cwd() + "/public/dash-needy.html");
})

app.get("/profile-needy", function (req, resp) {
   resp.sendFile(process.cwd() + "/public/profile-needy.html");
})

app.get("/dash-admin", function (req, resp) {
   resp.sendFile(process.cwd() + "/public/dash-admin.html");
})

app.get("/panel-users", function (req, resp) {
   resp.sendFile(process.cwd() + "/public/panel-users.html");
})

app.get("/panel-donors", function (req, resp) {
   resp.sendFile(process.cwd() + "/public/panel-donors.html");
})

app.get("/panel-needys", function (req, resp) {
   resp.sendFile(process.cwd() + "/public/panel-needys.html");
})

app.get("/med-manager", function (req, resp) {
   resp.sendFile(process.cwd() + "/public/med-manager.html");
})

app.get("/finder-med", function (req, resp) {
   resp.sendFile(process.cwd() + "/public/finder-med.html");
})

app.use(express.urlencoded(true));

//---------------------------DB Operations-------------------
//================Database Connectivity============
var dbConfig = {
   host: "127.0.0.1",
   user: "root",
   password: "Jindal@2004",
   database: "yatinproject",
   dateStrings: true
}

var dbCon = mysql.createConnection(dbConfig);
dbCon.connect(function (jasoos) {
   if (jasoos == null)
      console.log("Connected Successfulllyyy...");
   else
      console.log(jasoos);
})

//---------------------- SIGN-UP =========================

app.get("/chk-user", function (req, resp) {

   var email = req.query.kuchEmail;
   var pwd = req.query.kuchPwd;
   var type = req.query.kuchType;

   dbCon.query("insert into users(email,pwd,type,dos,status) values(?,?,?,current_date(),1)", [email, pwd, type], function (err) {
      if (err == null) {
         resp.send("Signed-Up successfully...");
      }
      else {
         resp.send(err.toString());
      }

   })
})

//---------------------email-existance =======================

app.get("/chk-email", function (req, resp) {

   var email = req.query.kuchEmail;

   dbCon.query("select * from users where email=?", [email], function (err, resultTable) {
      if (err == null) {
         if (resultTable.length == 1) {
            resp.send("(Already exists)");
         }
         else if (email == "")
            resp.send("(Fill the Email-Id)");
         else
            resp.send("(Available)");
      }
      else {
         resp.send(err.toString());
      }
   })
})

//-------------------------- LOGIN ================================

app.get("/login-user", function (req, resp) {

   var email = req.query.kuchEmail;
   var pwd = req.query.kuchPwd;

   dbCon.query("select * from users where email=?", [email], function (err, resultTable) {
      if (err == null) {

         if (resultTable.length == 1) {

            if (resultTable[0].pwd == pwd) {

               if (resultTable[0].status == 1)
                  resp.send(resultTable[0].type);
               else
                  resp.send("You are Blocked !!!");
            }
            else
               resp.send("(Incorrect Password)");
         }
         else
            resp.send("(Invalid User-ID)");
      }
      else {
         resp.send(err.toString());
      }
   })
})

//======================================================= DONOR =============================================================

//-------------------------------------- PROFILE-DONOR ====================================================

//----------------------profile-insert----------------------------
app.post("/profile-donor-process", function (req, resp) {

   var fileName = "nopic.jpg";
   if (req.files != null) {
      //console.log(process.cwd());
      fileName = req.files.npic.name;
      var path = process.cwd() + "/public/uploads/" + fileName;
      req.files.npic.mv(path);
   }

   var email = req.body.ntxtemail;
   var name = req.body.ntxtname;
   var contact = req.body.ntxtcontact;
   var address = req.body.ntxtaddress;
   var city = req.body.ntxtcity;
   var proof = req.body.ntxtproof;
   var afrom = req.body.ntxtfrom;
   var ato = req.body.ntxtto;
   var ahours = afrom + "-" + ato;
   //resp.send("got it");
   console.log(req.body);

   dbCon.query("insert into donorprofile(email,name,contact,address,city,idproof,ppic,ahours) values(?,?,?,?,?,?,?,?)", [email, name, contact, address, city, proof, fileName, ahours], function (err) {
      if (err == null)
         resp.send("Record SAVED Successssfullllyyyyyyyyyyy!!!!!!!!!");
      else
         resp.send(err.toString());
   })
})

//------------------------search-profile------------------------------
app.get("/get-json-record", function (req, resp) {

   dbCon.query("select * from donorprofile where email=?", [req.query.kuchEmail], function (err, resultTableJSON) {
      if (err == null) {
         if (resultTableJSON.length == 1)
            resp.send(resultTableJSON);
         else
            resp.send("No saved profile found !!!");
      }
      else
         resp.send(err.toString());
   })
})

//------------------------profile-update------------------------------
app.post("/profile-donor-update", function (req, resp) {

   var fileName;
   if (req.files != null) {
      //console.log(process.cwd());
      fileName = req.files.npic.name;
      var path = process.cwd() + "/public/uploads/" + fileName;
      req.files.npic.mv(path);
   }
   else {
      fileName = req.body.hdn;
   }

   var email = req.body.ntxtemail;
   var name = req.body.ntxtname;
   var contact = req.body.ntxtcontact;
   var address = req.body.ntxtaddress;
   var city = req.body.ntxtcity;
   var proof = req.body.ntxtproof;
   var ahours = req.body.ntxtfrom + "-" + req.body.ntxtto;
   //resp.send("got it");
   console.log(req.body);

   dbCon.query("update donorprofile set name=?, contact=?, address=?, city=?, idproof=?, ppic=?, ahours=? where email=?", [name, contact, address, city, proof, fileName, ahours, email], function (err) {
      if (err == null)
         resp.send("Record UPDATED Successssfullllyyyyyyyyyyy!!!!!!!!!");
      else
         resp.send(err.toString());
   })
})

//--------------------- profile-existance =======================

app.get("/chk-profile", function (req, resp) {

   var email = req.query.kuchEmail;

   dbCon.query("select * from donorprofile where email=?", [email], function (err, resultTable) {
      if (err == null) {
         if (resultTable.length == 1)
            resp.send("1");
         else
            resp.send("0");
      }
      else {
         resp.send(err.toString());
      }
   })
})

//---------------------------------- AVAIL-MED ======================================

app.get("/chk-avail", function (req, resp) {

   var email = req.query.kuchEmail;
   var medname = req.query.kuchMedname;
   var expdate = req.query.kuchExpdate;
   var packing = req.query.kuchPacking;
   var qty = req.query.kuchQty;

   dbCon.query("insert into availmed(email,medname,expdate,packing,qty) values(?,?,?,?,?)", [email, medname, expdate, packing, qty], function (err) {
      if (err == null)
         resp.send("Medicines added !!!");
      else
         resp.send(err.toString());
   })
})

//---------------------------------------- Med Manager ===============================================

//------------------------------------all med details ---------------------------------------
app.get("/get-angular-all-med", function (req, resp) {

   var email = req.query.emailkuch;

   dbCon.query("select * from availmed where email=?", [email], function (err, resultTableJSON) {
      if (err == null)
         resp.send(resultTableJSON);
      else
         resp.send(err);
   })
})

//----------------------------------delelte med ====================================
app.get("/do-angular-delete-med", function (req, resp) {

   var srno = req.query.srnokuch;

   dbCon.query("delete from availmed where srno=?", [srno], function (err, result) {
      if (err == null) {
         if (result.affectedRows == 1)
            resp.send("Profile Removed Successfully!!!");
         else
            resp.send("Invalid Email id");
      }
      else
         resp.send(err);
   })
})


//======================================================= NEEDY =============================================================

//-------------------------------------- PROFILE-NEEDY ====================================================

//----------------------needy-profile-insert----------------------------
app.post("/profile-needy-process", function (req, resp) {

   var fileName = "nopic.jpg";
   if (req.files != null) {
      //console.log(process.cwd());
      fileName = req.files.naadharpic.name;
      var path = process.cwd() + "/public/uploads/" + fileName;
      req.files.naadharpic.mv(path);
   }

   var email = req.body.ntxtemail;
   var name = req.body.ntxtname;
   var contact = req.body.ntxtcontact;
   var dob = req.body.ntxtdob;
   var gender = req.body.ntxtgender;
   var city = req.body.ntxtcity;
   var address = req.body.ntxtaddress;
   //resp.send("got it");
   console.log(req.body);

   dbCon.query("insert into needyprofile(email,name,contact,dob,gender,city,address,aadharpic) values(?,?,?,?,?,?,?,?)", [email, name, contact, dob, gender, city, address, fileName], function (err) {
      if (err == null)
         resp.send("Record SAVED Successssfullllyyyyyyyyyyy!!!!!!!!!");
      else
         resp.send(err.toString());
   })
})

//------------------------search-profile------------------------------
app.get("/get-json-record-needy", function (req, resp) {

   dbCon.query("select * from needyprofile where email=?", [req.query.kuchEmail], function (err, resultTableJSON) {
      if (err == null) {
         if (resultTableJSON.length == 1)
            resp.send(resultTableJSON);
         else
            resp.send("No saved profile found !!!");
      }
      else
         resp.send(err.toString());
   })
})

//------------------------profile-update------------------------------
app.post("/profile-needy-update", function (req, resp) {

   var fileName;
   if (req.files != null) {
      //console.log(process.cwd());
      fileName = req.files.naadharpic.name;
      var path = process.cwd() + "/public/uploads/" + fileName;
      req.files.naadharpic.mv(path);
   }
   else {
      fileName = req.body.hdn;
   }

   var email = req.body.ntxtemail;
   var name = req.body.ntxtname;
   var contact = req.body.ntxtcontact;
   var dob = req.body.ntxtdob;
   var gender = req.body.ntxtgender;
   var city = req.body.ntxtcity;
   var address = req.body.ntxtaddress;
   //resp.send("got it");
   console.log(req.body);

   dbCon.query("update needyprofile set name=?, contact=?, dob=?, gender=?, city=?, address=?, aadharpic=? where email=?", [name, contact, dob, gender, city, address, fileName, email], function (err) {
      if (err == null)
         resp.send("Record UPDATED Successssfullllyyyyyyyyyyy!!!!!!!!!");
      else
         resp.send(err.toString());
   })
})

//--------------------- profile-existance =======================

app.get("/chk-needy-profile", function (req, resp) {

   var email = req.query.kuchEmail;

   dbCon.query("select * from needyprofile where email=?", [email], function (err, resultTable) {
      if (err == null) {
         if (resultTable.length == 1)
            resp.send("1");
         else
            resp.send("0");
      }
      else {
         resp.send(err.toString());
      }
   })
})

//---------------------------------- User-settings ==========================================

app.get("/change-pwd", function (req, resp) {

   var email = req.query.kuchEmail;
   var oldpwd = req.query.kuchOldpwd;
   var newpwd = req.query.kuchNewpwd;
   var repwd = req.query.kuchRepwd;

   if (oldpwd != newpwd) {
      if (newpwd == repwd) {
         dbCon.query("update users set pwd=? where email=? and pwd=?", [newpwd, email, oldpwd], function (err) {
            if (err == null) {
               dbCon.query("select * from users where email=? and pwd=?", [email, oldpwd], function (err2, resultTable) {
                  if (err2 == null) {
                     if (resultTable.length == 1)
                        resp.send("Password updated...");
                     else
                        resp.send("(Invalid password)");
                  }
                  else {
                     resp.send(err2.toString());
                  }
               })
            }
            else
               resp.send(err.toString());
         })
      }
      else
         resp.send("(Not matched)");
   }
   else
      resp.send("(Enter different password)");
})

//============================================================ ADMIN =====================================================================

//--------------------------------------- Users-panel =============================================

//-------------------------------- all records ---------------------------------------
app.get("/get-angular-all-records", function (req, resp) {

   dbCon.query("select * from users", function (err, resultTableJSON) {
      if (err == null)
         resp.send(resultTableJSON);
      else
         resp.send(err);
   })
})

//--------------------------------- block user ---------------------------------------
app.get("/do-angular-block", function (req, resp) {

   var email = req.query.emailkuch;

   dbCon.query("update users set status=0 where email=?", [email], function (err, result) {
      if (err == null)
         resp.send("Account Blocked Successfully!!!");
      else
         resp.send(err);
   })
})

//--------------------------------- resume user --------------------------------------
app.get("/do-angular-resume", function (req, resp) {

   var email = req.query.emailkuch;

   dbCon.query("update users set status=1 where email=?", [email], function (err, result) {
      if (err == null)
         resp.send("Account Resumed Successfully!!!");
      else
         resp.send(err);
   })
})

//---------------------------------- delete user ---------------------------------------
app.get("/do-angular-delete", function (req, resp) {

   var email = req.query.emailkuch;

   dbCon.query("delete from users where email=?", [email], function (err, result) {
      if (err == null) {
         if (result.affectedRows == 1)
            resp.send("Account Removed Successfully!!!");
         else
            resp.send("Invalid Email id");
      }
      else
         resp.send(err);
   })
})

//----------------------------------------------- Donors panel =============================================

//------------------------------------all records ---------------------------------------
app.get("/get-angular-all-donors", function (req, resp) {

   dbCon.query("select * from donorprofile", function (err, resultTableJSON) {
      if (err == null)
         resp.send(resultTableJSON);
      else
         resp.send(err);
   })
})

//---------------------------------- delete donor ---------------------------------------
app.get("/do-angular-delete-donor", function (req, resp) {

   var email = req.query.emailkuch;

   dbCon.query("delete from donorprofile where email=?", [email], function (err, result) {
      if (err == null) {
         if (result.affectedRows == 1)
            resp.send("Profile Removed Successfully!!!");
         else
            resp.send("Invalid Email id");
      }
      else
         resp.send(err);
   })
})

//----------------------------------------------- Needys panel =============================================

//------------------------------------all records ---------------------------------------
app.get("/get-angular-all-needy", function (req, resp) {

   dbCon.query("select * from needyprofile", function (err, resultTableJSON) {
      if (err == null)
         resp.send(resultTableJSON);
      else
         resp.send(err);
   })
})

//---------------------------------- delete needy ---------------------------------------
app.get("/do-angular-delete-needy", function (req, resp) {

   var email = req.query.emailkuch;

   dbCon.query("delete from availmed where email=?", [email], function (err, result) {
      if (err == null) {
         if (result.affectedRows == 1)
            resp.send("Profile Removed Successfully!!!");
         else
            resp.send("Invalid Email id");
      }
      else
         resp.send(err);
   })
})

//---------------------------------- fetch cities =====================================
app.get("/get-cities", function (req, resp) {

   dbCon.query("select distinct city from donorprofile", function (err, resultTableJSON) {
      if (err == null)
         resp.send(resultTableJSON);
      else
         resp.send(err);
   })
})

//---------------------------------- fetch meds =====================================
app.get("/get-meds", function (req, resp) {

   dbCon.query("select distinct medname from availmed", function (err, resultTableJSON) {
      if (err == null)
         resp.send(resultTableJSON);
      else
         resp.send(err);
   })
})

//-------------------------------- fetch-donors for finders ===============================
app.get("/fetch-donors", function (req, resp) {

   console.log(req.query);
   var med = req.query.medkuch;
   var city = req.query.citykuch;

   var query = "select donorprofile.*, availmed.* from donorprofile inner join availmed on donorprofile.email=availmed.email where availmed.medname=? and donorprofile.city=?";

   dbCon.query(query, [med, city], function (err, resultTable) {

      console.log(resultTable + " " + err);

      if (err == null)
         resp.send(resultTable);
      else
         resp.send(err);
   })
})