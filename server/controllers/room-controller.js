
const Room = require('../models/room'); 

function formatDate(date) {
  const now = new Date();
  const roomDate = new Date(date);
  const diffTime = now - roomDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return `Today ${roomDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffDays === 1) {
    return `Yesterday ${roomDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return `${diffDays} days ago`;
  }
}

function formatDuration(minutes) {
  if (!minutes || minutes < 1) return "Less than 1 minute";
  
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  
  if (hours === 0) {
    return `${mins} minute${mins !== 1 ? 's' : ''}`;
  } else {
    return `${hours} hour${hours !== 1 ? 's' : ''} ${mins > 0 ? `${mins} minute${mins !== 1 ? 's' : ''}` : ''}`.trim();
  }
}

async function getRecentRooms(req, res) {
  try {
    const { userId } = req.params;
    
    
    const userRooms = await Room.find({
      userId: userId,
      
    })
    // .sort({ endedAt: -1 })
    // .limit(10);

    const formattedRooms = userRooms.map(room => ({
      id: room.roomId,
      date: formatDate(room.endedAt),
      duration: formatDuration(room.duration),
      participants: room.maxParticipants,
      participantNames: room.participants.map(p => p.username),
      createdAt: room.createdAt,
      endedAt: room.endedAt
    }));

    res.json(formattedRooms);
  } catch (error) {
    console.error("Error fetching recent rooms:", error);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
}


async function deleteRoomRecord(req, res) {
  try {
    const { roomId, userId } = req.params;
    
    
    const result = await Room.findOneAndDelete({
      roomId,
      userId: userId
    });

    if (!result) {
      return res.status(404).json({ error: "Room not found in your history" });
    }

    res.json({ message: "Room deleted from your history successfully" });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ error: "Failed to delete room" });
  }
}


async function createOrUpdateUserRoom(roomId, userId, username, otherParticipants, isActive = true) {
  try {
   
    if (!userId) {
      console.log('⚠️ Skipping room record creation - no userId provided');
      return null;
    }

    console.log(`📝 Creating/updating room record for user ${username} (${userId}) in room ${roomId}`);

    
    let userRoom = await Room.findOne({ 
      roomId, 
      userId,
      status: 'active' 
    });

    
    const participantsList = otherParticipants.map(p => ({
      username: p.username,
      userId: p.userId || null,
      socketId: p.socketId,
      joinedAt: p.joinedAt || new Date(),
      leftAt: p.leftAt || null
    }));

    if (!userRoom) {
      
      console.log(`✨ Creating new room record for user ${username}`);
      userRoom = new Room({
        roomId,
        userId,
        username,
        participants: participantsList,
        maxParticipants: Math.max(1, otherParticipants.length + 1), 
        status: isActive ? 'active' : 'ended',
        createdAt: new Date()
      });
    } else {
      
      console.log(`🔄 Updating existing room record for user ${username}`);
      userRoom.participants = participantsList;
      
     
      const activeParticipants = participantsList.filter(p => !p.leftAt).length + 1; 
      if (activeParticipants > userRoom.maxParticipants) {
        userRoom.maxParticipants = activeParticipants;
      }
    }

    await userRoom.save();
    console.log(`✅ Room record saved successfully for user ${username} with ${participantsList.length} participants`);
    return userRoom;
  } catch (error) {
    console.error(`❌ Error creating/updating user room for ${username}:`, error);
    return null;
  }
}


async function endUserRoom(roomId, userId, duration) {
  try {
    if (!userId) {
      return null;
    }

    const result = await Room.findOneAndUpdate(
      { 
        roomId, 
        userId,
        status: 'active' 
      },
      { 
        endedAt: new Date(),
        duration,
        status: 'ended'
      }
    );

    return result;
  } catch (error) {
    console.error("Error ending user room:", error);
    return null;
  }
}

module.exports = {
  getRecentRooms, 
  deleteRoomRecord,
  createOrUpdateUserRoom,
  endUserRoom
};