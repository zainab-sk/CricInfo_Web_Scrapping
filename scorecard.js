const url =
  "https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard";
const request = require("request");
const cheerio = require("cheerio");

const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

function getScorecard(url) {
  request(url, cb);
}
function cb(error, response, html) {
  if (error) {
    console.log(error);
  } else {
    extractPlayerLink(html);
  }
}
// extract the player details form scoreCard;
function extractPlayerLink(html) {
  $ = cheerio.load(html);
  let venueElem = $(".ds-grow .ds-text-tight-m.ds-text-ui-typo-mid");
  let venue = venueElem.text();
  venue = venue.split(",")[1];
  venue = venue.trim();
  let result = $(".ds-grow .ds-text-tight-m.ds-truncate");
  let innings = $(".ds-rounded-lg");
  //   console.log($(innings.text()));
  for (let i = 0; i < innings.length; i++) {
    let teamNameElem = $(innings[i]).find(".ds-uppercase");
    let teamName = teamNameElem.text();
    teamName = teamName.split("INNINGS")[0];
    teamName = teamName.trim();
    let opponentIndx = i == 0 ? 1 : 0;
    let opponentNameElem = $(innings[opponentIndx]).find(".ds-uppercase");
    let opponentName = opponentNameElem.text();
    opponentName = opponentName.split("INNINGS")[0];
    opponentName = opponentName.trim();
    // extract Player rows i.e tr
    let rowElem = $(innings[i]).find(
      ".ci-scorecard-table tbody tr.ds-text-tight-s"
    );
    for (let i = 0; i < rowElem.length - 1; i++) {
      // extarct player details from td
      let playerInfo = $(rowElem[i]).find("td");
      let playerName = $(playerInfo[0]).text().trim();
      let runs = $(playerInfo[2]).text().trim();
      let balls = $(playerInfo[3]).text().trim();
      let fours = $(playerInfo[5]).text().trim();
      let sixes = $(playerInfo[6]).text().trim();
      let sr = $(playerInfo[7]).text().trim();
      console.log(
        teamName,
        " ",
        opponentName,
        " ",
        venue,
        " ",
        $(result).text(),
        " ",
        playerName,
        " ",
        runs,
        " ",
        balls,
        " ",
        fours,
        " ",
        sixes,
        " ",
        sr
      );
      processPlayer(
        teamName,
        playerName,
        runs,
        balls,
        fours,
        sixes,
        sr,
        opponentName,
        venue,
        result
      );
    }
  }
}
function processPlayer(
  teamName,
  playerName,
  runs,
  balls,
  fours,
  sixes,
  sr,
  opponentName,
  venue,
  result
) {
  let teamPath = path.join(__dirname, "ipl", teamName);
  dirCreator(teamPath);
  let filePath = path.join(teamPath, playerName + ".xlsx");
  let content = excelRead(filePath, playerName);
  let playerObj = {
    teamName,
    playerName,
    runs,
    balls,
    fours,
    sixes,
    sr,
    opponentName,
    venue,
    result,
  };
  content.push(playerObj);
  excelWrite(filePath, content, playerName);
}
function dirCreator(filePath) {
  if (fs.existsSync(filePath) === false) {
    fs.mkdirSync(filePath);
  }
}
function excelWrite(filePath, json, sheetName) {
  let workbook = xlsx.utils.book_new();
  var worksheet = xlsx.utils.json_to_sheet(json);
  xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
  xlsx.writeFile(workbook, filePath);
}
function excelRead(filePath, sheetName) {
  if (fs.existsSync(filePath) === false) {
    return [];
  } else {
    let wb = xlsx.readFile(filePath);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
  }
}
module.exports = {
  ps: getScorecard,
};
