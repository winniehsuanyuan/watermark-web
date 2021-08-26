export function readASDataURL(imgFile) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function () {
      resolve(reader.result);
    };
    reader.readAsDataURL(imgFile);
  });
}

export async function createImg(imgFile) {
  const url = await readASDataURL(imgFile);
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = function () {
      resolve(img);
    };
  });
}
