import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import {Button, Table, Tag, Modal, Form, Input} from 'antd'
import {DeleteOutlined, ExclamationCircleOutlined} from "@ant-design/icons";

const EditableContext = React.createContext(null);
const {confirm} = Modal;



export default function NewsCategory() {
  const [dataSource, setDataSource] = useState([]);
  useEffect(()=>{
    axios.get("/categories").then(res =>{
      const list = res.data;
      setDataSource(list)})
  },[]);

  const handleSave = (record) => {
    setDataSource(dataSource.map(item=>{
      if (item.id == record.id){
        return {
          id:item.id,
          title: record.title,
          value: record.title
        }
      }
      return item
    }))
    axios.patch(`/categories/${record.id}`,{
      title: record.title,
      value: record.title
    })
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: id => <b>{id}</b>
    },
    {
      title: 'Title',
      dataIndex: 'title',
      onCell: (record) => ({
        record,
        editable: true,
        title: 'Title',
        dataIndex: 'title',
        handleSave: handleSave,
      }),
    },
      {
        title: "Operation",
        render:(item)=>{
          return <div>
          {/* delete */}
          <Button danger shape="circle" icon={<DeleteOutlined onClick={() => confirmMethod(item)}/>}></Button>    
        </div>
        }
      }
  ];

  const confirmMethod = (item) => {
    confirm({
      title: 'Do you want to delete these items?',
      icon: <ExclamationCircleOutlined />,
      // content: 'Bla bla ...',
      okText: "Delete",
      // cancelText: 'Cancel',
      onOk() {
        deleteRightList(item)
    }
    });
  };

  const deleteRightList = (item) => {
    if (item.grade === 1) {
      // delete the parent one
      axios.delete(`/rights/${item.id}`).then(() => {
          setDataSource(dataSource.filter(data => data.id !== item.id))
      })
  } else {
      // delete the children one
      let list = dataSource.filter(data => data.id === item.rightId)
      //filter
      list[0].children = list[0].children.filter(data => data.id !== item.id)
      axios.delete(`/children/${item.id}`).then(() => {
          setDataSource([...dataSource])
      })

  }
  };
  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };

  
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);
  
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
  
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
  
    let childNode = children;
  
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
  
    return <td {...restProps}>{childNode}</td>;
  };  
  
  
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{pageSize:5}} rowKey={item => item.id} components = {{
    body: {
      row: EditableRow,
      cell: EditableCell
    },}}/>;
    </div>
  )
}
