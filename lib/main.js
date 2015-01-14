'use strict'

const modules = [
	require('undoCloseTab'),
	require('unloadedTabStyle'),
]

exports.main = function(options, callbacks) {
	for (module of modules) {
		module.main(options, callbacks)
	}
}

exports.onUnload = function(reason) {
	for (module of modules) {
		module.onUnload(reason)
	}
}