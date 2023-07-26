const roomElement = document.getElementById('room');

(async () => {
	const rooms = await axios.get('/api/room');
	rooms.data.forEach((room) => {
		let option = document.createElement('option');
		option.value = room._id;
		option.innerHTML = room.room_name;
		roomElement.appendChild(option);
	});
})();
