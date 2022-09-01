import { myTimer } from "./MyObservable";

test("create our own timer operator", (done) => {
  let expectedResult = [0, 1, 2, 3, 4, 5];

  myTimer(10, 20).subscribe((val: number) => {
    const expected = expectedResult.shift();
    expect(val).toBe(expected);
    if (!expectedResult.length) {
      done();
    }
  });
});
