import { myOf } from "./MyObservable";

test("create our own of operator", (done) => {
  let expectedResult = [1, 2, 3, 4, 5];

  myOf(1, 2, 3, 4, 5).subscribe((val: number) => {
    const expected = expectedResult.shift();
    console.log({ val, expected });
    expect(val).toBe(expected);
    expect(expectedResult.length).toBe(0);
    done();
  });
});
