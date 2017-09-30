'use strict'
;(global => {
  const SznElements = global.SznElements = global.SznElements || {}

  SznElements['szn-checkbox'] = class SznCheckbox {
    constructor(rootElement, uiContainer) {
      this._input = rootElement.querySelector('input')

      this._ui = document.createElement('szn-')
      uiContainer.appendChild(this._ui)

      this.onKeyPressed = event => {
        if (event.keyCode === 32) {
          this.onPressedDown()
        }
      }

      this.onKeyReleased = event => {
        if (event.keyCode === 32) {
          this.onPressReleased()
        }
      }

      this.onPressedDown = () => {
        this._ui.dataset.pressed = ''
      }

      this.onPressReleased = () => {
        this._input.focus()
        delete this._ui.dataset.pressed
      }

      this.onFocus = () => {
        this._ui.dataset.focused = ''
      }

      this.onBlur = () => {
        delete this._ui.dataset.focused
      }

      this.onDisabledStateChange = () => {
        if (this._input.disabled) {
          this._ui.dataset.disabled = ''
        } else {
          delete this._ui.dataset.disabled
        }
      }

      this.onChange = () => {
        if (this._input.checked) {
          this._ui.dataset.checked = ''
        } else {
          delete this._ui.dataset.checked
        }
      }

      this.onUiClicked = () => {
        this._input.checked = !this._input.checked
        this._input.dispatchEvent(new CustomEvent('change'))
      }

      this.onDisabledStateChange()
      this.onChange()
    }

    onMount() {
      for (const eventType of ['keypress', 'change', 'click']) {
        this._input.addEventListener(eventType, this.onChange)
      }
      this._input.addEventListener('keydown', this.onKeyPressed)
      this._input.addEventListener('keyup', this.onKeyReleased)
      this._input.addEventListener('focus', this.onFocus)
      this._input.addEventListener('blur', this.onBlur)

      this._ui.addEventListener('mousedown', this.onPressedDown)
      this._ui.addEventListener('mouseup', this.onPressReleased)
      this._ui.addEventListener('click', this.onUiClicked)

      this._stopObserver = SznElements.observeAttributes(this._input, ['disabled'], this.onDisabledStateChange)
    }

    onUnmount() {
      for (const eventType of ['keypress', 'change']) {
        this._input.removeEventListener(eventType, this.onChange)
      }
      this._input.removeEventListener('keydown', this.onKeyPressed)
      this._input.removeEventListener('keyup', this.onKeyReleased)
      this._input.removeEventListener('focus', this.onFocus)
      this._input.removeEventListener('blur', this.onBlur)

      this._ui.removeEventListener('mousedown', this.onPressedDown)
      this._ui.removeEventListener('mouseup', this.onPressReleased)
      this._ui.removeEventListener('click', this.onUiClicked)

      this._stopObserver()
    }
  }

  if (SznElements.init) {
    SznElements.init()
  }
})(self)
