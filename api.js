function getProductsFromApi() {
  return fetch("https://fakestoreapi.com/products").then((response) =>
    response.json()
  );
}

function getProductsFromApiById(id) {
  return fetch(`https://fakestoreapi.com/products/${id}`).then((response) =>
    response.json()
  );
}


export default {getProductsFromApi,getProductsFromApiById}