const preloadImage = function (path) {
  return new Promise(function (resolve, reject) {
    const image = new Image();
    image.onload = function () {
      resolve(image);
    };
    image.onerror = reject;
    image.src = path;
  });
};
preloadImage('https://cdn.readhub.me/static/assets/png/readhub_logo@2x.c5c683e7.png').then((images) => {
  console.log(images);
}).catch(() => {

});
console.log('before preloadImage');