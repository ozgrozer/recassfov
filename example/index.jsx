import React from 'react'
import ReactDOM from 'react-dom'

import { Form, Input } from './../src/Recassfov'

class App extends React.Component {
  render () {
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
          rule: 'isLength',
          args: { min: 1 },
          invalidFeedback: 'please provide an email'
        },
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

    return (
      <Form>
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
