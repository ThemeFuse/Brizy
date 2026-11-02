export default function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = function () {
      resolve(this);
    };
    image.onabort = () => {
      reject(`preloadImage("${src}") onabort`);
    };
    image.onerror = () => {
      reject(`preloadImage("${src}") onerror`);
    };

    image.src = src;
  });
}
