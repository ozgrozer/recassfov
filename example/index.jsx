import React from 'react'
import ReactDOM from 'react-dom'

import { Form, Input } from './../src/Recassfov'

class App extends React.Component {
  render () {
    const validations = {
      email: [
        {
          rule: 'isLength',
          args: {min: 1},
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
          args: {min: 1},
          invalidFeedback: 'please provide a password'
        }
      ]
    }

    return (
      <Form>
        <div>
          <Input
            type='text'
            name='email'
            placeholder='email'
            className='test test2'
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
          <div className='valid-feedback'>valid</div>
        </div>

        <div>
          <input type='submit' value='submit' />
        </div>
      </Form>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
