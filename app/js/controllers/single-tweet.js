'use strict';
/* global angular, forEach */
/* jshint unused:false */

var controllersModule = require('./_index');
var PhotoSwipe = require('photoswipe');
var PhotoSwipeUI_Default = require('../components/photoswipe-ui-default');

/**
 * @ngInject
 */

controllersModule.controller('SingleTweetCtrl', ['$timeout', '$scope', '$location', '$stateParams', 'SearchService', function($timeout, $scope, $location, $stateParams, SearchService) {
	var vm = this;
	vm.showStatus = false;

	// Show status when imgs are loaded
	function checkImgLoad() {
		var imgs = angular.element('.images-wrapper img');
		if (imgs.length !== 0) {
			angular.forEach(imgs, function(value, key) {
				angular.element(value).bind('load' ,function() {
					vm.showStatus = true;
				});
			});
		} else {
			vm.showStatus = true;
		}
	}

	$scope.$watch(function() {
		return $location.search();
	}, function(value) {
		if (value.q && value.q.indexOf("id") > -1 ) {
			SearchService.getData(value.q)
				.then(function(data) {
					vm.status = data.statuses[0];
					checkImgLoad();
				},
				function() {
					console.log('status initital retrieval failed');
				});
		}
	});

	// Scrape for imgTag to serve photoswipe requirement
	function scrapeImgTag(imgTag) {
	    var ngEle = angular.element(imgTag);
	    return {
	        src: ngEle.attr('src'),
	        w: parseInt(ngEle.css('width').replace('px', '')),
	        h: parseInt(ngEle.css('height').replace('px', ''))
	    };
	}

	// Given a stattus_id, evaluate its data and open a pswp
	// See more pswp documentations
	vm.openSwipe = function(status_id) {
	    var items = [];
	    var images  = angular.element('#' + status_id + ' .images-wrapper img');
	    angular.forEach(images, function(image) {
	        this.push(scrapeImgTag(image));
	    }, items);
	    var options = {
	        index: 0,
	        history: false,
	    };
	    var swipeEle = document.querySelectorAll('.pswp')[0];

	    var swipeObject = 'gallery' + status_id;

	    $timeout(function() {
	        window[swipeObject] = new PhotoSwipe(swipeEle, PhotoSwipeUI_Default, items, options);
	        window[swipeObject].init();
	    }, 0);
	};

}]);
