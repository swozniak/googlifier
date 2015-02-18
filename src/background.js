chrome.browserAction.onClicked.addListener(function (tab) { //Fired when User Clicks ICON
	chrome.tabs.executeScript(tab.id, {
		'file': 'src/script.js'
	});
});

chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		if (request.type === 'processImage') {
			var img = new Image();

			img.onload = function () {
				var canvas = document.createElement('canvas'),
					context = canvas.getContext('2d');

				var detector,
					classifier = objectdetect.eye,
					eyes = [];

				// Define the canvas based on the image
				canvas.width = img.width;
				canvas.height = img.height;
				canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);

				// Detect eyes
				detector = new objectdetect.detector(canvas.width, canvas.height, 1.2, classifier);
				eyes = detector.detect(canvas);

				// Draw eyes
				for (var i = 0; i < eyes.length; ++i) {
					// Find the x/y/w/h coordinates of the detectedeye
					var coords = eyes[i],
						eye = {
							x: coords[0] + (coords[2] / 2),
							y: coords[1] + (coords[3] / 2),
							radius: coords[2] / 2,
							startAngle: 0,
							endAngle: 2 * Math.PI
						},
						pupil = {
							x: coords[0] + (coords[2] / 2),
							y: coords[1] + (coords[3] / 2),
							radius: (coords[2] / 2) / 1.66,
							startAngle: 0,
							endAngle: 2 * Math.PI
						},
						randomDistance = (eye.radius - pupil.radius) / 1.2;

					pupil.x = pupil.x + (Math.random() * (randomDistance - (-randomDistance)) + (-randomDistance));
					pupil.y = pupil.y + (Math.random() * (randomDistance - (-randomDistance)) + (-randomDistance));

					// Draw the eye
					context.beginPath();
					context.arc(eye.x, eye.y, eye.radius, eye.startAngle, eye.endAngle);
					context.fillStyle = '#fff';
					context.fill();
					context.lineWidth = 3;
					context.strokeStyle = '#000';
					context.stroke();
					context.closePath();

					// And the pupil
					context.beginPath();
					context.arc(pupil.x, pupil.y, pupil.radius, pupil.startAngle, pupil.endAngle);
					context.fillStyle = '#000';
					context.closePath();
					context.fill();
				}

				sendResponse({
					'googlified': canvas.toDataURL('image/jpg')
				});
			}

			img.src = request.src;
		}

		return true;
	}
);