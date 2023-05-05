const express = require('express')
const carsRouter = express.Router()
require('dotenv').config();
const fs = require('fs')
const axios = require('axios')
const admin = require('firebase-admin');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
let db = admin.firestore();
const nodemailer = require('nodemailer');
function normalize(phone) {
  //normalize string and remove all unnecessary characters
  phone = phone.replace(/[^\d]/g, "");

  //check if number length equals to 10
  if (phone.length == 10) {
      //reformat and return phone number
      return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  }

  return null;
}

Date.prototype.addHours= function(h){
  this.setHours(this.getHours()+h);
  return this;
}
function convertPhoneNumber(phone) {
  var cleaned = phone.replace(/\D/g, '');
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
      return match[1] + match[2] + match[3];
  }
  return null;
}
const stream = require('stream');
const { compileString } = require('sass');
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0, 
    minimumFractionDigits: 0,
});
carsRouter.get('', async (req, res) => {
    var dataentry = []
  var cartypeentry = []

    const filtertype = req.query.page

    try {
        ///const newsAPI = await axios.get(`https://raddy.dev/wp-json/wp/v2/posts/`)
        let rawdata = fs.readFileSync('fakedata.json');

        const datatype = await db.collection('AutoDevImport').get();
        const maketype = await db.collection('Makes').get();
        const bodytype = await db.collection('Body').get();

///console.log(datatype.docs[0].data())
if(filtertype == null){


///let newdata = JSON.parse(rawdata);
let raw5 = datatype.docs.slice(0,28)
var json = []



maketype.docs.forEach(async (dataraw) => {

  await dataentry.push({
    make: dataraw.data().make,
    count: dataraw.data().count
})

})

bodytype.docs.forEach(async (dataraw) => {

  var quickname = ""
  var image = ""


  if(dataraw.data().bodyType == "suv"){
    quickname = "SUV"
    image = "/img/SUV.png"
  }

  if(dataraw.data().bodyType == "sedan"){
    quickname = "Sedan"
    image = "/img/Sedan.png"
  }

  if(dataraw.data().bodyType == "coupe"){
    quickname = "Coupe"
    image = "/img/Coupe.png"
  }
  if(dataraw.data().bodyType == "pickup_truck"){
    quickname = "Pickup Truck"
    image = "/img/Pickup.png"
  }
  
if(dataraw.data().bodyType == "convertible"){
  quickname = "Convertible"
  image = "/img/Convertible.png"
}


  await cartypeentry.push({
    body: dataraw.data().bodyType,
    count: dataraw.data().count,
    quick: quickname,
    image: image
})

})


datatype.docs.forEach(async (dataraw) => {


    await json.push(dataraw.data())

});

await delay(300)

await dataentry.sort((a, b) => {
  if (a.make < b.make) return -1;
  if (a.make > b.make) return 1;
  return 0;
});

        await res.render('cars', { inventory: json, makefilter: dataentry, bodyfilter: cartypeentry })
        console.log(dataentry)

        console.log('Sent')
}

    } catch (err) {
        if (err.response) {
            res.render('news', { articles: null })
            console.log(err.response.data)
            console.log(err.response.status)
            console.log(err.response.headers)
        } else if (err.request) {
            res.render('news', { articles: null })
            console.log(err.requiest)
        } else {
            res.render('news', { articles: null })
            console.error('Error', err.message)
        }
    }

    
})

