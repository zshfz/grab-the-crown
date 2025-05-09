// index.js 서버 실행 진입점
const path = require("path");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const jwt = require("jsonwebtoken");

// 라우터 등록
const authRoutes = require("./src/api/AuthRoute");
const rankingRoutes = require("./src/api/RankingRoute");
const gameRoomRoutes = require("./src/api/GameRoomRoute");
const connectedUserRoute = require("./src/api/ConnectedUserRoute");

// 접속자 목록 위한
const {
  addConnectedUser,
  removeConnectedUser,
} = require("./src/services/connectedUserService");
const userModel = require("./src/models/usersModel"); // DB 접근용

const app = express();
app.use(cors()); // cors 허용
app.use(express.json()); // JSON 요청 파싱
app.use(express.urlencoded({ extended: true })); // form 요청 파싱

// 프론트엔드 정적 파일 서빙
app.use(express.static(path.join(__dirname, "../frontend/dist")));

//이미지 접근 경로 등록하기
app.use("/uploads", express.static(path.join(__dirname, "./src/uploads")));
// 라우터 연결
app.use("/auth", authRoutes);
app.use("/ranking", rankingRoutes);
app.use("/gameroom", gameRoomRoutes);
app.use("/connected_users", connectedUserRoute);

const server = http.createServer(app);

// 소켓 통신 테스트 - 핸들러 연결
const roomHandler = require("./src/socket/room");
const gameHandler = require("./src/socket/game");
const chatHandler = require("./src/socket/chat");

// 소켓 서버 생성
const io = new Server(server, {
  cors: {
    origin: "*", // 개발 중만 사용! 배포 시엔 꼭 제한해야 함
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: false,
  },
});

// ✅ 소켓 JWT 인증 미들웨어 (2단계)
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("토큰 없음"));

  jwt.verify(token, "mySecretKey", async (err, decoded) => {
    if (err) return next(new Error("토큰 유효하지 않음"));

    // ↓ 여기에 DB 조회를 추가
    const [rows] = await userModel.getUserById(decoded.userId);
    if (!rows.length) {
      // DB에 더 이상 없는 유저면 연결 차단
      return next(new Error("유효하지 않은 사용자입니다"));
    }

    socket.user = decoded;
    next();
  });
});

// 확인용
app.get("/", (req, res) => {
  res.send("<h1>서버 생성 완료</h1>");
});

// 소켓 연결 -> 로그인 완료시 연결됨.
io.on("connection", async (socket) => {
  console.log(`🟢 연결됨: ${socket.id}`);
  const userId = socket.user.userId;

  const [rows] = await userModel.getUserById(userId);

  if (!rows || rows.length === 0) {
    console.error(`❌ 유저 ID ${userId}에 해당하는 정보가 DB에 없음`);
    socket.disconnect(); // 연결 강제 종료
    return;
  }

  const userInfo = {
    socketId: socket.id,
    userId: userId,
    userName: socket.user.userName,
    profileImg: rows[0].profileImg,
  };

  addConnectedUser(userId, userInfo);

  // 클라이언트와의 소켓 통신 이벤트 예시
  socket.on("disconnect", () => {
    removeConnectedUser(userId);
    console.log(`🔴 연결 끊김: ${socket.id}`); // 클라이언트 연결이 끊겼을 때 출력
  });

  // 게임방 생성 및 참가가
  roomHandler(io, socket);
  gameHandler.registerGameHandlers(io, socket);
  chatHandler(io, socket);

  socket.emit("news", "Hello Socket.io");
});

const PORT = process.env.PORT || 5001;
// Render에서는 내부적으로 0.0.0.0:PORT 로 바인딩해야 외부에서 접근 가능
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 서버 실행 중: http://0.0.0.0:${PORT}`);
});

// SPA 라우팅 처리 (React Router 대응)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});
