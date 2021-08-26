export function observerSetup(root, refs, callback) {
  //observe about 2 more pages before and after the current page
  const option = { root: root, rootMargin: "200% 0px" };
  const observer = new IntersectionObserver(callback, option);
  refs.forEach((ref) => observer.observe(ref));
  return observer;
}

export function observerDisconnect(observers) {
  observers.forEach((observer) => {
    if (observer !== null) observer.disconnect();
  });
}
