function a() {
    b();
}
function b() {
    c();
}
function c() {
    console.trace("Function c was called");
}

a();