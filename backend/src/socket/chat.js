// src/socket/chat.js
const chatService = require("../services/chatService");
const gameScoreService = require("../services/gameScoreService"); // ← 추가

module.exports = (io, socket) => {
  socket.on("chat_message", async ({ roomId, message }) => {
    const userId = socket.user.userId;
    const userName = socket.user.userName;
    try {
      const containsForbidden = await chatService.checkForbidden(message);

      if (containsForbidden) {
        console.log(`🚫 [${userId}] 금칙어 메시지 차단됨: ${message}`);

        // — 1) 점수 차감
        try {
          await gameScoreService.addScoreToUser(roomId, userId, -10);
          const newScore = await gameScoreService.getUserScore(roomId, userId);
          io.to(roomId).emit("score_updated", { userId, score: newScore });
        } catch (err) {
          console.error("⚠️ 금칙어 점수 차감 오류:", err);
        }

        // — 2) 채팅 차단 메시지
        socket.emit("chat_blocked", {
          message:
            "⚠️ 금지어가 포함된 메시지는 전송할 수 없습니다. 10점이 감점됩니다.",
        });
        return;
      }

      // 정상 메시지는 그대로 전송
      io.to(roomId).emit("chat_message", { userId, userName, message });
    } catch (err) {
      console.error("금지어 필터링 오류:", err);
    }
  });
};
