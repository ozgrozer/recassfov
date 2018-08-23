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
      selectDefaultValue: 'yes'
    }

    const func = () => {
      this.setState({
        selectDefaultValue: 'no'
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

  render () {
    return (
      <Form
        onSubmit={this.onSubmit}
        validFormBeforePost={this.validFormBeforePost}
        invalidFormBeforePost={this.invalidFormBeforePost}
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
            validations={validations.username} />
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
            value={this.state.selectDefaultValue}
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
