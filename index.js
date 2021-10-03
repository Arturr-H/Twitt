//Importa express så det blir lättare att göra en server.
const express = require('express');

//Gör så att express är "main".
const app = express();

//Så att man kan läsa .env filerna.
require('dotenv').config();

//Get & post requests
var cors = require('cors')
app.use(cors())

//För att kunna se om personen är inloggad eller inte.
var cookieParser = require('cookie-parser');
app.use(cookieParser());

//Importera databashanteraren.
const faunadb = require("faunadb");


//Alla FDB funktioner som man behöver.
const { Update, Select, Append, Paginate, Get, Match, Index, Create, Collection, Lambda, Map: FdbMap, Documents, Let, Var  } = faunadb.query;

//Sätt upp client med .env koden.
const client = new faunadb.Client({
	secret: process.env.SECRET
})

//Så att man kan ha variablar i html!
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);
//styling
app.get('/frontend/style', function (req, res) { res.sendFile(__dirname + "/html/css/" + "style.css"); });
app.get('/frontend/script', function (req, res) { res.sendFile(__dirname + "/html/javascript/" + "handler.js"); });

const GET_RANDOM_ID = () => {
	str = "1234567890abcdefghijklmnopqrstuvwxyz1234567890"

	let ID = ""
	for (let i = 0; i < 15; i++) {
		ID += str.charAt(Math.floor(Math.random() * str.length));;
	}
	return ID;
}


app.get("/", async (req, res) => {

    //Kolla om personen är inloggad, annars skicka den till login pagen.
    if(req.cookies["usr"] == "" || req.cookies["usr"] == undefined){
        res.redirect("/login")
    }else{

        let Cards = []

        try{
            const doc = await client.query(
                FdbMap(
                    Paginate(Documents(Collection("Twitts"))),
                    Lambda(x => Get(x))
                )
            )
    
            doc.data.forEach(element => {
    
                const amc = element.data.comments
    
                Cards.push({
                    text: element.data.text,
                    id: element.data.id,
                    date: element.data.date,
                    amount_c: amc.length,
                    creatorname: element.data.creatorname,
                    creatorid: element.data.creatorid,
                })
            });
    
        }catch{
            res.sendStatus(404)
        }
    
    
        res.render("./html/index.html", {
            root: __dirname,
            Cards: Cards,
            creatorid: req.cookies["uid"],
        })
    }
})

app.get("/login", async (req, res) => {
    res.sendFile(__dirname + "/html/login.html")
})

app.get("/SignIn", async (req, res) => {
    res.sendFile(__dirname + "/html/signIn.html")
})

app.get("/post", async (req, res) => {

    const text = req.headers.text;
    const hashtag = req.headers.hashtag;
    const Tdate = req.headers.tdate;

    const creatorname = req.headers.creatorname;
    const creatorid = req.headers.creatorid;


    const TwittID = GET_RANDOM_ID();

    try{
        if(text != undefined && text.length >= 1 && text.replace(/ /gm, "").length >= 1){

            await client.query(
                Create(
                    Collection("Twitts"),
                    {
                        data: {
                            date: Tdate,
                            text: text,
                            hashtag: hashtag.split(","),
                            id: TwittID,
                            comments: [],
                            creatorname: creatorname,
                            creatorid: creatorid,
                        }
                    }
                )
            )
            res.sendStatus(200)
        }else{
            res.send("No twitt!")
        }

    }catch(err){
        res.sendStatus(404)
    }
})

app.get("/postComment", async (req, res) => {

    try{
        const id = req.headers.postid
        const text = req.headers.text
        const hashtag = req.headers.hashtag;
        const TwittID = GET_RANDOM_ID();

        if(text != undefined && text.length >= 1 && text.replace(/ /gm, "").length >= 1){
            //Gör ett dokument som har kommentaren i sig
            await client.query(
                Create(
                    Collection("Comments"),
                    {
                        data: {
                            text: text,
                            hashtag: hashtag.split(","),
                            id: TwittID,
                            twitt: id,
                        }
                    }
                )
            )

            //Få ID:et av twitten som blev kommenterad
            const docID = await client.query(
                Get(
                    Match(
                        Index("Twitt_by_id"),
                        id
                    )
                )
            )

            //Uppdatera dokumentet så kommentar postens id är med
            await client.query(
                Let(
                    {
                        ref:docID.ref,
                        doc:Get(Var('ref')),
                        array:Select(['data','comments'],Var('doc'))
                    },
                    Update(
                        Var('ref'),
                        {
                            data:{
                                comments:Append([TwittID],Var('array'))
                            }
                        }
                    )
                )
            )

            res.sendStatus(200)
        }
        else{
            res.sendStatus(404)
        }


    }catch(err){
        res.sendStatus(404)
    }
})