carsRouter.get('/cars', async (req, res) => {
  var dataentry = []
var cartypeentry = []

  const filtertype = req.query.page

  try {
      ///const newsAPI = await axios.get(`https://raddy.dev/wp-json/wp/v2/posts/`)
      let rawdata = fs.readFileSync('fakedata.json');

      const datatype = await db.collection('AutoDevImport').get();
      const maketype = await db.collection('Makes').get();
      const bodytype = await db.collection('Body').get();

///console.log(datatype.docs[0].data())
if(filtertype == null){


///let newdata = JSON.parse(rawdata);
let raw5 = datatype.docs.slice(0,28)
var json = []



maketype.docs.forEach(async (dataraw) => {

await dataentry.push({
  make: dataraw.data().make,
  count: dataraw.data().count
})

})

bodytype.docs.forEach(async (dataraw) => {

var quickname = ""

if(dataraw.data().bodyType == "suv"){
  quickname = "SUV"
}

if(dataraw.data().bodyType == "sedan"){
  quickname = "Sedan"
}

if(dataraw.data().bodyType == "coupe"){
  quickname = "Coupe"
}
if(dataraw.data().bodyType == "pickup_truck"){
  quickname = "Pickup Truck"
}

if(dataraw.data().bodyType == "convertible"){
  quickname = "Convertible"
}


await cartypeentry.push({
  body: dataraw.data().bodyType,
  count: dataraw.data().count,
  quick: quickname
})

})


datatype.docs.forEach(async (dataraw) => {


  await json.push(dataraw.data())

});

await delay(300)

await dataentry.sort((a, b) => {
if (a.make < b.make) return -1;
if (a.make > b.make) return 1;
return 0;
});

      await res.render('usedCars', { inventory: json, makefilter: dataentry, bodyfilter: cartypeentry })
      console.log(dataentry)

      console.log('Sent')
}
if(filtertype == 2){
  let newdata = JSON.parse(rawdata);
  let raw5 = newdata.slice(29,57)
          res.render('usedCars', { inventory: raw5 })
  }
  } catch (err) {
      if (err.response) {
          res.render('news', { articles: null })
          console.log(err.response.data)
          console.log(err.response.status)
          console.log(err.response.headers)
      } else if (err.request) {
          res.render('news', { articles: null })
          console.log(err.requiest)
      } else {
          res.render('news', { articles: null })
          console.error('Error', err.message)
      }
  }

  
})

