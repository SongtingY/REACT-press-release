import React, {useEffect, useState} from 'react'
import { PageHeader, Descriptions } from 'antd'
import { useParams } from "react-router";
import axios from 'axios';
import moment from 'moment'
import { HeartTwoTone } from '@ant-design/icons';

export default function Detail(props) {
  const params = useParams();
  const [newsInfo, setNewsInfo] = useState(null);

  const handleStar = () => {
    setNewsInfo(
        {
            ...newsInfo,
            star: newsInfo.star+1
        }
    )
    axios.patch(`/news/${params.id}`,{
        // console.log(res.view)
        star: newsInfo.star + 1
    })
  }

  useEffect(() => {
    axios.get(`/news/${params.id}?_expand=category&_expand=role`).then(res=>{
      // console.log(res.data)
      setNewsInfo({
        ...res.data,
        view: res.data.view+1
      })
    //   同步后端
      return res.data
    }).then(res => {
        axios.patch(`/news/${params.id}`,{
            // console.log(res.view)
            view: res.view + 1
        })
    })
  }, [params.id]);
  return (
    <div>
      {
        newsInfo && <div> 
        <div className="site-page-header-ghost-wrapper">
          <PageHeader
            ghost={false}
            onBack={() => window.history.back()}
            title= {newsInfo.title}
            subTitle= {<div>{newsInfo.category.title} <HeartTwoTone twoToneColor="#eb2f96" onClick={()=>handleStar()}/></div>}
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="Created">{newsInfo.author}</Descriptions.Item>
              <Descriptions.Item label="Publish Time">{newsInfo.publishTime?moment(newsInfo.publishTime).format("MM/DD/YYYY HH:mm:ss"):"-"}</Descriptions.Item>
              <Descriptions.Item label="Region">{newsInfo.region}</Descriptions.Item> 
              <Descriptions.Item label="Visits Counts">{newsInfo.view}</Descriptions.Item>
              <Descriptions.Item label="Likes Counts">{newsInfo.star}</Descriptions.Item>
              <Descriptions.Item label="Comments Counts">0</Descriptions.Item>
            </Descriptions>
          </PageHeader>
        </div>
        <div dangerouslySetInnerHTML={{ __html: newsInfo.content }} style={{ margin: "20px 24px", border: "1px solid #ccc" }}>
        </div>
        </div>
      }
    </div>
  )
}
