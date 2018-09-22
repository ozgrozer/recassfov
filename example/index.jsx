import React from 'react'
import ReactDOM from 'react-dom'

import { Form, Input, Select, Textarea } from './../src/Recassfov'

const validations = {
  username: [
    {
      rule: 'isLength',
      args: { min: 4, max: 32 },
      invalidFeedback: 'please provide a username (min: 4, max: 32)'
    }
  ],
  email: [
    {
      rule: 'isEmail',
      invalidFeedback: 'please provide a valid email'
    }
  ],
  password: [
    {
      rule: 'isLength',
      args: { min: 4, max: 32 },
      invalidFeedback: 'please provide a password (min: 4, max: 32)'
    }
  ],
  number: [
    {
      rule: 'isInt',
      args: { gt: 10, lt: 100 },
      invalidFeedback: 'please provide a number between 10-100'
    },
    {
      rule: 'isLength',
      args: { min: 1 },
      invalidFeedback: 'please provide at least one character'
    }
  ],
  yesOrNo: [
    {
      rule: 'isLength',
      args: { min: 1 },
      invalidFeedback: 'please select an option'
    }
  ],
  message: [
    {
      rule: 'isLength',
      args: { min: 1 },
      invalidFeedback: 'please provide a message'
    }
  ]
}

class App extends React.Component {
  constructor () {
    super()
    this.state = {
      yesOrNo: 'yes',
      username: 'john',
      usernameValidation: validations.username
    }

    const func = () => {
      this.setState({
        yesOrNo: 'no',
        usernameValidation: [
          {
            rule: 'isLength',
            args: { min: 5, max: 40 },
            invalidFeedback: 'please provide a username (min: 5, max: 40)'
          }
        ]
      })
    }
    setTimeout(func.bind(this), 2000)
  }

  onSubmit () {
    console.log('onSubmit')
  }

  validFormBeforePost (res) {
    console.log('validFormBeforePost')
    console.log(res.formItems)
  }

  invalidFormBeforePost (res) {
    console.log('invalidFormBeforePost')
    console.log(res.formItems)
    console.log(this.state)
  }

  validFormAfterPost (res) {
    console.log('validFormAfterPost')
    console.log(res.formItems)
    console.log(res.ajaxResult)
    res.cleanFormItems()
  }

  invalidFormAfterPost (res) {
    console.log('invalidFormAfterPost')
    console.log(res.formItems)
    console.log(res.ajaxResult)
  }

  handleInput (e) {
    const value = e.target.value
    this.setState({ username: value })
    console.log('handleInput', value)
  }

  handleSelect (e) {
    const value = e.target.value
    this.setState({ yesOrNo: value, username: '2' })
    console.log('handleSelect', value)
  }

  render () {
    return (
      <Form
        onSubmit={this.onSubmit}
        validFormBeforePost={this.validFormBeforePost}
        invalidFormBeforePost={this.invalidFormBeforePost.bind(this)}
        validFormAfterPost={this.validFormAfterPost}
        invalidFormAfterPost={this.invalidFormAfterPost}
        postUrl='https://runkit.io/ozgrozer/recassfov-backend-demo/branches/master/signup'
        classNames={{
          invalidInput: 'is-invalid',
          invalidFeedback: 'invalid-feedback'
        }}
        >
        <h2>demo form</h2>

        <ul>
          <li>type "john" into username to see backend error</li>
          <li>watch for console</li>
        </ul>

        <div>
          <Input
            type='text'
            name='username'
            placeholder='username'
            value={this.state.username}
            onChange={this.handleInput.bind(this)}
            validations={this.state.usernameValidation} />
        </div>

        <div>
          <Input
            type='email'
            name='email'
            placeholder='email'
            validations={validations.email} />
        </div>

        <div>
          <Input
            type='password'
            name='password'
            placeholder='password'
            validations={validations.password} />
        </div>

        <div>
          <Input
            type='number'
            name='number'
            placeholder='number'
            validations={validations.number} />
        </div>

        <div>
          <Select
            name='yesOrNo'
            value={this.state.yesOrNo}
            onChange={this.handleSelect.bind(this)}
            validations={validations.yesOrNo}>
            <option value=''>select</option>
            <option value='yes'>yes</option>
            <option value='no'>no</option>
          </Select>
        </div>

        <div>
          <Textarea
            name='message'
            placeholder='message'
            validations={validations.message} />
        </div>

        <div>
          <input type='submit' value='submit' />
        </div>
      </Form>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
