import React from 'react'
import ReactDOM from 'react-dom'

import { Form, Input } from './../src/Recassfov'

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
  ]
}

class App extends React.Component {
  validForm (formItems) {
    console.log('validForm')
    console.log(formItems)
  }

  invalidForm () {
    console.log('invalidForm')
  }

  render () {
    return (
      <Form
        validForm={this.validForm.bind(this)}
        invalidForm={this.invalidForm.bind(this)}
        postUrl='https://runkit.io/ozgrozer/recassfov-backend-demo/branches/master/signup'
      >
        <h2>Sign up</h2>

        <div>
          <Input
            type='text'
            name='username'
            placeholder='username'
            value='john'
            validations={validations.username}
          />
        </div>

        <div>
          <Input
            type='email'
            name='email'
            placeholder='email'
            value='john@doe.com'
            validations={validations.email}
          />
        </div>

        <div>
          <Input
            type='password'
            name='password'
            placeholder='password'
            value='1234'
            validations={validations.password}
          />
        </div>

        <div>
          <Input
            type='checkbox'
            name='rememberMe'
            placeholder='remember me'
          />
        </div>

        <div>
          <input type='submit' value='submit' />
        </div>
      </Form>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
