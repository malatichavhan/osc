function updateCartQty(obj){
    var productId = obj.getAttribute('data');
    var qty = obj.value;
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/card/updateQty", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("productId="+productId+"&quantity="+qty);
}