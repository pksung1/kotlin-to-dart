class KotlinToDart {
  kotlinArea: HTMLTextAreaElement
  dartArea: HTMLTextAreaElement
  constructor (kotlinArea: HTMLTextAreaElement, dartArea: HTMLTextAreaElement) {
    this.kotlinArea = kotlinArea
    this.dartArea = dartArea
    console.log("hello World")
  }

  generate() {
    
  }

  onChangeKotlinAreaValue (text: string) {
    
  }

}


window.addEventListener('load', () => {
  const kotlinToDart = new KotlinToDart(
    document.getElementById('kotlin-area') as HTMLTextAreaElement,
    document.getElementById('dart-area') as HTMLTextAreaElement
  )
})