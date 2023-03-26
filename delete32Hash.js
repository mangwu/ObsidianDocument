/*
 * @Author: mangwu                                                             *
 * @File: delete32Hash.js                                                      *
 * @Date: 2023-03-26 20:00:28                                                  *
 * @LastModifiedDate: 2023-03-26 20:04:32                                      *
 * @ModifiedBy: mangwu                                                         *
 * -----------------------                                                     *
 * Copyright (c) 2023 mangwu                                                   *
 * -----------------------                                                     *
 * @HISTORY:                                                                   *
 * Date   	            By 	    Comments                                       *
 * ---------------------	--------	----------------------------------------------- *
 */


const fs = require("fs");

const deleteDfs = (path, reg) => {
  fs.readdir(path, function (err, files) {
    if (!err) {
      for (const file of files) {
        if (file.includes(".md")) {
          // 修改文件
          let oldPath = path + "/" + file;
          let newPath =
            path + "/" + file.substring(0, file.length - 36) + ".md";
          fs.rename(oldPath, newPath, (err) => {
            if (!err) {
              // 修改文件内容
              fs.readFile(newPath, "utf-8", function (err, datastr) {
                if (!err) {
                  // 删除hash
                  const newStr = datastr.replace(/%20[0-9a-z]{32}/g, "");
                  fs.writeFile(newPath, newStr, "utf-8", (err) => {
                    if (err) {
                      return console.log("文件写入失败", err.message);
                    } else {
                      console.log(
                        `${file.substring(
                          0,
                          file.length - 38
                        )}：文件内容修改成功`
                      );
                    }
                  });
                }
              });
            } else {
              return console.log(`${oldPath}文件修改名称失败`);
            }
          });
        } else if (reg.test(file.substring(file.length - 32))) {
          let oldPath = path + "/" + file;
          let newPath = path + "/" + file.substring(0, file.length - 33);
          fs.rename(oldPath, newPath, (err) => {
            if (!err) {
              deleteDfs(newPath, reg);
            } else {
              return console.log(`${oldPath}文件夹名称修改失败`, err.message);
            }
          });
        }
      }
    } else {
      return console.log(`${path}路径读取失败`, err.message);
    }
  });
};

module.exports.deleteDfs = deleteDfs;