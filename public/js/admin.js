const deleteProduct = (btn) => {
  const prodId = btn.parentNode.querySelector("[name = productId]").value;
  const csrfToken = btn.parentNode.querySelector("[name = _csrf]").value;

  const deleteItem = btn.closest("article");

  fetch("/admin/delete-product/" + prodId, {
    method: "DELETE",
    headers: {
      "csrf-token": csrfToken,
    },
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      console.log(data);
      deleteItem.remove();
    })
    .catch((err) => console.log(err));
};
