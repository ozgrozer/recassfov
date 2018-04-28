import React from 'react'
import validator from 'validator'

const Context = React.createContext()

class Provider extends React.Component {
  constructor () {
    super()
    this.state = {
      values: {}
    }
  }

  setFormItem (item) {
    const values = this.state.values
    values[item.name] = {
      value: item.value || '',
      validations: item.validations || [],
      invalidFeedback: item.validations[0].invalidFeedback,
      className: ''
    }
    this.setState({ values })
  }

  handleInput (e) {
    const item = e.target
    const values = this.state.values

    if (item.type === 'checkbox') {
      values[item.name].value = !this.state.values[item.name]
    } else {
      values[item.name].value = item.value
    }
    this.setState({ values })
  }

  handleForm (e) {
    e.preventDefault()

    const values = this.state.values
    Object.keys(values).map((itemName) => {
      const item = values[itemName]

      item.validations.map((validation) => {
        const validate = validator[validation.rule](item.value, validation.args)
        item.className = validate ? '' : ' is-invalid'
        console.log(itemName, item.value, validation.rule, validate)
      })
    })
    this.setState({ values })
  }

  render () {
    const store = {
      state: this.state,
      setFormItem: this.setFormItem.bind(this),
      handleInput: this.handleInput.bind(this),
      handleForm: this.handleForm.bind(this)
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
        onSubmit={this.props.store.handleForm}
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
    const thisItem = store.state.values[this.props.name]

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
        {(store) => {
          return <Component {...props} store={store} />
        }}
      </Context.Consumer>
    </Provider>
  )
}

const connectConsumer = (Component) => {
  return (props) => (
    <Context.Consumer>
      {(store) => {
        return <Component {...props} store={store} />
      }}
    </Context.Consumer>
  )
}

module.exports.Form = connectProvider(Form)
module.exports.Input = connectConsumer(Input)
module.exports.Select = connectConsumer(Select)
