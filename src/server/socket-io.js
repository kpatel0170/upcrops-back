// "use strict";
const activeUsers = new Set();
const onlineUsers = {};
// const { sendPushNotification } = require("../middlewares/pushNotification");
// const api4Connection = require("../../../leaderbridge-backend/src/api/connection/index");

// const { ObjectId } = require("mongodb");
// const { CodeStarNotifications } = require("aws-sdk");
// module.exports = (server, logger) => {
//   logger.info("Socket.io server started");
//   const io = require("socket.io")(server, {
//     cors: {
//       origin: "*",
//     },
//   });

//   io.use((socket, next) => {
//     // logger.info(
//     //   `REQ [${socket.id}] [WS] ${socket.handshake.url} ${JSON.stringify(
//     //     socket.handshake
//     //   )}`
//     // );
//     next();
//   });

//   io.on("connection", async (socket) => {
//     console.log("User connected", socket.id);
//     // let updateIsOnline = await global.models.GLOBAL.ADMIN.updateOne(
//     //   { _id: ObjectId(userId) },
//     //   { $set: { isOnline: true } }
//     // );
//     logger.info(
//       `CONN [${socket.id}] [WS] ${socket.handshake.url} ${JSON.stringify(
//         socket.handshake
//       )}`
//     );

//     socket.on("disconnect", async () => {
//       console.log("user " + onlineUsers[socket.id] + " disconnected");
//       // remove saved socket from onlineUsers object
//       let userId = onlineUsers[socket.id];
//       console.log("-----2------", onlineUsers);
//       console.log("-----2------", userId);
//       let updateIsOnline = await global.models.GLOBAL.ADMIN.updateOne(
//         { _id: ObjectId(userId) },
//         { $set: { isOnline: false } }
//       );
//       console.log("-----2------", onlineUsers);
//       // console.log("userrrrStatussss", userStatus);
//       // delete onlineUsers[socket.id];
//     });

//     socket.on("leaveRoom", async ({ roomId }) => {
//       console.log("leaveRoom", roomId);
//       socket.leave(roomId);
//     });

//     console.log("onlineUsers----global", onlineUsers);
//     socket.on("join", async function ({ roomId, user }) {
//       logger.info(`user join room : ${roomId}`);
//       socket.userId = roomId;

//       let updateIsOnline = await global.models.GLOBAL.ADMIN.updateOne(
//         { _id: ObjectId(user) },
//         { $set: { isOnline: true } }
//       );

//       socket.join(roomId);

//       try {
//         if (roomId) {
//           let chatHistory;
//           // let ln = await io.in(roomId).allSockets();

//           // if (ln.size == 2) {
//           //   chatHistory = await chatCtrl.getMessages.handler(
//           //     roomId,
//           //     user,
//           //     "user"
//           //   );
//           // } else {
//           chatHistory = await chatCtrl.getMessages.handler(roomId, user);
//           // }

//           // console.log("////////////////history", chatHistory.payload);
//           if (chatHistory.payload && chatHistory.payload.chats) {
//             io.in(roomId).emit("history", { chats: chatHistory.payload.chats });
//           } else {
//             io.in(roomId).emit("history", { chats: [] });
//           }
//           console.log("history sent");
//           console.log(
//             "%%%%%%%%%%%%%%%%&&&&&&&&&&&_________________________&&&&&&&&&&&&&&&&&&&&message-sent",
//             user,
//             roomId
//           );
//         }
//       } catch (error) {
//         console.log("Error in finding Chats ", error);
//       }
//     });

//     socket.on("last-message", async function (user) {
//       // console.log("LAST MESSAGE------------->>>>>>", user);
//       try {
//         let lastMessage = await chatCtrl.lastMessage.handler(user);
//         // console.log("history", chatHistory.payload.chats);
//         io.in(socket.id).emit("last-message", {
//           chats: lastMessage.payload.chats,
//         });
//         console.log("last-message data sent");
//       } catch (error) {
//         console.log("Error in finding Chats ", error);
//       }
//     });

//     socket.on("init-chats", async function (token, id) {
//       // console.log("LAST MESSAGE------------->>>>>>", user);
//       try {
//         let lastMessage = await chatCtrl.initiateChat.handler(token, id);
//         console.log("init-chats", lastMessage);
//         // console.log("history", chatHistory.payload.chats);
//         // io.in(socket.id).emit("init-chats", {
//         //   chats: lastMessage.payload.chats,
//         // });
//         // io.in(socket.id).emit("chat-room");
//         io.in(socket.id).emit("history", {
//           room: "get",
//         });
//         console.log("last-message data sent");
//       } catch (error) {
//         console.log("Error in finding Chats ", error);
//       }
//     });

//     socket.on("chat-room", async function (user, userID) {
//       console.log("LAST MESSAGE------------->>>>>>", user, userID);
//       try {
//         console.log("userID", userID);
//         let allChatRoom = await chatCtrl.allChatRoom.handler(user);

//         console.log("history", allChatRoom.payload.room);
//         console.log("socket.id", socket.id);
//         io.in(socket.id).emit("history", {
//           room: allChatRoom.payload.room,
//           userId: userID,
//         });
//         console.log("Room data sent");
//       } catch (error) {
//         console.log("Error in finding Room ", error);
//       }
//     });

//     socket.on(
//       "new-message",
//       async function ({
//         roomId,
//         sender,
//         message,
//         type = "string",
//         parentMessageId,
//       }) {
//         // console.log({ roomId, sender, message, parentMessageId });
//         try {
//           console.log(
//             "%%%%%%%%%%%%%%%%&&&&&&&&&&&_________________________&&&&&&&&&&&&&&&&&&&&message-sent",
//             sender,
//             roomId
//           );
//           let ln = await io.in(roomId).allSockets();
//           let newMsg;
//           if (ln.size == 2) {
//             newMsg = await chatCtrl.sendMessage.handler({
//               roomId: roomId,
//               sender: sender,
//               message: message,
//               type: type,
//               parentMessageId: parentMessageId,
//               flag: "seen",
//             });
//           } else {
//             newMsg = await chatCtrl.sendMessage.handler({
//               roomId: roomId,
//               sender: sender,
//               message: message,
//               type: type,
//               parentMessageId: parentMessageId,
//             });
//           }

//           // newMsg = JSON.parse(JSON.stringify(newMsg));
//           // newMsg["network"] = "1"
//           // console.log("new-message", newMsg.payload.newChat);

//           // io.in(roomId).emit("new-message", newMsg.payload.newChat);
//           // io.emit("check-answer");

//           let chatHistory = await chatCtrl.getMessages.handler(roomId, sender);
//           console.log("history", { chats: chatHistory.payload.chats });
//           io.in(roomId).emit("history", { chats: chatHistory.payload.chats });
//           // io.emit("check-answer");
//         } catch (error) {
//           console.log("Error in sending message", error.message);
//         }
//       }
//     );
//   });
// };