carsRouter.get('/filter', async (req, res) => {

const filtertype = req.query.car
const cartype = req.query.type
const carprice = req.query.price
const sorttype = req.query.sort
const carfeature = req.query.feature

console.log(words)

var json = []
var dataentry = []

if(filtertype != null){

    
const replaced1 = filtertype.replaceAll(',', ' ');

var words = replaced1.split(" ");


    
    words.forEach(async (cartype) => {
      
   
    const check = await db.collection("AutoDevImport").where("make", "==", cartype).get()


    var json = []


   


    check.docs.forEach(async (dataraw) => {

        await json.push(dataraw.data())

        if(!dataentry.includes(dataraw.data().model)){
        await dataentry.push(dataraw.data().model)

        }


    });


    await res.render('filter', { inventory: json, modelinventory: dataentry})
    console.log(dataentry)

})

}
if(cartype != null){

    
      
   
    const check = await db.collection("AutoDevImport").where("bodyType", "==", cartype).get()


    var json = []


   


    check.docs.forEach(async (dataraw) => {

        await json.push(dataraw.data())

        if(!dataentry.includes(dataraw.data().model)){
        await dataentry.push(dataraw.data().model)

        }


    });


    await res.render('filter', { inventory: json, modelinventory: dataentry})
    console.log(dataentry)



}

if(carfeature != null){

    console.log(carfeature)
      
   
  const check = await db.collection("AutoDevImport").where(carfeature, "==", true).get()


  var json = []


 


  check.docs.forEach(async (dataraw) => {

      await json.push(dataraw.data())

      if(!dataentry.includes(dataraw.data().model)){
      await dataentry.push(dataraw.data().model)

      }


  });


  await res.render('filter', { inventory: json, modelinventory: dataentry})
  console.log(dataentry)



}

if(carprice != null){

    console.log(formatter.format(carprice))
    
      
   
    const check = await db.collection("AutoDevImport").where("price", "<=", formatter.format(carprice)).get()

    
    var json = []


   


    check.docs.forEach(async (dataraw) => {

        if(dataraw.data().price >= formatter.format(carprice - 9999))
        await json.push(dataraw.data())


        if(!dataentry.includes(dataraw.data().model)){
        await dataentry.push(dataraw.data().model)

        }


    });


    await res.render('filter', { inventory: json, modelinventory: dataentry})
    console.log(dataentry)



}

if(sorttype != null){

 

    if(sorttype == "lowest"){

    
      
   
    const check = await db.collection("AutoDevImport").orderBy("priceraw","asc").get()



    
    var json = []


   


    check.docs.forEach(async (dataraw) => {

      
        await json.push(dataraw.data())

        if(!dataentry.includes(dataraw.data().model)){
            await dataentry.push(dataraw.data().model)
    
            }
       

    });


    await res.render('filter', { inventory: json, modelinventory: dataentry })
    console.log(json)


    }


    if(sorttype == "recommended"){

    
      
   
        const check = await db.collection("AutoDevImport").get()
    
    
    
        
        var json = []
    
    
       
    
    
        check.docs.forEach(async (dataraw) => {
    
          
            await json.push(dataraw.data())
    
            if(!dataentry.includes(dataraw.data().model)){
                await dataentry.push(dataraw.data().model)
        
                }
           
    
        });
    
    
        await res.render('filter', { inventory: json, modelinventory: dataentry })
        console.log(json)
    
    
        }
    

    if(sorttype == "highest"){

    
      
   
        const check = await db.collection("AutoDevImport").orderBy("priceraw","desc").get()
    
    
    
        
        var json = []
    
    
       
    
    
        check.docs.forEach(async (dataraw) => {
    
          
            await json.push(dataraw.data())
            if(!dataentry.includes(dataraw.data().model)){
                await dataentry.push(dataraw.data().model)
        
                }
    
           
    
        });
    
    
        await res.render('filter', { inventory: json, modelinventory: dataentry })
        console.log(json)
    
    
        }


        if(sorttype == "highmiles"){

    
      
   
            const check = await db.collection("AutoDevImport").orderBy("milesraw","desc").get()
        
        
        
            
            var json = []
        
        
           
        
        
            check.docs.forEach(async (dataraw) => {
        
              
                await json.push(dataraw.data())
                if(!dataentry.includes(dataraw.data().model)){
                    await dataentry.push(dataraw.data().model)
            
                    }
        
               
        
            });
        
        
            await res.render('filter', { inventory: json, modelinventory: dataentry })
            console.log(json)
        
        
            }

            
        if(sorttype == "new"){

    
      
   
            const check = await db.collection("AutoDevImport").orderBy("year","desc").get()
        
        
        
            
            var json = []
        
        
           
        
        
            check.docs.forEach(async (dataraw) => {
        
              
                await json.push(dataraw.data())
                if(!dataentry.includes(dataraw.data().model)){
                    await dataentry.push(dataraw.data().model)
            
                    }
        
               
        
            });
        
        
            await res.render('filter', { inventory: json, modelinventory: dataentry })
            console.log(json)
        
        
            }

            if(sorttype == "old"){

    
      
   
                const check = await db.collection("AutoDevImport").orderBy("year","asc").get()
            
            
            
                
                var json = []
            
            
               
            
            
                check.docs.forEach(async (dataraw) => {
            
                  
                    await json.push(dataraw.data())
                    if(!dataentry.includes(dataraw.data().model)){
                        await dataentry.push(dataraw.data().model)
                
                        }
            
                   
            
                });
            
            
                await res.render('filter', { inventory: json, modelinventory: dataentry })
                console.log(json)
            
            
                }

            if(sorttype == "lowmiles"){

    
      
   
                const check = await db.collection("AutoDevImport").orderBy("milesraw","asc").get()
            
            
            
                
                var json = []
            
            
               
            
            
                check.docs.forEach(async (dataraw) => {
            
                  
                    await json.push(dataraw.data())
                    if(!dataentry.includes(dataraw.data().model)){
                        await dataentry.push(dataraw.data().model)
                
                        }
            
                   
            
                });
            
            
                await res.render('filter', { inventory: json, modelinventory: dataentry })
                console.log(json)
            
            
                }
}

    
    
})
carsRouter.post('/addcar', async (req, res) => {
    const filtertype = req.body.vin

    console.log(filtertype)

    if(req.body.vin.length > 5){

    console.log(filtertype)
   
    var washingtonRef = db.collection("AutoDevImport").doc(filtertype);
    
 
    const apiReply = await axios.get(`https://auto.dev/api/listings/${filtertype}?apikey=${process.env.APIKEY}`)
    var json = apiReply.data

    console.log(apiReply.data.mileage)

    var milesnum =  Number(apiReply.data.mileage.replace(/[^0-9\.]+/g,""));
    var pricenum = Number(apiReply.data.price.replace(/[^0-9\.]+/g,""));

    await washingtonRef.set(apiReply.data)


    washingtonRef.update({
      "priceraw": pricenum,
      "milesraw": milesnum
    })
   
    res.sendStatus(200);
  }else{

    console.log(filtertype)
   
 
   
    res.sendStatus(500);
  }

  })

