export default class {
    constructor () {
        this.productsImage = document.querySelectorAll('.gallery-item-image')
        this.productWrapper = document.querySelector('.gallery-wrapper')

        this.heroProducts = document.querySelector('.hero-products')

        this.fragment = document.createDocumentFragment()

        this.detail = document.querySelector('#detail')
        this.detailTemplate = document.querySelector('#detail-template').content
        this.btnClose = document.querySelector('.detail-close')

        this.iconCart = document.querySelector('#icon-cart')

        this.cartWrapper = document.querySelector('.cart-wrapper')

        this.cartElement = document.querySelector('#cart')
        this.cartTemplate = document.querySelector('#cart-template').content

        this.products = []
        this.totalProducts = null

        if (localStorage.getItem('cart')) {
            this.cart = JSON.parse(localStorage.getItem('cart'))
            this.showCart()
        } else {
            this.cart = {}
        }

        this.btnClose.classList.add('hide')
        
        this.fetchData()
        this.showDetail()

        this.hideDetail()

        this.showCart()
        this.hideCart()

        this.addToCart()

        this.showTotalInCart()

        this.addEventListeners()
    }

    async fetchData () {
        try {
            const res = await fetch('products.json')
            this.products = await res.json()
        } catch (error) {
            console.log(error)
        }
    }

    showDetail () {
        this.productsImage.forEach((item, index) => {
            item.addEventListener('click', () => {
                //set scroll to 0
                window.scrollTo(0, 0)
                this.btnClose.classList.remove('hide')
                if (item.id === this.products[index].id) {
                    //Paint detail page
                    this.detailTemplate.querySelector('img').setAttribute('src', this.products[index].image)
                    this.detailTemplate.querySelector('h2').textContent = this.products[index].title
                    this.detailTemplate.querySelector('.price').textContent = this.products[index].price
                    this.detailTemplate.querySelector('.description').textContent = this.products[index].description
                    this.detailTemplate.querySelector('.btn-cart').dataset.id = this.products[index].id

                    const clone = this.detailTemplate.cloneNode(true)
                    this.fragment.appendChild(clone)
                }
                this.detail.appendChild(this.fragment)
                //then create detail page put cart functionality
                this.addToCart()

                this.detail.classList.add('show')
                this.productWrapper.classList.add('hide')
                this.heroProducts.classList.add('hide')
            })
        })
    }

    hideDetail () {
        const buttonSkip = document.querySelector('#btn-close')

        buttonSkip.addEventListener('click', () => {
            this.productWrapper.classList.remove('hide')
            this.heroProducts.classList.remove('hide')
            this.cartWrapper.classList.remove('open')
            this.btnClose.classList.add('hide')

            this.detail.innerHTML = ''
        })
    }

    addToCart () {
        const buttonCart = document.querySelector('.btn-cart')

        if (this.products.length) {
            this.product = this.products.find(product => product.id === buttonCart.dataset.id)
            if (this.product) {
                this.product.amount = 0
            }
    
            buttonCart.addEventListener('click', () => {
                this.product.amount++
            
                if (this.product.amount >= this.product.stock) {
                    console.log('agotado')
                }
                this.cart[this.product.id] = { ...this.product }
                
                this.showCart()
                this.getTotal()
                this.showTotalInCart()
            })
        }

    }

    showCart () {
        this.cartElement.innerHTML = ''

        this.showCartNotResult()

        Object.values(this.cart).forEach(product => {
            this.cartTemplate.querySelector('img').setAttribute('src', product.image)
            this.cartTemplate.querySelector('h2').textContent = product.title
            this.cartTemplate.querySelector('.price').textContent = product.price * product.amount
            this.cartTemplate.querySelector('#button-cart-amount').textContent = product.amount
            
            //buttons
            this.cartTemplate.querySelector('#btn-sub').dataset.id = product.id
            this.cartTemplate.querySelector('#btn-add').dataset.id = product.id
    
            const clone = this.cartTemplate.cloneNode(true)
            this.fragment.appendChild(clone)
        })

        this.cartElement.appendChild(this.fragment)
        this.getTotal()

        localStorage.setItem('cart', JSON.stringify(this.cart))
    }

    hideCart () {
        document.querySelector('.btn-close-cart').addEventListener('click', () => {
            this.cartWrapper.classList.remove('open')
        })
    }

    addEventListeners () {
        this.iconCart.addEventListener('click', () => {
            this.cartWrapper.classList.add('open')
        })

        this.cartElement.addEventListener('click', event => { 
            this.addProduct(event) 
            this.subtractProduct(event)
        })
    }

    showCartNotResult () {
        if (Object.values(this.cart).length === 0) {
            this.cartElement.innerHTML = `
                <div class='not-result'>
                    <p class='heading-4'>No hay productos en tu carrito</p>
                    <button
                        class="btn btn-lg button-tertiary"
                        type="button">
                        Comienza a comprar
                    </button>
                </div>
            `
        }
    }

    getTotal () {
        this.totalProducts = Object.values(this.cart).reduce((accumulator, {amount}) => accumulator + amount, 0)
        this.totalPrice = Object.values(this.cart).reduce((accumulator, {amount, price}) => accumulator + amount * price, 0)
    }

    showTotalInCart () {
        const cartAmount = document.querySelector('.cart-amount')
        const cartTotalAmount = document.querySelector('#cart-total-amount')
        const cartTotalPrice = document.querySelector('#cart-total-price')

        cartAmount.textContent = this.totalProducts
        cartTotalAmount.textContent = this.totalProducts
        cartTotalPrice.textContent = this.totalPrice
    }

    subtractProduct (event) {
        if (event.target.classList.contains('btn-sub')) {

            const product = this.cart[event.target.dataset.id]
            product.amount--
            if (product.amount === 0) {
                delete this.cart[event.target.dataset.id]
            } else {
                this.cart[event.target.dataset.id] = { ...product }
            }
            this.showCart()
            this.showTotalInCart()
        }
    }

    addProduct (event) {
        if (event.target.classList.contains('btn-add')) {

            const product = this.cart[event.target.dataset.id]
            product.amount++
            this.cart[event.target.dataset.id] = { ...product }
            this.showCart()
            this.showTotalInCart()
        }
    }
}