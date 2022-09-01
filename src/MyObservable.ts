import { Observable, Observer, Subscription } from "rxjs";

interface MyObserver<T> {
  next: (n: T) => void;
  error: (err: any) => void;
  complete: () => void;
}

class MyObservable<T> {
  constructor(private producer: (observer: MyObserver<T>) => void) {}

  subscribe(observer: MyObserver<T>) {
    this.producer(observer);
  }
}

// const obs$ = new MyObservable<number>((observer: MyObserver<number>) => {
//   observer.next(1);
//   setTimeout(() => observer.next(2), 20);
//   setTimeout(() => observer.completed(), 40);
// });

// obs$.subscribe({
//   next: (n: number) => console.log("next", n),
//   error: (err: any) => console.log("error", err),
//   completed: () => console.log("completed"),
// });

export const myOperator =
  <T>(indentifier: string) =>
  (source: MyObservable<T>) => {
    return new MyObservable((observer: MyObserver<T>) => {
      const subscription = source.subscribe({
        next: (next: T) => {
          // console.log("next", next);
          observer.next(next);
        },
        error: (error: any) => {
          // console.log("error", error);
          observer.error(error);
        },
        complete: () => {
          // console.log("complete");
          observer.complete();
        },
      });

      return subscription;
    });
  };

export const myMap =
  <T>(mapFn: (n: T) => T) =>
  (source: Observable<T>) => {
    return new Observable((observer: Observer<T>) => {
      const subscription = source.subscribe((next: T) => {
        observer.next(mapFn(next));
      });

      return subscription;
    });
  };

export const myFilter =
  <T>(filterFn: (n: T) => boolean) =>
  (source: Observable<T>) => {
    return new Observable((observer: Observer<T>) => {
      const subscription = source.subscribe({
        next: (next: T) => {
          if (filterFn(next)) {
            observer.next(next);
          }
        },
        error: (err: any) => {
          observer.error(err);
        },
        complete: () => {
          observer.complete();
        },
      });

      return subscription;
    });
  };

export const myReduce =
  <T>(accumulator: (acc: T, cur: T) => T, seed: T) =>
  (source: Observable<T>) => {
    return new Observable((observer: Observer<T>) => {
      let acc = seed;
      const subscription = source.subscribe({
        next: (next: T) => {
          acc = accumulator(acc, next);
        },
        error: (err: any) => {
          observer.error(err);
        },
        complete: () => {
          observer.next(acc);
          observer.complete();
        },
      });

      return subscription;
    });
  };

export const myScan =
  <T>(accumulator: (acc: T, cur: T) => T, seed: T) =>
  (source: Observable<T>) => {
    return new Observable((observer: Observer<T>) => {
      let acc = seed;
      const subscription = source.subscribe({
        next: (next: T) => {
          acc = accumulator(acc, next);
          observer.next(acc);
        },
        error: (err: any) => {
          observer.error(err);
        },
        complete: () => {
          observer.complete();
        },
      });

      return subscription;
    });
  };

export const myTake =
  <T>(quantity: number) =>
  (source: Observable<T>) => {
    return new Observable((observer: Observer<T>) => {
      let count = 0;
      const subscription = source.subscribe({
        next: (next: T) => {
          observer.next(next);

          count++;

          if (quantity === count) {
            observer.complete();
            subscription.unsubscribe();
          }
        },
        error: (err: any) => {
          observer.error(err);
        },
        complete: () => {
          observer.complete();
        },
      });

      return subscription;
    });
  };

export const myTap =
  <T>(tapFn: {
    next: (n: T) => void;
    error: (err: any) => void;
    complete: () => void;
  }) =>
  (source: Observable<T>) => {
    return new Observable((observer: Observer<T>) => {
      const subscription = source.subscribe({
        next: (next: T) => {
          tapFn.next(next);
          observer.next(next);
        },
        error: (err: any) => {
          tapFn.error(err);
          observer.error(err);
        },
        complete: () => {
          tapFn.complete();
          observer.complete();
        },
      });

      return subscription;
    });
  };

export const myTap2 =
  <T>(tapFn: (value?: T) => void) =>
  (source: Observable<T>) => {
    return new Observable((observer: Observer<T>) => {
      const subscription = source.subscribe({
        next: (next: T) => {
          tapFn(next);
          observer.next(next);
        },
        error: (err: any) => {
          tapFn(err);
          observer.error(err);
        },
        complete: () => {
          tapFn();
          observer.complete();
        },
      });

      return subscription;
    });
  };

export const myTakeUntil =
  <T>(trigger$: Observable<any>) =>
  (source: Observable<T>) => {
    return new Observable((observer: Observer<T>) => {
      const subscription = source.subscribe({
        next: (next: T) => {
          observer.next(next);
        },
        error: (err: any) => {
          observer.error(err);
        },
        complete: () => {
          observer.complete();
        },
      });

      subscription.add(
        // clean up the trigger subscription
        trigger$.subscribe(() => {
          observer.complete();
          subscription.unsubscribe();
        })
      );

      return subscription;
    });
  };

export const myDebounceTime =
  <T>(debounce: number) =>
  (source: Observable<T>) => {
    return new Observable((observer: Observer<T>) => {
      let timeoutId: NodeJS.Timeout | undefined;
      let sourceCompleted = false;

      const subscription = source.subscribe({
        next: (next: T) => {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }

          timeoutId = setTimeout(() => {
            observer.next(next);

            timeoutId = undefined;

            if (sourceCompleted) {
              observer.complete();
            }
          }, debounce);
        },
        error: (err: any) => {
          observer.error(err);
        },
        complete: () => {
          sourceCompleted = true;

          if (!timeoutId) {
            observer.complete();
          }
        },
      });

      return subscription;
    });
  };

