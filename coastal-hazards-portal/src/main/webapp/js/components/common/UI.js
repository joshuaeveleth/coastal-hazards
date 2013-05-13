var UI = function(args) {
	LOG.info('UI.js::constructor: UI class is initializing.');
	var me = (this === window) ? {} : this;
	me.spinner = args.spinner;
	me.searchbar = args.searchbar;
	me.mapdiv = args.mapdiv;
	me.descriptionDiv = args.descriptionDiv;
	me.magicResizeNumber = 767;
	me.minimumHeight = args.minimumHeight || 480;
	me.previousWidth = $(window).width();
	me.currentSizing = '';
	LOG.debug('UI.js::constructor: UI class initialized.');
	return $.extend(me, {
		init: function() {
			this.bindSearchInput();
			this.bindWindowResize();
			this.bindSubmenuButtons();

			var currWidth = me.previousWidth;
			if (currWidth <= me.magicResizeNumber) {
				me.currentSizing = 'small';
			} else if (currWidth > me.magicResizeNumber) {
				me.currentSizing = 'large';
			}

			$(window).resize();
		},
		bindWindowResize: function() {
			$(window).resize(function() {
				var currWidth = $(window).width();
				var contentRowHeight = $(window).height() - $('#header-row').height() - $('#footer-row').height();

				if (contentRowHeight < me.minimumHeight) {
					contentRowHeight = me.minimumHeight;
				}

				var updated = false;
				if (me.previousWidth > me.magicResizeNumber && currWidth <= me.magicResizeNumber) {
					LOG.debug('resize-small');
					me.currentSizing = 'small';
					updated = true;
				} else if (me.previousWidth <= me.magicResizeNumber && currWidth > me.magicResizeNumber) {
					LOG.debug('resize-large');
					me.currentSizing = 'large';
					updated = true;
				}

				if (me.currentSizing === 'small') {
					var descriptionHeight = Math.round(contentRowHeight * .30);
					if (descriptionHeight < 280) {
						descriptionHeight = 280;
					}
					me.descriptionDiv.height(descriptionHeight);
					me.mapdiv.height(contentRowHeight - descriptionHeight);

				} else if (me.currentSizing === 'large') {
					me.mapdiv.height(contentRowHeight);
					me.descriptionDiv.height(contentRowHeight);
				}

				if (updated) {
					CONFIG.ui.createSlideshow();
				}

				me.previousWidth = currWidth;
			});
		},
		popoverClickHandler: function(e) {
			var container = $(this);
			if (!CONFIG.popupHandling.isVisible) {
				$(container).popover('show');
				CONFIG.popupHandling.clickedAway = false;
				CONFIG.popupHandling.isVisible = true;
				e.preventDefault();
			}
		},
		popoverShowHandler: function() {
			var container = $(this);
			var closePopovers = function(e) {
				if (CONFIG.popupHandling.isVisible && CONFIG.popupHandling.clickedAway && !$(e.target.offsetParent).hasClass('popover')) {
					$(document).off('click', closePopovers);
					$(container).popover('hide');
					CONFIG.popupHandling.isVisible = false;
					CONFIG.popupHandling.clickedAway = false;
				} else {
					CONFIG.popupHandling.clickedAway = true;
				}
			};
			$(document).off('click', closePopovers);
			$(document).on('click', closePopovers);
		},
		bindSubmenuButtons: function() {
			['storms', 'vulnerability'].each(function(item) {
				$('#accordion-group-' + item + '-view').popover({
					html: true,
					placement: 'right',
					trigger: 'manual',
					title: 'View ' + item.capitalize(),
					container: 'body',
					content: "<ul><li>Sed ut perspiciatis, unde omnis iste natus error sit voluptatem </li><li>Sed ut perspiciatis, unde omnis iste natus error sit voluptatem </li><li>Sed ut perspiciatis, unde omnis iste natus error sit voluptatem </li></ul>"
				}).on({
					click: CONFIG.ui.popoverClickHandler,
					shown: CONFIG.ui.popoverShowHandler
				});

				$('#accordion-group-' + item + '-learn').popover({
					html: true,
					placement: 'right',
					trigger: 'manual',
					title: 'Learn About ' + item.capitalize(),
					container: 'body',
					content: "<ul><li>Sed ut perspiciatis, unde omnis iste natus error sit voluptatem </li><li>Sed ut perspiciatis, unde omnis iste natus error sit voluptatem </li><li>Sed ut perspiciatis, unde omnis iste natus error sit voluptatem </li></ul>"
				}).on({
					click: CONFIG.ui.popoverClickHandler,
					shown: CONFIG.ui.popoverShowHandler
				});
			});
		},
		bindSearchInput: function() {
			me.searchbar.submit(function(evt) {
				var query = $('#app-navbar-search-input').val();
				if (query) {
					$.ajax({
						type: 'GET',
						url: 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find',
						data: {
							text: query,
							maxLocations: '20',
							outFields: '*',
							f: 'pjson',
							outSR: '3785'
						},
						async: false,
						contentType: 'application/json',
						dataType: 'jsonp',
						success: function(json) {
							if (json.locations[0]) {

								CONFIG.map.buildGeocodingPopup({
									locations: json.locations
								});

							} else {
							}
						}
					});
				}

			});
		},
		buildSlide: function(args) {
			var cswId = args.cswId;
			var item = CONFIG.popularity.getById({
				'id': cswId
			});

			if (item) {
				var containerDiv = $('<div />').addClass('description-container container-fluid');
				var toolbarRow = $('<div />').addClass('row-fluid description-button-row text-center');
				var buttonToolbar = $('<div />').addClass('btn-toolbar');
				var buttonGroup = $('<div />').addClass('btn-group');
				var titleRow = $('<div />').addClass('description-title-row row-fluid');
				var descriptionRow = $('<div />').addClass('description-description-row row-fluid');
				var expandButton = $('<button />').addClass('btn').attr('type', 'button').append($('<i />').addClass('icon-plus-sign slide-button muted'));
				var pauseButton = $('<button />').addClass('btn').attr('type', 'button').append($('<i />').addClass('icon-pause slide-button muted'));
				var reverseButton = $('<button />').addClass('btn').attr('type', 'button').append($('<i />').addClass('icon-fast-backward slide-button muted'));

				containerDiv.append(toolbarRow);
				toolbarRow.append(buttonToolbar);
				buttonToolbar.append(buttonGroup);
				buttonGroup.append(expandButton, pauseButton, reverseButton);

				var imageColumn = $('<div />').addClass('description-image-column span1 hidden-phone');
				var imageClass = 'muted ';
				if (item.type === 'storms') {
					imageClass += 'icon-bolt';
				} else if (item.type === 'vulnerability') {
					imageClass += 'icon-globe';
				} else {
					imageClass += 'icon-calendar';
				}
				imageColumn.append($('<div />').addClass('description-title-stage-container span2').append($('<i />').addClass(imageClass + ' description-title-stage-label')));

				var titleColumn = $('<div />').addClass('description-title-column span10 offset1').append($('<p />').addClass('lead').html(item.name));

				titleRow.append(imageColumn, titleColumn);

				descriptionRow.append($('<p />').addClass('slide-vertical-description unselectable').html(item.summary.abstract));

				containerDiv.append(titleRow, descriptionRow);
				if (CONFIG.ui.currentSizing === 'large') {
					containerDiv.addClass('description-container-large');
				} else if (CONFIG.ui.currentSizing === 'small') {
					containerDiv.addClass('description-container-small');
				}
			}

			return containerDiv;
		},
		bindShareMenu: function(args) {
			var menuItem = args.menuItem;
			menuItem.popover({
				html: true,
				placement: 'right',
				trigger: 'manual',
				title: 'Share Session',
				container: 'body',
				content: "<div class='container-fluid' id='prepare-container'><div>Preparing session export...</div></div>"
			}).on({
				'click': CONFIG.ui.popoverClickHandler,
				'shown': function() {
					CONFIG.session.getMinifiedEndpoint({
						callbacks: [
							function(args) {
								var response = args.response;
								var url = args.url;

								// URL controlset
								var container = $('<div />').addClass('container-fluid');
								var row = $('<div />').addClass('row-fluid');
								var controlSetDiv = $('<div />');
								container.append(row.append(controlSetDiv));
								$('#prepare-container').replaceWith(container);


								var goUsaResponse = JSON.parse(response.response);
								if (goUsaResponse.response.statusCode && goUsaResponse.response.statusCode.toLowerCase() === 'error') {
									LOG.warn(response.response);
								} else {
									url = goUsaResponse.response.data.entry[0].short_url;
								}
								controlSetDiv.html('Use the following URL to share your current view<br /><br /><b>' + url + '</b>');
							}
						]
					});
					CONFIG.ui.popoverShowHandler.call(this);
				}
			});
		},
		showSpinner: function() {
			me.spinner.fadeIn();
		},
		hideSpinner: function() {
			me.spinner.fadeOut();
		},
		createSlideshow: function(args) {
			setTimeout(function(args) {
				args = args || {};
				var results = args.results || CONFIG.popularity.results.sortBy(function(result) {
					return parseInt(result.hotness);
				}, true);

				$('.iosSlider').iosSlider('destroy');
				$('.iosSlider').iosSliderVertical('destroy');
				$('.iosSlider').remove();

				var sliderContainer = $('<div />').addClass('iosSlider').attr('id', 'iosslider-container');
				var sliderUl = $('<div />').addClass('slider').attr('id', 'iosslider-slider');
				sliderContainer.append(sliderUl);

				$('#description-wrapper').append(sliderContainer);

				results.each(function(result) {
					var item = CONFIG.ui.buildSlide({
						'cswId': result.id
					});

					var slide = $('<div />').addClass('slide well well-small').append(item);
					$('#iosslider-slider').append(slide);
				});

				var toggleClassForActiveSlide = function(event) {
					$('.slide').each(function(i, slide) {
						$(slide).removeClass('slider-slide-active');
						$(slide).addClass('slider-slide-inactive');
					});

					event.currentSlideObject.removeClass('slider-slide-inactive');
					event.currentSlideObject.addClass('slider-slide-active');
				};

				if (CONFIG.ui.currentSizing === 'large') {
					var resize = function(event) {
						toggleClassForActiveSlide(event);

						event.sliderContainerObject.css({
							'width': $('#description-wrapper').width() + 'px',
							'height': $('#description-wrapper').height() + 'px'
						});
						event.sliderObject.css({
							'width': event.sliderContainerObject.width() + 'px',
							'height': event.sliderContainerObject.height() + 'px'
						});

						$('.slide').each(function(index, slide) {
							var buttons = $(slide).find('.description-button-row');
							var title = $(slide).find('.description-title-row');
							var descr = $(slide).find('.description-description-row');

							var slideHeight = buttons.height() + title.height() + descr.height();
							if (slideHeight > event.sliderContainerObject.height()) {
								slideHeight = event.sliderContainerObject.height();
							}

							$(slide).css({
								'max-height': event.sliderContainerObject.height() + 'px',
								'height': slideHeight + 'px'
							});

							descr.css({
								'max-height': $(slide).height() - buttons.height() - title.height() + 'px'
							});
						});
					};
					
					sliderContainer.iosSliderVertical({
						desktopClickDrag: true,
						snapToChildren: true,
						snapSlideCenter: true,
						keyboardControls: true,
						autoSlide: true,
						autoSlideTransTimer: 1500,
						unselectableSelector: $('.unselectable'),
						onSliderLoaded: resize,
						onSliderResize: resize,
						onSlideChange: toggleClassForActiveSlide
					});
				} else if (CONFIG.ui.currentSizing === 'small') {
					var resizeSmall = function(event) {
						var container = $(event.sliderContainerObject).parent();
						event.sliderContainerObject.css('height', (container.height()) + 'px');
						event.sliderObject.css('height', (container.height()) + 'px');
						
						$('.slide').each(function(index, slide) {
							var buttons = $(slide).find('.description-button-row');
							var title = $(slide).find('.description-title-row');
							var descr = $(slide).find('.description-description-row');

							$(slide).css({
								'max-height': event.sliderContainerObject.height() - 20 + 'px',
								'height': event.sliderContainerObject.height() - 20 + 'px'
							});
							
							descr.css({
								'max-height': event.sliderContainerObject.height() - buttons.height() - title.height() - 20 + 'px',
								'height': event.sliderContainerObject.height() - buttons.height() - title.height() - 20 + 'px'
							});
						});
					};

					sliderContainer.iosSlider({
						desktopClickDrag: true,
						snapToChildren: true,
						snapSlideCenter: true,
						keyboardControls: true,
						autoSlide: true,
						autoSlideTransTimer: 1500,
						unselectableSelector: $('.unselectable'),
						onSliderLoaded: resizeSmall,
						onSliderResize: resizeSmall,
						onSlideChange: toggleClassForActiveSlide
					});
				}

				var orientationChange = function(event) {
					CONFIG.ui.createSlideshow();
				};

				$(window).off('orientationchange', orientationChange);
				$(window).on('orientationchange', orientationChange);
			}, 1000);
		}
	});
};