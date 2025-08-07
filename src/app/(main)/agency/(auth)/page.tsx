import React from 'react'

const page = (params:{params: {id: string}}) => {
  return (
    <div>page {params.params.id}</div>
  )
}

export default page