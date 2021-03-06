import React from 'react';
import ReactDOM from 'react-dom';
import Main from '../main/Main'
import {POSTRquest} from '../utils/httpRequest'
import {Button, Form, Icon, Input, Checkbox, Modal} from 'antd';
import '../css/LoginPage.css';
import 'antd/dist/antd.css'; 
import sha1 from 'js-sha1';
import GoogleLogin from 'react-google-login';
import Constants from '../Constants';
import user from '../objects/user';

class LoginInfo{
    static values = "";
};

function loginFeedback(str){
    
    if(str['stateCode'] === 0){
        
        user.setState(1);
        user.username = str['info'];
        console.log(user.name);
        ReactDOM.render(<Main />, document.getElementById('root'));
    }
}


class LoginForm extends React.Component{
    
    handleSubmit = e =>{
        e.preventDefault();
        this.props.form.validateFields((err, values) =>{
            if(!err){
                values['password'] = window.btoa(sha1(values['password']));
                LoginInfo.values = values;
                var data = {
                    name: values['username'],
                    pwd:  values['password'],
                    email: values['email']
                }
                var url = Constants.userConstants['login_url'];
                console.log(url);
                POSTRquest(url, data, loginFeedback);
                console.log('Received values of form: ', values);
            }
        });
    };

    render(){
        const { getFieldDecorator } = this.props.form;
        const element =  (
        <Form onSubmit={this.handleSubmit} id="login-form">
            <Form.Item>
            {getFieldDecorator('username', {
                rules: [{ required: true, message: 'Please input your username!' }],
            })(
                <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Username"
                />,
            )}
            </Form.Item>
            <Form.Item>
            {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
            })(
                <Input.Password
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="Password"
                />,
            )}
            </Form.Item>
            <Form.Item>
            {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
            })(<Checkbox>Remember me</Checkbox>)}
            <a id="login-form-forgot" href="">
                Forgot password
            </a>
            <br></br>
            <Button type="primary" htmlType="submit" id="login-form-button">
                Log in
            </Button>
            </Form.Item>
        </Form>
        );
        return element;
    }
}

export default class LoginPage extends React.Component{
    state = {
        ModalText: 'Content of the modal',
        visible: false,
        confirmLoading: false,
    };

    showModal = () =>{
        this.setState({
            visible:true,
        });
    };

    handleOk = () =>{
        this.setState({
            ModalText: 'The modal will be closed after two seconds',
            confirmLoading: true,
        });
        setTimeout(()=>{
            this.setState({
            visible: false,
            confirmLoading: false,
            });
        }, 2000);
    };

    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
          visible: false,
        });
    };
    
    render() {
        const { visible, confirmLoading, ModalText } = this.state;
        const WrappedNormalLoginForm = Form.create({ name: 'Login_Form' })(LoginForm);
        const responseGoogle = (response) => {
            console.log(response);
          }
        const onSuccess = response => console.log(response);
        const onFailure = response => console.error(response);
        return (
          <span style={{paddingRight:"20px"}}>
            <Button type="default" ghost onClick={this.showModal}>
              Sign in
            </Button>
            <Modal
              title="Log in"
              width="360px"
              visible={visible}
              onOk={this.handleOk}
              confirmLoading={confirmLoading}
              onCancel={this.handleCancel}
              style={{border: "0px white"}}
              footer={<div style={{textAlign: "right"}}>
                  <img src={Constants.pictureUrl['login-banner']} style={{width:"80%"}}></img>
                    <GoogleLogin
                        clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
                        render={renderProps => (
                            <Button id="sign-with-google"></Button>
                        )}
                        buttonText="Login"
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        cookiePolicy={'single_host_origin'}
                    />
                    
                        </div>
                        }
            >
            <WrappedNormalLoginForm/>
            </Modal>
          </span>
        );
      }
}
