(function ($) {
   var that = this;

   this.smartPrivate = {
      containerBg: {},
      parentContainer: {},
      containerClass: 'smartBg-container',
      arrowClassAll: 'arrowBackgroundGame',
      options: {
         imgBg: '',
         showArrow: false,
         keepVisible: true
      },
      init: function (parent) {
         this.parentContainer = parent;
         this.parentContainer.append($('<div class="subgame-backgroundImagesubgame-backgroundImage"></div>'));
         this.containerBg = $('.subgame-backgroundImagesubgame-backgroundImage');
         this.containerBg.addClass(this.containerClass);

         var background = new Image();
         background.onload = function () {
            var bgWidth = this.width;
            var bgHeight = this.height;
            that.smartPrivate.buildBackground(bgWidth, bgHeight);

            $(window).resize(function () {
               $('.' + that.smartPrivate.arrowClassAll).remove();
               that.smartPrivate.buildBackground(bgWidth, bgHeight);
            });
         };
         background.src = this.options.imgBg;
      },
      buildBackground: function (bgWidth, bgHeight) {

         $('.' + that.smartPrivate.arrowClassAll).unbind('click');
         if (this.options.showArrow) {
            that.smartPrivate.loadBackground(bgWidth, bgHeight);
         } else {
            //loadBackgroundsNoMarging(bgWidth, bgHeight, imageUrl);
         }

         //add this in the controller
         //$scope.$on("$destroy", function (event) {
         //   jQuery(window).unbind("resize");
         //});
      },
      loadBackground: function (imgWidth, imgHeight) {

         var parentElement = that.smartPrivate.parentContainer;
         var parentHeight = parentElement.height();
         var parentWidth = parentElement.width();
         var bgRatio = imgWidth / imgHeight;
         var imageUrl = that.smartPrivate.options.imgBg;

         that.smartPrivate.containerBg.height(imgHeight);
         that.smartPrivate.containerBg.width(imgWidth);

         that.smartPrivate.containerBg.css(
            'background-image',
            'url(' + imageUrl + ')'
         );

         that.smartPrivate.containerBg.fadeIn('slow');
         that.smartPrivate.containerBg.attr('data-position', 'center');

         if (parentElement[0].offsetHeight < parentElement[0].scrollHeight || parentElement[0].offsetWidth < parentElement[0].scrollWidth) {

            if (bgRatio >= 1.35) {
               that.smartPrivate.setLandscape(imgWidth, imgHeight, parentHeight, parentWidth);
            } else {
               that.smartPrivate.setPortrait(imgWidth, imgHeight, parentHeight, parentWidth);
            }

         } else {
            that.smartPrivate.setPortrait(imgWidth, imgHeight, parentHeight, parentWidth);
         }

         if (that.smartPrivate.options.keepVisible) {
            // Show arrows when is clicked the background
            $('.' + that.smartPrivate.arrowClassAll).css('opacity', '0');
            that.smartPrivate.parentContainer.on('click', that.smartPrivate.attachBackgroundEvent);
            $('.' + that.smartPrivate.arrowClassAll).hover(function () {
               $('.' + that.smartPrivate.arrowClassAll).css('opacity', '1');
            }, function () {
               var timer = undefined;
               timer = setTimeout(function () {
                  // Remove opacity style for prevents problems with :hover
                  $('.' + that.smartPrivate.arrowClassAll).css('opacity', '0');
                  clearTimeout(timer);
               }, 2000);
            });
         }

      },
      attachBackgroundEvent: function (event) {
         // Get the element clicked
         var targetElement = $(event.originalEvent.target);
         if (targetElement.hasClass(that.smartPrivate.containerClass)) {
            var timer = undefined;
            $('.' + that.smartPrivate.arrowClassAll).css('opacity', '1');

            timer = setTimeout(function () {
               // Remove opacity style for prevents problems with :hover
               $('.' + that.smartPrivate.arrowClassAll).css('opacity', '0');
               clearTimeout(timer);
            }, 3000);
         } else {
            var timer = undefined;
            timer = setTimeout(function () {
               // Remove opacity style for prevents problems with :hover
               $('.' + that.smartPrivate.arrowClassAll).css('opacity', '0');
               clearTimeout(timer);
            }, 3000);
         }
      },

      setPortrait: function(imgWidth, imgHeight, parentHeight, parentWidth) {
	      var ratio = imgWidth / parentWidth;
         var newHeightImage = imgHeight / ratio;

         if (newHeightImage >= parentHeight) {//in mobile view this image has to be bigger than the container
            that.smartPrivate.containerBg.height(newHeightImage);
            that.smartPrivate.containerBg.width(parentWidth);
            that.smartPrivate.containerBg.css(
               'background-size',
               parentWidth + 'px ' + newHeightImage + 'px'
            );

            //center image, half of image minues half of container
            var moveToCenter = (newHeightImage / 2) - (parentHeight / 2);
            that.smartPrivate.containerBg.css('top', '-' + moveToCenter + 'px');
            that.smartPrivate.containerBg.css('left', '0px');

            if ($('.arrowBackgroundGame-up').length == 0 && $('.arrowBackgroundGame-down').length == 0) {
               that.smartPrivate.parentContainer.append(
                  '<span class="glyphicon glyphicon-chevron-up arrowBackgroundGame arrowBackgroundGame-up" data-type="up"></span>' +
                  '<span class="glyphicon glyphicon-chevron-down arrowBackgroundGame arrowBackgroundGame-down" data-type="down"></span>'
               );
            }
            that.smartPrivate.attachEvent(parentHeight, parentWidth, moveToCenter);
         } else {
            that.smartPrivate.setLandscape(imgWidth, imgHeight, parentHeight, parentWidth);
         }

      },

      setLandscape: function (imgWidth, imgHeight, parentHeight, parentWidth) {
	      var ratio = imgHeight / parentHeight;
         var newWidthImage = imgWidth / ratio;

         if (newWidthImage >= parentWidth) {//in mobile view this image has to be bigger than the container

            that.smartPrivate.containerBg.height(parentHeight);
            that.smartPrivate.containerBg.width(newWidthImage);
            that.smartPrivate.containerBg.css(
               'background-size',
               newWidthImage + 'px ' + parentHeight + 'px');

            //center image, half of image minues half of container
            var moveToCenter = (newWidthImage / 2) - (parentWidth / 2);
            that.smartPrivate.containerBg.css('left', '-' + moveToCenter + 'px');
            that.smartPrivate.containerBg.css('top', '0px');

            //after redimension the image to fit the contanier we can check if the width are bigger than container. this happens with image 4400/3500
            if (that.smartPrivate.containerBg.width() < parentWidth) {
               that.smartPrivate.containerBg.addClass('overContent-centerAll');
            } else {
               if ($('.arrowBackgroundGame-left').length == 0 && $('.arrowBackgroundGame-right').length == 0) {
                  that.smartPrivate.parentContainer.append(
                      '<span class="glyphicon glyphicon-chevron-left arrowBackgroundGame arrowBackgroundGame-left" data-type="left"></span>' +
                      '<span class="glyphicon glyphicon-chevron-right arrowBackgroundGame arrowBackgroundGame-right" data-type="right"></span>'
                   );
               }
            }
            that.smartPrivate.attachEvent(parentHeight, parentWidth, moveToCenter);
         } else {
            that.smartPrivate.setPortrait(imgWidth, imgHeight, parentHeight, parentWidth);
         }

      },


      attachEvent: function (parentHeight, parentWidth, center) {

	      $('.' + that.smartPrivate.arrowClassAll).on('click', function () {
	         var imageBg = {
	            top: parseInt(that.smartPrivate.containerBg.css('top'), 10),
	            left: parseInt(that.smartPrivate.containerBg.css('left'), 10),
	            height: that.smartPrivate.containerBg.height(),
	            width: that.smartPrivate.containerBg.width(),
	            position: that.smartPrivate.containerBg.attr('data-position')
	         };

	         switch ($(this).attr('data-type')) {
	            case 'up':
	               if (imageBg.position == 'center') {
	                  that.smartPrivate.containerBg.css('top', '0%');
	                  that.smartPrivate.containerBg.attr('data-position', 'top');
	               }

	               if (imageBg.position == 'bottom') {
	                  that.smartPrivate.containerBg.css('top', '-' + center + 'px');
	                  that.smartPrivate.containerBg.css('bottom', '');
	                  that.smartPrivate.containerBg.attr('data-position', 'center');
	               }
	               break;
	            case 'down':
	               if (imageBg.position == 'center') {
	                  that.smartPrivate.containerBg.css('top', '');
	                  that.smartPrivate.containerBg.css('bottom', '0%');
	                  that.smartPrivate.containerBg.attr('data-position', 'bottom');
	               }

	               if (imageBg.position == 'top') {
	                  that.smartPrivate.containerBg.css('top', '-' + center + 'px');
	                  that.smartPrivate.containerBg.attr('data-position', 'center');
	               }
	               break;
	            case 'left':
	               if (imageBg.position == 'center') {
	                  that.smartPrivate.containerBg.css('left', '0%');
	                  that.smartPrivate.containerBg.attr('data-position', 'left');
	               }

	               if (imageBg.position == 'right') {
	                  that.smartPrivate.containerBg.css('left', '-' + center + 'px');
	                  that.smartPrivate.containerBg.attr('right', '');
	                  that.smartPrivate.containerBg.attr('data-position', 'center');
	               }
	               break;
	            case 'right':
	               if (imageBg.position == 'center') {
	                  that.smartPrivate.containerBg.css('left', '');
	                  that.smartPrivate.containerBg.css('right', '0%');
	                  that.smartPrivate.containerBg.attr('data-position', 'right');
	               }

	               if (imageBg.position == 'left') {
	                  that.smartPrivate.containerBg.css('left', '-' + center + 'px');
	                  that.smartPrivate.containerBg.attr('data-position', 'center');
	               }
	               break;
	         }

	      });

      }
   }

   $.fn.smartBg = function (options) {
      that.smartPrivate.options = $.extend(that.smartPrivate.options, options);
      that.smartPrivate.init(this);
      return this;
   };

}(jQuery));