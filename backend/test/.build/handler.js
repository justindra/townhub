'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.hello = void 0;
const core_1 = require('@townhub-libs/core');
class TestClass {
  constructor() {
    this.magic = `magic = ${core_1.HELLO_CAMEL}`;
  }
}
exports.hello = async (event) => {
  const a = new TestClass();
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        test: `${core_1.HELLO_CAMEL}, ${core_1.HELLO_SENTENCE}, ${core_1.YAY}, ${a.magic}`,
        input: event,
      },
      null,
      2
    ),
  };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlcyI6WyJoYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQUFzRTtBQUV0RSxNQUFNLFNBQVM7SUFFYjtRQUNFLElBQUksQ0FBQyxLQUFLLEdBQUcsV0FBVyxrQkFBVyxFQUFFLENBQUM7SUFDeEMsQ0FBQztDQUNGO0FBRVksUUFBQSxLQUFLLEdBQUcsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFO0lBQ25DLE1BQU0sQ0FBQyxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7SUFDMUIsT0FBTztRQUNMLFVBQVUsRUFBRSxHQUFHO1FBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQ2xCO1lBQ0UsT0FBTyxFQUFFLDBEQUEwRDtZQUNuRSxJQUFJLEVBQUUsR0FBRyxrQkFBVyxLQUFLLHFCQUFjLEtBQUssVUFBRyxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUU7WUFDN0QsS0FBSyxFQUFFLEtBQUs7U0FDYixFQUNELElBQUksRUFDSixDQUFDLENBQ0Y7S0FDRixDQUFDO0FBQ0osQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSEVMTE9fQ0FNRUwsIFlBWSwgSEVMTE9fU0VOVEVOQ0UgfSBmcm9tICdAdG93bmh1Yi1saWJzL2NvcmUnO1xuXG5jbGFzcyBUZXN0Q2xhc3Mge1xuICBtYWdpYzogc3RyaW5nO1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLm1hZ2ljID0gYG1hZ2ljID0gJHtIRUxMT19DQU1FTH1gO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBoZWxsbyA9IGFzeW5jIChldmVudCkgPT4ge1xuICBjb25zdCBhID0gbmV3IFRlc3RDbGFzcygpO1xuICByZXR1cm4ge1xuICAgIHN0YXR1c0NvZGU6IDIwMCxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeShcbiAgICAgIHtcbiAgICAgICAgbWVzc2FnZTogJ0dvIFNlcnZlcmxlc3MgdjEuMCEgWW91ciBmdW5jdGlvbiBleGVjdXRlZCBzdWNjZXNzZnVsbHkhJyxcbiAgICAgICAgdGVzdDogYCR7SEVMTE9fQ0FNRUx9LCAke0hFTExPX1NFTlRFTkNFfSwgJHtZQVl9LCAke2EubWFnaWN9YCxcbiAgICAgICAgaW5wdXQ6IGV2ZW50LFxuICAgICAgfSxcbiAgICAgIG51bGwsXG4gICAgICAyXG4gICAgKSxcbiAgfTtcbn07XG4iXX0=
