/* eslint-disable no-undef */
const socketClient = io();

const btnSubmit = document.getElementById("submit");
const idProductForm = document.getElementById("idProductForm");
const title = document.getElementById("title");
const description = document.getElementById("description");
const price = document.getElementById("price");
const status = document.getElementById("status");
const code = document.getElementById("code");
const stock = document.getElementById("stock");
const category = document.getElementById("category");
const idProduct = document.querySelectorAll(".update-product");
const idDelete = document.querySelectorAll(".delete-product");

// Obtener ID
idProduct.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    // se obtiene el ID del producto desde el atributo "data-product-id"
    const productId = e.target.getAttribute("data-product-id");

    // se emite un evento de Socket.io para actualizar el producto
    socketClient.emit("idUpdateProducts", { productId });
  });
});

// Actualizar producto
socketClient.on("loadListProducts", (data) => {
  idProductForm.value = data._id;
  title.value = data.title;
  description.value = data.description;
  price.value = data.price;
  status.value = data.status;
  code.value = data.code;
  stock.value = data.stock;
  category.value = data.category;

  btnSubmit.addEventListener("click", (e) => {
    e.preventDefault();
    updateList(
      idProductForm.value,
      title.value,
      description.value,
      price.value,
      status.value,
      code.value,
      stock.value,
      category.value
    );

    location.reload();

    alert("Producto actualizado");
  });
});

const updateList = (
  idProductForm,
  title,
  description,
  price,
  status,
  code,
  stock,
  category
) => {
  socketClient.emit("updateListProducts", {
    idProductForm,
    title,
    description,
    price,
    status,
    code,
    stock,
    category,
  });
};

// eliminar producto
idDelete.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    const productId = e.target.getAttribute("data-product-id");

    socketClient.emit("idDeleteProducts", { productId });

    socketClient.on("loadListProducts", (data) => {
      return data;
    });
    location.reload();

    alert("Producto eliminado");
  });
});
