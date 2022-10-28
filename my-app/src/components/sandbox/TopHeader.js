import React from 'react'
import { useLocation, NavLink} from "react-router-dom";
import { Layout, Dropdown, Menu, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';

import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
  } from '@ant-design/icons';


const { Header} = Layout;

const withRouter = Component => props => {
  const location = useLocation();
  return <Component {...props} location={location} />;
};


function TopHeader(props) {
  // console.log(props)

    function changeCollapsed() {
      props.changeCollapsed()
    }
    const {role:{roleName},username}  = JSON.parse(localStorage.getItem("token"))
    const menu = (
      <Menu>
          <Menu.Item key="1">{roleName}</Menu.Item>
          <Menu.Item danger key="2"><NavLink to="/login" onClick={() => {
            localStorage.removeItem("token")}}>Exit</NavLink></Menu.Item>
      </Menu>
  );
  return (
    <Header className="site-layout-background" style={{ padding: "0 16px" }}>
        {/* {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: 'trigger',
        onClick: () => setCollapsed(!collapsed),
        })} */}
        
        {
        props.isCollapsed?<MenuUnfoldOutlined onClick={changeCollapsed}/>: <MenuFoldOutlined onClick={changeCollapsed}/>
        }

        <div style={{float:"right"}}>
          <span>Welcome <span style={{color:'#1890ff'}}>{username}</span> !  </span>
          <Dropdown overlay={menu}>
            <a onClick={(e) => e.preventDefault()}>
            <Avatar size="large" icon={<UserOutlined />} />
            </a>
          </Dropdown>
        </div>
    </Header>
    
  )
}

const mapStateToProps = ({CollapsedReducer:{isCollapsed}}) =>{
  // console.log(state);
  return {
    isCollapsed
  }
}

const mapDispatchToProps = {
  changeCollapsed(){
    return {
      type: "change_collapsed"
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TopHeader));