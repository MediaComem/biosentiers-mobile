/**
 * Created by Mathias on 04.04.2016.
 */
describe('WikitudeModule', function () {
	describe('Wikitude service', function () {
		var service, WikitudeFunctionsMock;
		beforeEach(module('WikitudeModule'));

		beforeEach(function () {
			WikitudeFunctionsMock = {
				foo: jasmine.createSpy('foo')
			};

			module(function ($provide) {
				$provide.value('WikitudeFunctions', WikitudeFunctionsMock);
			})
		});


		beforeEach(inject(function (Wikitude) {
			service = Wikitude;
		}));

		it('should have an \'init\' property that is a method', function() {
			expect(service.init).toBeDefined();
			expect(service.init).toEqual(jasmine.any(Function));
		});

		describe('parseActionUrl()', function () {
			it('should return object with function and parameters properties from url', function () {
				var url = 'architectsdk://foo?{"bar":"foobar"}';
				var object = {
					funcName: 'foo',
					parameters: {
						bar: 'foobar'
					}
				};
				var result = service.parseActionUrl(url);
				expect(result).toEqual(object);
			});

			it('should return object with function property from url', function() {
				var url = 'architectsdk://foo';
				var result = service.parseActionUrl(url);
				var object = {
					funcName: 'foo',
					parameters: null
				};
				expect(result).toEqual(object);
			});

			it('should throw an error because of a bad json parameter after the \'?\'', function () {
				var url = 'architectsdk://foo?bar';
				expect(function(){service.parseActionUrl(url)}).toThrowError(SyntaxError);
			});

			it('should throw an error because of a badly formed url', function () {
				var url = 'foo';
				expect(function(){service.parseActionUrl(url)}).toThrowError(SyntaxError);
			})
		});

		describe('executeActionCall()', function () {
			it('should call the foo function', function () {
				var url = 'architectsdk://foo';
				service.executeActionCall(url);
				expect(WikitudeFunctionsMock.foo).toHaveBeenCalled();
			});
			it('should throw an exception caused by the missing bar function', function () {
				var url = 'architectsdk://bar';
				expect(function(){service.executeActionCall(url)}).toThrowError(TypeError);
			});
		});
	})
});
