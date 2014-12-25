jQuery.dropmenu
===============
v1.0.2

Copyright &copy; 2013-2014 Martijn W. van der Lee (http://martijn.vanderlee.com).
Licensed under the MIT.

Tree dropdown menu with native look and feel, user-defined item
rendering and unlimited items and depth.

Styled according to operating system.

Features
--------
-	Render any HTML content
-	Unlimited items and submenus
-	Styling matches operating system/browser look
-	Optional scrollbar
-	Submenus optionally selectable
-	Regenerate items every time
-	Short and sweet; just over 200 lines of cleanly written code

Download
--------
jQuery v1.6.0 or higher required.

jQueryUI v1.9.0 or higher required (stylesheet not necessary).

Current version: https://github.com/vanderlee/dropmenu/archive/master.zip

Sourcecode on Github: https://github.com/vanderlee/dropmenu

Documentation
=============
`.dropmenu(options)`
--------------------
Turns an element into a dropmenu.
Any element may be used.

Options
-------
### closeOnSelect (true)
Close menu when clicking on a selectable item

### duration ('normal')
See jQueryUI datepicker

### items
Array of items to display in the menu.

Structure is as such:

	[	value:		"#ff0000",	// optional
		label:		"Red",		// optional
		selectable: false,		// can option be selected (default false if subitems, otherwise true)
		items:		[...],		// optional (recursive)
		render:		callback,	// optional callback to render the item. Gets item as first argument
		name:		"#ff0000"	// deprecated, replaced by `value`
	]

Optionally, each items and/or item definition may be a callback.

Additional key-value pairs may be added. These are ignored by the dropmenu
plug-in, but may be used by the `render` callbacks.

For items, the callback receives the parent item and a callback. In case
of synchronous generation, simply return an array of items, if using async,
like an ajax call, call the callback with an array of items when finished.

Each individual item can also be a callback. Same rules apply as for items,
but this time a single item object must be returned.

You can both return a normal array and use the return callback if you wish.
The order of items will be undefined (though may be sorted in a parent
callback).

### render (undefined)
Optional fallback `render` callback, if no `render` callback specified for the
individual item, to render the items' HTML.
If no `render` callback is specified, the label of the item will be used.
The `render` callback will receive the entire item structure as it's first and
only argument.

### showAnim ('show')
See jQueryUI datepicker

### showOptions ({})
See jQueryUI datepicker

Events
------
### select (undefined)
Callback

Future
------
*Close upon hiding/destruction of element (handle dialogs closing while open)
*Test explicit (manual) open/close
*Include HTML-item-parsers in code