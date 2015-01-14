'use strict'

const { getTabContainer } = require('sdk/tabs/utils')
const { browserWindows } = require('sdk/windows')
const { viewFor } = require('sdk/view/core')

const { Cc, Ci } = require('chrome')
const { undoCloseTab, getClosedTabCount } = Cc['@mozilla.org/browser/sessionstore;1'].getService(Ci.nsISessionStore)

const { createLoadUnloadPair } = require('windowTools')

const MIDDLE_CLICK = 2

var listenerMap = new Map()

/** Creates an event handler undoing closed tabs for a window */
function makeHandler(window) {
	return function(event) {
		if (event.which === MIDDLE_CLICK && event.target.tagName === 'tabs') {
			//restore closed tab if available
			if (getClosedTabCount(window) > 0) {
				undoCloseTab(window, 0)
			}
			
			//in any case don’t open a new empty tab
			event.stopPropagation()
			event.preventDefault()
		}
	}
}

/** Add middle click listener to a window,
 * and register that listener in `listenerMap` with the window as key. */
function registerTabUndo(browserWindow) {
	let window = viewFor(browserWindow)
	let tabs = getTabContainer(window)
	
	let handler = makeHandler(window)
	
	listenerMap.set(window, handler)
	tabs.addEventListener('click', handler, true)
}

/** Remove middle click listener and window→listener mapping */
function unregisterTabUndo(browserWindow) {
	let window = viewFor(browserWindow)
	let tabs = getTabContainer(window)
	
	tabs.removeEventListener('click', listenerMap.get(window), true)
	listenerMap.delete(window)
}

[exports.main, exports.onUnload] = createLoadUnloadPair(registerTabUndo, unregisterTabUndo)