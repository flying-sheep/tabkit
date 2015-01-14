'use strict'

const { loadSheet, removeSheet } = require('sdk/stylesheet/utils')
const { viewFor } = require('sdk/view/core')
const { browserWindows } = require('sdk/windows')
const simplePrefs = require('sdk/simple-prefs')

const { createLoadUnloadPair } = require('windowTools')

var tabStyleURL = createStyleURL(simplePrefs.prefs.unloadedTabOpacity)

function createStyleURL(opacityPercent) {
	let opacity = opacityPercent / 100
	let css = 'tab.tabbrowser-tab[pending] { opacity: ' + opacity + ' }'
	return 'data:text/css;charset=utf-8,' + encodeURIComponent(css)
}

function enableStyle(browserWindow) {
	disableStyle(browserWindow)
	
	tabStyleURL = createStyleURL(simplePrefs.prefs.unloadedTabOpacity)
	
	loadSheet(viewFor(browserWindow), tabStyleURL)
}

function disableStyle(browserWindow) {
	removeSheet(viewFor(browserWindow), tabStyleURL)
}

function updateStyle() {
	if (simplePrefs.prefs.unloadedTabOpacity > 100) {
		simplePrefs.prefs.unloadedTabOpacity = 100
	}
	
	for (let browserWindow of browserWindows) {
		enableStyle(browserWindow)
	}
}

const [load, unload] = createLoadUnloadPair(enableStyle, disableStyle)

exports.main = function() {
	simplePrefs.on('unloadedTabOpacity', updateStyle)
	load()
}

exports.onUnload = function() {
	simplePrefs.removeListener('unloadedTabOpacity', updateStyle)
	unload()
}