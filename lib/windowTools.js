'use strict'

const { browserWindows } = require('sdk/windows')

/** Calling the first return value makes sure that `load` gets called on every existent and future window,
 * and calling the second unregisters all this and calls `unload` on every existing window.
 * This is useful for automating an addon working on every window. */
exports.createLoadUnloadPair = function(load, unload) {
	let loadAlways = function() {
		browserWindows.on('open', load)
		browserWindows.on('close', unload)
		
		for (let browserWindow of browserWindows) {
			load(browserWindow)
		}
	}
	
	let unloadAlways = function() {
		browserWindows.removeListener('open', load)
		browserWindows.removeListener('close', unload)
		
		for (let browserWindow of browserWindows) {
			unload(browserWindow)
		}
	}
	
	return [loadAlways, unloadAlways]
}