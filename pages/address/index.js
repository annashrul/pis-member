import ListAddress from "../../components/address/ListAddress";
import { PageHeader } from "antd";
import Router from "next/router";
import { useAppState } from "../../components/shared/AppProvider";
import React, { useEffect, useState } from "react";

const Address = () => {
  const [state] = useAppState();

  return state.mobile ? (
    <PageHeader
      className="site-page-header"
      onBack={() => Router.back()}
      title="Alamat"
    >
      <ListAddress />
    </PageHeader>
  ) : (
    <ListAddress />
  );
};

export default Address;