carsRouter.post('/refresh', async (req, res) => {
  const datatype = await db.collection('AutoDevImport').get();

  var makejson = []
  var bodyjson = []
  var json = []
  var cartype = datatype.docs
  var maketype = datatype.docs

  let unique1 = maketype.reduce((acc, car) => {
    let carData = car.data();
    if (!acc.some(obj => obj.make === carData.make)) {
      acc.push(carData);
    }
    return acc;
  }, []);

  let unique2 = cartype.reduce((acc, car) => {
    let carData = car.data();
    if (!acc.some(obj => obj.bodyType === carData.bodyType)) {
      acc.push(carData);
    }
    return acc;
  }, []);
  
  
  
  
  unique1.forEach(async (dataraw) => {
  
  
    const query = await db.collection("AutoDevImport").where('make', '==', dataraw.make).get();
    console.log(query.size)

    var makeref = db.collection("Makes").doc(dataraw.make);
    
    await  makeref.set({
      make: dataraw.make,
      count: query.size
  })

  });

  unique2.forEach(async (dataraw) => {
  
  
    const query = await db.collection("AutoDevImport").where('bodyStyle', '==', dataraw.bodyStyle).get();
    console.log(query.size)

    
    var makeref = db.collection("Body").doc(dataraw.bodyStyle);
    
    await  makeref.set({
      bodyType: dataraw.bodyStyle,
      count: query.size
  })
  

  });

 await delay(2500)


  res.json(bodyjson)
})


