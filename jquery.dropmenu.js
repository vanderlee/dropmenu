/*jslint devel: true, bitwise: true, regexp: true, browser: true, confusion: true, unparam: true, eqeq: true, white: true, nomen: true, plusplus: true, maxerr: 50, indent: 4 */
/*globals jQuery */

/*
 * Dropmenu
 *
 * Copyright (c) 2013 Martijn W. van der Lee
 * Licensed under the MIT.
 *
 * Requires jQuery and jQueryUI.
 *
 * Simple dropdown menu for buttons
 */

;(function($, undefined) {
	"use strict";

    $.widget("vanderlee.dropmenu", {
		options: {
            'items':			[],
			'closeOnSelect':	true,
			'showAnim':			'show',
			'duration':			'normal',
			'showOptions':		{},

			'select':			undefined
        },

        _create: function () {
			var that = this;

            that.widgetEventPrefix = 'dropmenu';
			
            that.menu = null;

            that.element.click(function(e) {
                e.preventDefault();
				that.open();
            });

			// Click outside to close
            $(document).delegate('html', 'touchstart click', function (event) {
				if (!$(event.target).closest(that.element).is(that.element)
				 && !$(event.target).closest(that.menu).is(that.menu)) {
					that.close();
				}
            });

            return that;
        },

		_show: function(element) {
			if ($.effects && $.effects.effect[this.options.showAnim]) {
				element.show(this.options.showAnim, this.options.showOptions, this.options.duration);
			} else {
				element[this.options.showAnim || "show"](this.options.showAnim ? this.options.duration : null);
			}
		},

		_hide: function(element, callback) {
			if ($.effects && ($.effects.effect[this.options.showAnim] || $.effects[this.options.showAnim])) {
				element.hide(this.options.showAnim, this.options.showOptions, this.options.duration, callback);
			} else {
				element[(this.options.showAnim === "slideDown" ? "slideUp" :
					(this.options.showAnim === "fadeIn" ? "fadeOut" : "hide"))]((this.options.showAnim ? this.options.duration : null), callback);
			}
		},

		open: function() {
			if (!this.menu) {
				this.menu = $('<div class="dropmenu"/>').hide().appendTo('body');
				this._addItems(this.menu, this.options.items);

				this._show(this.menu.position({
					'of':	this.element,
					'my':	'left top',
					'at':	'left bottom'
				}));
			}
		},

		close: function() {
			var that = this;
			if (that.menu) {
				that._hide(that.menu, function() {
					that.menu.remove();
					that.menu = null;
				});
			}
		},

		_addItem: function(menu, item) {
			var that		= this,
				label		= item.label || item.name,
				row			= $('<div class="dropmenu-item">'+label+'</div>').appendTo(menu),
				selectable	= item.selectable ? item.selectable	: (item.items ? false : true),
				submenu,
				items;
		
			if (item.items) {
				row.addClass('dropmenu-parent');
				submenu = $('<div class="dropmenu"/>').appendTo(row);

				row.hover(function() {
					submenu.css({
						'left': row.outerWidth(),
						'top': row.position().top
					}).empty();

					if ($.isFunction(item.items)) {
						if (items = item.items.call(this, item, function(items) {
							that._addItems(submenu, items);
							that._show(submenu);
						})) {
							that._addItems(submenu, items);
							that._show(submenu);
						}
					} else {
						that._addItems(submenu, item.items);
						that._show(submenu);
					}
				}, function() {
					that._hide(submenu);
				});
			}

			if (selectable !== false) {
				row.addClass('dropmenu-selectable');
				row.click(function() {
					if ($.isFunction(item.select)) {
						item.select.call(this, item);
					}
					that._trigger('select', null, item);

					if (that.options.closeOnSelect) {
						that.close();
					}
				});
			}
		},

		_addItems: function(menu, items) {
			var that = this;

			$.each(items, function(index, item) {
				if ($.isFunction(item)) {
					if (item = item.call(this, item, function(item) {
						that._addItem(menu, item);
					})) {
						that._addItem(menu, item);
					}
				} else {
					that._addItem(menu, item);
				}
			});
		}
    });
}(jQuery));
