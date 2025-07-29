const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const userSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// 프론트엔드에서 호출할 때 항상 실행되는 함수
// 즉, password는 항상 제거하고 return
userSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.password;
  delete obj.updatedAt;
  delete obj.__v;

  return obj;
};

// methods: 몽구스 모델에 함수를 추가할 때 사용하는 속성
// this: generateToken을 호출한 객체
userSchema.methods.generateToken = function () {
  const token = jwt.sign({ _id: this.id }, JWT_SECRET_KEY, {
    expiresIn: "1d", // 유효기간
  });
  return token;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
