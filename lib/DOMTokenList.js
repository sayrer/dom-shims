'use strict';

/**
 * DOMTokenList constructor
 *
 * @param {element} element - DOM element
 * @param {string} attribute - Attribute to create a token list for
 */
function DOMTokenList(element, attribute) {
  this._getString = function () {
    return element.getAttribute(attribute) || '';
  };
  this._setString = function (value) {
    element.setAttribute(attribute, value);
  };
  fixIndex(this, getList(this));
}

Object.defineProperties(DOMTokenList.prototype, {
  constructor: DOMTokenList,

  /**
   * Adds tokens to the token list
   * @param {...string} tokens
   */
  add: {
    value: function add() {
      var token;
      var i = 0;
      var len = arguments.length;
      var list = getList(this);
      var updated = false;

      for (; i < len; i++) {
        token = arguments[i];
        validateToken(token);
        if (list.indexOf(token) < 0) {
          list.push(token);
          updated = true;
        }
      }

      if (updated) {
        this._setString(list.join(' ').trim());
        fixIndex(this, list);
      }
    }
  },

  /**
   * @param {string} token
   * @return {boolean}
   */
  contains: {
    value: function contains(token) {
      validateToken(token);
      return (getList(this)).indexOf(token) > -1;
    }
  },

  /**
   * Returns the token at a given index
   * @param {integer} index
   * @return {string|null} - the token
   */
  item: {
    value: function item(index) {
      return (getList(this))[index] || null;
    }
  },

  /**
   * @return {integer} - length of the token list
   */
  length: {
    get: function () {
      return (getList(this)).length;
    }
  },

  /**
   * Removes tokens from the token list
   * @param {...string} tokens
   */
  remove: {
    value: function remove() {
      var index, token;
      var i = 0;
      var len = arguments.length;
      var list = getList(this);
      var updated = false;

      for (; i < len; i++) {
        token = arguments[i];
        validateToken(token);
        // remove multiple instances of the same class
        while ((index = list.indexOf(token)) > -1) {
          list.splice(index, 1);
          updated = true;
        }
      }

      if (updated) {
        this._setString(list.join(' ').trim());
        fixIndex(this, list);
      }
    }
  },

  /**
   * Toggles a token's presence in the token list
   * @param {string} token
   * @param {boolean} force - true: always add; false: always remove
   * @return {boolean} - true: the value was added to the token list
   */
  toggle: {
    value: function toggle(token, force) {
      var hasToken = this.contains(token);
      var method = hasToken ?
          (force !== true && 'remove') :
          (force !== false && 'add');

      if (method) {
        this[method](token);
      }

      return (typeof force == 'boolean' ? force : !hasToken);
    }
  },

  /**
   * @return {string} - value of the token list's associated attribute
   */
  toString: {
    value: function toString() {
      return this._getString();
    }
  }
});

/**
 * Ensure the token list is indexable
 *
 * @param {object} instance
 * @param {array} list
 */
function fixIndex(instance, list) {
  var len = list.length;
  var i = 0;
  for (; i < len; i++) { instance[i] = list[i]; }
  delete instance[len];
}

/**
 * Get the attribute's list of values
 *
 * @param {object} instance
 * @return {array} - values
 */
function getList(instance) {
  var str = instance._getString();
  if (!str || str === '') {
    return [];
  } else {
    return str.split(/\s+/);
  }
}

/**
 * @param {string} token
 */
function validateToken(token) {
  if (token === '' || token === undefined) {
    throw new Error(
      'An invalid or illegal string was specified (DOM Exception 12)');
  } else if (/\s+/.test(token)) {
    throw new Error(
      'InvalidCharacterError: String contains an invalid character ' +
      '(DOM Exception 5)');
  }
}

module.exports = DOMTokenList;
