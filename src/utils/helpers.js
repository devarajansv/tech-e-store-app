//import url from "./URL";

//flatten

export function flattenProducts(data) {
  return data.map((item) => {
    //cloudinary deploy
    let image = item.image[0].url;
    //local deploy
    //let image = `${url}${item.image.url}`;
    return { ...item, image };
  });
}

// helper functions

export function featuredProducts(data) {
  return data.filter((item) => {
    return item.featured === true;
  });
}
