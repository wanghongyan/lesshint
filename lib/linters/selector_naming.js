'use strict';

const parseSelector = require('../utils/parse-selector');
const util = require('util');

module.exports = {
    name: 'selectorNaming',
    nodeTypes: ['rule'],
    message: 'Selector "%s" should follow naming conventions.',

    lint: function selectorNamingLinter (config, node) {
        const selectors = parseSelector(node.selector);
        const selectorTypes = ['class', 'id'];
        const exclude = config.exclude || [];
        const results = [];

        selectors.walk((selector) => {
            if (selectorTypes.indexOf(selector.type) === -1) {
                return;
            }

            const name = selector.value;

            if (exclude.indexOf(name) !== -1) {
                return;
            }

            if (
                (config.disallowUppercase && name.toLowerCase() !== name) ||
                (config.disallowUnderscore && name.indexOf('_') !== -1) ||
                (config.disallowDash && name.indexOf('-') !== -1)
            ) {
                results.push({
                    column: node.source.start.column + selector.source.start.column - 1,
                    line: node.source.start.line + selector.source.start.line - 1,
                    message: util.format(this.message, name)
                });
            }
        });

        if (results.length) {
            return results;
        }
    }
};