export const myMergeMap =
  <T>(project: (n: T) => Observable<any>) =>
  (source: Observable<T>) => {
    return new Observable((observer: Observer<T>) => {
      let active = 0;
      let outerSubCompleted = false;
      const subscription = source.subscribe({
        next: (next: T) => {
          active++;
          project(next).subscribe({
            next: (next: T) => {
              observer.next(next);
            },
            error: (err: any) => {
              observer.error(err);
            },
            complete: () => {
              active--;
              if (active === 0 && outerSubCompleted) {
                observer.complete();
              }
            },
          });
        },
        error: (err: any) => {
          observer.error(err);
        },
        complete: () => {
          outerSubCompleted = true;
          if (active === 0) {
            observer.complete();
          }
        },
      });

      return subscription;
    });
  };

export const mySwitchMap =
  <T>(project: (n: T) => Observable<any>) =>
  (source: Observable<T>) => {
    return new Observable((observer: Observer<T>) => {
      let outerSubCompleted = false;
      let innerSubscription: Subscription;
      let innerSubscriptionActive = false;
      const subscription = source.subscribe({
        next: (next: T) => {
          if (innerSubscription) {
            innerSubscription.unsubscribe();
          }

          innerSubscriptionActive = true;

          innerSubscription = project(next).subscribe({
            next: (next: T) => {
              observer.next(next);
            },
            error: (err: any) => {
              observer.error(err);
            },
            complete: () => {
              innerSubscriptionActive = false;
              if (outerSubCompleted) {
                observer.complete();
              }
            },
          });
        },
        error: (err: any) => {
          observer.error(err);
        },
        complete: () => {
          outerSubCompleted = true;
          if (!innerSubscriptionActive) {
            observer.complete();
          }
        },
      });

      return subscription;
    });
  };

export const myConcatMap =
  <T>(project: (n: T) => Observable<any>) =>
  (source: Observable<T>) => {
    return new Observable((observer: Observer<T>) => {
      const queue: Array<Observable<any>> = [];
      let innerSubActive = false;
      let outerSubActive = true;

      const subscription = new Subscription();

      subscription.add(
        source.subscribe({
          next: (next: T) => {
            const subscribeToInner = (inner$: Observable<any>) => {
              subscription.add(
                inner$.subscribe({
                  next: (next: T) => {
                    observer.next(next);
                  },
                  error: (err: any) => {
                    observer.error(err);
                  },
                  complete: () => {
                    const first$ = queue.shift();
                    if (first$) {
                      subscribeToInner(first$);
                    } else {
                      innerSubActive = false;
                      if (!outerSubActive) {
                        observer.complete();
                      }
                    }
                  },
                })
              );
            };

            const inner$ = project(next);

            if (!innerSubActive) {
              innerSubActive = true;
              subscribeToInner(inner$);
            } else {
              queue.push(inner$);
            }
          },
          error: (err: any) => {
            observer.error(err);
          },
          complete: () => {
            outerSubActive = false;
            if (!innerSubActive) {
              observer.complete();
            }
          },
        })
      );

      return subscription;
    });
  };

export const myInterval = (intervalTime: number) => {
  return new Observable((observer: Observer<number>) => {
    let count = 0;
    const intervalId = setInterval(() => {
      observer.next(count);
      count++;
    }, intervalTime);

    return () => {
      clearInterval(intervalId);
    };
  });
};

export const myTimer = (timeTillFirstValue: number, periodTime: number) => {
  return new Observable((observer: Observer<number>) => {
    let count = 0;
    let intervalId: any;
    const timeoutId = setTimeout(() => {
      observer.next(count);
      count++;
      intervalId = setInterval(() => {
        observer.next(count);
        count++;
      }, periodTime);
    }, timeTillFirstValue);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  });
};

export const myOf = <T>(...values: Array<T>) => {
  return new Observable((observer: Observer<T>) => {
    values.forEach((val) => observer.next(val));
    observer.complete();
  });
};

export const myMerge = (...observables: Array<Observable<any>>) => {
  return new Observable((observer: Observer<any>) => {
    const numObservables = observables.length;
    let numObservablesCompleted = 0;

    const subscriptions = observables.map((obs) =>
      obs.subscribe({
        next: (next: any) => {
          observer.next(next);
        },
        error: (err: any) => {
          observer.error(err);
        },
        complete: () => {
          numObservablesCompleted++;
          if (numObservablesCompleted === numObservables) {
            observer.complete();
          }
        },
      })
    );

    return () => {
      subscriptions.forEach((sub) => {
        sub.unsubscribe();
      });
    };
  });
};

const NONE = {};

export const myCombineLatest = (observables: Array<Observable<any>>) => {
  return new Observable((observer: Observer<any>) => {
    const values = Array.from({ length: observables.length }).map((_) => NONE);

    const numObservables = observables.length;

    let numObservablesCompleted = 0;

    let toRespond = observables.length;

    const subscriptions = observables.map((obs, i) =>
      obs.subscribe({
        next: (next: any) => {
          if (values[i] === NONE) {
            toRespond--;
          }

          values[i] = next;

          if (toRespond === 0) {
            observer.next(values);
          }
        },
        error: (err: any) => {
          observer.error(err);
        },
        complete: () => {
          numObservablesCompleted++;
          if (numObservablesCompleted === numObservables) {
            observer.complete();
          }
        },
      })
    );

    return () => {
      subscriptions.forEach((sub) => {
        sub.unsubscribe();
      });
    };
  });
};
