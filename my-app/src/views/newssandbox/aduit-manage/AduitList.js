import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import {Table, Button, Tag, notification} from 'antd'

export default function AduitList() {
  const navigate = useNavigate();
  const {username} = JSON.parse(localStorage.getItem("token"))
  const [dataSource, setDataSource] = useState([])
  useEffect(()=>{
    if (username == "admin"){
      axios(`/news?auditState_ne=0&publishState_lte=1&_expand=category`).then(res=>{
        setDataSource(res.data)
      })
    }else{
      axios(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res=>{
        setDataSource(res.data)
      })
    }
  },[username])
  const handleRevert = (item) =>{
    setDataSource(dataSource.filter(data=>data.id !== item.id))
    axios.patch(`/news/${item.id}`,{
      auditState:0
    }).then(res=>{
      notification.info({
        message: `notification`,
        description:
          `You can go to draft to check your news`,
        placement:"bottomRight"
      });
    })
  };
  const handleUpdate = (item) =>{
    navigate(`/news-manage/update/${item.id}`)
  }
  const handlePublish = (item) =>{ 
    axios.patch(`/news/${item.id}`,{
      publishState: 2
    }).then(res=>{
      navigate('/publish-manage/published')
      notification.info({
        message: `notification`,
        description:
          `You can go to publish-management/published to check your news`,
        placement:"bottomRight"
      });
    })
  }

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
      title: 'News Category',
      dataIndex: 'category',
      render: (category)=>{
        return <div>{category.title}</div>
      }
    },
    {
      title: 'Audit State',
      dataIndex: 'auditState',
      render: (auditState)=>{
        const colorList = ["","orange","green","red"];
        const auditList = ["","Reviewing","Passed","Failed"]
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
      }
    },
    {
      title: "Operation",
      render:(item)=>{
        return <div>
          {
            item.auditState===1 && <Button onClick={()=>handleRevert(item)}> Revert </Button>
          }
          {
            item.auditState===2 && <Button danger onClick={()=>handlePublish(item)}> Publish </Button>
          }     
          
          {
            item.auditState===3 && <Button type="primary" onClick={()=>handleUpdate(item)}> Update </Button>  
          }  
      </div>
      }
    }]
    
  
  return (
    <Table dataSource={dataSource} columns={columns} pagination={{pageSize:5}} rowKey={(item)=>item.id}/>
  )
}
