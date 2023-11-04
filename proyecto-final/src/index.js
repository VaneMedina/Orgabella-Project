import Preloader from './components/Preloader.js'
import Navigation from './components/Navigation.js'

import Detail from './pages/detail.js'

class App {
    constructor () {
        this.createPreloader()
        this.createNavigation()

        this.createDetail()
    }

    createPreloader () {
        this.preloader = new Preloader()
    }

    createNavigation () {
        this.navigation = new Navigation()
    }

    createDetail () {
        this.detail = new Detail()
    }
}

new App()