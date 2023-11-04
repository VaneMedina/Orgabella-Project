export default class {
    constructor () {
        this.navigation = document.querySelector('.nav')
        const menu = document.querySelector('.nav-menu')

        const openNav = _ => {
            document.documentElement.classList.toggle('open')
        }

        menu.addEventListener('click', openNav)
        this.addEventListener()
    }

    addEventListener () {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 0) {
                this.navigation.classList.add('dropped')
            } else {
                this.navigation.classList.remove('dropped')
            }
        })        
    }
}