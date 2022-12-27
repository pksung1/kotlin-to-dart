class KotlinToDart {
    constructor(kotlinArea, dartArea) {
        this.kotlinArea = kotlinArea;
        this.dartArea = dartArea;
        console.log("hello World");
    }
    generate() {
    }
    onChangeKotlinAreaValue(text) {
    }
}
window.addEventListener('load', () => {
    const kotlinToDart = new KotlinToDart(document.getElementById('kotlin-area'), document.getElementById('dart-area'));
});
//# sourceMappingURL=index.js.map