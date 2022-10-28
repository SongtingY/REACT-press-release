import { Button } from 'antd';
import React from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import UsePublish from '../../../components/publish-manage/UsePublish'

export default function PublishSunset() {
  const {dataSource, handleDelete} = UsePublish(3);

  return (
    <div>
      <NewsPublish dataSource={dataSource} button={(id) => <Button danger onClick={()=>handleDelete(id)}>Delete</Button>} ></NewsPublish>
    </div>
  )
}

