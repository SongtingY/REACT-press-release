import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { Table, Button, notification } from 'antd'

export default function NewsAduit() {
  const {roleId, region, username} = JSON.parse(localStorage.getItem("token"))
  const [dataSource, setdataSource] = useState([])
  useEffect(()=>{
    axios.get(`/news?auditState=1&_expand=category`).then(res => {
      const list = res.data
      setdataSource(roleId == 1?list:[
          ...list.filter(item=> item.author == username),
          ...list.filter(item=> item.region == region && item.roleId == 3)
          // filter the editor and without the admin and 区域管理员
      ])
  })},[roleId, region, username])

  // 通过修改input来获得不同结果
  const handleAudit = (item, auditState, publishState) =>{
    setdataSource(dataSource.filter(data=>data.id !== item.id))
    axios.patch(`/news/${item.id}`,{
      auditState,
      publishState
    }).then(res=>{
      notification.info({
        message: `notification`,
        description:
          `You can go to review/review-list to check your news`,
        placement:"bottomRight"
      });
    })
  };
  const columns = [
    {
      title: 'News Title',
      dataIndex: 'title',
      render:(title,item) =>{
        return <a href={`#/news-manage/preview/${item.id}`} >{title}</a>
      }
    },
    {
      title: 'Author',
      dataIndex: 'author',
    },
    {
      title: "Operation",
      render:(item)=>{
        return <div>
          <Button type="primary" onClick={()=>handleAudit(item,2,1)}> Pass </Button>
          <Button danger onClick={()=>handleAudit(item,3,0)}> Reject </Button>
      </div>
      }
    }]
    
  return (
    <Table dataSource={dataSource} columns={columns}
                pagination={{
                    pageSize: 5
                }}
                rowKey={item => item.id}
            />

  )
}
