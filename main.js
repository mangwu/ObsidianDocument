/*
 * @Author: mangwu                                                             *
 * @File: main.js                                                              *
 * @Date: 2023-03-26 19:59:43                                                  *
 * @LastModifiedDate: 2023-03-26 21:02:05                                      *
 * @ModifiedBy: mangwu                                                         *
 * -----------------------                                                     *
 * Copyright (c) 2023 mangwu                                                   *
 * -----------------------                                                     *
 * @HISTORY:                                                                   *
 * Date   	            By 	    Comments                                       *
 * ---------------------	--------	----------------------------------------------- *
 */

// 本文件用于删除Notion生成的32位hash
const path = "./rebuilt.export"; // 修改需要更新文件名称的文件夹
const reg = /[0-9a-z]{32}/;

const { deleteDfs } = require("./delete32Hash");
deleteDfs(path, reg);
