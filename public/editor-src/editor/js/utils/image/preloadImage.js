export default function preloadImage(src) {
  return new Promise(function(resolve, reject) {
    const image = new Image();

    image.onload = function() {
      resolve(this);
    };
    image.onabort = function() {
      reject(`preloadImage("${src}") onabort`);
    };
    image.onerror = function() {
      reject(`preloadImage("${src}") onerror`);
    };

    image.src = src;
  });
}
