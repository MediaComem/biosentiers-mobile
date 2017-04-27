# BioSentiers QR Code

QR code binary format parser/serializer for [BioSentiers](https://github.com/MediaComem/biosentiers).

This library can encode and decode QR code data for the BioSentiers application.

Encoding transforms an object into a byte array or other formats (see options):

```js
var encoded = bioqr.encode({
  version: 1,
  excursion: {
    creatorName: 'Räksmörgås º¬∆',
    id: 'x728s',
    date: moment().milliseconds(0).toDate(),
    name: 'ジ　エクスクルシオン',
    participant: {
      id: 'f8',
      name: 'Bob',
    },
    themes: ['bird', 'flower'],
    zones: [1, 3]
  }
});
```

Decoding transforms the encoded data back into the original object:

```js
var decoded = bioqr.decode(encoded);
console.log(decoded.creatorName); // Räksmörgås
```

The encoded data can be used in a QR code in binary format.



## Options

An options object can be passed to `encode` or `decode` as the second argument.
The following options are available:

* `format` - `String` - Customize the output format

  ```js
  bioqr.encode(data); // [ 0x01, 0x87, 0x18, 0xC0, ... ] (raw byte array)
  bioqr.encode(data, { format: 'numeric' }); // "430981398715409183..." (for a numeric QR code)
  bioqr.encode(data, { format: 'string' }) // "\u0001\u0087\u0018\u00C0..." (8-bit string)
  ```

  The same format option must be given for decoding.
* `themes` - `Array|Function` - An array of reference values or function to encode/decode the themes bitmask

  ```js
  // Assuming the bitmask value is 3 (00000011 in binary),
  // so the first two indices (0 and 1) are active
  bioqr.decode(data, { themes: [ 'foo', 'bar', 'baz' ] }).excursion.themes; // [ 'foo', 'bar' ]
  bioqr.decode(data, { themes: (i) => i * 2 }).excursion.themes; // [ 0, 2 ]
  ```
* `zones` - `Array|Function` - An array of reference values or function to encode/decode the zones bitmask

  ```js
  // Assuming the bitmask value is 3 (00000011 in binary),
  // so the first two indices (0 and 1) are active
  bioqr.decode(data, { zones: [ 'foo', 'bar', 'baz' ] }).excursion.zones; // [ 'foo', 'bar' ]
  bioqr.decode(data, { zones: (i) => i * 2 }).excursion.zones; // [ 0, 2 ]
  ```



## Encoding

Data is encoded in the smallest possible number of bytes.
The `version` property of the data object specifies which encoding version to use.

### All versions

* Offsets and sizes are in bytes
* Integer and UTF-8 bytes are in big endian order
* Dates are truncated to the second (millisecond precision is lost)
* Dates are unsigned 32-bit integers with a max value of `2 ^ 32 - 1` seconds from the Unix epoch (the largest date that can be represented is Sun, 07 Feb 2106 06:28:15)
* Bitmask offsets 0 and 7 correspond to the least significant and most significant bit, respectively, in a 1-byte bitmask
* Strings must be truncated if they have too many bytes
* Strings must be padded with spaces to fit the expected byte length

### Version 1

Field            | Offset | Size | Type                               | Description
:---             | :---   | :--- | :---                               | :---
version          | 0      | 1    | uint8                              | The binary format version (1-255)
creator name     | 1      | 40   | UTF-8 string                       | The name of the user who manages the excursion
excursion id     | 41     | 5    | UTF-8 string                       | The unique identifier of the excursion
excursion date   | 46     | 4    | uint32 (Unix timestamp in seconds) | The date at which the excursion was planned
excursion name   | 50     | 60   | UTF-8 string                       | The name of the excursion
participant id   | 110    | 2    | UTF-8 string                       | The identifier of the participant (unique for the excursion)
participant name | 112    | 20   | UTF-8 string                       | The name of the participant
POI type(s)      | 132    | 1    | uint8 bitmask                      | A bitmask where each bit is a boolean flag to activate (1) or deactivate (0) each POI type
zone(s)          | 133    | 1    | uint8 bitmask                      | A bitmask where each bit is a boolean flag to activate (1) or deactivate (0) each zone in the trail

* A data payload is exactly 134 bytes long and should fit within a version 10 QR code (57x57 modules) in binary format with error correction level Q

#### POI themes

Themes    | Bitmask offset
:---      | :---
bird      | 0
butterfly | 1
flower    | 2
tree      | 3

#### Trail zones

Zones are assumed to be sequential.
Bitmask offsets correspond to each zone in order: 0 is the first zone, 7 is the last one (if there are that many).
