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
				if (event.target !== that.element[0] && !$(event.target).closest($(that.menu)).is(that.menu)) {
					that.close();
				}
            });

            return that;
        },

		open: function() {
			if (!this.menu) {
				this.menu = $('<div class="dropmenu"/>').hide().appendTo('body');
				this._addItems(this.menu, this.options.items);

				this.menu.position({
					'of':	this.element,
					'my':	'left top',
					'at':	'left bottom'
				}).show();
			}
		},

		close: function() {
			if (this.menu) {
				this.menu.remove();
				this.menu = null;
			}
		},

		_addItem: function(menu, item) {
			var that	= this,
				label	= item.label || item.name,
				row	= $('<div class="dropmenu-item">'+label+'</div>').appendTo(menu),
				submenu;
		
			if ($.isArray(item.items)) {
				row.addClass('dropmenu-parent');
				submenu = $('<div class="dropmenu"/>').appendTo(row);
				that._addItems(submenu, item.items);

				row.hover(function() {
					submenu.css({
						'left': row.outerWidth(),
						'top': row.position().top
					}).show();
				}, function() {
					submenu.hide();
				});
			}

			if (item.selectable !== false) {
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
				that._addItem(menu, item);
			});
		}
    });
}(jQuery));