/**
 *  Copyright 2014 Nest Labs Inc. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
/* globals $, Firebase */
'use strict';

var nestToken  = $.cookie('nest_token');
var firstLoad = true;

if (nestToken) { // Simple check for token

  // Create a reference to the API using the provided token
  var dataRef = new Firebase('wss://developer-api.nest.com');
  dataRef.auth(nestToken);

  // in a production client we would want to
  // handle auth errors here.

} else {
  // No auth token, go get one
  window.location.replace('/auth/nest');
}

/**
  Utility method to return the first child
  value of the passed in object.

  @method
  @param object
  @returns object
*/
function firstChild(object) {
  for(var key in object) {
    return object[key];
  }
}

$('#date').html($.format.date(new Date(), 'MMMM d'));

/**
  Start listening for changes on this account,
  update appropriate views as data changes.

*/
dataRef.on('value', function (snapshot) {
  var data = snapshot.val();

  // For simplicity, we only care about the first camera in the first structure
  var structure = firstChild(data.structures);
  var camera = data.devices.cameras[structure.cameras[0]];

  $('#cameraNameLong').html(camera.name_long);
  
  // On first load, do not display last event from camera
  if (!firstLoad) {
    var scope = angular.element(document.body).scope();
    scope.addEvent(camera.last_event);
    scope.$apply();
  } else {
  	firstLoad = false;
  }
});

angular.module('NestApp', []).controller('MainController', function($scope) {
	var getTimeSpan = function(event) {
		var timeSpan = $.format.date(event.start_time, 'h:mm:ss a') + ' - ';
		if (event.end_time) {
			timeSpan += $.format.date(event.end_time, 'h:mm:ss a');
		} else {
			timeSpan += 'ongoing';
		}
		return timeSpan
	};
	
	var getDuration = function(event) {
		if (event.end_time) {
			return $.format.date(new Date(new Date(event.end_time) - new Date(event.start_time)), 'mm:ss');
		} else {
			return '';
		}
	};
	
  $scope.events = [];
  $scope.addEvent = function(event) {
  	var newEvent = {
  			start_time: event.start_time,
  	  	timeSpan: getTimeSpan(event),
  	  	duration: getDuration(event),
  	  	image_url: event.image_url
  	};
  
  	// check if event is new or just an update
  	if ($scope.events.length > 0 && $scope.events[0].start_time === newEvent.start_time) {
			$scope.events[0] = newEvent;
  	} else {
  		$scope.events.unshift(newEvent);
  	}
  	
  	$scope.viewImage = function(index) {
  		$('#eventTimeSpan').html($scope.events[index].timeSpan);
  		document.getElementById('eventImage').src = $scope.events[index].image_url;
  		$('#imageModal').modal('show');
  	}
  }
});

//hide main table first so that ng-repeat rows not yet processed by angular will not be seen
$('#main-table').show();