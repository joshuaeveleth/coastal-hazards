/*jslint browser: true */
/*jslint plusplus: true */
/*global $ */
/*global CCH */
/*global twttr */
/*global alertify */
/*global Handlebars */
window.CCH = CCH || {};
CCH.Objects = CCH.Objects || {};
CCH.Objects.Back = CCH.Objects.Back || {};
CCH.Objects.Back.UI = function (args) {
	"use strict";
	CCH.LOG.info('UI.js::constructor: UI class is initializing.');

	var me = (this === window) ? {} : this;

	me.magicResizeNumber = 992;
	me.isSmall = function () {
		return $(window).outerWidth() < me.magicResizeNumber;
	};

	me.init = function (args) {
		me.$qrImage = $('#qr-code-img');
		me.$infoTitle = $('#info-title');
		me.$infoSummary = $('#info-summary');
		me.$infoPubListSpan = $('#info-container-publications-list-span');
		me.$labelActionCenter = $('#label-action-center');
		me.cswService;
		me.$publist;
		me.item = args.item;
		me.$mapServicesButton = $('#map-services-link-button');
		me.$downloadDataButton = $('#download-link-button');
		me.$printFormWrapper = $('#print-route-form');
		me.$infoButton = $('#application-info-button');
		me.$applicationButton = $('#application-link-button');
		me.$addToBucketButton = $('#add-bucket-link-button');
		me.$computeAnalysisButton = $('#analysis-link-button');
		me.$metadataButton = $('#metadata-link-button');
		me.serviceTemplate = null; // Lazy loaded
		me.$infoButton.on('click', function () {
			window.location.href = CCH.CONFIG.contextPath + '/info/#acContentArea';
			ga('send', 'event', {
				'eventCategory': 'infopage',
				'eventAction': 'infoButtonClicked',
				'eventLabel': 'info page event'
			});
		});

		me.$applicationButton.on('click', function () {
			window.location.href = CCH.CONFIG.contextPath + '/ui/item/' + CCH.CONFIG.itemId;
			ga('send', 'event', {
				'eventCategory': 'infopage',
				'eventAction': 'backToAppButtonClicked',
				'eventLabel': 'info page event'
			});
		});

		me.$downloadDataButton.on('click', function () {
			var cacheError = function () {
				alertify.error(CCH.CONFIG.data.messages.cacheInterrogationError);
				ga('send', 'exception', {
					'exDescription': 'DownloadRequestFailed',
					'exFatal': false
				});
			};

			var cacheHit = function (resp, content, jqXHR) {
				var status = jqXHR.status;

				if (status === 200) {
					window.location.href = CCH.CONFIG.contextPath + CCH.CONFIG.data.sources.download.endpoint + CCH.CONFIG.itemId;
				} else if (status === 202) {
					alertify.log(CCH.CONFIG.data.messages.cachePriming);
				} else {
					// I don't expect any other codes, so default to an error message
					alertify.error(CCH.CONFIG.data.messages.cacheInterrogationError);
				}
				ga('send', 'event', {
					'eventCategory': 'infopage',
					'eventAction': 'downloadRequestSucceeded',
					'eventLabel': 'info page event'
				});
			};

			var checkCache = CCH.Util.Util.interrogateDownloadCache(CCH.CONFIG.itemId);
			checkCache.done(cacheHit).fail(cacheError);
			ga('send', 'event', {
				'eventCategory': 'infopage',
				'eventAction': 'downloadButtonClicked',
				'eventLabel': 'info page event'
			});
		});

		me.$addToBucketButton.on('click', function (evt) {
			CCH.session.addItem({
				item: me.item,
				visible: true
			});
			$(evt.target).addClass('disabled');
			alertify.log('Item added to bucket!');
			ga('send', 'event', {
				'eventCategory': 'infopage',
				'eventAction': 'addToBucketButtonClicked',
				'eventLabel': 'info page event'
			});
		});

		me.$computeAnalysisButton.on('click', function () {
			alertify.log('Not yet.');
			ga('send', 'event', {
				'eventCategory': 'infopage',
				'eventAction': 'computeAnalysisButtonClicked',
				'eventLabel': 'info page event'
			});
		});

		me.createModalServicesTab({
			item: me.item
		});

		// Create a "View Metadata" button
		me.cswService = CCH.CONFIG.item.services.find(function (service) {
			return service.type === 'csw';
		});

		// If item has a metadata service behind it, wire up the button. Otherwise, remove it.
		if (me.cswService && me.cswService.endpoint) {
			me.$metadataButton.on('click', function () {
				window.location.href = me.cswService.endpoint + '&outputSchema=http://www.opengis.net/cat/csw/csdgm';
				ga('send', 'event', {
					'eventCategory': 'infopage',
					'eventAction': 'metadataButtonClicked',
					'eventLabel': 'info page event'
				});
			});
		} else {
			me.$metadataButton.remove();
		}

		// Build the publications list for the item
		if (me.item.summary.full.publications) {
			me.$publist = $('<ul />').attr('id', 'info-container-publications-list');
			Object.keys(me.item.summary.full.publications, function (type) {
				var pubTypeArray = me.item.summary.full.publications[type],
						pubTypeListHeader = $('<li />')
						.addClass('publist-header')
						.html(type),
						subList = $('<ul />'),
						pubLink;
				if (pubTypeArray.length) {
					pubTypeListHeader.append(subList);
					me.$publist.append(pubTypeListHeader);
					me.item.summary.full.publications[type].each(function (publication) {
						pubLink = $('<a />').attr({
							'href': publication.link,
							'target': 'portal_publication_window'
						}).html(publication.title);
						subList.append($('<li />').append(pubLink));
					});
				}
			});
		} else {
			me.$infoPubListSpan.remove();
		}

		me.$infoTitle.html(me.item.summary.full.title);
		me.$qrImage.attr({
			src: CCH.CONFIG.contextPath + '/data/qr/info/item/' + CCH.CONFIG.itemId + '?width=250&height=250'
		});
		me.$infoSummary.html(me.item.summary.full.text);
		me.$infoPubListSpan.append(me.$publist);

		me.$labelActionCenter.on('click', function () {
			me.toggleControlCenterVisibility();
			me.toggleArrowRotation();
			ga('send', 'event', {
				'eventCategory': 'infopage',
				'eventAction': 'controlCenterVisibilityToggled',
				'eventLabel': 'info page event'
			});
		});
		
		if (me.isSmall()) {
			me.toggleControlCenterVisibility();
			me.toggleArrowRotation();
		}

		var minificationCallback = function (data) {
			var url = data.tinyUrl || data.responseJSON.full_url,
					$shareInput = $('#modal-share-summary-url-inputbox'),
					$shareButton = $('#view-sharing-container button');

			// Add the url to the input box
			$shareInput.val(url);
			// Highlight the entire input box
			$shareInput.select();
			// Enable the share button
			$shareButton.removeClass('disabled');

			twttr.widgets.createShareButton(
					url,
					$('#twitter-button-span')[0],
					function (element) {
						CCH.LOG.trace('Twitter create share button callback triggered on ' + element);
					},
					{
						hashtags: 'USGS_CCH',
						lang: 'en',
						size: 'large',
						text: CCH.CONFIG.item.summary.tiny.text,
						count: 'none'
					}
			);

			twttr.events.bind('tweet', function () {
				alertify.log('Your view has been tweeted. Thank you.');
				ga('send', 'event', {
					'eventCategory': 'infopage',
					'eventAction': 'itemTweeted',
					'eventLabel': 'info page event'
				});
			});
		};

		// Build the share modal
		CCH.Util.Util.getMinifiedEndpoint({
			location: CCH.CONFIG.publicUrl + '/ui/info/item/' + CCH.CONFIG.itemId
		}).always(minificationCallback);

		// Is this item already in the bucket? If so, disable the add to bucket button
		if (CCH.session.getItemById(me.item.id)) {
			me.$addToBucketButton.addClass('disabled');
		}

		// To start, I only want tooltips when the app is in desktop mode.
		// I handle enabling/disabling tooltips during mode switch in windowResizeHandler()
		if (!me.isSmall()) {
			me.enableToolTips();
		}

		return me;
	};

	me.windowResizeHandler = function () {
		if (!me.isSmall()) {
			me.toggleControlCenterVisibility(true);
			me.rotateArrow('down');
			me.enableToolTips();
		} else {
			me.disableToolTips();
		}
	};

	me.enableToolTips = function () {
		$('[data-tooltip="tooltip"]').tooltip({container: 'body', trigger: 'hover'});
	};

	me.disableToolTips = function () {
		$('[data-tooltip="tooltip"]').tooltip('destroy');
	};

	me.toggleControlCenterVisibility = function (open) {
		var $actionCenterButtonContainer = $('#container-control-button'),
				hidden = 'hidden';

		// if incoming param was not passed, just toggle from current state
		// otherwise use incoming param to direct whether to open or close
		if (typeof open === "boolean") {
			if (open) {
				$actionCenterButtonContainer.removeClass(hidden);
			} else {
				$actionCenterButtonContainer.addClass(hidden);
			}
		} else {
			if ($actionCenterButtonContainer.hasClass(hidden)) {
				$actionCenterButtonContainer.removeClass(hidden);
			} else {
				$actionCenterButtonContainer.addClass(hidden);
			}
		}
	};

	me.rotateArrow = function (direction) {
		if (!direction) {
			return;
		}
		var $actionArrow = $('.action-arrow');
		if (direction === 'right') {
			$actionArrow.addClass('action-arrow-right');
		} else if (direction === 'down') {
			$actionArrow.removeClass('action-arrow-right').addClass('action-arrow');
		}
		return $actionArrow;
	};

	me.toggleArrowRotation = function () {
		var $actionArrow = $('.action-arrow');

		if (!$('#container-control-button').hasClass('hidden')) {
			$actionArrow.removeClass('action-arrow-right').addClass('action-arrow');
		} else {
			$actionArrow.addClass('action-arrow-right');
		}
		return $actionArrow;
	};

	me.createModalServicesTab = function (args) {
		var item = args.item,
				$treeContainer = $('#modal-services-view-tree-container'),
				createTreeData = function (item, data) {
					data.id = item.id;
					data.text = item.summary.tiny.text;
					data.children = [];
					data.type = item.itemType;
					data.li_attr = {
						'item_data': {
							'services': (function (s) {
								var svcs = [];
								s.each(function (svc) {
									svcs.push(svc);
								});
								return svcs;
							})(item.services)
						}
					};

					if (item.children && item.children.length) {
						// This item has children. We must go...deeper
						for (var itemIdx = 0; itemIdx < item.children.length; itemIdx++) {
							data.children.push(createTreeData(CCH.items.getById({id: item.children[itemIdx]}), {}));
						}
					}
					return data;
				};

		// Before I go too far, check that either this item has services or displays
		// any children with services. If not, hide the map services button and bail
		var deepDiveToFindAnyServices = function (item, services) {
			if (services.length === 0) {
				if (item.children.length !== 0) {
					for (var cIdx = 0; cIdx < item.children.length; cIdx++) {
						var childId = item.children[cIdx];
						services = services.union(deepDiveToFindAnyServices(CCH.items.getById({id: childId}), services));
					}
				}
				services = services.union(item.services);
			}
			return services;
		};
		
		if (deepDiveToFindAnyServices(CCH.CONFIG.item, []).length === 0) {
			[this.$mapServicesButton, this.$printFormWrapper, this.$downloadDataButton].each(function ($i) {
				$i.addClass('hidden');
			});
		}

		Handlebars.registerHelper('list_translation', function (serviceType) {
			var serviceString = '';
			switch (serviceType) {
				case ('csw') :
					serviceString = 'CSW';
					break;
				case ('source_wms') :
					serviceString = 'Source WMS';
					break;
				case ('source_wfs') :
					serviceString = 'Source WFS';
					break;
				case ('proxy_wfs') :
					serviceString = 'Proxy WFS';
					break;
				case ('proxy_wms') :
					serviceString = 'Proxy WMS';
					break;
			}
			return serviceString;
		});

		$.ajax(CCH.CONFIG.contextPath + '/resource/template/handlebars/search/services_display.mustache', {
			success: function (data) {
				CCH.ui.serviceTemplate = Handlebars.compile(data);

				$treeContainer
						.on({
							'select_node.jstree': function (e, data) {
								var services = data.node.li_attr.item_data.services;
								var id = data.node.li_attr.id;
								$('#modal-services-view-services').html(CCH.ui.serviceTemplate({services: services}));
								if (!data.node.state.opened) {
									data.instance.open_node(id, null, true);
								} else {
									data.instance.close_node(id, null, true);
								}

							},
							'loaded.jstree': function (evt, tree) {
								tree.instance.select_node({id: CCH.CONFIG.itemId}, true, true);
							}
						})
						.jstree({
							'core': {
								'data': createTreeData(item, {}),
								'check_callback': true,
								'dblclick_toggle': false,
								'themes': {
									'variant': 'large'
								}
							},
							'types': {
								'aggregation': {
									'icon': 'fa fa-angle-double-right'
								},
								'template': {
									'icon': 'fa fa-angle-double-right'
								},
								'data': {
									'icon': 'fa fa-angle-right'
								}
							},
							'plugins': ['types']
						});
			}
		});
	};

	$(window).on({
		'resize': function () {
			setTimeout(function () {
				me.windowResizeHandler();
			}, 1);
		}
	});

	return $.extend({}, me, {
	});
};