carsRouter.get('/post', async (req, res) => {

    
  const accountSid = process.env.accountSid
  const authToken = process.env.authToken
    const clienttoken = require('twilio')(accountSid, authToken);
    const carvin = await req.query.vin
    const custname = req.query.name
    const custemail = req.query.email
    const custphone = req.query.phone
    const subject = req.query.subject
    const details2 = req.query.detail
    const emailon = req.query.emailcontact
    const phoneon = req.query.phonecontact
await console.log(carvin.toString())
console.log(normalize(custphone))
const query = await db.collection("Leads").where('phone', '==', normalize(custphone)).where('vin', '==', carvin).get();
if(query.docs[0] == null){

var makeref = db.collection("Leads").doc(`${convertPhoneNumber(custphone)}${carvin}`);
const check = await db.collection("AutoDevImport").where("vin", "==", carvin).get()



    await  makeref.set({
      vin: carvin,
      name: custname,
      'subject': subject,
      carname: `${check.docs[0].data().year} ${check.docs[0].data().make} ${check.docs[0].data().model}`,
      email: custemail,
      phone: normalize(custphone),
      time: admin.firestore.FieldValue.serverTimestamp(),
      details: details2

  })

    if(phoneon != null){
    

        clienttoken.messages
        .create({body: `Hello ${custname}! This is the BPAAuto Team. This is about the ${check.docs[0].data().year} ${check.docs[0].data().make} ${check.docs[0].data().model} you recently inquired about. Our team has received your request and will be in contact shortly`, from: `${process.env.NUM}`, to: `+1${custphone}`})
        .then(message => res.send(message.sid));
    }
    if(emailon != null){
        let transporter = nodemailer.createTransport({
            host: process.env.HOST,
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAILPASS  // generated ethereal password
            }
        });
      

    
        // setup email data with unicode symbols
        let mailOptions = {
            from: 'BPAAuto Team 🚗<contact@bpaauto.com>',
            to: `${custemail}`,
            subject: 'BPAAuto Car Inquiry',
            html: `  
            <!doctype html>
            <html>
              <head>
                <meta name="viewport" content="width=device-width">
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                <title>Simple Transactional Email</title>
                <style>
                /* -------------------------------------
                    INLINED WITH htmlemail.io/inline
                ------------------------------------- */
                /* -------------------------------------
                    RESPONSIVE AND MOBILE FRIENDLY STYLES
                ------------------------------------- */
                @media only screen and (max-width: 620px) {
                  table[class=body] h1 {
                    font-size: 28px !important;
                    margin-bottom: 10px !important;
                  }
                  table[class=body] p,
                        table[class=body] ul,
                        table[class=body] ol,
                        table[class=body] td,
                        table[class=body] span,
                        table[class=body] a {
                    font-size: 16px !important;
                  }
                  table[class=body] .wrapper,
                        table[class=body] .article {
                    padding: 10px !important;
                  }
                  table[class=body] .content {
                    padding: 0 !important;
                  }
                  table[class=body] .container {
                    padding: 0 !important;
                    width: 100% !important;
                  }
                  table[class=body] .main {
                    border-left-width: 0 !important;
                    border-radius: 0 !important;
                    border-right-width: 0 !important;
                  }
                  table[class=body] .btn table {
                    width: 100% !important;
                  }
                  table[class=body] .btn a {
                    width: 100% !important;
                  }
                  table[class=body] .img-responsive {
                    height: auto !important;
                    max-width: 100% !important;
                    width: auto !important;
                  }
                }
            
                /* -------------------------------------
                    PRESERVE THESE STYLES IN THE HEAD
                ------------------------------------- */
                @media all {
                  .ExternalClass {
                    width: 100%;
                  }
                  .ExternalClass,
                        .ExternalClass p,
                        .ExternalClass span,
                        .ExternalClass font,
                        .ExternalClass td,
                        .ExternalClass div {
                    line-height: 100%;
                  }
                  .apple-link a {
                    color: inherit !important;
                    font-family: inherit !important;
                    font-size: inherit !important;
                    font-weight: inherit !important;
                    line-height: inherit !important;
                    text-decoration: none !important;
                  }
                  #MessageViewBody a {
                    color: inherit;
                    text-decoration: none;
                    font-size: inherit;
                    font-family: inherit;
                    font-weight: inherit;
                    line-height: inherit;
                  }
                  .btn-primary table td:hover {
                    background-color: #34495e !important;
                  }
                  .btn-primary a:hover {
                    background-color: #34495e !important;
                    border-color: #34495e !important;
                  }
                }
                </style>
              </head>
              <body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
                <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">${check.docs[0].data().year} ${check.docs[0].data().make} ${check.docs[0].data().model} Information</span>
                <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
                  <tr>
                    <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
                    <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
                      <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">
            
                        <!-- START CENTERED WHITE CONTAINER -->
                        <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;">
            
                          <!-- START MAIN CONTENT AREA -->
                          <tr>
                            <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
                              <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                                <tr>
                                <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
                                <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hello ${custname},</p>
                                <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">This is the BPAuto team reaching out about the ${check.docs[0].data().year} ${check.docs[0].data().make} ${check.docs[0].data().model} you recently inquired about. Our team has received your request and will be in contact shortly.</p>
                                <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;">
                                  <tbody>
                                    <tr>
                                      <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;">
                                        <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
                                          <tbody>
                                            <tr>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Sincerely,</p>
                                    <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">The BPAAuto Team.</p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
            
                        <!-- END MAIN CONTENT AREA -->
                        </table>
            
                        <!-- START FOOTER -->
                        <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
                          <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                            <tr>
                              <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
                                
                              </td>
                            </tr>
                            <tr>
                             
                            </tr>
                          </table>
                        </div>
                        <!-- END FOOTER -->
            
                      <!-- END CENTERED WHITE CONTAINER -->
                      </div>
                    </td>
                    <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
                  </tr>
                </table>
              </body>
            </html>`
           
        }
  

        transporter.sendMail(mailOptions, function(err, info) {
            if (err) {
              console.log(err)
            } else {
              console.log(info);
            }
        });
    }



  }

  
await res.render('reps')

});

