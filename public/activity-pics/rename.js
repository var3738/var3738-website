const fs = require("fs");
const path = require("path");

const files = fs.readdirSync("./");

let i = 1;

files.forEach(file => {
  if (/\.(jpg|jpeg|png)$/i.test(file)) {
    const ext = path.extname(file);
    const newName = `activity-pics${String(i).padStart(2, "0")}${ext}`;
    fs.renameSync(file, newName);
    i++;
  }
});
