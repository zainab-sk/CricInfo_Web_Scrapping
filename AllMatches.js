const request = require("request");
const cheerio = require("cheerio");
const scoreCardObj = require("./scorecard");
function getAllLink(url) {
  request(url, cb);
  function cb(error, response, html) {
    if (error) {
      console.log(error);
    } else {
      extractAllLink(html);
    }
  }
}
function extractAllLink(html) {
  $ = cheerio.load(html);
  let boxCntnr = $(".ds-w-full .ds-p-0 .ds-border-b >div");
  for (let i = 0; i < boxCntnr.length; i++) {
    let scrCrdElem = $(boxCntnr[i]).find("span a");
    for (let j = 0; j < scrCrdElem.length; j++) {
      //to get the the anchor tag link
      let scrCrdLnk = $(scrCrdElem[2]).attr("href");
      scrCrdLnk = "https://www.espncricinfo.com" + scrCrdLnk;
      console.log(scrCrdLnk);
      scoreCardObj.ps(scrCrdLnk);
    }
  }
}
module.exports = {
  getAllmatches: getAllLink,
};
