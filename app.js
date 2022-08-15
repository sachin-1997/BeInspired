const express = require('express');
const app = express();

const path = require('path');
const fs = require('fs');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))

//requiring the json file ./quotes.json is the path name
const quotes= require("./quotes.json"); 
const userWrittenQuotes = require("./userWrittenQuotes.json");
const { text } = require('body-parser');

app.use(express.static(path.join(__dirname, 'public')));

let quote={}


app.set("view engine", "ejs")

app.get("/", function(req,res){


    let randomQuoteIndex= Math.floor(Math.random()*quotes.length);
    let randomQuoteText = quotes[randomQuoteIndex].text;
    let randomQuoteAuthor = quotes[randomQuoteIndex].author;
    res.render("index", {textMarker:randomQuoteText,authorMarker:randomQuoteAuthor})
})

app.get("/write",function(req,res){
    res.render("write")
});

app.get("/compose",function(req,res){
    res.render("compose",{QuoteWrittenBy:quote.text,QuoteWritten:quote.author})
});


app.post("/",function(req,res){
    let readOperation = req.body.readbutton;
    let writeOperation = req.body.writebutton;
    if(readOperation==="r")
    {
        res.redirect("/");
    }
    else if(writeOperation==="w"){
        res.redirect("write");
    }
})



//composing post route
app.post("/compose",function(req,res){
     quote={
        text: req.body.authorTitle,
        author: req.body.quoteBody
    }
    console.log(quote);

    if(req.body.authorTitle.length>3&&req.body.quoteBody.length>10){

        fs.readFile("userWrittenQuotes.json", function (err, data) {
            var json = JSON.parse(data)
            json.push(quote)
    
            fs.writeFile("userWrittenQuotes.json", JSON.stringify(json),function(err){
                console.log("done");
            })
        })
        res.redirect("/compose")

    }
    else
    {
        res.send("Please enter valid Name and Quote");
    }

    

    
})

app.post("/home",function(req,res){
    res.redirect("/");
})





app.listen(process.env.PORT || 3000, function(){
    console.log("server is started in 3000")
})
