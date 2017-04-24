(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["bioqr"] = factory();
	else
		root["bioqr"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.decode = exports.encode = undefined;
	
	var _v = __webpack_require__(1);
	
	var bioqr = {
	  encode: encode,
	  decode: decode
	};
	
	function encode(data, options) {
	  switch (data.version) {
	    case 0:
	      return (0, _v.encode)(data, options);
	    default:
	      throw new Error('Unknown format version ' + data.version);
	  }
	}
	
	function decode(string, options) {
	  var version = string.charCodeAt(0);
	  switch (version) {
	    case 0:
	      return (0, _v.decode)(string, options);
	    default:
	      throw new Error('String is not in a known format version ' + version);
	  }
	}
	
	exports.default = bioqr;
	exports.encode = encode;
	exports.decode = decode;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.encode = encode;
	exports.decode = decode;
	
	var _bitmask = __webpack_require__(2);
	
	var _timestamp = __webpack_require__(3);
	
	var _uint = __webpack_require__(4);
	
	var _utf8String = __webpack_require__(5);
	
	var _encoder = __webpack_require__(6);
	
	var _encoder2 = _interopRequireDefault(_encoder);
	
	var _decoder = __webpack_require__(8);
	
	var _decoder2 = _interopRequireDefault(_decoder);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var FORMAT_VERSION = 0;
	var FORMAT_LENGTH = 134;
	var CREATOR_NAME_LENGTH = 40;
	var EXCURSION_ID_LENGTH = 5;
	var EXCURSION_NAME_LENGTH = 60;
	var PARTICIPANT_ID_LENGTH = 2;
	var PARTICIPANT_NAME_LENGTH = 20;
	var TYPES = ['bird', 'butterfly', 'flower', 'tree'];
	
	function encode(data, options) {
	  options = options || {};
	
	  var encoder = new _encoder2.default();
	  encoder.add(_uint.encode, FORMAT_VERSION, 1);
	  encoder.add(_utf8String.encode, data.creatorName, CREATOR_NAME_LENGTH);
	  encoder.add(_utf8String.encode, data.excursionId, EXCURSION_ID_LENGTH);
	  encoder.add(_timestamp.encode, data.excursionDate);
	  encoder.add(_utf8String.encode, data.excursionName, EXCURSION_NAME_LENGTH);
	  encoder.add(_utf8String.encode, data.participantId, PARTICIPANT_ID_LENGTH);
	  encoder.add(_utf8String.encode, data.participantName, PARTICIPANT_NAME_LENGTH);
	  encoder.add(_bitmask.encode, data.types, options.types || TYPES);
	  encoder.add(_bitmask.encode, data.zones);
	
	  if (encoder.bytes.length != FORMAT_LENGTH) {
	    throw new Error('Format 0 byte length should be 134 (got ' + encoder.bytes.length + ')');
	  }
	
	  return encoder.toString();
	}
	
	function decode(string, options) {
	  options = options || {};
	
	  var decoder = new _decoder2.default(string);
	  if (decoder.bytes.length != FORMAT_LENGTH) {
	    throw new Error('Format 0 byte length should be 134 (got ' + decoder.bytes.length + ')');
	  }
	
	  var decoded = {};
	  decoded.version = decoder.get(_uint.decode, 1);
	  decoded.creatorName = decoder.get(_utf8String.decode, CREATOR_NAME_LENGTH);
	  decoded.excursionId = decoder.get(_utf8String.decode, EXCURSION_ID_LENGTH);
	  decoded.excursionDate = decoder.get(_timestamp.decode, 4);
	  decoded.excursionName = decoder.get(_utf8String.decode, EXCURSION_NAME_LENGTH);
	  decoded.participantId = decoder.get(_utf8String.decode, PARTICIPANT_ID_LENGTH);
	  decoded.participantName = decoder.get(_utf8String.decode, PARTICIPANT_NAME_LENGTH);
	  decoded.types = decoder.get(_bitmask.decode, TYPES);
	  decoded.zones = decoder.get(_bitmask.decode);
	
	  return decoded;
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.encode = encode;
	exports.decode = decode;
	/**
	 * Fills a byte array with a 1-byte bitmask that can be used to serialize up to 8 boolean flags.
	 *
	 * If no references are given, values must be numbers from 0 to 7.
	 * For example, the values [ 1, 3 ] would be encoded as the integer 10 (or 00001010 in binary).
	 *
	 * If references are given, then each value must be one of the reference values.
	 * The references array must not contain more than 32 items.
	 * For example, the values [ 'foo', 'baz' ] with references [ 'foo', 'bar', 'baz' ]
	 * would be encoded as the integer 5 (or 00000101 in binary).
	 */
	function encode(bytes, offset, values, references) {
	  var byte = 0;
	
	  values.forEach(function (value, i) {
	
	    var bitmaskIndex = value;
	
	    // If references are given, convert the value to its index in the reference array
	    if (references) {
	      bitmaskIndex = references.indexOf(value);
	      if (bitmaskIndex < 0) {
	        throw new Error('Unknown bitmask value ' + value + ' (allowed: ' + references.join(', ') + ')');
	      } else if (bitmaskIndex > 7) {
	        throw new Error('References have too many values (' + references.length + ' > 32)');
	      }
	    } else if (!Number.isInteger(bitmaskIndex) || bitmaskIndex < 0 || bitmaskIndex > 31) {
	      throw new Error('Bitmask value ' + i + ' must be an integer between 0 and 31 or one of the reference values (got ' + bitmaskIndex + ')');
	    }
	
	    // Set the correct bit to 1 in the bitmask
	    byte = byte | 1 << bitmaskIndex;
	  });
	
	  // Add the byte to the array
	  bytes[offset] = byte;
	}
	
	/**
	 * Decodes up to 8 boolean flags from a 1-byte bitmask at the specified position in a byte array.
	 *
	 * If no references are given, the indices of the active flags are returned, e.g. [ 1, 3 ].
	 *
	 * If references are given, the indices are converted to the correspond reference values,
	 * e.g. [ 'foo', 'baz' ] if the decoded flags are [ 0, 2 ] and the references are [ 'foo', 'bar', 'baz' ].
	 */
	function decode(bytes, offset, references) {
	
	  var values = [];
	  var byte = bytes[offset];
	
	  // Iterate over the 8 bits
	  for (var i = 0; i < 8; i++) {
	    // Check whether the bit at the current position is 1
	    var mask = 1 << i;
	    if ((byte & mask) > 0) {
	      // Add the index (or reference value) to the result array if that is the case
	      if (!references) {
	        values.push(i);
	      } else if (references[i]) {
	        values.push(references[i]);
	      }
	    }
	  }
	
	  return values;
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	exports.encode = encode;
	exports.decode = decode;
	
	var _uint = __webpack_require__(4);
	
	/**
	 * Fills a byte array with a 4-byte integer representing the specified date in minutes.
	 * Seconds and milliseconds are lost in the conversion.
	 */
	function encode(bytes, offset, dateOrTimestamp) {
	
	  var timestamp = typeof dateOrTimestamp.getTime == 'function' ? dateOrTimestamp.getTime() : dateOrTimestamp;
	  if (!Number.isInteger(timestamp)) {
	    throw new Error('Timestamp must be an integer or a date (got a value of type ' + (typeof timestamp === 'undefined' ? 'undefined' : _typeof(timestamp)) + ')');
	  } else if (timestamp < 0) {
	    throw new Error('Timestamp must be positive (got ' + timestamp + ')');
	  }
	
	  var minutes = Math.floor(timestamp / 1000);
	  return (0, _uint.encode)(bytes, offset, minutes, 4);
	}
	
	/**
	 * Decodes a date from a 4-byte number of minutes at the specified position in a byte array.
	 */
	function decode(bytes, offset) {
	  var minutes = (0, _uint.decode)(bytes, offset, 4);
	  return new Date(minutes * 1000);
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.encode = encode;
	exports.decode = decode;
	/**
	 * Fills a byte array with the specified integer's bytes (in big endian order).
	 *
	 * Unsigned integers may only be serialized up to a precision of 6 bytes
	 * (JavaScript numbers are doubles with a significand of 52 bits).
	 */
	function encode(bytes, offset, number, byteSize) {
	  if (!Number.isInteger(number)) {
	    throw new Error("Number must be an integer");
	  } else if (number < 0) {
	    throw new Error("Unsigned integer cannot be smaller than zero (got " + number + ")");
	  } else if (byteSize < 1) {
	    throw new Error("Unsigned integer cannot be encoded with less than one byte");
	  } else if (byteSize > 6) {
	    throw new Error("Unsigned integer cannot be encoded with more than seven bytes");
	  }
	
	  // Ensure the number is not larger than the maximum allowed by the specified byte size
	  var bits = byteSize * 8;
	  var max = Math.pow(2, bits) - 1;
	  if (number > max) {
	    throw new Error("Unsigned " + byteSize + " bytes integer cannot be greater than " + max + " (got " + number + ")");
	  }
	
	  // Add the specified number of bytes
	  var bound = offset + byteSize;
	  for (var i = offset; i < bound; i++) {
	    // For each byte, right-shift the number by the correct amount
	    // and take the last 8 bits (with & 0xFF) to obtain the byte to store at that position
	    // (e.g. for a 4 bytes integer, the first byte is right-shifted by 24,
	    // the second by 16, the third by 8 and the fourth by 0)
	    var bitShift = (bound - i - 1) * 8;
	    bytes[i] = 0xFF & number >> bitShift;
	  }
	}
	
	/**
	 * Decodes an unsigned integer's bytes from the specified portion of a byte array (in big endian order).
	 */
	function decode(bytes, offset, byteSize) {
	  if (byteSize < 1 || byteSize > 6) {
	    throw new Error("Unsigned integer byte size must be between 1 and 6 (got " + byteSize + ")");
	  }
	
	  var number = 0;
	  var bound = offset + byteSize;
	
	  // Iterate byte by byte over the specified range (from offset to offset + byteSize)
	  for (var i = offset; i < bound; i++) {
	    // Shift each byte's bits by the correct amount
	    // and add them to the result number
	    // (e.g. for a 4 bytes integer, the first byte is left-shifted by 24,
	    // the second by 16, the third by 8 and the fourth by 0)
	    var bitShift = (bound - i - 1) * 8;
	    number = number | bytes[i] << bitShift;
	  }
	
	  return number;
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.encode = encode;
	exports.decode = decode;
	/**
	 * Fills a byte array with the UTF-8 bytes of the specified string.
	 *
	 * If the string is longer than the specified length (in bytes), extra bytes are not serialized.
	 * Extra spaces at the end of the string will be lost when decoding, as spaces are used for padding.
	 */
	function encode(bytes, offset, string, length) {
	
	  var currentByte = offset;
	  var stringLength = string.length;
	
	  // For each character in the string...
	  for (var i = 0; i < stringLength; i++) {
	
	    var char = string[i];
	
	    // Convert the character to an array of UTF-8 bytes (1 to 4 bytes per character)
	    var utf8Bytes = stringToUtf8Bytes(char);
	
	    // Stop here if there are too many bytes (the rest of the string is ignored)
	    if (currentByte + utf8Bytes.length > offset + length) {
	      break;
	    }
	
	    // Add the character's UTF-8 bytes to the byte array
	    for (var j = 0; j < utf8Bytes.length; j++) {
	      bytes[currentByte + j] = utf8Bytes[j];
	    }
	
	    currentByte += utf8Bytes.length;
	  }
	
	  // If the string is not long enough to fill the expected length, pad it with spaces
	  var remainingBytes = offset + length - currentByte;
	  for (var _i = 0; _i < remainingBytes; _i++) {
	    bytes.push(0x20); // space
	  }
	
	  return bytes;
	}
	
	/**
	 * Decodes a string from the UTF-8 bytes in the specified portion of a byte array.
	 */
	function decode(bytes, offset, length) {
	
	  var stringBytes = bytes.slice(offset, offset + length);
	  var rawString = stringBytes.map(function (byte) {
	    return String.fromCodePoint(byte);
	  }).join('');
	
	  return decodeURIComponent(escape(rawString)).trim();
	}
	
	/**
	 * Convers a string to an array containing all its character's UTF-8 bytes (1 to 4 bytes per character).
	 */
	function stringToUtf8Bytes(string) {
	  return unescape(encodeURIComponent(string)).split('').map(function (char) {
	    return char.charCodeAt(0);
	  });
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _byte = __webpack_require__(7);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Utility class to progressively build a byte array and keep track of the current offset.
	 */
	var Encoder = function () {
	
	  /**
	   * Constructs an encoder with an empty byte array.
	   */
	  function Encoder() {
	    _classCallCheck(this, Encoder);
	
	    this.bytes = [];
	    this.offset = 0;
	  }
	
	  /**
	   * Calls the specified encoding function with this encoder's internal byte array, the
	   * current offset and the specified extra arguments. It's the responsibility of the
	   * encoding function to add more bytes to the array starting at the specified offset.
	   *
	   * The encoder will automatically increment its current offset by the number of new bytes
	   * added to the array, so subsequent calls will invoke encoding functions with greater offsets.
	   */
	
	
	  _createClass(Encoder, [{
	    key: 'add',
	    value: function add(encodeFunc) {
	
	      var currentLength = this.bytes.length;
	
	      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }
	
	      args.unshift(this.bytes, this.offset);
	
	      var result = encodeFunc.apply(undefined, args);
	      this.offset += this.bytes.length - currentLength;
	
	      return result;
	    }
	
	    /**
	     * Converts this encoder's internal byte array to a string of characters that can
	     * all be represented with 1 byte in UTF-8.
	     */
	
	  }, {
	    key: 'toString',
	    value: function toString() {
	      return this.bytes.map(function (byte) {
	        return String.fromCodePoint((0, _byte.ensureByte)(byte));
	      }).join('');
	    }
	  }]);
	
	  return Encoder;
	}();
	
	exports.default = Encoder;

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.ensureByte = ensureByte;
	/**
	 * Returns the specified value unchanged, but throws an error if it is not an integer between 0 and 255.
	 */
	function ensureByte(byte) {
	  if (!Number.isInteger(byte)) {
	    throw new Error("Byte is not an integer (" + byte + ")");
	  } else if (byte < 0) {
	    throw new Error("Byte is too small (" + byte + " < 0)");
	  } else if (byte > 255) {
	    throw new Error("Byte is too large (" + byte + " > 255)");
	  }
	
	  return byte;
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _byte = __webpack_require__(7);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Utility class to progressively decode a byte array and keep track of the current offset.
	 */
	var Decoder = function () {
	
	  /**
	   * Constructs a decoder for the specified byte array.
	   *
	   * A string can also be given in place of the byte array.
	   * It should contain only characters that can be represented with 1 byte in UTF-8.
	   */
	  function Decoder(bytes) {
	    _classCallCheck(this, Decoder);
	
	    this.offset = 0;
	    this.bytes = bytes;
	
	    if (typeof bytes == 'string') {
	      this.bytes = this.bytes.split('').map(function (char) {
	        return (0, _byte.ensureByte)(char.charCodeAt(0));
	      });
	    }
	  }
	
	  /**
	   * Calls the specified decoding function with this decoder's internal byte array, the
	   * current offset and the specified extra arguments, and returns the result. It's the
	   * responsibility of the decoding function to extract the relevant bytes from the array,
	   * starting at the specified offset.
	   *
	   * If the last argument passed to the decoding function is a positive integer, the
	   * decoder will interpret it as the number of bytes that have been decoded and increment
	   * the current offset by that value. Otherwise, it will assume that only 1 byte has been
	   * decoded. Add an extra number argument if that is not the case.
	   */
	
	
	  _createClass(Decoder, [{
	    key: 'get',
	    value: function get(decodeFunc) {
	      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }
	
	      var lastArg = args.length >= 1 ? args[args.length - 1] : undefined;
	
	      args.unshift(this.bytes, this.offset);
	
	      var result = decodeFunc.apply(undefined, args);
	
	      if (Number.isInteger(lastArg) && lastArg >= 1) {
	        this.offset += lastArg;
	      } else {
	        this.offset++;
	      }
	
	      return result;
	    }
	  }]);
	
	  return Decoder;
	}();
	
	exports.default = Decoder;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=biosentiers-qrcode.js.map