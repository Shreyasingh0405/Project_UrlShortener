const urlModel = require("../models/UrlModel");

const validUrl = require('valid-url')
const shortid = require('shortid')
const baseUrl='http://localhost:3000'

const shortUrl=async function(req,res){
    let {longUrl}=req.body
    if (!validUrl.isUri(longUrl)) {
        return res.status(400).json('Invalid base URL')
    }
    let check=await urlModel.findOne({longUrl:longUrl})
    if(check){
        return res.status(409).send({status:false,message:"already exist"})
    }
    const urlCode = shortid.generate(longUrl)
    let url=await urlModel.findOne({urlCode:urlCode})
    if(url){
        return res.status(409).send({status:false,message:"already exist"})
    }
    const shortUrl = baseUrl + '/' + urlCode
    const newUrl={longUrl,shortUrl,urlCode}
    const short=await urlModel.create(newUrl)
    return res.status(201).send({status:true,data:short})
}

const getShortUrl=async function(req,res){
    let urlCode=req.params.urlCode
    let url=await urlModel.findOne({urlCode:urlCode})
    console.log(url)
    if(url){
        return res.status(302).redirect(url.longUrl)
    }
    return res.status(404).send({status:false,message:"url not found"})
}

module.exports={shortUrl,getShortUrl}
