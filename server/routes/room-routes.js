
const express = require('express');
const router = express.Router();
const { getRecentRooms, deleteRoomRecord } = require('../controllers/room-controller');


router.get('/get-rooms/:username', getRecentRooms);
router.post('/delete-room/:roomId/:username', deleteRoomRecord);

module.exports = router;
