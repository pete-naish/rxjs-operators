import { myInterval } from "./MyObservable";

test("create our own interval operator", (done) => {
  let expectedResult = [0, 1, 2, 3, 4, 5];

  myInterval(10).subscribe((val: number) => {
    const expected = expectedResult.shift();
    expect(val).toBe(expected);
    if (!expectedResult.length) {
      done();
    }
  });
});
