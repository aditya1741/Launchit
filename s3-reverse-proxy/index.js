const express = require('express')
const httpProxy = require('http-proxy')

const app = express()
const PORT = process.env.PORT || 8000
const BASE_PATH = "https://s3_bucket_Name.s3.ap-south-1.amazonaws.com/__outputs"

const proxy = httpProxy.createProxy()

app.use((req, res)=>{
    const hostname = req.hostname;
    const subdomain = hostname.split(".")[0];

    // Custom Domain DB QUery
    const resolveTo = `${BASE_PATH}/${subdomain}`
    return proxy.web(req,res, {target: resolveTo, changeOrigin: true})
})

proxy.on('proxyReq', (proxyReq, req, res) =>{
    const url = req.url;
    if(url === '/'){
        proxyReq.path += 'index.html'
    }
})

app.listen(PORT, ()=>{console.log(`S3 Reverse Proxy server Running on ${PORT}`)})






