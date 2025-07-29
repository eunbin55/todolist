const userController = {};
const bcrypt = require("bcryptjs");
const User = require("../model/User");
const saltRounds = 10;

// 회원가입
userController.createUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    // 기존 유저인지 확인
    const user = await User.findOne({ email }); // findOne({email: email})와 같은 의미
    if (user) {
      throw new Error("이미 가입된 유저입니다.");
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    const newUser = new User({ email, name, password: hash });
    await newUser.save();
    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// 로그인
userController.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    // "-createdAt" 은 이번 findOne 콜에서만 제거되는 일시적 제거 기능.
    const user = await User.findOne({ email }, "-createdAt -updatedAt -__v");

    if (user) {
      const isMatch = bcrypt.compareSync(password, user.password);
      if (isMatch) {
        // 토큰 발행
        const token = user.generateToken();
        // 응답으로 유저 정보 및 토큰 보냄
        return res.status(200).json({ status: "success", user, token });
      }
    }
    throw new Error("아이디 또는 비밀번호가 일치하지 않습니다.");
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// 유저 정보 가져오기
userController.getUser = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);
    if (!user) throw new Error("can not find user");
    res.status(200).json({ status: "success", user });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

module.exports = userController;
