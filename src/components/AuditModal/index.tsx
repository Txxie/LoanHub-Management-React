import React, { useState } from 'react';
import {
    borrowUpdate,
} from "@/api";
import { BORROW_STATUS } from "@/constants";
import {
    Modal,
    message,
    Input,
    Button,
    Form,
} from "antd";
import { BorrowType } from "@/types";
import { ExclamationCircleFilled } from "@ant-design/icons";


const AuditModal = ({ modalVisible, record, fetchData, form }) => {
    const [modalForm] = Form.useForm();
    // const [reason, setReason] = useState(""); // 用于存储输入框的内容
    const [visible, setVisible] = useState(modalVisible); // 用于控制模态框的显示与隐藏

    console.log("modalVisible, record, fetchData", modalVisible, record, fetchData);

    // const handleOk = async () => {
    //     await borrowUpdate(record?.id, { record?.item, record?.user, status: BORROW_STATUS.ON });
    //     message.success("同意借用");
    //     fetchData(form.getFieldsValue());
    //     setVisible(false);
    // };
    const handleOk = async () => {
        const borrowData = {
            item: record?.item,
            user: record?.user,
            status: BORROW_STATUS.ON
        };
        await borrowUpdate(record?._id, borrowData);
        message.success("审批成功");
        fetchData(form.getFieldsValue());
        setVisible(false);
    };

    const handleCancel = async () => {
        const borrowData = {
            item: record?.item,
            user: record?.user,
            status: BORROW_STATUS.REJECTED
        };
        if (!modalForm.getFieldValue('reason')) {
            message.error("请填写拒绝原因");
            return;
        }
        await borrowUpdate(record?._id, { ...borrowData, reason: modalForm.getFieldValue('reason') }); // 将输入框内容一并传递给 borrowUpdate 函数
        message.success("审批成功");
        fetchData(form.getFieldsValue());
        setVisible(false);
    };

    return (
        <Modal
            title="审批借用申请"
            icon={<ExclamationCircleFilled />}
            okText="同意"
            cancelText="拒绝"
            visible={visible}
            // onOk={handleOk}
            onCancel={() => setVisible(false)}
            footer={[
                <Button key="reject" onClick={handleCancel}>
                    拒绝
                </Button>,
                <Button key="confirm" type="primary" onClick={handleOk}>
                    同意
                </Button>,
            ]}
        >
            <Form form={modalForm}>
                <Form.Item
                    name="reason"
                    rules={[{ required: true, message: '请输入拒绝原因' }]}
                >
                    <Input.TextArea
                        placeholder="如审批拒绝，请输入拒绝原因"
                        style={{ marginBottom: "16px", height: "50px" }}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AuditModal;
