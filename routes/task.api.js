const express = require("express");
const taskController = require("../controller/task.controller");
const router = express.Router();

// 할 일 추가
router.post("/", taskController.createTask);

// 할 일 조회
router.get("/", taskController.getTask);

// 할 일 수정
router.put("/:id", taskController.updateTask);

// 할 일 삭제
router.delete("/:id", taskController.deleteTask);

module.exports = router;
