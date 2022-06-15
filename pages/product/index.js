import ListProduct from "../../components/product/ListProduct";
import { PageHeader } from "antd";
import Router from "next/router";
import { useAppState } from "../../components/shared/AppProvider";
import React from "react";

const IndexProduct = () => {
  const [state] = useAppState();

  return state.mobile ? (
    <PageHeader
      className="site-page-header"
      onBack={() => Router.back()}
      title="Produk RO"
    >
      <ListProduct />
    </PageHeader>
  ) : (
    <ListProduct />
  );
};

export default IndexProduct;
