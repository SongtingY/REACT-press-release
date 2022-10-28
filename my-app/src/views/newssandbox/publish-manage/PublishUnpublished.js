import { Button } from 'antd';
import React from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import UsePublish from '../../../components/publish-manage/UsePublish'

export default function PublishUnpublished() {
  const {dataSource, handlePublish} = UsePublish(1);

  return (
    <div>
      <NewsPublish dataSource={dataSource} button={(id) => <Button  type="primary" onClick={()=>handlePublish(id)}>Publish</Button>} ></NewsPublish>
    </div>
  )
}

