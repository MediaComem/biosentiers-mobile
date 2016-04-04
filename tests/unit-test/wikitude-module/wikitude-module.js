/**
 * Created by Mathias on 04.04.2016.
 */
describe('WikitudeModule', function () {
  describe('Wikitude service', function () {
    beforeEach(module('WikitudeModule'));

    it('should have an \'init\' property that is a method', inject(function (Wikitude) {
      expect(Wikitude.init).toBeDefined();
      expect(Wikitude.init).toEqual(jasmine.any(Function));
    }));

    xdescribe('executeARViewCall()', function () {
      it('should only accepts \'architectsdk://\' calls', inject(function (Wikitude) {
        expect(function(){Wikitude.executeARViewCall('foo')}).toThrowError(SyntaxError);
        expect(function(){Wikitude.executeARViewCall('architectsdk://foo?bar')}).toThrowError(SyntaxError);
        expect(function(){Wikitude.executeARViewCall('architectsdk://foo')}).toThrowError(TypeError);
      }))
    })
  })
});
