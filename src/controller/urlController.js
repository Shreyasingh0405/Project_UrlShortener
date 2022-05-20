
const validUrl = require('valid-url')
const urlModel = require("../models/urlModel");
const shortId = require("shortid");
const { response } = require("express");

const redis = require("redis");

const { promisify } = require("util");

//Connect to redis
const redisClient = redis.createClient(
    17520,
    "redis-17520.c301.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);
redisClient.auth("zlIq8LOZY4VAd7O2H1G53cr9P9G9tFf5", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});

//1. connect to the server
//2. use the commands :

//Connection setup for redis

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length == 1;
};


const shortenUrl = async function (req, res) {
    try {
        //-------------------------------------------validation----------------------------------
        let longUrl  = req.body.longUrl
        if (!isValidRequestBody(req.body)) {
            return res.status(400).send({ status: false, message: "Please provide data or provide only one longurl" })
        }
        if (!isValid(longUrl)) {
            return res.status(400).send({ status: false, message: "Please provide longUrl" })
        }
        if (!validUrl.isUri(longUrl)) {
            return res.status(400).send({ status: false, messege: 'Invalid  URL' })
        }
       
//--------------------------------------validation end---------------------------------------------------
 //--------------------------------------catch entry------------------------------------------------------------        
const findInCache = await GET_ASYNC(`${longUrl}`);
        if (findInCache) {
            let data = JSON.parse(findInCache);
            return res
                .status(200)
                .send({ status: true, message: "Entry from cache", shortUrl: data.shortUrl });
        }
        const isAlreadyReg = await urlModel
            .findOne({ longUrl })
            .select({ _id:0,createdAt: 0, updatedAt: 0, __v: 0 });
        if (isAlreadyReg) {
            await SET_ASYNC(`${longUrl}`, JSON.stringify(isAlreadyReg));
            res
                .status(409)
                .send({
                    status: false,
                    message: `URL data already generated`,
                    data: isAlreadyReg,
                });
        } else {
            const urlCode = shortId.generate(longUrl);
//--------------------------------------------DB check------------------------------------------- 
      
            let checkUrlCode = await urlModel.findOne({ urlCode: urlCode });            
            if (checkUrlCode) {
                return res.status(400)
                    .send({
                        status: false,
                        message: `URL data already generated`,
                    })
            }
//-------------------------------------------------------short Url gentated-------------------------------------
            const shortUrl = `http://localhost:3000/${urlCode}`;
            const data = {};
            data["longUrl"] = longUrl;
            data["shortUrl"] = shortUrl;
            data["urlCode"] = urlCode;

            let profile = await urlModel.create(data);
            await SET_ASYNC(`${longUrl}`, JSON.stringify(profile));
            await SET_ASYNC(`${urlCode}`, JSON.stringify(profile));
            let profile1=await urlModel.findOne({urlCode:urlCode}).select({ _id:0,createdAt: 0, updatedAt: 0, __v: 0 })
            res.status(201).send({ data: profile1 });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ msg: "Some error occured" });
    }
};

const redirectUrl = async function (req, res) {
    try {
        const urlData = req.params.urlCode;

        const urlCode = urlData
            .split("")
            .map((a) => a.trim())
            .join("");

        let cachedUrlDataTwo = await GET_ASYNC(`${urlCode}`);
        let cachedUrlDataThree = JSON.parse(cachedUrlDataTwo);
        //--------------------------------------Redirecting-------------------------------------------------
        if (cachedUrlDataThree) {
            res.redirect(307, cachedUrlDataThree["longUrl"]);
        } else {
            let validData = await urlModel
                .findOne({ urlCode: urlCode })
                .select({ longUrl: 1 });

            if (!validData) {
                return res
                    .status(404)
                    .send({ status: false, message: "url not found " });
            }

            await SET_ASYNC(`${urlCode}`, JSON.stringify(validData));
            res.redirect(307, validData.longUrl);
        }
    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
};

module.exports.shortenUrl = shortenUrl;
module.exports.redirectUrl = redirectUrl;

