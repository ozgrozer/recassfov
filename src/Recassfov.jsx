import React from 'react'
import validator from 'validator'
import axios from 'axios'

const objectToUrlEncoded = (element, key, list) => {
  list = list || []
  if (typeof element === 'object') {
    for (let idx in element) {
      objectToUrlEncoded(element[idx], key ? key + '[' + idx + ']' : idx, list)
    }
  } else {
    list.push(key + '=' + encodeURIComponent(element))
  }
  return list.join('&')
}

const Context = React.createContext()

class Provider extends React.Component {
  constructor () {
    super()
    this.state = {
      formItems: {},
      totalValidations: 0
    }
  }

  setFormItem (item) {
    const formItems = this.state.formItems

    formItems[item.name] = {
      value: item.value || '',
      validations: item.validations || [],
      invalidFeedback: item.validations[0].invalidFeedback || '',
      className: ''
    }

    this.setState({ formItems })

    this.setState((prevState) => ({
      totalValidations: prevState.totalValidations + item.validations.length
    }))
  }

  handleInput (e) {
    const item = e.target
    const formItems = this.state.formItems

    if (item.type === 'checkbox') {
      formItems[item.name].value = !this.state.formItems[item.name]
    } else {
      formItems[item.name].value = item.value
    }

    this.setState({ formItems })
  }

  onSubmit (onSubmit, validForm, invalidForm, postUrl, e) {
    e.preventDefault()

    if (onSubmit) onSubmit()

    const formItems = this.state.formItems

    let howManyOfFormItemsAreValidated = 0

    Object.keys(formItems).map((itemName) => {
      const item = formItems[itemName]

      item.validations.map((validation) => {
        const validate = validator[validation.rule](item.value, validation.args)

        if (validate) howManyOfFormItemsAreValidated++

        item.className = validate ? '' : ' is-invalid'
      })
    })

    this.setState({ formItems })

    if (howManyOfFormItemsAreValidated === this.state.totalValidations) {
      const _formItems = Object.keys(formItems).reduce((previous, current) => {
        previous[current] = formItems[current].value
        return previous
      }, {})

      if (validForm) validForm(_formItems)

      if (postUrl) {
        axios({
          method: 'post',
          url: postUrl,
          data: objectToUrlEncoded(_formItems),
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          }
        })
          .then((res) => {
            const validations = res.data.validations

            if (Object.keys(validations).length) {
              Object.keys(validations).map((itemName) => {
                formItems[itemName].invalidFeedback = validations[itemName]
                formItems[itemName].className = ' is-invalid'
              })

              this.setState({ formItems })
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    } else {
      if (invalidForm) invalidForm()
    }
  }

  render () {
    const store = {
      state: this.state,
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
  render () {
    return (
      <form
        noValidate
        onSubmit={
          this.props.store.onSubmit.bind(
            this,
            this.props.onSubmit,
            this.props.validForm,
            this.props.invalidForm,
            this.props.postUrl
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
    const { validations, store, className, ...otherProps } = this.props
    const thisItem = store.state.formItems[this.props.name]

    return (
      <React.Fragment>
        <input
          {...otherProps}
          onChange={store.handleInput.bind(this)}
          className={`${className || ''}${thisItem.className}`}
          value={thisItem.value}
        />

        <div className='invalid-feedback'>{thisItem.invalidFeedback}</div>
      </React.Fragment>
    )
  }
}

class Select extends React.Component {
  render () {
    return (
      <select {...this.props} onChange={this.props.store.handleInput}>
        {this.props.children}
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
