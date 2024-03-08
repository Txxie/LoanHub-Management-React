import { categoryAdd, categoryDelete, categoryUpdate } from "@/api/category";
import { Content } from "@/components";
import { ExclamationCircleFilled } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  TablePaginationConfig,
  Tag,
  message,
} from "antd";
import dayjs from "dayjs";
import qs from "qs";
import { useCallback, useEffect, useState } from "react";

import { CategoryQueryType, CategoryType } from "../../types";
import request from "../../utils/request";
import styles from "./index.module.css";

const Option = Select.Option;

const LEVEL = {
  ONE: "一级",
  TWO: "二级",
};

const LEVEL_OPTION = [
  { label: "一级分类", value: LEVEL.ONE },
  { label: "二级分类", value: LEVEL.TWO },
];

const COLUMNS = [
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
    ellipsis: true,
    width: 300,
  },
  {
    title: "分类级别",
    dataIndex: "level",
    key: "level",
    ellipsis: true,
    width: 200,
    render: (text: string) => (
      <Tag color={text === "一级" ? "green" : "cyan"}>{`${text}分类`}</Tag>
    ),
  },
  {
    title: "所属分类",
    dataIndex: "parent",
    key: "parent",
    ellipsis: true,
    width: 200,
    render: (text: { name: string }) => {
      console.log("所属分类text", text);
      return text?.name ?? "无";
    },
  },
  {
    title: "创建时间",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 200,
    render: (text: string) => dayjs(text).format("YYYY-MM-DD"),
  },
];

