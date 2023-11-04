export default class {
    constructor () {
        this.images = document.querySelectorAll('img')

        this.element = document.querySelector('.preloader')
        this.number = document.querySelector('.preloader-number')

        this.length = 0
        this.createLoader()
    }

    createLoader () {
        this.images.forEach(image => {  
            image.addEventListener('load', this.onAssetLoaded())
        })
    }

    onAssetLoaded () {
        this.length ++

		const percent = this.length / this.images.length

		this.number.innerHTML = `${Math.round(percent * 100)}  <span class="preloader-symbol">%</span>`

		if (percent === 1 ) {
			this.onLoaded()
		}
    }

    onLoaded () {
        this.element.classList.add('preloader-close')
        document.documentElement.classList.add('preloader-open')

        setTimeout(() => {
            this.element.parentNode.removeChild(this.element)
            document.documentElement.classList.remove('preloader-open')
          }, 1000)
    }
}