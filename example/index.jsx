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
  onSubmitValidForm (formItems) {
    console.log('onSubmitValidForm')
    console.log(formItems)
  }

  onSubmitInvalidForm () {
    console.log('onSubmitInvalidForm')
  }

  render () {
    return (
      <Form
        onSubmitValidForm={this.onSubmitValidForm.bind(this)}
        onSubmitInvalidForm={this.onSubmitInvalidForm.bind(this)}
      >
        <h2>Sign up</h2>

        <div>
          <Input
            type='text'
            name='username'
            placeholder='username'
            validations={validations.username}
          />
        </div>

        <div>
          <Input
            type='email'
            name='email'
            placeholder='email'
            validations={validations.email}
          />
        </div>

        <div>
          <Input
            type='password'
            name='password'
            placeholder='password'
            validations={validations.password}
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
