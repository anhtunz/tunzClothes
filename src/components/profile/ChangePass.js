import React, { useState } from 'react'
import { Col, Row, Flex, Avatar, Button, Form, Input, Space } from 'antd';
import { useNavigate } from 'react-router';
import { changeUserPassword } from '../../APi';
function ChangePass() {
    const navigate = useNavigate();
    const SubmitButton = ({ form, children }) => {
        const [submittable, setSubmittable] = React.useState(false);

        const values = Form.useWatch([], form);
        React.useEffect(() => {
            form
                .validateFields({
                    validateOnly: true,
                })
                .then(() => setSubmittable(true))
                .catch(() => setSubmittable(false));
        }, [form, values]);
        return (
            <Button type="primary" htmlType="submit" disabled={!submittable}>
                {children}
            </Button>
        );
    };
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        // values là object chứa các giá trị từ form khi gửi
        console.log('Received values:', values.newPassword);
        // Thực hiện xử lý các giá trị như bạn cần
        const confirm = await changeUserPassword(values.newPassword)
        if (confirm === true) {
            navigate('/login')
        }
    };
    const confirmPassValidator = (_, value) => {
        const newPassword = form.getFieldValue('newPassword');
        if (value && value !== newPassword) {
            return Promise.reject(new Error('Mật khẩu không khớp'));
        }
        return Promise.resolve();
    };
    return (
        <>
            <Flex justify="space-between" vertical gap={10} style={{ width: '100%' }}>
                <strong style={{ textAlign: 'center', fontSize: '20px' }}>Đổi mật khẩu</strong>
                <Form
                    form={form}
                    name="validateOnly"
                    layout="vertical"
                    autoComplete="off"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="newPassword"
                        label="Mật khẩu mới"
                        rules={[
                            {
                                message: 'Trường này không được để trống',
                                required: true,
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="confirmPass"
                        label="Xác nhận mật khẩu: "
                        rules={[
                            {
                                message: 'Trường này không được để trống',
                                required: true,
                            },
                            {
                                validator: confirmPassValidator,
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <SubmitButton form={form}>Đổi mật khẩu</SubmitButton>
                            <Button htmlType="reset">Hủy</Button>
                        </Space>
                    </Form.Item>
                </Form>

            </Flex>
        </>
    )
}

export default ChangePass