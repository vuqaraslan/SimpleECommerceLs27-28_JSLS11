// fetch('https://jsonplaceholder.typicode.com/posts',{
//     method:"POST",
//     body:JSON.stringify({
//         name:"Jack",
//         surname:"Larry"
//     })
// })
// .then((response)=>console.log(response))

import  function_ from './api.js';
import { setStorage, getStorage} from './storage.js';
let productRow = document.querySelector(".product-row");
let productBaskets = document.getElementsByClassName("product-shop-btn");
let basketNumber = document.querySelector(".basket-number");
let basketContainer = document.querySelector(".basket-container");
let totalCount=document.querySelector('.total-count');
let totalAmount=document.querySelector('.total-amount');
let detailBtns=document.getElementsByClassName('details-btn');
let detailContainer=document.querySelector('.detail-container');


totalCount.textContent=0;
totalAmount.textContent=0;
let baskets = getStorage("basket");

let products = function_.getProductsFromApi();

document.addEventListener("DOMContentLoaded", function () {
  //   fetch("https://fakestoreapi.com/products")
  //     .then((response) => response.json())
  // // .then((data)=>ShowProducts(data))
  products.then(ShowProducts);
  products.then(ShowBaskets);
  CalculateTotalCount();
});

function ShowProducts(products) {
  productRow.innerHTML = "";
  products.forEach((product) => {
    let hasInBasket = baskets.some((basket) => basket.id == product.id);

    productRow.innerHTML += `
        <div class="col-xl-4">
            <div class="card product-card">
              <img src="${product.image}" class="card-img-top product-img" 
                alt="${product.title}" />
                <div class="card-body">
                    <h5 class="card-title">${getTitle(product.title, 20)}</h5>
                    <b class="card-text">Price : ${product.price} AZN</b>
                    <p class="card-text">
                    ${getTitle(product.description, 60)}
                    </p>
                    <button class="btn btn-primary details-btn "
                   data-bs-toggle="modal" data-bs-target="#detail"
                      data-id='${product.id}'>Open Details</button>

                    <buttom class="product-shop-btn ${
                      hasInBasket && "active"
                    }" data-id='${product.id}'
                    > <i class="fa-solid fa-bag-shopping"></i> </button>
                </div>
            </div>
        </div>
    `;
  });

  AddEventsToBasketBtn();
}

function AddEventsToBasketBtn() {
  for (const btn of productBaskets) {
    btn.addEventListener("click", function (e) {
      // let id=Number(e.currentTarget.getAttribute("data-id"));
      // console.log(e.currentTarget.dataset.id);
      let thisEl = e.currentTarget;
      let id = Number(thisEl.dataset.id);

      if (thisEl.classList.contains("active")) {
        baskets = baskets.filter((basket) => basket.id !== id);
      } else {
        baskets.push({
          id: id,
          count: 1,
        });
      }
      thisEl.classList.toggle("active");
      // console.log(baskets);
      
      // localStorage.setItem("basket", JSON.stringify(baskets));
      setStorage('basket',baskets);
      products.then(ShowBaskets);
      CalculateTotalCount();
    });
  }


  for (const detail of detailBtns) {
    detailContainer.innerHTML="";
    detail.addEventListener('click',async function(e){
     let thisEl=e.currentTarget;
     let id=Number(thisEl.dataset.id);
      let productById=await function_.getProductsFromApiById(id);
      console.log(productById);

      detailContainer.innerHTML=`
      <div class='container text-center p-3'  style="background-color: deepskyblue;"> 
        <img src="${productById.image}" alt="product image"  style="border-radius:20px;" class='w-50'>
        <h2><b>Id</b> : ${productById.id}</h2>
        <h3><b>Title : </b>${productById.title}</h3>
        <h4><b>Price : </b>${productById.price} $</h4>
        <p>${productById.description}</p>
        <h4><b>Category : </b>${productById.category}</h4>
        <h4><b>Rating rate : </b>${productById.rating.rate} <span id='star-span'>${DrawStar(Math.round(productById.rating.rate))}</span></h4>
        <h4><b>Rating count : </b>${productById.rating.count}</h4>
      </div>
          `;

    });
  }
}

function DrawStar(count){
  let star='⭐';
  let spanContent='';
  for(let i=0;i<count;i++){
    spanContent+=star;
  }
  return spanContent;
}

