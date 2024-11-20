function payment(){
    var sessionid = document.getElementById('sessionId').value;
    var stripe = Stripe('pk_test_51QMJxtJWpbVOS3jdCDVVSbZolQ8e7vGvkACGKADEMOu1p6NniFqNQZc3njIOsXbUj6Vh1zoH9vqKXeYtCvuGiv6J00Qj6S1LYl');
    stripe.redirectToCheckout({
        sessionId: sessionid
    });
}