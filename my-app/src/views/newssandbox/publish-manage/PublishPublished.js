import { Button } from 'antd';
import React from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import UsePublish from '../../../components/publish-manage/UsePublish'

export default function PublishPublished() {
  const {dataSource, handleSunset} = UsePublish(2);

  return (
    <div>
      <NewsPublish dataSource={dataSource} button={(id) => <Button danger onClick={()=>handleSunset(id)}>Offline</Button>} ></NewsPublish>
    </div>
  )
}
