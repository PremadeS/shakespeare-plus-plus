const fs = require("fs");
const path = require("path");

const shebang = "#!/usr/bin/env node\n";
const distDir = path.join(__dirname, "dist");
function addShebangToFiles(dir) {
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error("Error reading file stats:", err);
          return;
        }

        if (stats.isFile() && filePath.endsWith(".js")) {
          fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
              console.error("Error reading file:", err);
              return;
            }

            if (!data.startsWith(shebang)) {
              const updatedData = shebang + data;
              fs.writeFile(filePath, updatedData, "utf8", (err) => {
                if (err) {
                  console.error("Error writing file:", err);
                }
              });
            }
          });
        }
      });
    });
  });
}

addShebangToFiles(distDir);
