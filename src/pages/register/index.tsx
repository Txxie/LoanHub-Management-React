import { UserRegisterType } from "@/types";
import request from "@/utils/request";
import Icon from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import classnames from "classnames";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

import styles from "./index.module.css";

export default function Register() {
    const router = useRouter();
    const onFinish = async (values: UserRegisterType) => {
        try {
            // console.log("values", values);
            const res = await request.post("/api/register", values);
            // console.log("register res", res);
            // localStorage.setItem("user", JSON.stringify(res.data));
            message.success("注册成功");

            router.push("/login");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Head>
                <title>注册</title>
                <meta name="itemLocation" content="图书馆里系统" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <header className={styles.header}>
                    <Image
                        className={styles.img}
                        width={100}
                        height={100}
                        src="/logo.svg"
                        alt="logo"
                    />
                    校园物品租借管理系统
                </header>
                <div className={styles.form}>
                    <Form
                        name="basic"
                        initialValues={{ name: "", password: "" }}
                        onFinish={onFinish}
                        layout="vertical"
                        autoComplete="off"
                        size="large"
                    >
                        <Form.Item
                            name="name"
                            label={<span className={styles.label}>账号</span>}
                            rules={[{ required: true, message: "请输入用户名/学号" }]}
                        >
                            <Input placeholder="请输入用户名/学号" />
                        </Form.Item>
                        <Form.Item
                            name="nickName"
                            label={<span className={styles.label}>昵称</span>}
                            rules={[{ required: true, message: "请输入昵称" }]}
                        >
                            <Input placeholder="请输入昵称" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label={<span className={styles.label}>密码</span>}
                            rules={[{ required: true, message: "请输入密码" }]}
                        >
                            <Input.Password placeholder="请输入密码" />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                className={classnames(styles.btn, styles.registerBtn)}
                                size="large"
                            >
                                注册
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </main>
        </>
    );
}