carsRouter.get('/maintenancepost', async (req, res) => {

    /// http://localhost:3023/maintenancepost?name=Cooper+Contrucci&email=dodhi7384%40gmail.com&phone=3468148846&phonecontact=on&make=Ford&model=Focus&year=2023&needed=Cabin+Air+Filter+Replacement&date=2034-01-11&detail=
  const accountSid = process.env.accountSid
  const authToken = process.env.authToken
  const clienttoken = require('twilio')(accountSid, authToken);
  const custname = req.query.name
  const custemail = req.query.email
  const custphone = req.query.phone
  const details2 = req.query.detail
  const make = req.query.make
  const model = req.query.model
  const year = req.query.year
  const needed = req.query.needed
  const date = req.query.date
  const emailon = req.query.emailcontact
  const phoneon = req.query.phonecontact
console.log(normalize(custphone))
const query = await db.collection("Appointments").where('phone', '==', normalize(custphone)).where('date', '==', date).get();
if(query.docs[0] == null){

  const datefinal = new Date(date).addHours(6);

var makeref = db.collection("Appointments").doc(`${convertPhoneNumber(custphone)}${date}`);
  
  await  makeref.set({
    'make': make,
    'model': model,
    'year': year,
    'needed': needed,
    'date': date,
    name: custname,
    email: custemail,
    phone: normalize(custphone),
    time: admin.firestore.FieldValue.serverTimestamp(),
    scheduletime: admin.firestore.Timestamp.fromDate(datefinal),
    details: details2

})

  if(phoneon != null){
    const options = { month: 'long', day: '2-digit'};
    const monthDay = datefinal.toLocaleDateString("en-us", options);
    

      clienttoken.messages
      .create({body: `Hello ${custname}! This is the BPAAuto Team. This is your confirmation about your recent maintenance request for your ${year} ${make} ${model} on ${monthDay}. Please let us know if you have any other questions`, from: `${process.env.NUM}`, to: `+1${custphone}`})
      .then(message => res.send(message.sid));
  }
  if(emailon != null){
    const options = { month: 'long', day: '2-digit'};
    const monthDay = datefinal.toLocaleDateString("en-us", options);
      let transporter = nodemailer.createTransport({
          host: process.env.HOST,
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
              user: process.env.EMAIL,
              pass: process.env.EMAILPASS  // generated ethereal password
          }
      });
    

  
      // setup email data with unicode symbols
      let mailOptions = {
          from: 'BPAAuto Team 🚗<contact@bpaauto.com>',
          to: `${custemail}`,
          subject: 'BPAAuto Car Inquiry',
          html: `  
          <!doctype html>
          <html>
            <head>
              <meta name="viewport" content="width=device-width">
              <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
              <title>Simple Transactional Email</title>
              <style>
              /* -------------------------------------
                  INLINED WITH htmlemail.io/inline
              ------------------------------------- */
              /* -------------------------------------
                  RESPONSIVE AND MOBILE FRIENDLY STYLES
              ------------------------------------- */
              @media only screen and (max-width: 620px) {
                table[class=body] h1 {
                  font-size: 28px !important;
                  margin-bottom: 10px !important;
                }
                table[class=body] p,
                      table[class=body] ul,
                      table[class=body] ol,
                      table[class=body] td,
                      table[class=body] span,
                      table[class=body] a {
                  font-size: 16px !important;
                }
                table[class=body] .wrapper,
                      table[class=body] .article {
                  padding: 10px !important;
                }
                table[class=body] .content {
                  padding: 0 !important;
                }
                table[class=body] .container {
                  padding: 0 !important;
                  width: 100% !important;
                }
                table[class=body] .main {
                  border-left-width: 0 !important;
                  border-radius: 0 !important;
                  border-right-width: 0 !important;
                }
                table[class=body] .btn table {
                  width: 100% !important;
                }
                table[class=body] .btn a {
                  width: 100% !important;
                }
                table[class=body] .img-responsive {
                  height: auto !important;
                  max-width: 100% !important;
                  width: auto !important;
                }
              }
          
              /* -------------------------------------
                  PRESERVE THESE STYLES IN THE HEAD
              ------------------------------------- */
              @media all {
                .ExternalClass {
                  width: 100%;
                }
                .ExternalClass,
                      .ExternalClass p,
                      .ExternalClass span,
                      .ExternalClass font,
                      .ExternalClass td,
                      .ExternalClass div {
                  line-height: 100%;
                }
                .apple-link a {
                  color: inherit !important;
                  font-family: inherit !important;
                  font-size: inherit !important;
                  font-weight: inherit !important;
                  line-height: inherit !important;
                  text-decoration: none !important;
                }
                #MessageViewBody a {
                  color: inherit;
                  text-decoration: none;
                  font-size: inherit;
                  font-family: inherit;
                  font-weight: inherit;
                  line-height: inherit;
                }
                .btn-primary table td:hover {
                  background-color: #34495e !important;
                }
                .btn-primary a:hover {
                  background-color: #34495e !important;
                  border-color: #34495e !important;
                }
              }
              </style>
            </head>
            <body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
              <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">BPAAuto Maintenance Appointment Confirmation</span>
              <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
                <tr>
                  <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
                  <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
                    <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">
          
                      <!-- START CENTERED WHITE CONTAINER -->
                      <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;">
          
                        <!-- START MAIN CONTENT AREA -->
                        <tr>
                          <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
                            <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                              <tr>
                              <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
                              <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hello ${custname},</p>
                              <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">This is the BPAAuto Team. This is your confirmation about your recent maintenance request for your ${year} ${make} ${model} on ${monthDay}. Please let us know if you have any other questions</p>
                              <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;">
                                <tbody>
                                  <tr>
                                    <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;">
                                      <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
                                        <tbody>
                                          <tr>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Sincerely,</p>
                                  <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">The BPAAuto Team.</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
          
                      <!-- END MAIN CONTENT AREA -->
                      </table>
          
                      <!-- START FOOTER -->
                      <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
                        <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                          <tr>
                            <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
                              
                            </td>
                          </tr>
                          <tr>
                           
                          </tr>
                        </table>
                      </div>
                      <!-- END FOOTER -->
          
                    <!-- END CENTERED WHITE CONTAINER -->
                    </div>
                  </td>
                  <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
                </tr>
              </table>
            </body>
          </html>`
         
      }


      transporter.sendMail(mailOptions, function(err, info) {
          if (err) {
            console.log(err)
          } else {
            console.log(info);
          }
      });
  }



}


await res.render('reps')

});

