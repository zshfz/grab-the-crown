const gameRoomUserModel = require("../models/gameRoomUserModel");

const joinRoom = async (roomId, userId) => {
  await gameRoomUserModel.joinRoom(roomId, userId);
};

// 수정 후
const getPlayersInRoomByGID = async (roomId) => {
  return await gameRoomUserModel.getPlayersInRoomByGID(roomId);
};

const leaveRoom = async (roomId, userId) => {
  await gameRoomUserModel.leaveRoom(roomId, userId);
};

module.exports = {
  joinRoom,
  leaveRoom,
  getPlayersInRoomByGID,
};
