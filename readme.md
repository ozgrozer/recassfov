# recassfov

[![npm](https://img.shields.io/npm/v/recassfov.svg?style=flat-square)](https://www.npmjs.com/package/recassfov)
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/ozgrozer/recassfov/blob/master/license)

**Re**act **C**lient **a**nd **S**erver **S**ide **Fo**rm **V**alidation

## Usage

Install library.

```sh
# with yarn
$ yarn add recassfov

# or with npm
$ npm i recassfov
```

Import library.

```jsx
import { Form, Input } from 'recassfov'
```

Create validation rules. ([Validator.js](https://github.com/chriso/validator.js#validators))

```jsx
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
  ]
}
```

Build your form.

```jsx
<Form
  postUrl='http://example.com/post.php'
>
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
    <input type='submit' value='submit' />
  </div>
</Form>
```

## Callbacks

1. validForm()
2. invalidForm()

## Contribution
Feel free to contribute. Open a new [issue](https://github.com/ozgrozer/recassfov/issues), or make a [pull request](https://github.com/ozgrozer/recassfov/pulls).

## License
[MIT](https://github.com/ozgrozer/recassfov/blob/master/license)