carsRouter.get('/api/car', async (req, res) => {

    

  const carvin = await req.query.vin


  if(carvin != null){

    const r = fs.createReadStream('./public/img/BPAAutoBanner.png') // or any other way to get a readable stream
  const ps = new stream.PassThrough() // <---- this makes a trick with stream error handling
  stream.pipeline(
   r,
   ps, // <---- this makes a trick with stream error handling
   (err) => {
    if (err) {
      console.log(err) // No such file or any other kind of error
      return res.sendStatus(400); 
    }
  })
  ps.pipe(res) // <---- this makes a trick with stream error handling
}
})



carsRouter.get('/calculator', async (req, res) => {
  const price = req.query.price

  
    
        await res.render('loanCalc', { priceSent: price})

      
    });


 carsRouter.get('/maintenance', async (req, res) => {

  
    
      await res.render('maintenance')
    
  });
    

    carsRouter.get('/aboutus', async (req, res) => {

  
    
      await res.render('aboutUs')
    
  });
    carsRouter.get('/contact', async (req, res) => {
        const carvin = req.query.vin
        



  
    
        await res.render('inquire', { carinfo: carvin})
      
    });   
        

carsRouter.get('/lookup', async (req, res) => {
    const filtertype = req.query.vin
    const check = await db.collection("AutoDevImport").where("vin", "==", filtertype).get()

    const apiReply = await axios.get(`https://auto.dev/api/listings/${filtertype}?apikey=${process.env.APIKEY}`)


    if(apiReply.data.error != null){

      if(check.docs[0] != null){
      const res3 = await db.collection('AutoDevImport').doc(check.docs[0].id).delete();
      }
      await res.render('reps')

    }
    if(apiReply.data.error == null){

      const recommendcheck = await db.collection("AutoDevImport")
      .where("make", "==", check.docs[0].data().make)
      .limit(3)
      .get();

      var json3 = []


      recommendcheck.docs.forEach(async (dataraw) => {
 
    
          await json3.push(dataraw.data()); // push the data to json3
   
        
      });

console.log(json3)
      var dataentry =  []

      console.log(check.docs[0].data().sunroof)

      if(check.docs[0].data().heatedSeats == true){

  await dataentry.push({
    name: "/img/HeatedSeats.png"
})

      }
      if(check.docs[0].data().oneOwner == true){

        await dataentry.push({
          name: "/img/OneOwner.png"
      })
      
            }
            
            if(check.docs[0].data().sunroof == true){

              await dataentry.push({
                name: "/img/SunRoof.png"
            })
            
                  }

                  if(check.docs[0].data().wifi == true){

                    await dataentry.push({
                      name: "/img/Wifi.png"
                  })
                  
                        }
      

                  await delay(1000)
    

                  console.log(dataentry)
    
      await res.render('carsSingle', { apiData: apiReply.data, dbData: check.docs[0].data(), bodyfilter: dataentry, recommend: json3})

    }

    
    


    
})
 

