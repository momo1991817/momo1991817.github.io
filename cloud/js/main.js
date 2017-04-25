/* 
 *  CoreMob Camera
 *  Vanilla JavaScript App
 *  https://github.com/coremob/camera/vanilla
 * 
 *  W3C Core Mobile Web Platform Community Group
 *  License: -----
 */

var CoreMobCamera = (function() {

	var maxFilesize = 1048576 * 3.5; // Max image size is 3.5MB (iPhone5, Galaxy SIII, Lumia920 < 3MB)
	var numPhotosSaved = 0;
	var imgCrop;
	var finalPhotoDimension = 612;
	var viewWidth;
	var isBlobSupported = true;

	// UI
	var originalPhoto = document.getElementById('originalPhoto'),
		resultPhoto = document.getElementById('resultPhoto');

	return {
		init: init
	};

	function init() {
		var prefetchImg = new Image();

		var prefetchImg2 = new Image();


		viewWidth = (window.innerWidth < finalPhotoDimension) ? window.innerWidth : finalPhotoDimension;

		bindEvents();

		checkMediaCaptureSupport();
		console.log(navigator.userAgent);
	}

	function showUI(uiElem) {
		uiElem.removeAttribute('hidden');
	}

	function hideUI(uiElem) {
		uiElem.setAttribute('hidden', 'hidden');
	}


	function reInit() {

		var index = numPhotosSaved-1;
		var q = '[data-index="' + index + '"]';

		var oldClone = document.querySelector('.swiper-wrapper');
		oldClone.parentNode.removeChild(oldClone);
		/*cloneThumbNode();*/
	}

	// Note: IE10 Mobile and Maxthon return the window.FileReader as 'function' but fail to read image
	// I need to write another capability check besides this function
	function checkMediaCaptureSupport() {
		if(typeof window.FileReader === 'undefined') {
			showUI(document.getElementById('warningMediaCapture'));
			document.querySelector('.camera').classList.add('no-support'); //disable the button
		}
	}

	function checkHistorySupport() {
		if (typeof history.pushState === 'undefined') {
			showUI(document.getElementById('warningHistory'));
		}
	}

	function renderFirstRun() {

		var arrowHeight = window.innerHeight * .5;
		document.getElementsByClassName('arrow-container')[0].style.height = arrowHeight + 'px';
	}

	function bindEvents() {
		// Screen orientation/size change
		var orientationEvent = ('onorientationchange' in window) ? 'orientationchange' : 'resize';
		window.addEventListener(orientationEvent, function() {
			/*displayThumbnails();*/
		}, false);

		// A photo taken (or a file chosen)
		document.getElementById('camera').addEventListener('change', function() {
                        
			fileSelected('camera');
			
		}, false);

	}


	function cropAndResize() {
		
		var photoObj = document.getElementById('originalPhoto');

		imgCrop = new PhotoCrop(photoObj, {
			size: {w: finalPhotoDimension, h: finalPhotoDimension}
		});

		var newImg = imgCrop.getDataURL();
		imgCrop.displayResult();
		document.getElementById('croppedPhoto').setAttribute('hidden','hidden'); //keep in DOM but not shown

		resultPhoto.src = newImg;
		resultPhoto.style.width = 310 + 'px';
		resultPhoto.style.height = 230 +'px';

		// Removing the previously created canvas, if any
		var prevEffect = document.getElementById('filteredPhoto');
		if(prevEffect) {
			prevEffect.parentNode.removeChild(prevEffect);

		}

		history.pushState({stage: 'effectView'}, null);
	}

	/**
	 * File Picker
	 */

	function fileSelected(capture) {
		var localFile = document.getElementById(capture).files[0],
			imgFormat = /^(image\/bmp|image\/gif|image\/jpeg|image\/png)$/i;

		if (! imgFormat.test(localFile.type)) {
			alert('The image format, ' + localFile.type + ' is not supported.');
			return;
		}

		if (localFile.size > maxFilesize) { //this should exclude a huge panorama pics
			alert('The file size is too large.');
			return;
		}

		// display the selected image
		var orig = document.getElementById('originalPhoto');
		var imgFile = new FileReader();

		imgFile.onload = function(e){
			// e.target.result contains the Base64 DataURL
			orig.onload = function () {
				cropAndResize();
				//displayFileInfo(localFile, orig);
			};
			orig.src = e.target.result;
		};

		imgFile.readAsDataURL(localFile);
		
		
	}


}());

onload = function() {
	CoreMobCamera.init();
};
function camera() {
	document.getElementById('camera').click();
	$.showLoading();
	return false;
}
