'use strict';

// Put variables in global scope to make them available to the browser console.
var video = document.querySelector('video');
var canvas = window.canvas = document.querySelector('canvas');
canvas.width = 480;
canvas.height = 0;
var dataURL;
var highEmotion = "";

// Empty variable to hold URL which will change depending on emotion detected

var queryURL = "";

$(document).on("click", "#takeSnapshot", whichMovies);

function whichMovies () {

$("#test-div").empty();

//// Which genre will match with which emotion? 
// anger = action, crime, thriller
// contempt = documentary, history
// disgust = science fiction
// fear = horror, mystery
// neutral = drama
// sadness = romance, drama
// surprise = fantasy, adventure
// happiness = comedy, music

// Variables holding the genre IDs needed for the API call

var action = "28";
var adventure = "12";
var comedy = "35";
var crime = "80";
var documentary = "99";
var drama = "18";
var fantasy = "14";
var history = "36";
var horror = "27";
var music = "10402";
var mystery = "9648";
var romance = "10749";
var scienceFiction = "878";
var thriller = "53";

// Movie Database API key

var movieAPI = "aed8a1ce3108479482ae5d0e4cbb536a";

// If statements that determine which URL will be called

if (highEmotion === "anger") {

	queryURL = "https://api.themoviedb.org/3/discover/movie?api_key=" + movieAPI + "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=" + action + "%2C%20" + crime + "%2C%20" + thriller; 

} else if (highEmotion === "contempt") {

	queryURL = "https://api.themoviedb.org/3/discover/movie?api_key=" + movieAPI + "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=" + documentary + "%2C%20" + history;

} else if (highEmotion === "disgust") {

	queryURL = "https://api.themoviedb.org/3/discover/movie?api_key=" + movieAPI + "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=" + scienceFiction;

} else if (highEmotion === "fear") {

	queryURL = "https://api.themoviedb.org/3/discover/movie?api_key=" + movieAPI + "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=" + horror + "%2C%20" + mystery;

} else if (highEmotion === "neutral") {

	queryURL = "https://api.themoviedb.org/3/discover/movie?api_key=" + movieAPI + "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=" + drama;

} else if (highEmotion === "sadness") {

	queryURL = "https://api.themoviedb.org/3/discover/movie?api_key=" + movieAPI + "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=" + romance + "%2C%20" + drama;

} else if (highEmotion === "surprise") {

	queryURL = "https://api.themoviedb.org/3/discover/movie?api_key=" + movieAPI + "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=" + fantasy + "%2C%20" + adventure;

} else {

	queryURL = "https://api.themoviedb.org/3/discover/movie?api_key=" + movieAPI + "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=" + comedy + "%2C%20" + music;

}

ajaxCall ();

}

// AJAX Call to the Movie Database API

function ajaxCall () {

	$.ajax({
		url: queryURL,
		method: 'GET'
	}).done(function(response) {

		var results = response.results;

		console.log(results);

		// for (var i = 0; i < 10; i++) {

		// 	var movieDiv = $("<div>");

  //   		var poster = $("<img>");

  //   		reactionImage.addClass("gif");

  //   		reactionImage.attr("src", results[i].images.fixed_height_still.url);

  //   		reactionDiv.append(reactionImage);
  //   		reactionDiv.append(p);

  //   		reactionDiv.addClass("float-left m-2");

  //   		$("#gif-view").prepend(reactionDiv);
		// }
	})
}

/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */


//I think this takes a still and displays it
var button = document.querySelector('button');
button.onclick = function () {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').
  drawImage(video, 0, 0, canvas.width, canvas.height);

  dataURL = canvas.toDataURL("image/png");

  var makeblob = function (dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
      var parts = dataURL.split(',');
      var contentType = parts[0].split(':')[1];
      var raw = decodeURIComponent(parts[1]);
      return new Blob([raw], {
        type: contentType
      });
    }
    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {
      type: contentType
    });
  };

  // console.log(dataURL);
  var params = {
    // Request parameters
  };

  $.ajax({
      // NOTE: You must use the same location in your REST call as you used to obtain your subscription keys.
      //   For example, if you obtained your subscription keys from westcentralus, replace "westus" in the 
      //   URL below with "westcentralus".
      url: "https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize?" + $.param(params),
      beforeSend: function (xhrObj) {
        // Request headers
        xhrObj.setRequestHeader("Content-Type", "application/octet-stream");

        // NOTE: Replace the "Ocp-Apim-Subscription-Key" value with a valid subscription key.
        xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "d8c7aa1767df41c0aa08d36223895b0c");
      },
      type: "POST",
      // Request body
      // data: '{"url": canvas.toDataURL()}',
      data: makeblob(dataURL),
      processData: false,

    })
    .done(function (data) {
      alert("success");
      if (typeof data[0] !== "undefined") {
        var scores = data[0].scores;
        // Returns the highest index in the emotion object in emotion object
        var highEmotion = Object.keys(scores).reduce((a, b) => {
          return scores[a] > scores[b] ? a : b
        });
      }
      else {
        alert("Please take another picture");
      }


      console.log(highEmotion);
    })
    .fail(function () {
      alert("error");
    });

};
console.log(dataURL);

var constraints = {
  audio: false,
  video: true
};

function handleSuccess(stream) {
  window.stream = stream; // make stream available to browser console
  video.srcObject = stream;
}

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

navigator.mediaDevices.getUserMedia(constraints).
then(handleSuccess).catch(handleError);