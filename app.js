const bodyParser = require("body-parser");
const express = require("express");
const request = require("request");
const https = require("https")


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    const firstName = req.body.fName
    const lastName = req.body.lName
    const email = req.body.email
    
    const data = {

        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]

    };

    const jsonData = JSON.stringify(data);

    const url = "https://us14.api.mailchimp.com/3.0/lists/88e358178a";

    const options = {
        method: "POST",
        auth: "joana:1c5e8b49b28f40b5e3f066a3ae0c0858-us14"
    }

    const request = https.request(url, options, function(response) {
        let statusCode = response.statusCode;

        response.on("data", function(data) {
            console.log(JSON.parse(data));
            
        })

        if(statusCode == 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

    })

    request.write(jsonData)
    request.end()
})

app.post("/failure", function(req, res) {
    res.redirect("/")
})


app.listen(3000, function() {
    console.log("Server is running on port 3000.");
})


// API Key
// 1c5e8b49b28f40b5e3f066a3ae0c0858-us14

// List ID
// 88e358178a