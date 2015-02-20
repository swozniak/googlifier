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

/** Googlify subsequently added images */
var childListObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
    	for (var j = 0; j < mutation.addedNodes.length; ++j) {
			var node = mutation.addedNodes[j];
			if (node.nodeType === 1) {
				var images = node.getElementsByTagName('IMG');
				for (var i = 0; i < images.length; ++i) {
					googlify(images[i]);
				}
			}
		}
	});
});

childListObserver.observe(document.body, {childList: true, subtree: true});

/** Googlify subsequently modified images with new src */
var attributeObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
		if (mutation.target.tagName === 'IMG' && mutation.attributeName === 'src') {
			googlify(mutation.target);
		}
	});
});

attributeObserver.observe(document.body, {attributes: true,	subtree: true});
