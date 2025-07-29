const Task = require("../model/Task");

const taskController = {};

// 할 일 추가
taskController.createTask = async (req, res) => {
  try {
    const { task, isComplete } = req.body;
    const { userId } = req;
    const newTask = new Task({ task, isComplete, author: userId });
    await newTask.save();
    res.status(200).json({ status: "ok", data: newTask });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err });
  }
};

// 할 일 조회
taskController.getTasks = async (req, res) => {
  try {
    // populate -> 몽구스에서 제공하는 조인 함수
    const taskList = await Task.find({}).populate("author").select("-__v");
    res.status(200).json({ status: "ok", data: taskList });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err });
  }
};

// 할 일 수정
taskController.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const findTask = await Task.findOne({ _id: id });
    if (findTask) {
      findTask.isComplete = !findTask.isComplete;
      findTask.save();
      res.status(200).json({ status: "ok", data: findTask });
    }
  } catch (err) {
    res.status(400).json({ status: "fail", error: err });
  }
};

// 할 일 삭제
taskController.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTask = await Task.deleteOne({ _id: id });
    res.status(200).json({ status: "ok", data: deleteTask });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err });
  }
};

module.exports = taskController;
