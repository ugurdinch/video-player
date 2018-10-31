var API_ENDPOINT = 'https://www.cbc.ca/bistro/order';
var mediaID; 

var video = {
	title: "",
	description: "",
	key: ""
}

window.onload = function() {
	this.getMediaID(); // get mediaID from querystring

	document.getElementById('video-player').addEventListener("click", togglePlayPause); // attaching click event to the video player
}

function getMediaID() {
	const urlParams = new URLSearchParams(window.location.search);
	const mediaID = urlParams.get('mediaId');

	this.mediaID = mediaID;

	// console.log(this.mediaID);

	if (this.mediaID && ! isNaN(this.mediaID)) this.getVideo(this.mediaID);
	else {
		// no mediaID or not a number - display error message
	}
}

//
function getVideo(mediaID) {	
	// var that = this; // outer context
	
	let mediaUrl = `${this.API_ENDPOINT}?mediaId=${mediaID}`;
	
	var xmlHttp = new XMLHttpRequest();

	xmlHttp.onreadystatechange = function() { 
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
			let httpResponse = JSON.parse(xmlHttp.responseText);

			if (httpResponse) {
				if (httpResponse.items && httpResponse.items[0]) {
					this.video.title = httpResponse.items[0].title; // set title
					this.video.description = httpResponse.items[0].description; // set description
					this.video.duration = httpResponse.items[0].duration; // set duration

					if (httpResponse.items[0].assetDescriptors && httpResponse.items[0].assetDescriptors[1]) {
						this.video.key = httpResponse.items[0].assetDescriptors[1].key; // set key

						this.updateView(this.video); // update html
					}
				}
			} 
			else {
				// error - display error message
			}
			
		}
	}.bind(this) // maintain outer context

	xmlHttp.open("GET", mediaUrl, true); // true for asynchronous 
	xmlHttp.send(null);
}

// updates the title and the video src in html
function updateView(video) {
	let videoTitleElement = document.getElementById("video-title");
	videoTitleElement.innerText = video.title;

	let videoDescriptionElement = document.getElementById("video-description");
	videoDescriptionElement.innerText = video.description;

	let videoDurationElement = document.getElementById("video-duration");
	let minutes = Math.floor(video.duration / 60);
	let seconds = Math.floor(video.duration % 60);
	videoDurationElement.innerText = minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);

	let videoPlayerElement = document.getElementById("video-player");
	videoPlayerElement.setAttribute("src", video.key);

	this.playVideo();
}

function playVideo() {
	let videoPlayerElement = document.getElementById("video-player");
	videoPlayerElement.play();	
}

function pauseVideo() {
	let videoPlayerElement = document.getElementById("video-player");
	videoPlayerElement.pause();	
}

function togglePlayPause() {
	let videoPlayerElement = document.getElementById("video-player");
	videoPlayerElement.paused ? playVideo() : pauseVideo();
}

