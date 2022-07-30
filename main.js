const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
const fs = require("fs");
const path = require("path");
const request = require("request");
const cheerio = require("cheerio");
const AllMatch = require("./AllMatches");
const iplPath = path.join(__dirname, "ipl");
dirCreator(iplPath);
request(url, cb);
function cb(error, response, html) {
  if (error) {
    console.log(error);
  } else {
    extractLink(html);
  }
}
// extract home page link
function extractLink(html) {
  $ = cheerio.load(html);
  let nxtLnk = $(".ds-block >div >span.ds-inline-flex.ds-leading-none >a ");
  let nxtPgLnk = $(nxtLnk).attr("href");
  nxtPgLnk = "https://www.espncricinfo.com" + nxtPgLnk;
  console.log(nxtPgLnk);
  AllMatch.getAllmatches(nxtPgLnk);
}
//Get all matches link by clicking on view result
function dirCreator(filePath) {
  if (fs.existsSync(filePath) === false) {
    fs.mkdirSync(filePath);
  }
}
