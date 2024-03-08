import { UserType } from "@/types";
import { useEffect, useState } from "react";

export const useCurrentUser = () => {
  const [user, setUser] = useState<UserType | null>(null);
  useEffect(() => {
    const obj = localStorage.getItem("user");
    // if (obj) {
    //   console.log(
    //     "%c [ obj ]-9",
    //     "font-size:13px; background:pink; color:#bf2c9f;",
    //     obj
    //   );
    //   setUser(JSON.parse(obj));
    // }
    if (obj) {
      try {
        const parsedObj = JSON.parse(obj);
        console.log(
          "%c [ obj ]-9",
          "font-size:13px; background:pink; color:#bf2c9f;",
          parsedObj
        );
        setUser(parsedObj);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        // 处理 JSON 解析错误，例如清除 localStorage 中的无效数据
        localStorage.removeItem("user");
      }
    }
  }, []);

  return user;
};