app.get("/twitt/:id?", async (req, res) => {

    try{
        let CommentCards = [];

        const doc = await client.query(
            Get(
                Match(
                    Index("Twitt_by_id"),
                    req.params.id
                )
            )
        )
        const comments = await client.query(
            FdbMap(
                Paginate(
                    Match(
                        Index("Comments_by_twitt"), 
                        doc.data.id
                    )
                ),
                Lambda(
                    "twitt",
                    Get(
                        Var("twitt")
                    )
                )
            )
        )

        comments.data.forEach(element => {
            CommentCards.push({
                text: element.data.text,
                id: element.data.id,
            })
        });

        const msg = doc.data.text

        res.render("./html/twitt.html", {
            root: __dirname,
            Twitt: msg
                .replace(/\*\*(.*?)\*\*/gm, "<b>$1</b>")
                .replace(/\*\*/gm, "")
                .replace(/\B\#([a-zA-Z]+\w)/gm, "<a class='LINK' href='https://backend.artur.red/hashtag/$1'>#$1</a>"),
            id: doc.data.id,
            date: doc.data.date,
            comments: CommentCards,
        })
    }catch(err){
        res.sendStatus(404)
    }
})

app.get("/hashtag/:ht?", async (req, res) => {

    let Cards = []

    try{
        const doc = await client.query(
            FdbMap(
                Paginate(
                    Match(
                        Index("Twitt_by_hashtag"), 
                        req.params.ht.replace(/\#/g, "")
                    )
                ),
                Lambda(
                    "twitt",
                    Get(
                        Var("twitt")
                    )
                )
            )
        )
        doc.data.forEach(element => {
            Cards.push({
                text: element.data.text,
                id: element.data.id,
            })
        });

        res.render("./html/index.html", {
            root: __dirname,
            Cards: Cards,
        })
    }catch(err){
        res.sendStatus(404)
    }
})

//Lägg upp servern på port 3000 på backend.artur.red
app.listen(3000, () => {
    console.log("Launched successfully.")
})



//ACCOUNT HANDLER

app.get("/CreateAccount", async (req, res) => {

    const username = req.headers.username
    const password = req.headers.password
    const email = req.headers.email
    const id = req.headers.id

    try{

        //Kolla om det är en valid request. annar skicka 404
        if(email == undefined || password == undefined || username == undefined){
            res.sendStatus(404)
        }else{

            //Kolla om emailen redan är registrerad
            try{
                await client.query(
                    Get(
                        Match(
                            Index("User_by_email"),
                            email
                        )
                    )
                )
                //IM used status kod
                res.sendStatus(226)
            }
            //Nu om emailen inte var registrerad, så skapa kontot
            catch{

                await client.query(
                    Create(
                        Collection("Accounts"),
                        {
                            data: {
                                username: username,
                                password: password,
                                email: email,
                                id: id,
                            }
                        }
                    )
                )
                res.sendStatus(200)
            }
        }
    }catch{
        res.sendStatus(404)
    }

})

app.get("/LoginAccount", async (req, res) => {

    const password = req.headers.password
    const email = req.headers.email

    try{

        //Kolla om det är en valid request. annar skicka 404
        if(email == undefined || password == undefined){
            res.sendStatus(404)
        }else{
            const doc = await client.query(
                Get(
                    Match(
                        Index("User_by_email"),
                        email
                    )
                )
            )
            

            //Kolla om lösenordet matchar det riktiga lösenordet
            //Om inte, skicka 404
            if (doc.data.password == password){
                res.json({
                    id: doc.data.id,
                    username: doc.data.username,
                })
            }else{
                res.sendStatus(404)
            }

        }

    }catch(err){
        res.sendStatus(404)
    }

})

app.get("/CheckAccountAvailability", async (req, res) => {

    const email = req.cookies["usr"].split(",-,")[0]
    const password = req.cookies["usr"].split(",-,")[1]

    try{
        const doc = await client.query(
            Get(
                Match(
                    Index("User_by_email"),
                    email
                )
            )
        )

        if(doc.data.password == password){
            res.send(doc.data)
        }else{
            res.send(404)
        }

    }catch{
        res.sendStatus(404)
    }


})

app.get("/user/:id?", async (req, res) => {

    const id = req.params.id;

    try{

        const doc = await client.query(
            Get(
                Match(
                    Index("User_by_id"),
                    id
                )
            )
        )

        const twitts = await client.query(
            FdbMap(
                Paginate(
                    Match(
                        Index("Twitt_by_user_id"), 
                        id
                    )
                ),
                Lambda(
                    "twitt",
                    Get(
                        Var("twitt")
                    )
                )
            )
        )

        let Twitts = [];

        twitts.data.forEach(element => {
            Twitts.push({
                text: element.data.text,
                id: element.data.id,
                date: element.data.date,
                creatorid: doc.data.id,
            })
        });


        res.render("./html/userpage.html", {
            root: __dirname,
            username: doc.data.username,
            id: id,
            twitts: Twitts,
        })
        
    }catch(err){
        res.sendStatus(404)
    }

})