import React from 'react'
import { Flex, Col, Row, Form, Input, Select, Button, message } from 'antd'
import { addNewUser } from '../APi';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

const { TextArea } = Input;

const user = {
    created_time: new Date(),
    description: "Usertest1",
    email: "test@gmail.com",
    image: "",
    password: "",
    purchase_ordered: 0,
    role: "",
    status: "0",
    uid: "",
    updated_time: new Date(),
    username: "usertest",
}


function AddUserPage() {
    const [form] = Form.useForm();
    const today = new Date();
    const onFinish = async (values) => {
        console.log(values);
        user.email = values.email
        user.password = values.password
        user.username = values.username
        user.role = values.role
        user.description = values.description
        user.created_time = today
        user.updated_time = today
        const result = await addNewUser(user)
        if (result === true) {
            message.success('Thêm người dùng thành công')
        }
        else {
            message.error('Thêm thất bại')
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error('Hãy điền đầy đủ các trường')
    };
    const handleCancel = () => {
        form.resetFields();
        message.info('Hủy thành công')
    };
    return (
        <Flex
            gap={10}
            vertical
        >
            <Row>
                <Col
                    span={24}
                    style={{
                        textAlign: 'center',
                        fontSize: 24,
                        fontWeight: 'bold'
                    }}
                >Thêm mới người dùng</Col>
            </Row>
            <Form
                form={form}
                layout='vertical'
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                initialValues={{
                    role: {
                        value: 'USER',
                        label: 'Người dùng'
                    }
                }}
            >
                <Row>
                    <Col span={10}>
                        <Form.Item
                            name="email"
                            label="Email:"
                            rules={[
                                {
                                    required: true,
                                    message: 'Email không được để trống'
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                    </Col>
                    <Col span={10}>
                        <Form.Item
                            name="username"
                            label="Username:"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={10}>
                        <Form.Item
                            name="password"
                            label="Mật khẩu: "
                            rules={[
                                {
                                    required: true,
                                    message: 'Mật khẩu không được để trống'
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                    </Col>
                    <Col span={10}>
                        <Form.Item
                            name="role"
                            label="Vai trò:"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vai trò không được để trống'
                                },
                            ]}
                        >
                            <Select

                                options={[
                                    {
                                        value: 'USER',
                                        label: 'Người dùng'
                                    },
                                    {
                                        value: 'MANAGER',
                                        label: 'Nhân viên'
                                    },
                                    {
                                        value: 'ADMIN',
                                        label: 'Admin'
                                    },
                                ]}
                            >
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col
                        span={24}
                    >
                        <Form.Item
                            name="description"
                            label="Mô tả: "
                        >
                            <Input.TextArea
                                showCount
                                maxLength={300}
                                style={{ height: 120, resize: 'none' }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col
                        span={8}
                    >
                    </Col>
                    <Col
                        span={8}
                    >
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Thêm người dùng
                            </Button>
                            <Button
                                type="text"
                                danger
                                style={{
                                    marginLeft: 10
                                }}
                                onClick={handleCancel}
                            >
                                Hủy
                            </Button>
                        </Form.Item>
                    </Col>
                    <Col
                        span={8}
                    >
                    </Col>
                </Row>
            </Form>
        </Flex>
    )
}

export default AddUserPage

