import { borrowAdd, borrowUpdate, getItemList, getUserList } from "@/api";
import { ItemType, BorrowOptionType, BorrowType, UserType } from "@/types";
import { Button, Form, Select, message, Input } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Content from "../Content";
import styles from "./index.module.css";

const BorrowForm: React.FC<any> = ({ title, editData }) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [userList, setUserList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [itemStock, setItemStock] = useState(0);
  const [isChange, setIsChange] = useState(false);

  useEffect(() => {
    getUserList().then((res) => {
      setUserList(res.data);
    });
    getItemList({ all: true }).then((res) => {
      setItemList(res.data);
    });
  }, []);

  useEffect(() => {
    form.setFieldsValue(editData);
  }, [editData, form]);

  const handleFinish = async (values: BorrowType) => {
    try {
      if (editData?._id) {
        await borrowUpdate(editData._id, values);
        message.success("编辑成功");
      } else {
        await borrowAdd(values);
        message.success("创建成功");
      }
      router.push("/borrow");
    } catch (error) {
      console.error(error);
    }
  };

  const handleItemChange = (
    value: string,
    option: BorrowOptionType | BorrowOptionType[]
  ) => {
    setIsChange(true);
    setItemStock((option as BorrowOptionType).stock);
  };

  return (
    <Content title={title}>
      <Form
        className={styles.form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        form={form}
        onFinish={handleFinish}
        autoComplete="off"
      >
        <Form.Item
          label="物品名称"
          name="item"
          rules={[
            {
              required: true,
              message: "请输入物品名称",
            },
          ]}
        >
          <Select
            placeholder="请选择"
            showSearch
            optionFilterProp="label"
            onChange={handleItemChange}
            options={itemList?.map((item: ItemType) => ({
              label: item.name,
              value: item._id as string,
              stock: item.stock,
            }))}
          />
        </Form.Item>
        <Form.Item
          label="借用用户"
          name="user"
          rules={[
            {
              required: true,
              message: "请输入名称或学号",
            },
          ]}
        >
          {/* <Input placeholder="请输入学号" allowClear /> */}
          <Select
            placeholder="请选择"
            showSearch
            optionFilterProp="label"
            onChange={() => setIsChange(true)}
            options={userList?.map((item: UserType) => ({
              label: item.name,
              value: item._id,
            }))}
          />
        </Form.Item>
        <Form.Item
          label="物品库存"
          rules={[
            {
              required: true,
              message: "请输入物品名称",
            },
          ]}
        >
          {itemStock}
        </Form.Item>
        <Form.Item label=" " colon={false}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className={styles.btn}
            // 库存<=0并且不是编辑模式，不能点击
            disabled={(itemStock <= 0 && !editData?._id) || (isChange === false)}
          >
            {editData?._id ? "编辑" : "创建"}
          </Button>
        </Form.Item>
      </Form>
    </Content>
  );
};

export default BorrowForm;
