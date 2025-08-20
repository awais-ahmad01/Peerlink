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

async function getRecentRooms(req,res) {

     try {
    const { username } = req.params;
    
    const rooms = await Room.find({
      "participants.username": username,
        status: "ended"
    })
    .sort({ endedAt: -1 })
    .limit(10);

    const formattedRooms = rooms.map(room => ({
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


async function deleteRoomRecord(req,res) {
    try {
    const { roomId, username } = req.params;
    
    // Only allow deletion if user was a participant
    const room = await Room.findOne({
      roomId,
      "participants.username": username
    });

    if (!room) {
      return res.status(404).json({ error: "Room not found or access denied" });
    }

    await Room.findOneAndDelete({ roomId });
    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ error: "Failed to delete room" });
  }
}


module.exports = {getRecentRooms, deleteRoomRecord};