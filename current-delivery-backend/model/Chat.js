const { Schema: Sc, model: Md } = require('mongoose');
const ChatSchema = new Sc({ chatId: String, senderId: Sc.Types.ObjectId, senderName: String, text: String, attachments: [String], read: { type: Boolean, default: false } }, { timestamps: true });
module.exports = Md('Chat', ChatSchema);