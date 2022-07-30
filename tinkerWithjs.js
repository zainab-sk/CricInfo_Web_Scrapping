let fs = require("fs");
// let buffer = fs.readFileSync("./example.json");
// let data = JSON.parse(buffer);
// let data = require("./example.json");
let xlsx = require("xlsx");
// console.log(data);
// data.push({
//   name: "Thanos",
//   lastName: "Rogers",
//   isAvenger: true,
//   friends: ["bruce", "peter", "Natasha"],
//   age: "45",
//   adress: {
//     city: "new York",
//     state: "manhattan",
//   },
// });
// let stringData = JSON.stringify(data);
// fs.writeFileSync("example.json", stringData);
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