carsRouter.get('/buyacar', async (req, res) => {
  
    
        await res.render('reps')
    


    
})

carsRouter.get('/addacar', async (req, res) => {
  const datatype = await db.collection('AutoDevImport').orderBy("year","asc").get();
  const leadtype = await db.collection('Leads').get();
  const appointtype = await db.collection('Appointments').get();


  console.log(datatype.size)

///console.log(datatype.docs[0].data())


///let newdata = JSON.parse(rawdata);
let raw5 = datatype.docs.slice(0,28)
var json = []
var leadjson = []
var apptype = []

var test = 0

datatype.docs.forEach(async (dataraw) => {


  await json.push(dataraw.data())

  console.log(dataraw.data().priceraw)

  test = test + dataraw.data().priceraw
});

appointtype.docs.forEach(async (dataraw) => {


  await apptype.push(dataraw.data())


});

leadtype.docs.forEach(async (dataraw) => {


  await leadjson.push(dataraw.data())


  console.log(dataraw.data().time.seconds)

  
  
});
await delay(200)

console.log(test)

console.log(leadjson)

      await res.render('addacar', { lead: leadjson, inventory: json, listed: datatype.size, value: formatter.format(test), leadsize: leadtype.size, appsize: appointtype.size, app: apptype })





})



module.exports = carsRouter 
