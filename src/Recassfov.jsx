import React from 'react'
import validator from 'validator'
import axios from 'axios'

import objectToUrlEncoded from './objectToUrlEncoded'

const Context = React.createContext()

class Provider extends React.Component {
  constructor () {
    super()
    this.state = {
      formItems: {},
      totalValidations: 0,
      invalidInputClassName: 'is-invalid',
      invalidFeedbackClassName: 'invalid-feedback'
    }
  }

  setAnyState (state, value) {
    this.setState({ [state]: value })
  }

  setFormItem (item) {
    const formItems = this.state.formItems

    formItems[item.name] = {
      value: item.value || '',
      validations: item.validations || [],
      invalidFeedback: item.validations ? item.validations[0].invalidFeedback : '',
      className: ''
    }

    this.setState({ formItems })

    this.setState((prevState) => ({
      totalValidations: prevState.totalValidations + (item.validations ? item.validations.length : 0)
    }))
  }

  handleInput (e) {
    const item = e.target
    const formItems = this.state.formItems

    if (item.type === 'checkbox') {
      formItems[item.name].value = !formItems[item.name].value
    } else {
      formItems[item.name].value = item.value
    }

    this.setState({ formItems })
  }

  onSubmit (
    onSubmit,
    validFormBeforePost,
    invalidFormBeforePost,
    validFormAfterPost,
    invalidFormAfterPost,
    postUrl,
    e
  ) {
    e.preventDefault()

    if (onSubmit) onSubmit()

    const formItems = this.state.formItems
    let formItemsValues = {}
    let howManyOfFormItemsAreValidated = 0

    Object.keys(formItems).map((itemName) => {
      const item = formItems[itemName]
      formItemsValues[itemName] = item.value

      item.validations.map((validation) => {
        const validate = validator[validation.rule](item.value, validation.args)

        if (validate) howManyOfFormItemsAreValidated++

        item.invalidFeedback = validation.invalidFeedback
        item.className = validate ? '' : ` ${this.state.invalidInputClassName}`
      })
    })

    this.setState({ formItems })

    if (howManyOfFormItemsAreValidated === this.state.totalValidations) {
      if (validFormBeforePost) {
        validFormBeforePost({
          formItems: formItemsValues
        })
      }

      if (postUrl) {
        const _formItems = Object.keys(formItems).reduce((previous, current) => {
          previous[current] = formItems[current].value
          return previous
        }, {})

        axios({
          method: 'post',
          url: postUrl,
          data: objectToUrlEncoded(_formItems),
          headers: { 'content-type': 'application/x-www-form-urlencoded' }
        })
          .then((res) => {
            const validations = res.data.validations || {}

            if (Object.keys(validations).length) {
              if (invalidFormAfterPost) {
                invalidFormAfterPost({
                  formItems: formItemsValues,
                  ajaxData: res.data
                })
              }

              Object.keys(validations).map((itemName) => {
                formItems[itemName].invalidFeedback = validations[itemName]
                formItems[itemName].className = ` ${this.state.invalidInputClassName}`
              })

              this.setState({ formItems })
            } else {
              if (validFormAfterPost) {
                validFormAfterPost({
                  formItems: formItemsValues,
                  ajaxData: res.data
                })
              }
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    } else {
      if (invalidFormBeforePost) {
        invalidFormBeforePost({
          formItems: formItemsValues
        })
      }
    }
  }

  render () {
    const store = {
      state: this.state,
      setAnyState: this.setAnyState.bind(this),
      setFormItem: this.setFormItem.bind(this),
      handleInput: this.handleInput.bind(this),
      onSubmit: this.onSubmit.bind(this)
    }

    return (
      <Context.Provider value={store}>
        {this.props.children}
      </Context.Provider>
    )
  }
}

class Form extends React.Component {
  constructor (props) {
    super(props)
    if (this.props.invalidInputClassName) {
      this.props.store.setAnyState('invalidInputClassName', this.props.invalidInputClassName)
    }
    if (this.props.invalidFeedbackClassName) {
      this.props.store.setAnyState('invalidFeedbackClassName', this.props.invalidFeedbackClassName)
    }
  }

  render () {
    const {
      store,
      onSubmit,
      validFormBeforePost,
      invalidFormBeforePost,
      validFormAfterPost,
      invalidFormAfterPost,
      postUrl,
      invalidInputClassName,
      invalidFeedbackClassName,
      ...otherProps
    } = this.props

    return (
      <form
        {...otherProps}
        noValidate
        onSubmit={
          this.props.store.onSubmit.bind(
            this,
            onSubmit,
            validFormBeforePost,
            invalidFormBeforePost,
            validFormAfterPost,
            invalidFormAfterPost,
            postUrl
          )
        }
      >
        {this.props.children}
      </form>
    )
  }
}

class Input extends React.Component {
  constructor (props) {
    super(props)
    this.props.store.setFormItem(this.props)
  }

  render () {
    const { store, validations, className, ...otherProps } = this.props
    const thisItem = store.state.formItems[this.props.name]

    return (
      <React.Fragment>
        <input
          {...otherProps}
          onChange={store.handleInput}
          className={`${className || ''}${thisItem.className}`}
          value={thisItem.value}
        />

        <div className={store.state.invalidFeedbackClassName}>{thisItem.invalidFeedback}</div>
      </React.Fragment>
    )
  }
}

class Select extends React.Component {
  render () {
    const { store, children, ...otherProps } = this.props

    return (
      <select {...otherProps} onChange={store.handleInput}>
        {children}
      </select>
    )
  }
}

const connectProvider = (Component) => {
  return (props) => (
    <Provider>
      <Context.Consumer>
        {(store) => <Component {...props} store={store} />}
      </Context.Consumer>
    </Provider>
  )
}

const connectConsumer = (Component) => {
  return (props) => (
    <Context.Consumer>
      {(store) => <Component {...props} store={store} />}
    </Context.Consumer>
  )
}

module.exports.Form = connectProvider(Form)
module.exports.Input = connectConsumer(Input)
module.exports.Select = connectConsumer(Select)
