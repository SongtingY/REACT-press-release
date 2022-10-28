import axios from 'axios'
import { useEffect, useState } from 'react'
import { notification } from 'antd'

export default function UsePublish(type) {
const {username} = JSON.parse(localStorage.getItem("token"))
const [dataSource,setDataSource] = useState([])


  useEffect(()=>{
    axios(`/news?author=${username}&publishState=${type}&_expand=category`).then(res=>{
      setDataSource(res.data)
    })
  })

  const handlePublish = (id) =>{
    setDataSource(dataSource.filter(item => item.id!== id))
    axios.patch(`/news/${id}`,{
        publishState: 2,
        publishTime: Date.now()
      }).then(res=>{
        notification.info({
          message: `notification`,
          description:
            `You can go to Published to check your news`,
          placement:"bottomRight"
        });
      })
  };

  const handleSunset = (id) =>{
    setDataSource(dataSource.filter(item => item.id!== id))
    axios.patch(`/news/${id}`,{
        publishState: 3,
        publishTime: Date.now()
      }).then(res=>{
        notification.info({
          message: `notification`,
          description:
            `You can go to Sunset to check your news`,
          placement:"bottomRight"
        });
      })
};
const handleDelete = (id) =>{
    setDataSource(dataSource.filter(item => item.id!==id))
    axios.delete(`/news/${id}`).then(res=>{
        notification.info({
          message: `notification`,
          description:
            `You have deleted your offline news`,
          placement:"bottomRight"
        });
      })
};
  return (
    {
        dataSource,
        handlePublish,
        handleDelete,
        handleSunset
    }
  )
}
