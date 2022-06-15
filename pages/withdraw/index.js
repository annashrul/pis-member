import CreateWithdraw from "../../components/withdraw/createWithdraw";
import { PageHeader } from "antd";
import Router from "next/router";
import { useAppState } from "../../components/shared/AppProvider";
import React from "react";

const Withdraw = () => {
  const [state] = useAppState();
  return state.mobile ? (
    <PageHeader
      className="site-page-header"
      onBack={() => Router.back()}
      title="Penarikan"
    >
      <CreateWithdraw />
    </PageHeader>
  ) : (
    <CreateWithdraw />
  );
};

export default Withdraw;
