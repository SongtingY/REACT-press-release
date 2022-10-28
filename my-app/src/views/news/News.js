import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { PageHeader, Row, Card, Col, List } from 'antd'
import _ from "lodash"

export default function News() {
    const [dataSource, setDataSource] = useState([])
    useEffect(()=>{
        axios.get("/news?publishState=2&_expand=category").then(res=>{
            setDataSource(Object.entries(_.groupBy(res.data, item => item.category.title)));
        })
    },[])
  return (
    <div style={{width:"95%", margin:"auto"}}>
    <PageHeader
    className="site-page-header"
    title="Global News"
    subTitle="Detail list"
  />
    <div className="site-card-wrapper">
        <Row gutter={[16,16]}>
        {
            dataSource.map(item =>  
            <Col span={8} key={item[0]}>
            <Card title={item[0]} bordered={true} hoverable={true}>
            <List
                size="small"
                dataSource={item[1]}
                pagination = {{pageSize:2}}
                renderItem={(data) => <List.Item><a href={`#/detail/${data.id}`}>{data.title}</a></List.Item>}
            />
            </Card>
        </Col>)
        }
       
        </Row>
    </div>
    </div>
  )
}
