function googlifyImage(img, force) {
	chrome.runtime.sendMessage({
		'type': 'processImage',
		'src': img.src
	}, function (response) {
		if (response.googlified) {
			img.src = response.googlified;
		}
	});
}

$(function () {
	var observerOptions = {
			childList: true,
			attributes: false,
			characterData: false,
			subtree: true
		},
		observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (mutation.addedNodes) {
					$(mutation.addedNodes).each(function () {
						$('img', this).each(function () {
							googlifyImage(this, false);
						});
					});
				}
			});
		});

	observer.observe(document.querySelector('body'), observerOptions);

	$('img').each(function () {
		googlifyImage(this, false);
	});
});