import { PageHeader } from "antd";
import CreateMitra from "../../components/mitra/CreateMitra";
import Router from "next/router";
import { useAppState } from "../../components/shared/AppProvider";
import React from "react";

const IndexMitra = () => {
  const [state] = useAppState();

  return state.mobile ? (
    <PageHeader
      className="site-page-header"
      onBack={() => Router.back()}
      title="Mitra Baru"
    >
      <CreateMitra />
    </PageHeader>
  ) : (
    <CreateMitra />
  );
};

export default IndexMitra;