function ShowBaskets(products) {
  basketContainer.innerHTML = "";
  baskets.forEach((basket) => {
    let product = products.find((p) => p.id == basket.id);

    basketContainer.innerHTML += `
         <div class="basket-element">
              <h2>${getTitle(product.title, 20)}</h2>
              <span>${product.price} AZN</span>
              <div class="basket-btn">
                <button class='decrement-count' data-id=${basket.id}
                ><i class="fa-solid fa-minus"></i></button>
                <span>X${basket.count}</span>
                <button class='increment-count' data-id=${basket.id}
                ><i class="fa-solid fa-plus"></i></button>
              </div>
              <span class="basket-price">${(
                basket.count * product.price
              ).toFixed(2)} AZN</span>
              <button class="delete-btn" data-id=${basket.id}>
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
        `;
  });

  AddEventsToBasket();
    /*Here is not working this delete code but in function is working
   which has written below
   */
  //   for (const deleteBtn of deleteBtns) {
  //     deleteBtn.addEventListener("click", function (e) {
  //       let delBtnId = Number(e.currentTarget.dataset.id);
  //       baskets = baskets.filter((b) => b.id !== delBtnId);
  //       // let basketForDelete=baskets.find(b=>b.id==delBtnId);
  //       localStorage.setItem("basket", JSON.stringify(baskets));
  //       products.then(ShowBaskets);
  //       console.log(baskets);
  //     });
  //   }
  basketNumber.textContent = baskets.length;
}
// let deleteBtns = document.getElementsByClassName("delete-btn");

function getTitle(title, count) {
  return title.length > count ? title.substring(0, count).concat("...") : title;
}


function AddEventsToBasket() {
  let minusBtns = document.getElementsByClassName("decrement-count");
  let plusBtns = document.getElementsByClassName("increment-count");
  let deleteBtns = document.getElementsByClassName("delete-btn");

  for (const delBtn of deleteBtns) {
    delBtn.addEventListener('click',function(e){
        let id = Number(e.currentTarget.dataset.id);
        baskets=baskets.filter((basket)=>basket.id!==id);

        setStorage('basket',baskets);
        products.then(ShowBaskets);
        // console.log(baskets);
        products.then(ShowProducts);

        CalculateTotalCount();
    });
  }

  for (const btn of minusBtns) {
    btn.addEventListener("click", function (e) {
    /*
        let id = Number(e.currentTarget.dataset.id);
        let basketObj = baskets.find((b) => b.id === id);
        baskets = baskets.map((basket) => {
          if(basket.count>1){
              return {
                ...basket,
                count: basket.id === basketObj.id ? basket.count - 1
                                                 : basket.count,
              };
          }
          else{
              return basket;
          }
        });
        localStorage.setItem("basket", JSON.stringify(baskets));
        products.then(ShowBaskets);
       */

        //Birinci usul
        // OperationCount(e, 1, -1, false);
        //İkinci usul
        OperationCount(e, -1,(b_count)=>b_count>1);

    });
  }

  for (const btn of plusBtns) {
    btn.addEventListener("click", function (e) {
        /*
        let id = Number(e.currentTarget.dataset.id);
        let basketObj = baskets.find((b) => b.id === id);
        baskets = baskets.map((basket) => {
          if(basket.count < 10){
              return {
                ...basket,
                count:
                  basket.id === basketObj.id
                      ? basket.count + 1
                    : basket.count,
              };
          }
          else{
              return basket;
          }
        });
        localStorage.setItem("basket", JSON.stringify(baskets));
        products.then(ShowBaskets);
        */

      //Birinci usul
      //OperationCount(e, 10, 1, true);

    //İkinci usul
    OperationCount(e,1,(b_count)=>b_count<10 );

 
    });
  }
}

async function CalculateTotalCount(){
  let datacount=0;
  let dataamount=0;
  let allProducts=await products;
  // console.log(allProducts);
  // for (let i=0;i<baskets.length;i++){
  //   datacount+=baskets[i].count;
  //   let product=allProducts.find((p)=>p.id===baskets[i].id);
  //   dataamount+=product.price*baskets[i].count;
  // }
  baskets.forEach((basket)=>{
    datacount+=basket.count;
    let product=allProducts.find((p)=>p.id===basket.id);
    dataamount+=product.price*basket.count;
  });
  totalCount.textContent=datacount;
  totalAmount.textContent=dataamount.toFixed(2);
}
/*
//Birinci usul function
function OperationCount(e, borderValue, count, isPlus) {
  let id = Number(e.currentTarget.dataset.id);
  let basketObj = baskets.find((b) => b.id === id);
  
  baskets = baskets.map((basket) => {
    if (isPlus ? basket.count < borderValue : basket.count > borderValue) {
      return {
        ...basket,
        count: basket.id === basketObj.id ? basket.count + count : basket.count,
      };
    } else {
      return basket;
    }
  });

  localStorage.setItem("basket", JSON.stringify(baskets));
  products.then(ShowBaskets);
}
 */

//Ikinci usul
function OperationCount(e, count, callBack) {
  let id = Number(e.currentTarget.dataset.id);
  let basketObj = baskets.find((b) => b.id === id);
  
  baskets = baskets.map((basket) => {
    if (callBack(basket.count)) {
      return {
        ...basket,
        count: basket.id === basketObj.id ? basket.count + count : basket.count,
      };
      
    } else {
      return basket;
    }
  });

  setStorage('basket',baskets);
  products.then(ShowBaskets);
  CalculateTotalCount();
}