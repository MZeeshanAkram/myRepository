const fs = require('fs')
const http = require('http')
const https = require('https')
const parse5 = require('parse5')
const url = require('url')


const readFile = (file) => new Promise((resolve,reject) => 
		fs.readFile(file , (error,Data) => error? reject(error) : resolve(Data)))
const delay = msecs => new Promise(resolve => setTimeout(resolve, msecs))

siteInfo = {}
count = 1

function mapCheck(baseUrl , incomingUrl)
{
	if(count<=100)
	{
		if (siteInfo[(url.parse(incomingUrl).hostname)] != undefined)
		{ 	
			if(siteInfo[(url.parse(incomingUrl).hostname)].requestCount < 5)
			{
				siteInfo[(url.parse(incomingUrl).hostname)].requestCount++
				count++
				//console.log(incomingUrl);
				//count++
				httRequest(incomingUrl)
				.then((url) => delay(1000))
				.catch((err) => console.log(err))
			}
		}
		else
		{
			//console.log(incomingUrl);
			count++
			siteInfo[url.parse(incomingUrl).hostname] = 
			{
				requestCount: 1,
				outgoingLinks: [],
				inLinks: [],
				promisedDelay: httRequest(incomingUrl).then((urls) => delay(1000)).catch((err) => console.log(err))
			}
		}
	}
	else
	{
		console.log(siteInfo)
		process.exit(0)
	}
}

function httRequest(urlb)
{
	return new Promise(async (resolve, reject) => {
		urls = []
		url1 = urlb
		string = '';
		urlb.substr(0,5) == 'https' ? string = https : string = http 
		 const parser = new parse5.SAXParser();
		 string.get(urlb , (response) => {
	  		response.pipe(parser)
	  		parser.on('startTag', (tag,attributes) => {
	  			if (tag == 'a')
	  			{
	  				attributes.map( attribute => 
	  				{
	  					if(attribute.name == 'href')
	  					{
	  						if(attribute.value.substr(0,2)=='//')
	  						{
	  							if(urlb.substr(0,5) == 'https')
	  							{
	  								mapCheck(urlb,'https:' + attribute.value)
	  								if(!(siteInfo[(url.parse(urlb).hostname)].outgoingLinks.includes(url.parse(('https:' + attribute.value)).hostname)))
			 						{
			 							if(  url.parse(urlb).hostname != url.parse('https:' + attribute.value).hostname )
			 							{
			 								siteInfo[(url.parse(urlb).hostname)].outgoingLinks.push(url.parse(('https:' + attribute.value)).hostname)
			 								siteInfo[(url.parse('https:' + attribute.value).hostname)].inLinks.push(url.parse((urlb)).hostname)
			 							}
			 						}
	  							}
	  							else
	  							{
	  								mapCheck(urlb,'http:' + attribute.value)
	  								if(!(siteInfo[(url.parse(url1).hostname)].outgoingLinks.includes(url.parse(('http:' + attribute.value)).hostname)))
			 						{
			 							if(  url.parse(urlb).hostname != url.parse('http:' + attribute.value).hostname )
			 							{ 
			 								siteInfo[(url.parse(urlb).hostname)].outgoingLinks.push(url.parse(('http:' + attribute.value)).hostname)
			 								siteInfo[(url.parse('http:' + attribute.value).hostname)].inLinks.push(url.parse((urlb)).hostname)
			 							}
			 						}	
	  							}
	  						} 
	  						else if(attribute.value.substr(0,4) == 'http' || attribute.value.substr(0,5) == 'https')
	  						{
	  							mapCheck(url,attribute.value)
	  							if(!(siteInfo[(url.parse(urlb).hostname)].outgoingLinks.includes(url.parse((attribute.value)).hostname)))
			 						{
			 							if(  url.parse(urlb).hostname != url.parse(attribute.value).hostname )
			 							{
			 								siteInfo[(url.parse(urlb).hostname)].outgoingLinks.push(url.parse((attribute.value)).hostname)
			 								siteInfo[(url.parse(attribute.value).hostname)].inLinks.push(url.parse((urlb)).hostname)
			 							}
			 						}
	  						}
	  						else if(attribute.value.substr(0) == '/')
	  						{
	  							//urls.push(url + attribute.value)
	  							mapCheck(urlb, urlb + attribute.value)

	  						}

	  					}
	  				})
	  			}
	  			
	  		})
	  		parser.on('error', (err)=> reject(err))
	  		parser.on('end', () => resolve(urls))
		})	
	})	
}

async function crawler(configfile)
{
	try{
	const data = await readFile(configfile)
	const parsedData = JSON.parse(data)
	name = parsedData.initialUrls[0]
	parsedData.initialUrls.forEach(url => 
		{
			mapCheck(url, url)
		})
	}catch(error)
	{
		console.log(error)
	}
}

crawler('config.json') 