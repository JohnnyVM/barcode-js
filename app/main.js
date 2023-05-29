let MediaRequirements = {
    video: {
        facingMode: "environment",
    }
};

navigator.mediaDevices.getUserMedia(MediaRequirements).then(function(stream) {
	// tell the canvas which resolution we ended up getting from the webcam
	const track = stream.getVideoTracks()[0];
	const actualSettings = track.getSettings();
	console.log(actualSettings.width, actualSettings.height);
}).catch(function(err) {
    /* manejar el error */
    console.error(`${err.name}: ${err.message}`);
});