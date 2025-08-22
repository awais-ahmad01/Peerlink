
const express = require('express');
const router = express.Router();
const { getRecentRooms, deleteRoomRecord } = require('../controllers/room-controller');

router.get('/get-rooms/:userId', getRecentRooms);

router.post('/delete-room/:roomId/:userId', deleteRoomRecord);


module.exports = router;
