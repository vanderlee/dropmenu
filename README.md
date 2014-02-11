dropmenu
========

Basic multi-level dropdown menu for buttons.

Copyright (c) 2013-2014 Martijn W. van der Lee
Licensed under the MIT.

Requires jQuery and jQueryUI (not tested with old versions, but it doesn't use
any really new features. Tested with 1.9's).

Options
-------
closeOnSelect
	Close menu when clicking on a selectable item (default is true)

items
	Array of items to display in the menu.

	Structure is as such:
		[	name:	"#ff0000",		// required
			label:	"Red",			// optional
			selectable: true,		// can option be selected (default false if subitems, otherwise true)
			items: [...],			// optional (recursive structure)
			render:	callback		// optional callback to render the item. Gets item as first argument
		]

	Optionally, each items and/or item definition may be a callback.

	For items, the callback receives the parent item and a callback. In case
	of synchronous generation, simply return an array of items, if using async,
	like an ajax call, call the callback with an array of items when finished.

	Each individual item can also be a callback. Same rules apply as for items,
	but this time a single item object must be returned.

	You can both return a normal array and use the return callback if you wish.
	The order of items will be undefined (though may be sorted in a parent
	callback).

render
	Optional fallback render callback (if not specified with item) to render the items.

showAnim
showOptions
duration
	See jQueryUI datepicker.

Events
------
select
	Callback

Future
------
*Close upon hiding/destruction of element (handle dialogs closing while open)
*Test explicit (manual) open/close
*Include HTML-item-parsers in code