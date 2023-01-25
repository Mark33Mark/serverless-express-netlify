import React from 'react'

const App = (props) => {

  const list = props.data.map((user) => {
    return (
      <li>{user.name}</li>
    )
  })

  return (
    <div>
      <h1>
        This is Server Side Rendered React
      </h1>
      {list}
      <a href="/">Home</a>
    </div>
  )
}

export default App
