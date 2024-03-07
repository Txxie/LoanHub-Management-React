import { getItemDetail } from "@/api";
import { ItemForm } from "@/components";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Item() {
  const [data, setData] = useState();
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const res = await getItemDetail(router.query.id as string);
      setData(res.data);
    })();
  }, [router]);
  return <ItemForm title="图书编辑" editData={data} />;
}
