import ListAddress from '../../components/address/ListAddress';
import { PageHeader } from 'antd';
import Router from 'next/router';

const Address = () => {
    return (
        <PageHeader
            className="site-page-header"
            onBack={() => Router.back()}
            title="Alamat"
        >
            <ListAddress />
        </PageHeader>
    );
};

export default Address;
