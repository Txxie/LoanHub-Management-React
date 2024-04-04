import {
  borrowBack,
  borrowUpdate,
  borrowDelete,
  getItemList,
  getBorrowList,
  getCategoryList,
} from "@/api";
import { AuthHoc, Content, Layout, AuditModal } from "@/components";
import { BORROW_STATUS } from "@/constants";
import { ItemType, BorrowQueryType, BorrowType, CategoryType, UserType } from "@/types";
import { useCurrentUser } from "@/utils/hoos";
import { ExclamationCircleFilled } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Select,
  Space,
  Table,
  TablePaginationConfig,
  Tag,
  message,
  Input,
} from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import styles from "./index.module.css";

const Option = Select.Option;

const COLUMNS = [
  {
    title: "物品名称",
    dataIndex: "itemName",
    key: "itemName",
    ellipsis: true,
    width: 300,
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    ellipsis: true,
    width: 100,
    render: (text: string) => {
      if (text === 'on') {
        return <Tag color="orange">借出</Tag>;
      } else if (text === 'off') {
        return <Tag color="green">已还</Tag>;
      } else if (text === 'pending') {
        return <Tag color="blue">待审批</Tag>;
      } else {
        return <Tag color="red">被拒绝</Tag>;
      }
    }
  },
  {
    title: "拒绝原因",
    dataIndex: "reason",
    key: "reason",
    ellipsis: true,
    width: 100,
  },
  {
    title: "物品编码",
    dataIndex: "code",
    key: "code",
    ellipsis: true,
    width: 150,
  },
  {
    title: "借用人",
    dataIndex: "borrowUser",
    key: "borrowUser",
    ellipsis: true,
    width: 150,
  },
  {
    title: "借用时间",
    dataIndex: "borrowAt",
    key: "borrowAt",
    width: 200,
    render: (text: string) => dayjs(text).format("YYYY-MM-DD"),
  },
  {
    title: "归还时间",
    dataIndex: "backAt",
    key: "backAt",
    width: 200,
    render: (text: string) => (text ? dayjs(text).format("YYYY-MM-DD") : "-"),
  },
];

export default function Borrow() {
  const [form] = Form.useForm();
  const [list, setList] = useState<BorrowType[]>([]);
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const [itemList, setItemList] = useState<ItemType[]>([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [record, setRecord] = useState<BorrowType>();
  const router = useRouter();

  const columns = [
    ...COLUMNS,
    {
      title: "操作",
      dataIndex: "",
      key: "action",
      width: "150px",
      render: (_: any, row: BorrowType) => (
        <Space>
          {row.status === BORROW_STATUS.ON ? (
            <Button
              type="link"
              block
              onClick={() => {
                handleBorrowBack(row._id as string);
              }}
            >
              归还
            </Button>
          ) : row.status === BORROW_STATUS.OFF ? (
            null
          ) : (
            row.status === BORROW_STATUS.PENDING && JSON.parse(localStorage.getItem("user") || '{}').role !== 'admin' ? (
              <Button
                type="link"
                block
                onClick={() => {
                  handleDeleteModal(row._id as string);
                }}
              >
                撤销申请
              </Button>
            ) : (
              <AuthHoc>
                <Button
                  type="link"
                  block
                  danger
                  onClick={() => {
                    handleAudit(row);
                  }}
                >
                  审批
                </Button>
              </AuthHoc>
            )
          )}
          <AuthHoc>
            <Button
              type="link"
              block
              danger
              onClick={() => {
                handleDeleteModal(row._id as string);
              }}
            >
              删除
            </Button>
          </AuthHoc>
        </Space>
      ),
    },
  ];

  const fetchData = useCallback(
    (search?: BorrowQueryType) => {
      const { item, user, code, status } = search || {};
      getBorrowList({
        current: pagination.current as number,
        pageSize: pagination.pageSize as number,
        item,
        code,
        user,
        status,
      }).then((res) => {
        const data = res?.data?.map((item: BorrowType) => ({
          ...item,
          itemName: item.item.name,
          code: item.item.code,
          borrowUser: item.user.nickName,
        }));
        setList(data);
        setTotal(res.total);
        setModalVisible(false);
      });
    },
    [pagination]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData, pagination]);

  useEffect(() => {
    getCategoryList({ all: true }).then((res) => {
      setCategoryList(res.data);
    });
    getItemList({ all: true }).then((res) => {
      setItemList(res.data);
    });
  }, []);

  const handleBorrowBack = (id: string) => {
    Modal.confirm({
      title: "确认归还？",
      icon: <ExclamationCircleFilled />,
      okText: "确定",
      cancelText: "取消",
      async onOk() {
        await borrowBack(id);
        message.success("归还成功");
        fetchData(form.getFieldsValue());
      },
    });
  };

  const handleAudit = (row: BorrowType) => {
    setModalVisible(true);
    setRecord(row);
  }

  const handleDeleteModal = (id: string) => {
    Modal.confirm({
      title: "确认删除？",
      icon: <ExclamationCircleFilled />,
      okText: "确定",
      cancelText: "取消",
      async onOk() {
        await borrowDelete(id);
        fetchData(form.getFieldsValue());
        message.success("删除成功");
      },
    });
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
  };

  const handleSearchFinish = (values: BorrowQueryType) => {
    fetchData(values);
  };

  return (
    <Content title="物品借用">
      <Form
        form={form}
        name="search"
        className={styles.form}
        onFinish={handleSearchFinish}
      >
        <Row gutter={24}>
          <Col span={5}>
            <Form.Item name="item" label="物品名称">
              <Select
                showSearch
                placeholder="请选择"
                optionFilterProp="label"
                allowClear
                options={itemList.map((item) => ({
                  label: item.name,
                  value: item._id,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="status" label="状态">
              <Select
                showSearch
                placeholder="请选择"
                optionFilterProp="label"
                allowClear
                options={[
                  { label: "借出", value: BORROW_STATUS.ON },
                  { label: "归还", value: BORROW_STATUS.OFF },
                  { label: "待审批", value: BORROW_STATUS.PENDING },
                  { label: "被拒绝", value: BORROW_STATUS.REJECTED },
                ]}
              />
            </Form.Item>
          </Col>
          <AuthHoc>
            <Col span={5}>
              <Form.Item name="user" label="借用人">
                <Input placeholder="请输入学号" allowClear />
                {/* <Select placeholder="请选择" allowClear>
                  {categoryList.map((category) => (
                    <Option key={category._id} value={category._id}>
                      {category.name}
                    </Option>
                  ))}
                </Select> */}
              </Form.Item>
            </Col>
          </AuthHoc>
          <Col span={9} style={{ textAlign: "left" }}>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
            <Button
              style={{ margin: "0 8px" }}
              onClick={() => {
                form.resetFields();
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
          scroll={{ x: 1300 }}
          pagination={{
            ...pagination,
            total: total,
            showTotal: () => `共 ${total} 条`,
          }}
        />
      </div>
      {modalVisible ? <AuditModal modalVisible={modalVisible} record={record} fetchData={fetchData} form={form} /> : null}
    </Content>
  );
}