export default function Item() {
  // const [form] = Form.useForm();
  const [searchForm] = Form.useForm(); // 用于搜索表单
  const [addEditForm] = Form.useForm(); // 用于添加/编辑表单
  const [isModalOpen, setModalOpen] = useState(false);
  const [list, setList] = useState<CategoryType[]>([]);
  const [total, setTotal] = useState(0);
  const [formLevel, setFormLevel] = useState<string>();
  const [levelOneList, setLevelOneList] = useState<CategoryType[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
  });
  const [editData, setEditData] = useState<Partial<CategoryType>>({});

  const columns = [
    ...COLUMNS,
    {
      title: "操作",
      dataIndex: "",
      key: "action",
      render: (_: any, row: CategoryType) => (
        <Space>
          <Button
            type="link"
            block
            onClick={() => {
              fetchLevelOneData();
              setModalOpen(true);
              setEditData(row);
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            block
            onClick={() => {
              handleDeleteModal(row._id as string);
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const fetchData = useCallback(
    (search?: CategoryQueryType) => {
      const { name, level } = search || {};

      request
        .get(
          `/api/categories?${qs.stringify({
            current: pagination.current,
            pageSize: pagination.pageSize,
            name,
            level,
          })}`
        )
        .then((res) => {
          setList(res.data);
          setTotal(res.total);
        });
    },
    [pagination]
  );

  // 获取所有level=一级分类的分类
  const fetchLevelOneData = useCallback(() => {
    request
      .get(
        `/api/categories?${qs.stringify({
          level: "一级",
          all: true,
        })}`
      )
      .then((res) => {
        setLevelOneList(res.data);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, fetchLevelOneData, pagination]);

  // 在 Modal 打开时初始化添加/编辑表单字段值
  useEffect(() => {
    if (isModalOpen) {
      addEditForm.setFieldsValue(editData || {});
    }
  }, [isModalOpen, editData, addEditForm]);

  const handleEditCategoryFinish = async (values: CategoryType) => {
    // 编辑
    // if (editData._id) {
    //   await categoryUpdate(editData._id, values);
    //   message.success("编辑成功");
    // } else {
    //   await categoryAdd(values);
    //   message.success("创建成功");
    // }
    // fetchData();
    // handleCancel();
    try {
      // 编辑
      if (editData._id) {
        await categoryUpdate(editData._id, values);
        message.success("编辑成功");
        fetchData();
        handleCancel();
      } else {
        // 检查分类是否已存在
        const existingCategory = list.find(category => category.name === values.name);
        if (existingCategory) {
          // 如果分类已存在，则显示提示信息给用户
          message.error("分类已存在，请输入其他分类名称");
        } else {
          // 分类不存在，可以添加
          await categoryAdd(values);
          message.success("创建成功");
          fetchData();
          handleCancel();
        }
      }
    } catch (error) {
      // 处理其他类型的错误
      console.error(error);
      message.error("发生错误，请重试");
    }
  };

  const handleOk = async () => {
    // form.submit();
    addEditForm.submit();
  };

  const handleCancel = () => {
    setEditData({});
    setModalOpen(false);
  };

  const handleDeleteModal = (id: string) => {
    Modal.confirm({
      title: "确认删除？",
      icon: <ExclamationCircleFilled />,
      okText: "确定",
      cancelText: "取消",
      async onOk() {
        await categoryDelete(id);
        message.success("删除成功");
        // fetchData(form.getFieldsValue());
        fetchData(addEditForm.getFieldsValue());
      },
    });
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
  };

  const handleSearchFinish = (values: CategoryQueryType) => {
    fetchData(values);
  };

  const handleCategoryAdd = () => {
    fetchLevelOneData();
    setModalOpen(true);
    setTimeout(() => {
      // form.resetFields();
      addEditForm.resetFields(); // 重置添加/编辑表单字段值
    });
  };

  const handleFormLevelChange = (value: string) => {
    setFormLevel(value);
  };

  return (
    <>
      <Content
        title="分类列表"
        operation={
          <Button type="primary" onClick={handleCategoryAdd}>
            添加
          </Button>
        }
      >
        <Form
          // form={form}
          form={searchForm}
          name="search"
          className={styles.form}
          onFinish={handleSearchFinish}
        >
          <Row gutter={24}>
            <Col span={5}>
              <Form.Item name="name" label="分类名称">
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="level" label="分类级别">
                <Select
                  allowClear
                  placeholder="请选择"
                  options={LEVEL_OPTION}
                ></Select>
              </Form.Item>
            </Col>
            <Col span={9} style={{ textAlign: "left" }}>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
              <Button
                style={{ margin: "0 8px" }}
                onClick={() => {
                  // form.resetFields();
                  searchForm.resetFields();
                }}
              >
                清空
              </Button>
            </Col>
          </Row>
        </Form>
        <div className={styles.tableWrap}>
          <Table
            rowKey="_id"
            dataSource={list}
            columns={columns}
            onChange={handleTableChange}
            pagination={{
              ...pagination,
              total: total,
              showTotal: () => `共 ${total} 条`,
            }}
          />
        </div>
        {isModalOpen && (
          <Modal
            title={editData._id ? "编辑分类" : "创建分类"}
            open={isModalOpen}
            onOk={handleOk}
            okText="确认"
            cancelText="取消"
            onCancel={handleCancel}
          >
            <Form
              name="category"
              // form={form}
              form={addEditForm}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              style={{ maxWidth: 600 }}
              initialValues={editData ? editData : {}}
              onFinish={handleEditCategoryFinish}
              autoComplete="off"
            >
              <Form.Item
                label="名称"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "请输入名称",
                  },
                ]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
              <Form.Item
                label="分类级别"
                name="level"
                rules={[
                  {
                    required: true,
                    message: "请选择级别",
                  },
                ]}
              >
                <Select
                  placeholder="请选择"
                  options={LEVEL_OPTION}
                  onChange={handleFormLevelChange}
                />
              </Form.Item>
              {formLevel === LEVEL.TWO && (
                <Form.Item
                  label="所属分类"
                  name="parent"
                  rules={[
                    {
                      required: true,
                      message: "请选择分类",
                    },
                  ]}
                >
                  <Select placeholder="请选择">
                    {levelOneList?.map((item) => (
                      <Option key={item._id} value={item._id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
            </Form>
          </Modal>
        )}
      </Content>
    </>
  );
}
