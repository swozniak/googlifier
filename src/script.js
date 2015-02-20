/** Googlify image in background thread */
function googlify(img) {
	// Skip if already googlified once
	if (!img.src || img.googlified) return;
	img.googlified = true;

	// Perform googlification in background
	chrome.runtime.sendMessage({
		'type': 'googlify',
		'src': img.src
	}, function(response) {
		if (response.googlified) {
			img.src = response.googlified;
		}
	});
}

/** Googlify all available images on initialization */
var images = document.getElementsByTagName('IMG');
for (var i = 0; i < images.length; ++i) {
	googlify(images[i]);
}

/** Googlify all subsequently added or modified images */
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
		if (mutation.type === 'attributes') {
			
			// Googlify images whose src changed
			if (mutation.target.tagName === 'IMG' && mutation.attributeName === 'src') {
				googlify(mutation.target);
			}
		} else if (mutation.type === 'childList') {
			
			// Googlify images that have been added
			for (var j = 0; j < mutation.addedNodes.length; ++j) {
				var node = mutation.addedNodes[j];
				if (node.nodeType === 1) {
					var images = node.getElementsByTagName('IMG');
					for (var i = 0; i < images.length; ++i) {
						googlify(images[i]);
					}
				}
			}
		}
	});
});

observer.observe(document.body, {
	childList: true,
	attributes: true,
	subtree: true
});
