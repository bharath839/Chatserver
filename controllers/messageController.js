const messageModel = require("../models/messageModel");


module.exports.addMessage = async (req, res, next) => {
    try {
      const { from, to, message } = req.body;
      if (!message) {
        // If message text is not provided, return a 400 Bad Request response
        return res.status(400).json({ error: "Message text is required" });
      }
  
      const data = await messageModel.create({
        message: { text: message }, // Ensure that the text property is provided
        users: [from, to],
        sender: from
      });
  
      if (data) {
        return res.json({ msg: "Message added successfully" });
      }
      return res.json({ msg: "Failed to add message" });
  
    } catch (error) {
      next(error);
    }
  };
  
module.exports.getAllMessage = async (req, res, next)=>{
try {
    
    const{ from,to}=req.body;

const messages=await messageModel.find({
    users:{
        $all:[from,to]

    },
}).sort({updatedAt:1})
const projectMesssages=messages.map((msg)=>{
    return{
fromSelf:msg.sender.toString()===from,
message:msg.message.text,
    }
})
return res.json(projectMesssages);
} catch (error) {
    next(error)
    
}
}