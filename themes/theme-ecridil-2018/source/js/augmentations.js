import 'intersection-observer'
import scrollama from 'scrollama'

class Augmentations {
  /**
   * Constructor: logic is run when a new instance is born
   */
  constructor() {
    this.boundResize = this.resize.bind(this)
    this.setupAugmentations()
  }

  /**
   * Activate scroll intersection behavior
   */
  setupAugmentations() {
    
    // check if there is a correct scroll wrapper
    // if not, we cannot use the scrolling functionality
    if (!document.querySelector('.hybritexte-page__scroll-wrapper')) {
      return
    }

    // setup new scrollama instance
    this.scroller = new scrollama()
      .setup({
        container: '.hybritexte-page__scroll-wrapper',
        step: '.hybritexte-augmentation--step-marker',
        offset: 0,
        progress: true
      })

    // Could be .onStepEnter or .onStepExit, but only 1 please
    // because the marker is so small, we don't want to trigger
    // twice very quickly (stepenter + stepexit in a single scroll)
    this.scroller.onStepExit(this.handleStep)

    // attach event listeners
    window.addEventListener('resize', this.boundResize)

    
    let augmentations = Array.prototype.slice.call(document.querySelectorAll('[data-augmentation-id]'))
    // js-enabled by default, but could be disabled in augmentations options
    augmentations.forEach(function(b) {
      b.querySelector('.hybritexte-augmentation__inner').classList.add('js-enabled')
    })
  }

  /**
   * Handle step trigger
   * @param {object} response Scrollama trigger object
   */
  handleStep(response) {
    let augmentations = Array.prototype.slice.call(document.querySelectorAll('.hybritexte-augmentation__augmentation'))
    // reset augmentations
    // actually we don't want this to be reset for all augmentations, every time, necessarily.
    // see per-direction logic below
//
//    augmentations.forEach(function(b) {
//      b.classList.remove('is-active', 'is-stuck')
//    })
    // END reset augmentations

    let beforeId = response.element.getAttribute('data-augmentation-before')
    let afterId = response.element.getAttribute('data-augmentation-after')

    if (response.direction === 'up') {
      if (beforeId) {
        // z-index situation when scrolling up
        if (afterId) {
          let matchingAfterAugmentation = document.querySelector('[data-augmentation-id="' + afterId + '"]')
          matchingAfterAugmentation && matchingAfterAugmentation.classList.remove('is-active', 'is-stuck')
        }

        let matchingBeforeAugmentation = document.querySelector('[data-augmentation-id="' + beforeId + '"]')
        matchingBeforeAugmentation && matchingBeforeAugmentation.classList.add('is-active', 'is-stuck')
      } else {
        augmentations.forEach(function(a) {
          a.classList.remove('is-active', 'is-stuck')
        })
      }
    } else if (response.direction === 'down') {
      if (afterId) {
        let matchingAfterAugmentation = document.querySelector('[data-augmentation-id="' + afterId + '"]')
        matchingAfterAugmentation && matchingAfterAugmentation.classList.add('is-active', 'is-stuck')
      } else {
        augmentations.forEach(function(a) {
          a.classList.remove('is-active', 'is-stuck')
        })
      }
    }
  }

  /**
   * Method to handle window resize logic
   */
  resize() {
    if (this.scroller) {
      this.scroller.resize()
    }
  }

  /**
   * Method to destroy the instance and remove listeners
   */
  destroy() {
    window.removeEventListener('resize', this.boundResize)
    if (this.scroller) {
      this.scroller.destroy()
    }
  }
}

export default Augmentations
