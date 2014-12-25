/*jslint devel: true, bitwise: true, regexp: true, browser: true, confusion: true, unparam: true, eqeq: true, white: true, nomen: true, plusplus: true, maxerr: 50, indent: 4 */
/*globals jQuery */

/*
 * Dropmenu
 *
 * Copyright (c) 2013-2014 Martijn W. van der Lee
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
			'closeOnSelect':	true,
			'duration':			'normal',
            'items':			[],
			'render':			undefined,
			'showAnim':			'show',
			'showOptions':		{},

			'select':			undefined
        },
		
		_handle_mousedown: null,

        _create: function () {
			var that = this;

            this.widgetEventPrefix = 'dropmenu';

            this.menu		= null;

            this.element.click(function(e) {
				that.toggle();
            });
			
			this._handle_mousedown = function(event) {
				if (!$(event.target).closest(that.element).is(that.element)
				 && !$(event.target).closest(that.menu).is(that.menu)) {
					that.close();
				}
			};
			
			// Click outside to close
            $(document).bind('mousedown', this._handle_mousedown);

            return this;
        },
		
		_destroy: function() {
			$(document).unbind('mousedown', this._handle_mousedown);
		},

		_show: function(element, callback) {
			if ($.effects && $.effects.effect[this.options.showAnim]) {
				element.show(this.options.showAnim, this.options.showOptions, this.options.duration, callback);
			} else {
				element[this.options.showAnim || "show"](this.options.showAnim ? this.options.duration : null, callback);
			}
		},

		_hide: function(element, callback) {
			element.stop();
			if ($.effects && ($.effects.effect[this.options.showAnim] || $.effects[this.options.showAnim])) {
				element.hide(this.options.showAnim, this.options.showOptions, this.options.duration, callback);
			} else {
				element[(this.options.showAnim === "slideDown" ? "slideUp" :
					(this.options.showAnim === "fadeIn" ? "fadeOut" : "hide"))]((this.options.showAnim ? this.options.duration : null), callback);
			}
		},

		toggle: function() {
			this[this.menu ? 'close' : 'open']();
		},

		open: function() {
			var that = this,
				items,
				content,
				element;

			if (!this.menu) {
				this.menu = $('<div class="dropmenu"/>').hide().appendTo('body');
				content = $('<div class="dropdown-content"/>').appendTo(this.menu);
				this._addItemSource(this, content, this.options.items, function() {
					that._show(that.menu.position({
						'of':			that.element,
						'my':			'left top',
						'at':			'left bottom',
						'collision':	'flipfit'
					}));
				});
				
				element = content.get(0);
				if (element.offsetWidth > element.clientWidth) {
					content.css('width', element.offsetWidth + (element.offsetWidth - element.clientWidth) + 1);
				}
			}
		},

		close: function() {
			var that = this,
				menu = this.menu;

			if (this.menu) {
				this.menu = null;
				this._hide(menu, function() {
					menu.remove();
				});
			}
		},

		_addItem: function(menu, item) {
			var that		= this,
				label		= item.label || item.value || item.name || '',
				render		= $.isFunction(item.render) ? item.render
							: $.isFunction(this.options.render) ? this.options.render
							: undefined,
				html		= render? render(item) : label,
				row			= $('<div class="dropmenu-item"/>').html(html).appendTo(menu),				
				text		= render? '' : row.text(),
				selectable	= item.selectable ? item.selectable	: (item.items ? false : true),
				submenu,
				content,
				element;
			
			if (text !== '') {
				row.mouseenter(function () {
					if (this.offsetWidth < this.scrollWidth && !row.attr('title')) {
						row.attr('title', text);
					}
				});
			}

			if (item.items) {
				row.addClass('dropmenu-parent').bind({
					mouseenter: function() {
						submenu = $('<div class="dropmenu"/>').hide().appendTo(row);
						content = $('<div class="dropdown-content"/>').appendTo(submenu);												
						that._addItemSource(item, content, item.items, function() {
							that._show(submenu.css('visibility', 'hidden').show().position({
								'of':			row,
								'my':			'left top',
								'at':			'right top',
								'collision':	'flipfit'
							}).hide().css('visibility', ''));
						});
						element = content.get(0);
						if (element.offsetWidth > element.clientWidth) {
							content.css('width', element.offsetWidth + (element.offsetWidth - element.clientWidth) + 1);
						}						
					},
					mouseleave: function() {
						var oldSubmenu = submenu;
						that._hide(oldSubmenu, function() {
							oldSubmenu.remove();
						});
					}
				});
			}

			if (selectable !== false) {
				row.addClass('dropmenu-selectable');
				row.click(function() {
					if ($.isFunction(item.select)) {
						item.select(item);
					}
					if ($.isFunction(that.options.select)) {
						that.options.select(item);
					}
					if (that.options.closeOnSelect) {
						that.close();
					}
				});
			}
		},

		_addItemSource: function(parent, menu, items, callback) {
			var that = this,
				returned;
			if ($.isFunction(items)) {
				if (returned = items(parent, function(items) {
					that._addItems(menu, items);
					callback();
				})) {
					that._addItems(menu, returned);
					callback();
				}
			} else {
				that._addItems(menu, items);
				callback();
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